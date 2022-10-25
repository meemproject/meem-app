import { gql } from '@apollo/client'

export const MEEM_PARTS = gql`
	fragment MeemParts on Meems {
		tokenId
		MeemContractId
		MeemContract {
			address
			name
			symbol
		}
	}
`

export const MEEM_CONTRACT_PARTS = gql`
	fragment MeemContractParts on MeemContracts {
		slug
		address
		metadata
		createdAt
		name
	}
`

export const GET_IS_MEMBER_OF_CLUB = gql`
	query GetIsMemberOfClub(
		$walletAddress: String
		$clubSlug: String
		$chainId: Int!
	) {
		Meems(
			where: {
				MeemContractId: { _is_null: false }
				MeemContract: {
					slug: { _eq: $clubSlug }
					chainId: { _eq: $chainId }
				}
				Owner: { address: { _ilike: $walletAddress } }
			}
		) {
			id
			tokenId
			Owner {
				address
			}
		}
	}
`

export const SUB_IS_MEMBER_OF_CLUB = gql`
	subscription GetIsMemberOfClubSubscription(
		$walletAddress: String
		$clubSlug: String
		$chainId: Int
	) {
		Meems(
			where: {
				MeemContractId: { _is_null: false }
				MeemContract: {
					slug: { _eq: $clubSlug }
					chainId: { _eq: $chainId }
				}
				Owner: { address: { _ilike: $walletAddress } }
			}
		) {
			id
			tokenId
			Owner {
				address
			}
		}
	}
`

export const GET_CLUBS_AUTOCOMPLETE = gql`
	query GetClubsAutocomplete($query: String, $chainId: Int) {
		MeemContracts(
			where: { name: { _ilike: $query }, chainId: { _eq: $chainId } }
		) {
			id
			name
			metadata
			slug
		}
	}
`

export const GET_CLUB_SLUG = gql`
	query GetClubSlug($contractAddress: String) {
		MeemContracts(where: { address: { _eq: $contractAddress } }) {
			slug
		}
	}
`

export const GET_CLUB = gql`
	query GetClub($slug: String, $chainId: Int) {
		MeemContracts(
			where: { slug: { _eq: $slug }, chainId: { _eq: $chainId } }
		) {
			slug
			address
			metadata
			createdAt
			name
			Meems {
				Owner {
					address
					ens
					MeemIdentities {
						displayName
						profilePicUrl
						MeemIdentityIntegrations {
							metadata
							visibility
						}
					}
				}
				tokenId
				tokenURI
				mintedAt
				mintedBy
			}
			splits
			maxSupply
			mintPermissions
			symbol
			id
			MeemContractIntegrations(where: { isEnabled: { _eq: true } }) {
				IntegrationId
				id
				isEnabled
				metadata
				Integration {
					description
					guideUrl
					icon
					id
					name
				}
				isPublic
			}
		}
	}
`

export const GET_CLUB_AS_MEMBER = gql`
	query GetClubAsMember($slug: String, $chainId: Int) {
		MeemContracts(
			where: { slug: { _eq: $slug }, chainId: { _eq: $chainId } }
		) {
			slug
			address
			metadata
			createdAt
			name
			gnosisSafeAddress
			Meems {
				Owner {
					address
					ens
					MeemIdentities {
						displayName
						profilePicUrl
						MeemIdentityIntegrations {
							metadata
							visibility
						}
					}
				}
				tokenId
				tokenURI
				mintedAt
				mintedBy
			}
			splits
			maxSupply
			mintPermissions
			symbol
			MeemContractWallets {
				role
				Wallet {
					address
					ens
				}
			}
			id
			MeemContractIntegrations(where: { isEnabled: { _eq: true } }) {
				IntegrationId
				id
				isEnabled
				metadata
				Integration {
					description
					guideUrl
					icon
					id
					name
				}
				isPublic
			}
		}
	}
`

export const GET_CLUB_INFO = gql`
	query GetClubInfo($slug: String, $chainId: Int) {
		MeemContracts(
			where: { slug: { _eq: $slug }, chainId: { _eq: $chainId } }
		) {
			slug
			address
			metadata
			createdAt
			name
		}
	}
`

export const SUB_CLUB = gql`
	subscription GetClubSubscription($slug: String, $chainId: Int) {
		MeemContracts(
			where: { slug: { _eq: $slug }, chainId: { _eq: $chainId } }
		) {
			slug
			address
			metadata
			createdAt
			name
			Meems {
				Owner {
					address
					ens
					MeemIdentities {
						displayName
						profilePicUrl
						MeemIdentityIntegrations {
							metadata
							visibility
						}
					}
				}
				tokenId
				tokenURI
				mintedAt
				mintedBy
			}
			splits
			maxSupply
			mintPermissions
			symbol
			id
			MeemContractIntegrations(where: { isEnabled: { _eq: true } }) {
				IntegrationId
				id
				isEnabled
				metadata
				Integration {
					description
					guideUrl
					icon
					id
					name
				}
				isPublic
			}
		}
	}
`

