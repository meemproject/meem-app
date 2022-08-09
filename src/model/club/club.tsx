import log from '@kengoldfarb/log'
import { MeemAPI } from '@meemproject/api'
import { ethers } from 'ethers'
import { DateTime } from 'luxon'
import { MeemContracts } from '../../../generated/graphql'
import { tokenFromContractAddress } from '../token/token'
import { clubMetadataFromContractUri } from './club_metadata'

export const ClubAdminRole =
	'0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775'

export interface Integration {
	// Convenience for admin screen
	isExistingIntegration?: boolean

	// DB properties
	id?: string
	integrationId: string
	name: string
	isEnabled?: boolean
	isPublic?: boolean
	isVerified?: boolean
	verifiedTwitterUser?: string
	url?: string
	icon?: string
	description?: string
	guideUrl?: string
}

export interface Club {
	id?: string
	name?: string
	address?: string
	slug?: string
	description?: string
	image?: string
	admins?: string[]
	membershipSettings?: MembershipSettings
	slotsLeft?: number
	members?: string[]
	isClubMember?: boolean
	membershipToken?: string
	isClubAdmin?: boolean
	isValid?: boolean
	rawClub?: MeemContracts
	allIntegrations?: Integration[]
	publicIntegrations?: Integration[]
	privateIntegrations?: Integration[]
}

export interface MembershipSettings {
	requirements: MembershipRequirement[]
	costToJoin: number
	membershipFundsAddress: string
	membershipQuantity: number
	membershipStartDate?: Date
	membershipEndDate?: Date
	clubAdmins?: string[]
}

export enum MembershipReqType {
	None,
	ApprovedApplicants,
	TokenHolders,
	OtherClubMember
}

export function MembershipRequirementToMeemPermission(
	mr: MembershipRequirement & {
		costEth?: number
		mintStartTimestamp?: number
		mintEndTimestamp?: number
	}
): MeemAPI.IMeemPermission {
	let permission = MeemAPI.Permission.Anyone

	switch (mr.type) {
		case MembershipReqType.ApprovedApplicants:
			permission = MeemAPI.Permission.Addresses
			break
		case MembershipReqType.TokenHolders:
			permission = MeemAPI.Permission.Holders
			break
		case MembershipReqType.None:
		default:
			break
	}

	const costEth = mr.costEth ?? 0
	const mintStartTimestamp = `${mr.mintStartTimestamp ?? 0}`
	const mintEndTimestamp = `${mr.mintEndTimestamp ?? 0}`

	return {
		addresses: mr.approvedAddresses,
		costWei: ethers.utils.parseEther(`${costEth}`).toHexString(),
		lockedBy: MeemAPI.zeroAddress,
		mintStartTimestamp,
		mintEndTimestamp,
		numTokens: `${mr.tokenMinQuantity}`,
		permission
	}
}

export enum MembershipReqAndor {
	None,
	And,
	Or
}

export interface MembershipRequirement {
	// Currently hardcoded as there is only one additional req.
	// 0 = first req
	// 1 = optional second req
	index: number
	// For additional reqs, whether they are 'alternatively' or 'in addition'
	andor: MembershipReqAndor
	// Type of requirement
	type: MembershipReqType
	// Applicants
	applicationInstructions?: string
	approvedAddresses: string[]
	approvedAddressesString: string
	// NFT / Token holders
	tokenName: string // Resolved from contract
	tokenContractAddress: string
	tokenChain: string // Not used for V1
	tokenMinQuantity: number
	// Club membership
	clubContractAddress: string
	clubName: string // Resolved from contract
}

// The club's basic metadata, doesn't require async
export function clubSummaryFrommeemContract(clubData?: MeemContracts): Club {
	if (clubData) {
		const metadata = clubMetadataFromContractUri(clubData.contractURI)
		return {
			id: clubData.id,
			name: clubData.name,
			address: clubData.address,
			admins: [],
			isClubAdmin: false,
			slug: clubData.slug,
			description: metadata.description,
			image: metadata.image,
			isClubMember: true,
			membershipToken: '',
			members: [],
			slotsLeft: 0,
			membershipSettings: {
				requirements: [],
				costToJoin: 0,
				membershipFundsAddress: '',
				membershipStartDate: undefined,
				membershipEndDate: undefined,
				membershipQuantity: 0,
				clubAdmins: []
			},
			isValid: clubData.mintPermissions !== undefined,
			rawClub: clubData,
			allIntegrations: []
		}
	} else {
		return {}
	}
}

