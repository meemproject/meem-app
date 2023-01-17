/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-loop-func */
import log from '@kengoldfarb/log'
import { MeemAPI, normalizeImageUrl } from '@meemproject/sdk'
import { ethers } from 'ethers'
import { DateTime } from 'luxon'
import {
	AgreementExtensions,
	AgreementRoles,
	AgreementRoleTokens,
	Agreements
} from '../../../generated/graphql'
import { tokenFromContractAddress } from '../token/token'

export const AgreementAdminRole =
	'0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775'
export const AgreementMinterRole =
	'0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6'
export const AgreementUpgraderRole =
	'0x189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e3'

// GraphQL extension
export interface Extension {
	__typename?: 'Extensions' | undefined
	createdAt: any
	description: string
	guideUrl: string
	icon: string
	id: any
	name: string
	slug: string
	updatedAt: any
}

export interface AgreementRolePermission {
	description?: string
	enabled?: boolean
	id: string
	locked?: boolean
	name?: string
}

export interface AgreementRole {
	id: string
	isAdminRole?: boolean
	isTransferrable?: boolean
	name: string
	rolesExtensionData?: any
	tokenAddress?: string
	tokens?: AgreementRoleTokens[]
}

export function emptyRole(): AgreementRole {
	return {
		id: 'addRole',
		isAdminRole: false,
		name: '',
		rolesExtensionData: ''
	}
}

export interface AgreementMember {
	discordUserId?: string
	discordUsername?: string
	displayName?: string
	emailAddress?: string
	ens?: string
	isAgreementAdmin?: boolean
	isAgreementOwner?: boolean
	isMeemApi?: boolean
	ownerId?: string
	profilePicture?: string
	roles?: AgreementRole[]
	twitterUsername?: string
	wallet: string

	// Convenience bool for roles
	chosen?: boolean
}
export interface Agreement {
	address?: string
	adminAddresses?: string[]
	admins?: AgreementMember[]
	agreementOwner?: AgreementMember
	description?: string
	extensions?: AgreementExtensions[]
	gnosisSafeAddress?: string | null
	id?: string
	image?: string
	isAgreementControlledByMeemApi?: boolean
	isCurrentUserAgreementAdmin?: boolean
	isCurrentUserAgreementMember?: boolean
	isCurrentUserAgreementOwner?: boolean
	isLaunched?: boolean
	isValid?: boolean
	memberCount?: number
	memberRolesMap?: Map<string, AgreementMember[]>
	members?: AgreementMember[]
	membershipSettings?: MembershipSettings
	membershipToken?: string
	name?: string
	rawAgreement?: Agreements
	roles?: AgreementRole[]
	slotsLeft?: number
	slug?: string
}

export const extensionFromSlug = (slug: string, agreement?: Agreement) => {
	const agreementExtension = agreement?.extensions?.find(
		ae => ae.Extension?.slug === slug
	)
	return agreementExtension
}

export interface MembershipSettings {
	costToJoin: number
	membershipEndDate?: Date
	membershipFundsAddress: string
	membershipQuantity: number
	membershipStartDate?: Date
	requirements: MembershipRequirement[]
	// The agreement admins set when the agreement is created
	agreementAdminsAtAgreementCreation?: string[]
}

export enum MembershipReqType {
	None,
	ApprovedApplicants,
	TokenHolders,
	OtherAgreementMember
}

