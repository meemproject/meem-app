import { gql } from '@apollo/client'

export const MEEM_PARTS = gql`
	fragment MeemParts on AgreementTokens {
		tokenId
		AgreementId
		Agreement {
			address
			name
			symbol
		}
	}
`

export const MEEM_CONTRACT_PARTS = gql`
	fragment AgreementParts on Agreements {
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
		AgreementTokens(
			where: {
				AgreementId: { _is_null: false }
				Agreement: {
					slug: { _eq: $clubSlug }
					chainId: { _eq: $chainId }
				}
				Wallet: { address: { _ilike: $walletAddress } }
			}
		) {
			id
			tokenId
			Wallet {
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
		AgreementTokens(
			where: {
				AgreementId: { _is_null: false }
				Agreement: {
					slug: { _eq: $clubSlug }
					chainId: { _eq: $chainId }
				}
				Wallet: { address: { _ilike: $walletAddress } }
			}
		) {
			id
			tokenId
			Wallet {
				address
			}
		}
	}
`

export const GET_CLUBS_AUTOCOMPLETE = gql`
	query GetClubsAutocomplete($query: String, $chainId: Int) {
		Agreements(
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
		Agreements(where: { address: { _eq: $contractAddress } }) {
			slug
		}
	}
`

export const GET_CLUB = gql`
	query GetClub($slug: String, $chainId: Int) {
		Agreements(
			where: { slug: { _eq: $slug }, chainId: { _eq: $chainId } }
		) {
			slug
			address
			metadata
			createdAt
			name
			AgreementTokens {
				Wallet {
					address
					ens
					User {
						displayName
						profilePicUrl
						UserIdentities {
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
			AgreementExtensions {
				AgreementExtensionLinks {
					createdAt
					id
					isEnabled
					updatedAt
					label
					url
					AgreementExtensionId
				}
				AgreementExtensionWidgets {
					AgreementExtensionId
					createdAt
					id
					isEnabled
					metadata
					updatedAt
				}
				ExtensionId
				metadata
				id
				Extension {
					slug
					id
					icon
					name
				}
			}
		}
	}
`

export const GET_CLUB_AS_MEMBER = gql`
	query GetClubAsMember($slug: String, $chainId: Int) {
		Agreements(
			where: { slug: { _eq: $slug }, chainId: { _eq: $chainId } }
		) {
			slug
			address
			metadata
			createdAt
			name
			gnosisSafeAddress
			AgreementTokens {
				Wallet {
					address
					ens
					User {
						displayName
						profilePicUrl
						UserIdentities {
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
			AgreementWallets {
				role
				Wallet {
					address
					ens
				}
			}
			id
			AgreementExtensions {
				AgreementExtensionLinks {
					createdAt
					id
					isEnabled
					updatedAt
					label
					url
					AgreementExtensionId
				}
				AgreementExtensionWidgets {
					AgreementExtensionId
					createdAt
					id
					isEnabled
					metadata
					updatedAt
				}
				metadata
				id
				Extension {
					slug
					id
					icon
					name
				}
			}
		}
	}
`

export const GET_CLUB_INFO = gql`
	query GetClubInfo($slug: String, $chainId: Int) {
		Agreements(
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
		Agreements(
			where: { slug: { _eq: $slug }, chainId: { _eq: $chainId } }
		) {
			slug
			address
			metadata
			createdAt
			name
			AgreementTokens {
				Wallet {
					address
					ens
					User {
						displayName
						profilePicUrl
						UserIdentities {
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
			AgreementExtensions {
				AgreementExtensionLinks {
					createdAt
					id
					isEnabled
					updatedAt
					label
					url
					AgreementExtensionId
				}
				AgreementExtensionWidgets {
					AgreementExtensionId
					createdAt
					id
					isEnabled
					metadata
					updatedAt
				}
				metadata
				id
				Extension {
					slug
					id
					icon
					name
				}
			}
		}
	}
`

export const SUB_CLUB_AS_MEMBER = gql`
	subscription GetClubAsMemberSubscription($slug: String, $chainId: Int) {
		Agreements(
			where: { slug: { _eq: $slug }, chainId: { _eq: $chainId } }
		) {
			slug
			address
			metadata
			createdAt
			name
			gnosisSafeAddress
			OwnerId
			AgreementTokens {
				OwnerId
				Wallet {
					address
					ens
					User {
						displayName
						profilePicUrl
						UserIdentities {
							metadata
							visibility
						}
					}
				}
				tokenId
				tokenURI
				mintedAt
				mintedBy
				Agreement {
					AgreementWallets {
						role
						Wallet {
							address
						}
					}
					AgreementRoles {
						id
						isAdminRole
						name
						# AgreementRolePermissions {
						# 	RolePermissionId
						# }
						address
						metadata
						Agreement {
							isTransferrable
						}
					}
				}
			}
			splits
			maxSupply
			mintPermissions
			symbol
			id
			AgreementExtensions {
				AgreementExtensionLinks {
					createdAt
					id
					isEnabled
					updatedAt
					label
					url
					AgreementExtensionId
				}
				AgreementExtensionWidgets {
					AgreementExtensionId
					createdAt
					id
					isEnabled
					metadata
					updatedAt
				}
				metadata
				Extension {
					slug
					id
					icon
					name
				}
			}
			AgreementRoles {
				id
				name
				isAdminRole
				# AgreementRolePermissions {
				# 	RolePermissionId
				# }
				address
				metadata
				Agreement {
					isTransferrable
				}
			}
		}
	}
`

export const SUB_CLUBS = gql`
	subscription ClubSubscription($address: String, $chainId: Int) {
		Agreements(
			where: { address: { _eq: $address }, chainId: { _eq: $chainId } }
		) {
			slug
			address
			createdAt
			name
			metadata
			AgreementTokens {
				Wallet {
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
			AgreementWallets {
				role
				Wallet {
					ens
					address
				}
			}
		}
	}
`

export const GET_EXTENSIONS = gql`
	query GetExtensions {
		Extensions {
			createdAt
			description
			guideUrl
			icon
			id
			name
			slug
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
		Agreements(
			where: { slug: { _eq: $slug }, chainId: { _eq: $chainId } }
		) {
			AgreementTokens(
				where: {
					Agreement: { AgreementRoles: { id: { _eq: $roleId } } }
				}
			) {
				Wallet {
					address
					ens
					User {
						displayName
						profilePicUrl
						UserIdentities {
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
		Agreements(
			where: { chainId: { _eq: $chainId } }
			order_by: { AgreementTokens_aggregate: { count: desc } }
			limit: $limit
			offset: $offset
		) {
			slug
			address
			createdAt
			name
			metadata
			AgreementTokens {
				Wallet {
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
			# AgreementWallets {
			# 	role
			# 	Wallet {
			# 		ens
			# 		address
			# 	}
			# }
			# AgreementTokens {
			# 	Wallet {
			# 		address
			# 		ens
			# 	}
			# }
		}
	}
`

export const SUB_MY_CLUBS = gql`
	subscription MyClubsSubscription($walletAddress: String, $chainId: Int) {
		AgreementTokens(
			where: {
				AgreementId: { _is_null: false }
				Wallet: { address: { _ilike: $walletAddress } }
				Agreement: { chainId: { _eq: $chainId } }
			}
			order_by: {
				Agreement: { AgreementTokens_aggregate: { count: desc } }
			}
		) {
			tokenId
			AgreementId
			Agreement {
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
				AgreementWallets {
					role
					Wallet {
						ens
						address
					}
				}
				AgreementTokens_aggregate {
					aggregate {
						count
					}
				}
				AgreementTokens {
					Wallet {
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