export default async function clubFromMeemContract(
	wallet: any,
	walletAddress: string,
	clubData: MeemContracts
): Promise<Club> {
	if (clubData != null && clubData) {
		// Parse the contract URI
		// const metadata = clubMetadataFromContractUri(clubData.contractURI)

		// Disabled due to rate limiting
		// // Define a provider to look up wallet addresses for admins / approved addresses
		// const provider = new ethers.providers.AlchemyProvider(
		// 	'mainnet',
		// 	process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
		// )

		// Convert minting permissions to membership requirements
		const reqs: MembershipRequirement[] = []
		let costToJoin = 0
		let index = 0

		// Set up club admins
		// Is the current user a club admin?
		const admins: string[] = [] // ENS-resolved list of admin addresses

		// Raw admin addresses stored on contract, used to filter out admin-only mintPermissions
		const adminRawAddresses: string[] = []
		let isClubAdmin = false

		// Look up admin addresses and convert to ENS where necessary
		if (
			clubData.MeemContractWallets &&
			clubData.MeemContractWallets.length > 0
		) {
			await Promise.all(
				clubData.MeemContractWallets.map(async function (wall) {
					if (wall.Wallet) {
						const address = wall.Wallet.address
						adminRawAddresses.push(address)
						//const name = await provider.lookupAddress(address)
						admins.push(address)
					}

					if (
						wall.Wallet?.address.toLowerCase() ===
							walletAddress?.toLowerCase() &&
						wall.role === ClubAdminRole
					) {
						isClubAdmin = true
					}
				})
			)
		}

		let membershipStartDate: Date | undefined
		let membershipEndDate: Date | undefined

		if (clubData.mintPermissions) {
			// clubData.mintPermissions.forEach((permission: any) => {
			// 	log.debug(permission)
			// })
			await Promise.all(
				clubData.mintPermissions.map(async (permission: any) => {
					log.debug(permission)
					if (permission.mintStartTimestamp) {
						membershipStartDate = DateTime.fromSeconds(
							ethers.BigNumber.from(
								permission.mintStartTimestamp
							).toNumber()
						).toJSDate()
					}
					if (permission.mintEndTimestamp) {
						membershipEndDate = DateTime.fromSeconds(
							ethers.BigNumber.from(
								permission.mintEndTimestamp
							).toNumber()
						).toJSDate()
					}
					// Filter out the admin-exclusive permissions
					if (
						permission.permission ===
							MeemAPI.Permission.Addresses &&
						permission.addresses.length === 1 &&
						adminRawAddresses.includes(
							permission.addresses[0].toLowerCase()
						)
					) {
						// Don't do anything
						//log.debug('ignoring admin mint permission')
					} else {
						const cost = isNaN(permission.costWei)
							? 0
							: permission.costWei
						//log.debug(`cost to join (wei) = ${cost}`)
						if (cost === 0) {
							costToJoin = cost
						} else {
							const matic = ethers.utils.formatEther(cost)
							costToJoin = Number(matic)
						}
						//log.debug(`cost to join (matic) = ${costToJoin}`)

						let type = MembershipReqType.None
						const approvedAddresses: string[] = []
						let approvedAddressesString = ''
						let tokenName = 'TOKEN'
						let tokenContractAddress = ''
						let tokenMinQuantity = 0

						// Used for the 'other club' additional req, TODO
						const clubContractAddress = ''
						const clubName = ''

						const tokenDetails = await tokenFromContractAddress(
							permission.addresses ? permission.addresses[0] : '',
							wallet
						)

						switch (permission.permission) {
							case MeemAPI.Permission.Anyone:
								type = MembershipReqType.None
								break
							case MeemAPI.Permission.Addresses:
								type = MembershipReqType.ApprovedApplicants

								// Look up ENS names for approved addresses
								await Promise.all(
									permission.addresses.map(
										async (address: string) => {
											// const name =
											// 	await provider.lookupAddress(
											// 		address
											// 	)
											approvedAddresses.push(address)
											approvedAddressesString =
												approvedAddressesString +
												`${address}\n`
										}
									)
								)
								break
							case MeemAPI.Permission.Holders:
								tokenMinQuantity = Number(permission.numTokens)
								// eslint-disable-next-line no-case-declarations
								type = MembershipReqType.TokenHolders

								if (tokenDetails !== undefined) {
									tokenName = tokenDetails.name
									//log.debug('got token name')
								}

								tokenContractAddress = permission.addresses[0]
								break
						}

						// Construct a requirement
						// (check to make sure there isn't already an 'anyone' req type)
						let didReqTypeExist = false
						reqs.forEach(req => {
							if (
								req.type === MembershipReqType.None &&
								type === MembershipReqType.None
							) {
								didReqTypeExist = true
							}
						})
						if (!didReqTypeExist) {
							//log.debug('pushing req')

							reqs.push({
								index,
								andor: MembershipReqAndor.Or,
								type,
								// applicationInstructions:
								// 	metadata.applicationInstructions
								// 		? metadata.applicationInstructions
								// 				.length > 0
								// 			? metadata
								// 					.applicationInstructions[0]
								// 			: undefined
								// 		: undefined,
								approvedAddresses,
								approvedAddressesString,
								tokenName,
								tokenMinQuantity,
								tokenChain: '',
								clubContractAddress,
								tokenContractAddress,
								clubName
							})
						}

						index++
					}
				})
			)
		} else {
			//log.debug('this club has no mint permissions')
		}

		// Membership funds address
		let fundsAddress = ''
		if (clubData.splits && clubData.splits.length > 0) {
			const split = clubData.splits[0]
			fundsAddress = split.toAddress
		}

		// Total memberships
		let totalMemberships = Number(clubData.maxSupply)
		if (totalMemberships === -1) {
			totalMemberships = 0
		}

		// Club members
		const members: string[] = []

		// Is the current user a club member?
		let isClubMember = false

		// If so, what's their tokenId? / parse members
		let membershipToken = undefined
		if (clubData.Meems) {
			for (const meem of clubData.Meems) {
				if (
					walletAddress &&
					walletAddress?.toLowerCase() ===
						meem.Owner?.address.toLowerCase()
				) {
					isClubMember = true
					membershipToken = meem.tokenId
				}

				if (
					meem.Owner?.address.toLowerCase() !==
						MeemAPI.zeroAddress.toLowerCase() &&
					// 0xfurnace address
					meem.Owner?.address.toLowerCase() !==
						'0x6b6e7fb5cd1773e9060a458080a53ddb8390d4eb'
				) {
					//const name = await ensWalletAddress(meem.Owner?.address)
					if (meem.Owner && !members.includes(meem.Owner.address)) {
						members.push(meem.Owner.address)
					}
				}
			}
		}

		// Integrations
		const allIntegrations: Integration[] = []
		const publicIntegrations: Integration[] = []
		const privateIntegrations: Integration[] = []
		if (clubData.MeemContractIntegrations) {
			clubData.MeemContractIntegrations.forEach(inte => {
				if (inte.isEnabled) {
					const integration: Integration = {
						id: inte.id,
						integrationId: inte.IntegrationId,
						name: inte.Integration?.name ?? 'Unknown',
						description: inte.Integration?.description ?? 'Unknown',
						icon: inte.Integration?.icon ?? '',
						isEnabled: inte.isEnabled,
						isPublic: inte.isPublic,
						isVerified: inte.metadata.isVerified ?? false,
						verifiedTwitterUser:
							inte.metadata.twitterUsername ?? 'Unknown',
						guideUrl: inte.Integration?.guideUrl,
						url: inte.metadata.externalUrl ?? '',
						isExistingIntegration: true
					}

					if (inte.isPublic) {
						publicIntegrations.push(integration)
					} else {
						privateIntegrations.push(integration)
					}
					allIntegrations.push(integration)
				}
			})
		}

		// Calculate slots left if totalOriginSupply > 0
		let slotsLeft = -1
		if (totalMemberships > 0) {
			const membersCount = members.length
			slotsLeft = totalMemberships - membersCount
		}

		return {
			id: clubData.id,
			name: clubData.name,
			address: clubData.address,
			admins,
			isClubAdmin,
			slug: clubData.slug,
			description: clubData.metadata.description,
			image: clubData.metadata.image,
			isClubMember,
			membershipToken,
			members,
			slotsLeft,
			membershipSettings: {
				requirements: reqs,
				costToJoin,
				membershipFundsAddress: fundsAddress,
				membershipStartDate,
				membershipEndDate,
				// membershipStartDate:
				// 	clubData.mintStartAt !== 0
				// 		? clubData.mintStartAt
				// 		: undefined,
				// membershipEndDate:
				// 	clubData.mintEndAt !== 0 ? clubData.mintEndAt : undefined,
				membershipQuantity: totalMemberships,
				clubAdmins: []
			},
			isValid: clubData.mintPermissions !== undefined,
			rawClub: clubData,
			allIntegrations,
			publicIntegrations,
			privateIntegrations
		}
	} else {
		return {}
	}
}
