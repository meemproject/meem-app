import log from '@kengoldfarb/log'
import { MeemAPI } from '@meemproject/api'
import { Permission } from '@meemproject/meem-contracts'
import { ethers } from 'ethers'
import { MeemContracts } from '../../../generated/graphql'
import { truncatedWalletAddress } from '../../utils/truncated_wallet'
import { tokenFromContractAddress } from '../token/token'
import { clubMetadataFromContractUri } from './club_metadata'

export const ClubAdminRole =
	'0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775'

export interface Integration {
	name: string
	url: string
	icon?: string
	description?: string
	guideUrl?: string
}

export const allIntegrations: Integration[] = [
	{
		name: 'Twitter',
		url: '',
		icon: 'integration-twitter.png',
		description: "Add a link to your Club's Twitter account."
	},
	{
		name: 'Discord',
		url: '',
		icon: 'integration-discord.png',
		description: 'Add a link to invite Club members to your Discord server.'
	},
	{
		name: 'Guild',
		url: '',
		icon: 'integration-guild.png',
		description: 'Create a Guild for your Club.',
		guideUrl:
			'https://meemproject.notion.site/Guild-7c6f030bd5b4485998899d521fc3694a'
	},
	{
		name: 'SlikSafe',
		url: '',
		icon: 'integration-sliksafe.png',
		description: 'File storage and backup for Club members.',
		guideUrl:
			'https://meemproject.notion.site/Sliksafe-9ee759f735ac4f9cb52b5d849292188c'
	},
	{
		name: 'Tellie',
		url: '',
		icon: 'integration-tellie.png',
		description: 'Website builder for your Club.',
		guideUrl:
			'https://meemproject.notion.site/Tellie-5c176f1036ef4fe3b993b0137eec15a8'
	},
	{
		name: 'Clarity',
		url: '',
		icon: 'integration-clarity.png',
		description: 'Manage contributions and rewards for Club members.',
		guideUrl:
			'https://meemproject.notion.site/Clarity-b144c6bc1eae4e08b3af870ac87ce60d'
	},
	{
		name: 'Gnosis',
		url: '',
		icon: 'integration-gnosis.png',
		description: 'Manage Club funds in a secure way.',
		guideUrl:
			'https://meemproject.notion.site/Gnosis-af38757b9faf486f9900a5ea8f4a805d'
	},
	{
		name: 'Myco',
		url: '',
		icon: 'integration-myco.png',
		description: 'Turn your Club into a legal entity.',
		guideUrl:
			'https://meemproject.notion.site/Myco-5425597cd8ca413fa070bc55bf1428f8'
	},
	{
		name: 'Orca',
		url: '',
		icon: 'integration-orca.png',
		description: 'Organize working groups for your Club',
		guideUrl:
			'https://meemproject.notion.site/Orca-a67a9137657643609c3ae54183505ecf'
	}
]

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
	integrations?: Integration[]
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
	applicationLink?: string
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
			integrations: metadata.integrations
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
		const metadata = clubMetadataFromContractUri(clubData.contractURI)

		// Convert minting permissions to membership requirements
		const reqs: MembershipRequirement[] = []
		let costToJoin = 0
		let index = 0

		// Set up club admins
		// Is the current user a club admin?
		const admins: string[] = []
		let isClubAdmin = false
		if (
			clubData.MeemContractWallets &&
			clubData.MeemContractWallets.length > 0
		) {
			for (const wall of clubData.MeemContractWallets) {
				if (wall.Wallet) {
					const name = wall.Wallet.address
					admins.push(name)
				}

				if (
					wall.Wallet?.address.toLowerCase() === walletAddress?.toLowerCase() &&
					wall.role === ClubAdminRole
				) {
					isClubAdmin = true
				}
			}
		}

		if (clubData.mintPermissions) {
			console.log('club has mint permissions')

			// clubData.mintPermissions.forEach((permission: any) => {
			// 	log.debug(permission)
			// })
			await Promise.all(
				clubData.mintPermissions.map(async (permission: any) => {
					log.debug(permission)
					// Filter out the admin-exclusive permissions
					if (
						permission.permission === Permission.Addresses &&
						permission.addresses.length === 1 &&
						admins.includes(permission.addresses[0].toLowerCase())
					) {
						// Don't do anything
						//log.debug('ignoring admin mint permission')
					} else {
						const cost = isNaN(permission.costWei) ? 0 : permission.costWei
						//log.debug(`cost to join (wei) = ${cost}`)
						if (cost === 0) {
							costToJoin = cost
						} else {
							const matic = ethers.utils.formatEther(cost)
							costToJoin = Number(matic)
						}
						//log.debug(`cost to join (matic) = ${costToJoin}`)

						let type = MembershipReqType.None
						let approvedAddresses: string[] = []
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
							case Permission.Anyone:
								type = MembershipReqType.None
								break
							case Permission.Addresses:
								type = MembershipReqType.ApprovedApplicants
								approvedAddresses = permission.addresses
								break
							case Permission.Holders:
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
								applicationLink:
									metadata.applicationLinks.length > 0
										? metadata.applicationLinks[0]
										: undefined,
								approvedAddresses,
								approvedAddressesString: '',
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
		let totalMemberships = Number(clubData.totalOriginalsSupply)
		if (totalMemberships === -1) {
			totalMemberships = 0
		}

		// Club members
		const members: string[] = []

		// Is the current user a club member?
		let isClubMember = false

		// If so, what's their tokenId?
		let membershipToken = undefined
		if (clubData.Meems) {
			for (const meem of clubData.Meems) {
				if (
					walletAddress &&
					walletAddress?.toLowerCase() === meem.owner.toLowerCase()
				) {
					isClubMember = true
					membershipToken = meem.tokenId
				}

				if (
					meem.owner.toLowerCase() !== MeemAPI.zeroAddress.toLowerCase() &&
					// 0xfurnace address
					meem.owner.toLowerCase() !==
						'0x6b6e7fb5cd1773e9060a458080a53ddb8390d4eb'
				) {
					const name = await truncatedWalletAddress(meem.owner)
					if (!members.includes(name)) {
						members.push(name)
					}
				}
			}
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
			description: metadata.description,
			image: metadata.image,
			isClubMember,
			membershipToken,
			members,
			slotsLeft,
			membershipSettings: {
				requirements: reqs,
				costToJoin,
				membershipFundsAddress: fundsAddress,
				membershipStartDate:
					clubData.mintStartAt !== 0 ? clubData.mintStartAt : undefined,
				membershipEndDate:
					clubData.mintEndAt !== 0 ? clubData.mintEndAt : undefined,
				membershipQuantity: totalMemberships,
				clubAdmins: []
			},
			isValid: clubData.mintPermissions !== undefined,
			rawClub: clubData,
			integrations: metadata.integrations
		}
	} else {
		return {}
	}
}
