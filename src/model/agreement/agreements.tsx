/* eslint-disable @typescript-eslint/no-loop-func */
import log from '@kengoldfarb/log'
import { MeemAPI, normalizeImageUrl } from '@meemproject/sdk'
import { ethers } from 'ethers'
import { DateTime } from 'luxon'
import {
	AgreementExtensions,
	AgreementRoles,
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
	id: string
	name?: string
	description?: string
	enabled?: boolean
	locked?: boolean
}

export interface AgreementRole {
	id: string
	name: string
	isAdminRole?: boolean
	isTransferrable?: boolean
	tokenAddress?: string
	permissions: AgreementRolePermission[]
	rolesExtensionData?: any
	guildRoleId?: string
	guildRoleName?: string
	guildDiscordServerName?: string
	guildDiscordServerId?: string
	guildDiscordServerIcon?: string
}

export function emptyRole(): AgreementRole {
	return {
		id: 'addRole',
		isAdminRole: false,
		name: '',
		permissions: [],
		rolesExtensionData: '',
		guildRoleId: '',
		guildRoleName: '',
		guildDiscordServerId: '',
		guildDiscordServerIcon: '',
		guildDiscordServerName: ''
	}
}

export interface AgreementMember {
	displayName?: string
	wallet: string
	ens?: string
	profilePicture?: string
	twitterUsername?: string
	discordUsername?: string
	discordUserId?: string
	emailAddress?: string
	roles?: AgreementRole[]
	isAgreementOwner?: boolean
	isAgreementAdmin?: boolean
	isMeemApi?: boolean

	// Convenience bool for roles
	chosen?: boolean
}
export interface Agreement {
	id?: string
	name?: string
	address?: string
	slug?: string
	description?: string
	image?: string
	adminAddresses?: string[]
	membershipSettings?: MembershipSettings
	slotsLeft?: number
	agreementOwner?: AgreementMember
	admins?: AgreementMember[]
	members?: AgreementMember[]
	roles?: AgreementRole[]
	memberRolesMap?: Map<string, AgreementMember[]>
	membershipToken?: string
	currentUserAgreementPermissions?: string[]
	isCurrentUserAgreementMember?: boolean
	isCurrentUserAgreementAdmin?: boolean
	isCurrentUserAgreementOwner?: boolean
	isAgreementControlledByMeemApi?: boolean
	isValid?: boolean
	rawAgreement?: Agreements
	extensions?: AgreementExtensions[]
	gnosisSafeAddress?: string | null
	memberCount?: number
}

export const extensionFromSlug = (agreement: Agreement, slug: string) => {
	const agreementExtension = agreement?.extensions?.find(
		ae => ae.Extension?.slug === slug
	)
	return agreementExtension
}

export interface MembershipSettings {
	requirements: MembershipRequirement[]
	costToJoin: number
	membershipFundsAddress: string
	membershipQuantity: number
	membershipStartDate?: Date
	membershipEndDate?: Date
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

export function agreementRolesToAgreementRoles(
	agreementRoles: AgreementRoles[]
): AgreementRole[] {
	const roles: AgreementRole[] = []
	agreementRoles.forEach(rawRole => {
		const permissions: AgreementRolePermission[] = []
		// if (rawRole.AgreementRolePermissions) {
		// 	rawRole.AgreementRolePermissions.forEach(rolePermission => {
		// 		const rp: AgreementRolePermission = {
		// 			id: rolePermission.RolePermissionId ?? ''
		// 		}
		// 		permissions.push(rp)
		// 	})
		// }

		// Roles discord extension metadata
		const metadata = rawRole.metadata

		let guildDiscordServerIcon = ''
		let guildDiscordServerId = ''
		let guildDiscordServerName = ''
		let guildRoleName = ''
		let guildRoleId = ''

		if (metadata && metadata.length > 0 && metadata[0].discordServerData) {
			const data = metadata[0].discordServerData
			guildDiscordServerIcon = data.serverIcon
			guildDiscordServerId = data.serverId
			guildDiscordServerName = data.serverName

			if (data.roles && data.roles.length > 0) {
				data.roles.forEach((role: any) => {
					if (role.name === rawRole.name) {
						guildRoleName = role.name
						guildRoleId = role.id
					}
				})
			}
		}

		const agreementRole: AgreementRole = {
			id: rawRole.id,
			isAdminRole: rawRole.isAdminRole,
			rolesExtensionData: metadata,
			tokenAddress: rawRole.address ?? '',
			isTransferrable: rawRole.Agreement?.isTransferrable ?? false,
			name: rawRole.name,
			guildDiscordServerIcon,
			guildDiscordServerId,
			guildDiscordServerName,
			guildRoleId,
			guildRoleName,
			permissions
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
export function agreementSummaryFromAgreement(
	agreementData?: Agreements
): Agreement {
	// Count members accurately
	const members: AgreementMember[] = []

	// Parse members
	if (agreementData) {
		if (agreementData.AgreementTokens) {
			for (const agreementToken of agreementData.AgreementTokens) {
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
								ens: agreementToken.Wallet.ens ?? undefined
							})
						}
					}
				}
			}
		}
	}