export function MembershipRequirementToMeemPermission(
	mr: MembershipRequirement & {
		costEth?: number
		mintStartTimestamp?: number
		mintEndTimestamp?: number
	}
): MeemAPI.IMeemPermission {
	let permission = MeemAPI.Permission.Anyone
	let addresses: string[] = []

	switch (mr.type) {
		case MembershipReqType.ApprovedApplicants:
			permission = MeemAPI.Permission.Addresses
			addresses = mr.approvedAddresses
			break
		case MembershipReqType.TokenHolders:
			permission = MeemAPI.Permission.Holders
			addresses = [mr.tokenContractAddress]
			break
		case MembershipReqType.None:
		default:
			break
	}

	const costEth = mr.costEth ?? 0
	const mintStartTimestamp = `${mr.mintStartTimestamp ?? 0}`
	const mintEndTimestamp = `${mr.mintEndTimestamp ?? 0}`

	return {
		addresses,
		costWei: ethers.utils.parseEther(`${costEth}`).toHexString(),
		mintStartTimestamp,
		mintEndTimestamp,
		numTokens: `${mr.tokenMinQuantity}`,
		permission,
		merkleRoot: ethers.utils.formatBytes32String('')
	}
}

export function rawRolesToAgreementRoles(
	agreementRoles: AgreementRoles[]
): AgreementRole[] {
	const roles: AgreementRole[] = []
	agreementRoles.forEach(rawRole => {
		// Roles discord extension metadata
		const metadata = rawRole.metadata

		const agreementRole: AgreementRole = {
			id: rawRole.id,
			isAdminRole: rawRole.isAdminRole,
			rolesExtensionData: metadata,
			tokenAddress: rawRole.address ?? '',
			isTransferrable: rawRole.Agreement?.isTransferrable ?? false,
			tokens: rawRole.AgreementRoleTokens,
			name: rawRole.name
		}
		roles.push(agreementRole)
	})

	return roles
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
	// Agreement membership
	agreementContractAddress: string
	otherAgreementName: string // Resolved from contract
}

// The agreement's basic metadata, doesn't require async
export function agreementSummaryFromDb(
	agreementData?: any,
	walletAddress?: string
): Agreement {
	// Count members accurately
	const members: AgreementMember[] = []

	let iAmAgreementAdmin = false

	// Parse members
	if (agreementData) {
		if (agreementData.AgreementTokens) {
			for (const agreementToken of agreementData.AgreementTokens) {
				// log.debug(
				// 	`slug ${agreementData.slug} | parsing token for ${agreementToken.Wallet?.address}`
				// )
				if (
					agreementToken.Wallet?.address.toLowerCase() !==
						MeemAPI.zeroAddress.toLowerCase() &&
					// 0xfurnace address
					agreementToken.Wallet?.address.toLowerCase() !==
						'0x6b6e7fb5cd1773e9060a458080a53ddb8390d4eb'
				) {
					if (agreementToken.Wallet) {
						let hasAlreadyBeenAdded = false
						members.forEach(member => {
							if (
								member.wallet === agreementToken.Wallet?.address
							) {
								hasAlreadyBeenAdded = true
							}
						})
						if (!hasAlreadyBeenAdded) {
							members.push({
								wallet: agreementToken.Wallet.address,
								ens: agreementToken.Wallet.ens ?? undefined,
								ownerId: agreementToken.OwnerId
							})
							const isCurrentUser =
								walletAddress &&
								walletAddress?.toLowerCase() ===
									agreementToken.Wallet?.address.toLowerCase()

							if (isCurrentUser) {
								const iAmAgreementOwner =
									agreementToken.OwnerId ===
									agreementData.OwnerId

								// Is the current user an admin?
								if (iAmAgreementOwner) {
									iAmAgreementAdmin = true
								} else {
									agreementData.AgreementRoles.forEach(
										(role: any) => {
											if (role.isAdminRole) {
												role.AgreementRoleTokens.forEach(
													(token: any) => {
														if (
															agreementToken.OwnerId ===
															token.OwnerId
														) {
															iAmAgreementAdmin =
																true
														}
													}
												)
											}
										}
									)
								}
							}
						}
					}
				}
			}
		}
	}

	if (agreementData) {
		return {
			address: agreementData.address,
			adminAddresses: [],
			admins: [],
			description: agreementData.metadata.description,
			extensions: [],
			id: agreementData.id,
			image: agreementData.metadata.image,
			isCurrentUserAgreementAdmin: iAmAgreementAdmin,
			isCurrentUserAgreementMember: true,
			isLaunched: agreementData.isLaunched,
			isValid: agreementData.mintPermissions !== undefined,
			memberCount: members.length,
			members,
			membershipSettings: {
				requirements: [],
				costToJoin: 0,
				membershipFundsAddress: '',
				membershipStartDate: undefined,
				membershipEndDate: undefined,
				membershipQuantity: 0,
				agreementAdminsAtAgreementCreation: []
			},
			membershipToken: '',
			name: agreementData.name,
			rawAgreement: agreementData,
			slotsLeft: 0,
			slug: agreementData.slug
		}
	} else {
		return {}
	}
}

