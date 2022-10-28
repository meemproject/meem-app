/* eslint-disable @typescript-eslint/no-loop-func */
import log from '@kengoldfarb/log'
import { MeemAPI, normalizeImageUrl } from '@meemproject/api'
import { ethers } from 'ethers'
import { DateTime } from 'luxon'
import { MeemContractRoles, MeemContracts } from '../../../generated/graphql'
import { tokenFromContractAddress } from '../token/token'

export const ClubAdminRole =
	'0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775'
export const ClubMinterRole =
	'0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6'
export const ClubUpgraderRole =
	'0x189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e3'
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
	url?: string
	icon?: string
	description?: string
	guideUrl?: string

	// Per-app properties
	verifiedTwitterUser?: string
	publicationSlug?: string
	publicationName?: string
	gatherTownSpacePw?: string
}

export interface ClubRolePermission {
	id: string
	name?: string
	description?: string
	enabled?: boolean
	locked?: boolean
}

export interface ClubRole {
	id: string
	name: string
	isAdminRole?: boolean
	isDefaultRole?: boolean
	isTransferrable?: boolean
	tokenAddress?: string
	permissions: ClubRolePermission[]
	rolesIntegrationData?: any
	guildRoleId?: string
	guildRoleName?: string
	guildDiscordServerName?: string
	guildDiscordServerId?: string
	guildDiscordServerIcon?: string
}

export function emptyRole(): ClubRole {
	return {
		id: 'addRole',
		isAdminRole: false,
		isDefaultRole: false,
		name: '',
		permissions: [],
		rolesIntegrationData: '',
		guildRoleId: '',
		guildRoleName: '',
		guildDiscordServerId: '',
		guildDiscordServerIcon: '',
		guildDiscordServerName: ''
	}
}

export interface ClubMember {
	displayName?: string
	wallet: string
	ens?: string
	profilePicture?: string
	twitterUsername?: string
	discordUsername?: string
	discordUserId?: string
	emailAddress?: string
	roles?: ClubRole[]
	isClubOwner?: boolean
	isClubAdmin?: boolean

	// Convenience bool for roles
	chosen?: boolean
}
export interface Club {
	id?: string
	name?: string
	address?: string
	slug?: string
	description?: string
	image?: string
	adminAddresses?: string[]
	membershipSettings?: MembershipSettings
	slotsLeft?: number
	clubOwner?: ClubMember
	admins?: ClubMember[]
	members?: ClubMember[]
	roles?: ClubRole[]
	memberRolesMap?: Map<string, ClubMember[]>
	membershipToken?: string
	currentUserClubPermissions?: string[]
	isCurrentUserClubMember?: boolean
	isCurrentUserClubAdmin?: boolean
	isCurrentUserClubOwner?: boolean
	isClubControlledByMeemApi?: boolean
	isValid?: boolean
	rawClub?: MeemContracts
	allIntegrations?: Integration[]
	publicIntegrations?: Integration[]
	privateIntegrations?: Integration[]
	gnosisSafeAddress?: string | null
	memberCount?: number
}