export const SUB_CLUB_AS_MEMBER = gql`
	subscription GetClubAsMemberSubscription($slug: String, $chainId: Int) {
		MeemContracts(
			where: { slug: { _eq: $slug }, chainId: { _eq: $chainId } }
		) {
			slug
			address
			metadata
			createdAt
			name
			gnosisSafeAddress
			OwnerId
			Meems {
				OwnerId
				Owner {
					address
					ens
					MeemIdentities {
						displayName
						profilePicUrl
						MeemIdentityIntegrations {
							metadata
							visibility
						}
					}
				}
				tokenId
				tokenURI
				mintedAt
				mintedBy
				MeemContract {
					MeemContractWallets {
						role
					}
					MeemContractRoles {
						id
						isAdminRole
						isDefaultRole
						name
						MeemContractRolePermissions {
							RolePermissionId
						}
						integrationsMetadata
					}
				}
			}
			splits
			maxSupply
			mintPermissions
			symbol
			id
			MeemContractIntegrations(where: { isEnabled: { _eq: true } }) {
				IntegrationId
				id
				isEnabled
				metadata
				Integration {
					description
					guideUrl
					icon
					id
					name
				}
				isPublic
			}
			MeemContractRoles {
				id
				name
				isAdminRole
				isDefaultRole
				MeemContractRolePermissions {
					RolePermissionId
				}
				integrationsMetadata
			}
		}
	}
`

export const SUB_CLUBS = gql`
	subscription ClubSubscription($address: String, $chainId: Int) {
		MeemContracts(
			where: { address: { _eq: $address }, chainId: { _eq: $chainId } }
		) {
			slug
			address
			createdAt
			name
			metadata
			Meems {
				Owner {
					address
					ens
				}
				tokenId
				tokenURI
				mintedAt
				mintedBy
			}
			splits
			mintPermissions
			symbol
			MeemContractWallets {
				role
				Wallet {
					ens
					address
				}
			}
		}
	}
`

export const GET_INTEGRATIONS = gql`
	query GetIntegrations {
		Integrations {
			createdAt
			deletedAt
			description
			guideUrl
			icon
			id
			name
			updatedAt
		}
	}
`

export const GET_AVAILABLE_PERMISSIONS = gql`
	query GetAvailablePermission {
		RolePermissions {
			description
			id
			name
		}
	}
`

export const GET_MEMBERS_FOR_ROLE = gql`
	query GetClubMembersForRole($slug: String, $chainId: Int, $roleId: uuid) {
		MeemContracts(
			where: { slug: { _eq: $slug }, chainId: { _eq: $chainId } }
		) {
			Meems(
				where: {
					MeemContract: {
						MeemContractRoles: { id: { _eq: $roleId } }
					}
				}
			) {
				Owner {
					address
					ens
					MeemIdentities {
						displayName
						profilePicUrl
						MeemIdentityIntegrations {
							metadata
							visibility
						}
					}
				}
			}
		}
	}
`

export const GET_ALL_CLUBS = gql`
	query AllClubs($chainId: Int, $limit: Int, $offset: Int) {
		MeemContracts(
			where: { chainId: { _eq: $chainId } }
			order_by: { Meems_aggregate: { count: desc } }
			limit: $limit
			offset: $offset
		) {
			slug
			address
			createdAt
			name
			metadata
			Meems {
				Owner {
					address
					ens
				}
				tokenId
				tokenURI
				mintedAt
				mintedBy
			}
			splits
			mintPermissions
			symbol
			# MeemContractWallets {
			# 	role
			# 	Wallet {
			# 		ens
			# 		address
			# 	}
			# }
			# Meems {
			# 	Owner {
			# 		address
			# 		ens
			# 	}
			# }
		}
	}
`

export const SUB_MY_CLUBS = gql`
	subscription MyClubsSubscription($walletAddress: String, $chainId: Int) {
		Meems(
			where: {
				MeemContractId: { _is_null: false }
				Owner: { address: { _ilike: $walletAddress } }
				MeemContract: { chainId: { _eq: $chainId } }
			}
			order_by: { MeemContract: { Meems_aggregate: { count: desc } } }
		) {
			tokenId
			MeemContractId
			MeemContract {
				id
				slug
				address
				createdAt
				name
				metadata
				splits
				gnosisSafeAddress
				mintPermissions
				symbol
				MeemContractWallets {
					role
					Wallet {
						ens
						address
					}
				}
				Meems_aggregate {
					aggregate {
						count
					}
				}
				Meems {
					Owner {
						address
						ens
					}
				}
				updatedAt
			}
		}
	}
`

export const GET_BUNDLE_BY_ID = gql`
	query GetBundleById($id: uuid!) {
		Bundles(where: { id: { _eq: $id } }) {
			id
			abi
			BundleContracts {
				functionSelectors
				Contract {
					ContractInstances {
						address
					}
				}
			}
		}
	}
`