export default async function agreementFromDb(
	wallet: any,
	walletAddress: string,
	agreementData: Agreements
): Promise<Agreement> {
	if (agreementData != null && agreementData) {
		// Start time
		const startTime = Date.now()
		// Parse the contract URI
		// const metadata = agreementMetadataFromContractUri(agreementData.contractURI)

		// Convert minting permissions to membership requirements
		const reqs: MembershipRequirement[] = []
		let costToJoin = 0
		let index = 0

		// Raw admin addresses stored on contract, used to filter out admin-only mintPermissions
		const adminRawAddresses: string[] = []
		let iAmAgreementAdmin = false
		let iAmAgreementOwner = false
		let isAgreementControlledByMeemApi = false

		// Agreement members and admins
		let agreementOwner = undefined
		const admins: AgreementMember[] = []
		const members: AgreementMember[] = []

		// Is the current user a agreement member?
		let isAgreementMember = false

		let membershipToken = undefined

		// Parse roles
		let agreementRoles: AgreementRole[] = []
		if (agreementData.AgreementRoles) {
			agreementRoles = rawRolesToAgreementRoles(
				agreementData.AgreementRoles
			)
		}

		// Parse wallets (for Meem API owner status)
		if (agreementData.AgreementWallets) {
			for (const agreementWallet of agreementData.AgreementWallets) {
				// Check to see if the agreement is controlled by the meem api
				if (
					agreementWallet.Wallet?.address.toLowerCase() ===
						process.env.NEXT_PUBLIC_MEEM_API_WALLET_ADDRESS?.toString().toLowerCase() &&
					agreementWallet.role === AgreementAdminRole
				) {
					isAgreementControlledByMeemApi = true
					log.debug(`Agreement is controlled by meem API`)
				}
			}
		}

		// Parse members
		if (agreementData.AgreementTokens) {
			for (const agreementToken of agreementData.AgreementTokens) {
				if (
					// Filter out 0xfurnace + zero address
					agreementToken.Wallet?.address.toLowerCase() !==
						MeemAPI.zeroAddress.toLowerCase() &&
					// 0xfurnace address
					agreementToken.Wallet?.address.toLowerCase() !==
						'0x6b6e7fb5cd1773e9060a458080a53ddb8390d4eb'
				) {
					if (agreementToken.Wallet) {
						// Filter duplicate tokens
						let hasAlreadyBeenAdded = false
						members.forEach(member => {
							if (
								member.wallet === agreementToken.Wallet?.address
							) {
								hasAlreadyBeenAdded = true
							}
						})

						// Is this member an admin?
						let isMemberAnAdmin = false

						// Is this member the agreement owner?
						let isMemberTheAgreementOwner = false

						// Is this member the Meem API wallet?
						const meemApiWallet =
							process.env.NEXT_PUBLIC_MEEM_API_WALLET_ADDRESS?.toString().toLowerCase()
						const isMemberMeemAPI: boolean =
							agreementToken.Wallet?.address.toLowerCase() ===
							meemApiWallet

						if (!hasAlreadyBeenAdded) {
							// Is this the current user?
							const isCurrentUser =
								walletAddress &&
								walletAddress?.toLowerCase() ===
									agreementToken.Wallet?.address.toLowerCase()

							// Logic specific to the current user
							if (isCurrentUser) {
								isAgreementMember = true
								membershipToken = agreementToken.tokenId

								log.debug(
									`agreement ownerId ${agreementData.OwnerId}`
								)
								iAmAgreementOwner =
									agreementToken.OwnerId ===
									agreementData.OwnerId

								// Is the current user an admin?
								if (iAmAgreementOwner) {
									iAmAgreementAdmin = true
								} else {
									agreementData.AgreementRoles.forEach(
										role => {
											if (role.isAdminRole) {
												role.AgreementRoleTokens.forEach(
													token => {
														if (
															agreementToken.OwnerId ===
															token.OwnerId
														) {
															iAmAgreementAdmin =
																true
														}
													}
												)
											}
										}
									)
								}
							}

							// Is this member an admin
							agreementData.AgreementRoles.forEach(role => {
								if (role.isAdminRole) {
									role.AgreementRoleTokens?.forEach(token => {
										if (
											agreementToken.OwnerId ===
											token.OwnerId
										) {
											isMemberAnAdmin = true
											adminRawAddresses.push(
												agreementToken?.Wallet
													?.address ?? ''
											)
										}
									})
								}
							})

							// Is this member the agreement owner?
							isMemberTheAgreementOwner =
								agreementToken.OwnerId === agreementData.OwnerId

							// Roles + permissions logic
							let memberRoles: AgreementRole[] = []
							if (
								agreementRoles &&
								agreementData.AgreementRoleTokens
							) {
								// Find raw member roles
								const rawMemberRoles:
									| AgreementRoles[]
									| undefined = []
								agreementData.AgreementRoles.forEach(role => {
									let memberHasRole = false
									agreementData.AgreementRoleTokens.forEach(
										roleToken => {
											if (
												roleToken.AgreementRoleId ===
													role.id &&
												roleToken.OwnerId ===
													agreementToken.OwnerId
											) {
												memberHasRole = true
											}
										}
									)
									if (memberHasRole) {
										log.debug(
											`member ${agreementToken.Wallet?.address} has role ${role.name}`
										)
										rawMemberRoles.push(role)
									}
								})

								// Convert member roles
								memberRoles =
									rawRolesToAgreementRoles(rawMemberRoles)
							}

							// Agreement member metadata + extensions
							const memberIdentity =
								agreementToken.Wallet.Users &&
								agreementToken.Wallet.Users.length > 0
									? agreementToken.Wallet.Users[0]
									: undefined

							const twitterUsername = ''
							const discordUsername = ''
							const discordUserId = ''
							const emailAddress = ''

							// Assemble member
							const memberData = {
								wallet: agreementToken.Wallet.address,
								ens: agreementToken.Wallet.ens ?? undefined,
								roles: memberRoles,
								displayName: memberIdentity?.displayName
									? memberIdentity?.displayName
									: '',
								profilePicture: memberIdentity?.profilePicUrl
									? normalizeImageUrl(
											memberIdentity?.profilePicUrl
									  )
									: '',
								ownerId: agreementToken.OwnerId,
								twitterUsername,
								discordUsername,
								discordUserId,
								emailAddress,
								isAgreementOwner: isMemberTheAgreementOwner,
								isAgreementAdmin: isMemberAnAdmin,
								isMeemApi: isMemberMeemAPI
							}

							// Add to members
							members.push(memberData)

							// Add to admins if necessary
							if (isMemberAnAdmin) {
								admins.push(memberData)
							}

							// Set agreement owner if necessary
							if (
								agreementToken.Wallet.id ===
								agreementData.Wallet?.id
							) {
								agreementOwner = memberData
							}
						}
					}
				}
			}
		}

		// role id => agreement member relation
		const memberRolesMap: Map<string, AgreementMember[]> = new Map()

		// Populate the above map with all role ids
		agreementRoles.forEach(role => {
			memberRolesMap.set(role.id, [])
		})

		// Build a relationship between role id <> AgreementMember[]
		members.forEach(member => {
			if (member.roles) {
				member.roles.forEach(memberRole => {
					const currentRoleMembers =
						memberRolesMap.get(memberRole.id) ?? []
					currentRoleMembers?.push(member)
					memberRolesMap.set(memberRole.id, currentRoleMembers)
				})
			}
		})

		memberRolesMap.forEach((value, key) => {
			log.debug(`members for role ${key} = ${value.length}`)
		})

		let membershipStartDate: Date | undefined
		let membershipEndDate: Date | undefined

		if (agreementData.mintPermissions) {
			await Promise.all(
				agreementData.mintPermissions.map(async (permission: any) => {
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

						// Used for the 'other agreement' additional req, TODO
						const agreementContractAddress = ''
						const agreementName = ''

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

						reqs.push({
							index,
							andor: MembershipReqAndor.Or,
							type,
							applicationInstructions: agreementData.metadata
								.application_instructions
								? agreementData.metadata
										.application_instructions.length > 0
									? agreementData.metadata
											.application_instructions[0]
									: undefined
								: undefined,
							approvedAddresses,
							approvedAddressesString,
							tokenName,
							tokenMinQuantity,
							tokenChain: '',
							agreementContractAddress,
							tokenContractAddress,
							otherAgreementName: agreementName
						})

						index++
					}
				})
			)
		} else {
			//log.debug('this agreement has no mint permissions')
		}

		// Membership funds address
		let fundsAddress = ''
		if (agreementData.splits && agreementData.splits.length > 0) {
			const split = agreementData.splits[0]
			fundsAddress = split.toAddress
		}

		// Total memberships
		let totalMemberships = Number(agreementData.maxSupply)
		if (totalMemberships === -1) {
			totalMemberships = 0
		}

		// Extensions
		const allExtensions: AgreementExtensions[] = []
		if (agreementData.AgreementExtensions) {
			agreementData.AgreementExtensions.forEach(extension => {
				allExtensions.push(extension)
			})
		}

		// Calculate slots left if totalOriginSupply > 0
		let slotsLeft = -1
		if (totalMemberships > 0) {
			const membersCount = members.length
			slotsLeft = totalMemberships - membersCount
		}

		if (!isAgreementControlledByMeemApi) {
			log.debug(`Agreement is NOT controlled by meem API`)
		}

		log.debug(`current user is agreement owner = ${iAmAgreementOwner}`)

		log.debug(`current user is agreement admin = ${iAmAgreementAdmin}`)

		const endTime = Date.now()
		const timeTaken = endTime - startTime
		log.debug(`club model processing took ${timeTaken}ms`)

		return {
			id: agreementData.id,
			name: agreementData.name,
			address: agreementData.address,
			adminAddresses: adminRawAddresses,
			admins,
			isCurrentUserAgreementAdmin: iAmAgreementAdmin,
			isCurrentUserAgreementOwner: iAmAgreementOwner,
			isLaunched: agreementData.isLaunched,
			agreementOwner,
			slug: agreementData.slug,
			gnosisSafeAddress: agreementData.gnosisSafeAddress,
			description: agreementData.metadata.description,
			image: agreementData.metadata.image,
			roles: agreementRoles,
			memberRolesMap,
			isCurrentUserAgreementMember: isAgreementMember,
			isAgreementControlledByMeemApi,
			membershipToken,
			members,
			slotsLeft,
			membershipSettings: {
				requirements: reqs,
				costToJoin,
				membershipFundsAddress: fundsAddress,
				membershipStartDate,
				membershipEndDate,
				membershipQuantity: totalMemberships
			},
			isValid: agreementData.mintPermissions !== undefined,
			rawAgreement: agreementData,
			extensions: allExtensions
		}
	} else {
		return {}
	}
}