export interface MembershipSettings {
	requirements: MembershipRequirement[]
	costToJoin: number
	membershipFundsAddress: string
	membershipQuantity: number
	membershipStartDate?: Date
	membershipEndDate?: Date
	// The club admins set when the club is created
	clubAdminsAtClubCreation?: string[]
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

export function meemContractRolesToClubRoles(
	meemContractRoles: MeemContractRoles[]
): ClubRole[] {
	const roles: ClubRole[] = []
	meemContractRoles.forEach(rawRole => {
		const permissions: ClubRolePermission[] = []
		if (rawRole.MeemContractRolePermissions) {
			rawRole.MeemContractRolePermissions.forEach(rolePermission => {
				const rp: ClubRolePermission = {
					id: rolePermission.RolePermissionId ?? ''
				}
				permissions.push(rp)
			})
		}

		// Roles discord integration metadata
		const metadata = rawRole.integrationsMetadata

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

		const clubRole: ClubRole = {
			id: rawRole.id,
			isAdminRole: rawRole.isAdminRole,
			isDefaultRole: rawRole.isDefaultRole,
			rolesIntegrationData: metadata,
			tokenAddress: rawRole.tokenAddress ?? '',
			isTransferrable: rawRole.isTokenTransferrable,
			name: rawRole.name,
			guildDiscordServerIcon,
			guildDiscordServerId,
			guildDiscordServerName,
			guildRoleId,
			guildRoleName,
			permissions
		}
		roles.push(clubRole)
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
	// Club membership
	clubContractAddress: string
	otherClubName: string // Resolved from contract
}

// The club's basic metadata, doesn't require async
export function clubSummaryFromMeemContract(clubData?: MeemContracts): Club {
	// Count members accurately
	const members: ClubMember[] = []

	// Parse members
	if (clubData) {
		if (clubData.Meems) {
			for (const meem of clubData.Meems) {
				if (
					meem.Owner?.address.toLowerCase() !==
						MeemAPI.zeroAddress.toLowerCase() &&
					// 0xfurnace address
					meem.Owner?.address.toLowerCase() !==
						'0x6b6e7fb5cd1773e9060a458080a53ddb8390d4eb'
				) {
					if (meem.Owner) {
						let hasAlreadyBeenAdded = false
						members.forEach(member => {
							if (member.wallet === meem.Owner?.address) {
								hasAlreadyBeenAdded = true
							}
						})
						if (!hasAlreadyBeenAdded) {
							members.push({
								wallet: meem.Owner.address,
								ens: meem.Owner.ens ?? undefined
							})
						}
					}
				}
			}
		}
	}

	if (clubData) {
		return {
			id: clubData.id,
			name: clubData.name,
			address: clubData.address,
			admins: [],
			adminAddresses: [],
			isCurrentUserClubAdmin: false,
			slug: clubData.slug,
			description: clubData.metadata.description,
			image: clubData.metadata.image,
			isCurrentUserClubMember: true,
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
				clubAdminsAtClubCreation: []
			},
			isValid: clubData.mintPermissions !== undefined,
			rawClub: clubData,
			allIntegrations: [],
			memberCount: members.length
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

		// Convert minting permissions to membership requirements
		const reqs: MembershipRequirement[] = []
		let costToJoin = 0
		let index = 0

		// Raw admin addresses stored on contract, used to filter out admin-only mintPermissions
		const adminRawAddresses: string[] = []
		let isClubAdmin = false
		let isClubOwner = false

		// Club members and admins
		let clubOwner = undefined
		const admins: ClubMember[] = []
		const members: ClubMember[] = []

		// Is the current user a club member?
		let isClubMember = false

		let membershipToken = undefined

		// Parse roles
		let clubRoles: ClubRole[] = []
		const currentUserClubPermissions: string[] = []
		if (clubData.MeemContractRoles) {
			clubRoles = meemContractRolesToClubRoles(clubData.MeemContractRoles)
		}

		// Parse members
		if (clubData.Meems) {
			for (const meem of clubData.Meems) {
				if (
					// Filter out 0xfurnace + zero address
					meem.Owner?.address.toLowerCase() !==
						MeemAPI.zeroAddress.toLowerCase() &&
					// 0xfurnace address
					meem.Owner?.address.toLowerCase() !==
						'0x6b6e7fb5cd1773e9060a458080a53ddb8390d4eb'
				) {
					if (meem.Owner) {
						// Filter duplicate meem owners
						let hasAlreadyBeenAdded = false
						members.forEach(member => {
							if (member.wallet === meem.Owner?.address) {
								hasAlreadyBeenAdded = true
							}
						})

						// Is this member an admin?
						let isMemberAnAdmin = false

						// Is this member the club owner?
						let isMemberTheClubOwner = false

						if (!hasAlreadyBeenAdded) {
							// Is this the current user?
							const isCurrentUser =
								walletAddress &&
								walletAddress?.toLowerCase() ===
									meem.Owner?.address.toLowerCase()

							// Does this member have a contract role?
							const memberMeemContractWallet =
								meem?.MeemContract?.MeemContractWallets[0]

							// Logic specific to the current user
							if (isCurrentUser) {
								isClubMember = true
								membershipToken = meem.tokenId

								log.debug(`meem ownerId ${meem.OwnerId}`)
								log.debug(`club ownerId ${clubData.OwnerId}`)
								isClubOwner = meem.OwnerId === clubData.OwnerId

								// Is the current user an admin?
								if (memberMeemContractWallet) {
									if (
										memberMeemContractWallet.role.toLowerCase() ===
										ClubAdminRole.toLowerCase()
									) {
										isClubAdmin = true
									}
								} else if (isClubOwner) {
									isClubAdmin = true
								}

								isMemberAnAdmin = isClubAdmin
							}

							// Is this member an admin
							if (memberMeemContractWallet) {
								if (
									memberMeemContractWallet.role.toLowerCase() ===
									ClubAdminRole.toLowerCase()
								) {
									isMemberAnAdmin = true
									adminRawAddresses.push(
										meem.Owner.address ?? ''
									)
								}
							}

							// Is this member the club owner?
							isMemberTheClubOwner =
								meem.OwnerId === clubData.OwnerId

							// Roles + permissions logic
							let memberRoles: ClubRole[] = []
							if (meem.MeemContract?.MeemContractRoles) {
								// Convert member roles
								memberRoles = meemContractRolesToClubRoles(
									meem.MeemContract?.MeemContractRoles
								)

								// Set the current user's available permissions, if they exist
								meem.MeemContract.MeemContractRoles.forEach(
									clubMemberRole => {
										// Current member logic
										if (
											meem.Owner &&
											meem.Owner.address.toLowerCase() ===
												walletAddress.toLowerCase()
										) {
											// Set the current user's available permissions
											if (
												clubMemberRole.MeemContractRolePermissions
											) {
												clubMemberRole.MeemContractRolePermissions.forEach(
													permission => {
														if (
															permission.RolePermissionId
														) {
															currentUserClubPermissions.push(
																permission.RolePermissionId
															)
														}
													}
												)
											}
										}
									}
								)
							}

							// Club member metadata + integrations
							const memberIdentity =
								meem.Owner.MeemIdentities &&
								meem.Owner.MeemIdentities.length > 0
									? meem.Owner.MeemIdentities[0]
									: undefined

							let twitterUsername = ''
							let discordUsername = ''
							let discordUserId = ''
							let emailAddress = ''

							memberIdentity?.MeemIdentityIntegrations.forEach(
								inte => {
									if (inte.metadata.twitterUsername) {
										twitterUsername =
											inte.metadata.twitterUsername
									} else if (inte.metadata.discordUsername) {
										discordUsername =
											inte.metadata.discordUsername
										discordUserId =
											inte.metadata.discordUserId
									} else if (inte.metadata.emailAddress) {
										emailAddress =
											inte.metadata.emailAddress
									}
								}
							)

							// Assemble member
							const memberData = {
								wallet: meem.Owner.address,
								ens: meem.Owner.ens ?? undefined,
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
								isClubOwner: isMemberTheClubOwner,
								isClubAdmin: isMemberAnAdmin
							}

							// Add to members
							members.push(memberData)

							// Add to admins if necessary
							if (isMemberAnAdmin) {
								admins.push(memberData)
							}

							// Set club owner if necessary
							if (meem.OwnerId === clubData.OwnerId) {
								clubOwner = memberData
							}
						}
					}
				}
			}
		}

		// role id => club member relation
		const memberRolesMap: Map<string, ClubMember[]> = new Map()

		// Populate the above map with all role ids
		clubRoles.forEach(role => {
			memberRolesMap.set(role.id, [])
		})

		// Build a relationship between role id <> ClubMember[]
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

		if (clubData.mintPermissions) {
			await Promise.all(
				clubData.mintPermissions.map(async (permission: any) => {
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

						// Construct a requirement - only push if it is not 'anyone'
						if (
							permission.permission !== MeemAPI.Permission.Anyone
						) {
							reqs.push({
								index,
								andor: MembershipReqAndor.Or,
								type,
								applicationInstructions: clubData.metadata
									.application_instructions
									? clubData.metadata.application_instructions
											.length > 0
										? clubData.metadata
												.application_instructions[0]
										: undefined
									: undefined,
								approvedAddresses,
								approvedAddressesString,
								tokenName,
								tokenMinQuantity,
								tokenChain: '',
								clubContractAddress,
								tokenContractAddress,
								otherClubName: clubName
							})

							index++
						}
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

						guideUrl: inte.Integration?.guideUrl,
						url: inte.metadata.externalUrl ?? '',
						isExistingIntegration: true,

						// Per app properties
						verifiedTwitterUser:
							inte.metadata.twitterUsername ?? '',
						publicationSlug: inte.metadata.publicationSlug ?? '',
						publicationName: inte.metadata.publicationName ?? '',
						gatherTownSpacePw: inte.metadata.gatherTownSpacePw ?? ''
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

		// Determine if the club is controlled by the Meem API wallet address
		let isClubControlledByMeemApi = false
		clubData.MeemContractWallets.forEach(contractWallet => {
			if (contractWallet.Wallet) {
				if (
					contractWallet.Wallet.address.toLowerCase() ===
					process.env.NEXT_PUBLIC_MEEM_API_WALLET_ADDRESS?.toString().toLowerCase()
				) {
					isClubControlledByMeemApi = true
				}
			}
		})

		log.debug(
			`club is controlled by meem api = ${isClubControlledByMeemApi}`
		)

		return {
			id: clubData.id,
			name: clubData.name,
			address: clubData.address,
			adminAddresses: adminRawAddresses,
			admins,
			isCurrentUserClubAdmin: isClubAdmin,
			isCurrentUserClubOwner: isClubOwner,
			clubOwner,
			slug: clubData.slug,
			gnosisSafeAddress: clubData.gnosisSafeAddress,
			description: clubData.metadata.description,
			image: clubData.metadata.image,
			roles: clubRoles,
			currentUserClubPermissions,
			memberRolesMap,
			isCurrentUserClubMember: isClubMember,
			isClubControlledByMeemApi,
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