	if (agreementData) {
		return {
			id: agreementData.id,
			name: agreementData.name,
			address: agreementData.address,
			admins: [],
			adminAddresses: [],
			isCurrentUserAgreementAdmin: false,
			slug: agreementData.slug,
			description: agreementData.metadata.description,
			image: agreementData.metadata.image,
			isCurrentUserAgreementMember: true,
			membershipToken: '',
			members,

			slotsLeft: 0,
			membershipSettings: {
				requirements: [],
				costToJoin: 0,
				membershipFundsAddress: '',
				membershipStartDate: undefined,
				membershipEndDate: undefined,
				membershipQuantity: 0,
				agreementAdminsAtAgreementCreation: []
			},
			isValid: agreementData.mintPermissions !== undefined,
			rawAgreement: agreementData,
			extensions: [],
			memberCount: members.length
		}
	} else {
		return {}
	}
}

export default async function agreementFromAgreement(
	wallet: any,
	walletAddress: string,
	agreementData: Agreements
): Promise<Agreement> {
	if (agreementData != null && agreementData) {
		// Parse the contract URI
		// const metadata = agreementMetadataFromContractUri(agreementData.contractURI)

		// Convert minting permissions to membership requirements
		const reqs: MembershipRequirement[] = []
		let costToJoin = 0
		let index = 0

		// Raw admin addresses stored on contract, used to filter out admin-only mintPermissions
		const adminRawAddresses: string[] = []
		let isAgreementAdmin = false
		let isAgreementOwner = false
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
		const currentUserAgreementPermissions: string[] = []
		if (agreementData.AgreementRoles) {
			agreementRoles = agreementRolesToAgreementRoles(
				agreementData.AgreementRoles
			)
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

							// Does this member have a contract role?
							const memberAgreementWallet =
								agreementToken?.Agreement?.AgreementWallets[0]

							// Logic specific to the current user
							if (isCurrentUser) {
								isAgreementMember = true
								membershipToken = agreementToken.tokenId

								log.debug(
									`agreement ownerId ${agreementData.OwnerId}`
								)
								isAgreementOwner =
									agreementToken.OwnerId ===
									agreementData.OwnerId

								// Is the current user an admin?
								if (memberAgreementWallet) {
									if (
										memberAgreementWallet.role.toLowerCase() ===
										AgreementAdminRole.toLowerCase()
									) {
										isAgreementAdmin = true
									}
								} else if (isAgreementOwner) {
									isAgreementAdmin = true
								}

								isMemberAnAdmin = isAgreementAdmin
							}

							// Is this member an admin
							if (memberAgreementWallet) {
								if (
									memberAgreementWallet.role.toLowerCase() ===
									AgreementAdminRole.toLowerCase()
								) {
									isMemberAnAdmin = true
									adminRawAddresses.push(
										agreementToken.Wallet.address ?? ''
									)
								}
							}

							// Is this member the agreement owner?
							isMemberTheAgreementOwner =
								agreementToken.OwnerId === agreementData.OwnerId

							// Check to see if the agreement is controlled by the meem api
							if (
								agreementToken.Wallet?.address.toLowerCase() ===
								process.env.NEXT_PUBLIC_MEEM_API_WALLET_ADDRESS?.toString().toLowerCase()
							) {
								isAgreementControlledByMeemApi = true
								log.debug(`Agreement is controlled by meem API`)
							}

							// Roles + permissions logic
							let memberRoles: AgreementRole[] = []
							if (agreementToken.Agreement?.AgreementRoles) {
								// Convert member roles
								memberRoles = agreementRolesToAgreementRoles(
									agreementToken.Agreement?.AgreementRoles
								)

								// Set the current user's available permissions, if they exist
								// agreementToken.Agreement.AgreementRoles.forEach(
								// 	agreementMemberRole => {
								// 		// Current member logic
								// 		if (
								// 			agreementToken.Wallet &&
								// 			agreementToken.Wallet.address.toLowerCase() ===
								// 				walletAddress.toLowerCase()
								// 		) {
								// 			// Set the current user's available permissions
								// 			if (
								// 				agreementMemberRole.AgreementRolePermissions
								// 			) {
								// 				agreementMemberRole.AgreementRolePermissions.forEach(
								// 					permission => {
								// 						if (
								// 							permission.RolePermissionId
								// 						) {
								// 							currentUserAgreementPermissions.push(
								// 								permission.RolePermissionId
								// 							)
								// 						}
								// 					}
								// 				)
								// 			}
								// 		}
								// 	}
								// )
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

		// memberRolesMap.forEach((value, key) => {
		// 	log.debug(`members for role ${key} = ${JSON.stringify(value)}`)
		// })

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

		log.debug(`current user is agreement owner = ${isAgreementOwner}`)

		log.debug(`current user is agreement admin = ${isAgreementAdmin}`)

		return {
			id: agreementData.id,
			name: agreementData.name,
			address: agreementData.address,
			adminAddresses: adminRawAddresses,
			admins,
			isCurrentUserAgreementAdmin: isAgreementAdmin,
			isCurrentUserAgreementOwner: isAgreementOwner,
			agreementOwner,
			slug: agreementData.slug,
			gnosisSafeAddress: agreementData.gnosisSafeAddress,
			description: agreementData.metadata.description,
			image: agreementData.metadata.image,
			roles: agreementRoles,
			currentUserAgreementPermissions,
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
