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

export const GET_IS_MEMBER_OF_AGREEMENT = gql`
	query GetIsMemberOfAgreement(
		$walletAddress: String
		$agreementSlug: String
		$chainId: Int!
	) {
		AgreementTokens(
			where: {
				AgreementId: { _is_null: false }
				Agreement: {
					slug: { _eq: $agreementSlug }
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

export const SUB_IS_MEMBER_OF_AGREEMENT = gql`
	subscription GetIsMemberOfAgreementSubscription(
		$walletAddress: String
		$agreementSlug: String
		$chainId: Int
	) {
		AgreementTokens(
			where: {
				AgreementId: { _is_null: false }
				Agreement: {
					slug: { _eq: $agreementSlug }
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

export const GET_AGREEMENTS_AUTOCOMPLETE = gql`
	query GetAgreementsAutocomplete($query: String, $chainId: Int) {
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

export const GET_AGREEMENT_SLUG = gql`
	query GetAgreementSlug($contractAddress: String) {
		Agreements(where: { address: { _eq: $contractAddress } }) {
			slug
		}
	}
`

export const GET_AGREEMENT_INFO = gql`
	query GetAgreementInfo($slug: String, $chainId: Int) {
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

export const SUB_AGREEMENT = gql`
	subscription GetAgreementSubscription($slug: String, $chainId: Int) {
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
				AgreementExtensionLinks(
					where: { visibility: { _eq: "anyone" } }
				) {
					createdAt
					id
					isEnabled
					updatedAt
					label
					url
					AgreementExtensionId
					visibility
				}
				AgreementExtensionWidgets(
					where: { visibility: { _eq: "anyone" } }
				) {
					AgreementExtensionId
					createdAt
					id
					isEnabled
					metadata
					updatedAt
					visibility
				}
				metadata
				id
				isInitialized
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
				address
				metadata
				Agreement {
					isTransferrable
				}
			}
			AgreementRoleTokens {
				OwnerId
				AgreementRoleId
				id
			}
		}
	}
`

export const SUB_AGREEMENT_AS_MEMBER = gql`
	subscription GetAgreementAsMemberSubscription(
		$slug: String
		$chainId: Int
	) {
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
					id
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
				AgreementExtensionLinks(
					where: { visibility: { _in: ["token-holders", "anyone"] } }
				) {
					createdAt
					id
					isEnabled
					updatedAt
					label
					url
					AgreementExtensionId
					visibility
				}
				AgreementExtensionWidgets(
					where: { visibility: { _in: ["token-holders", "anyone"] } }
				) {
					AgreementExtensionId
					createdAt
					id
					isEnabled
					metadata
					updatedAt
					visibility
				}
				id
				metadata
				isInitialized
				Extension {
					slug
					id
					icon
					name
					slug
				}
			}
			AgreementRoles {
				id
				name
				isAdminRole
				address
				metadata
				Agreement {
					isTransferrable
				}
			}
			AgreementRoleTokens {
				OwnerId
				AgreementRoleId
				id
			}
			AgreementWallets {
				role
				Wallet {
					address
				}
			}
		}
	}
`

export const SUB_AGREEMENTS = gql`
	subscription AgreementSubscription($address: String, $chainId: Int) {
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
	query GetAgreementMembersForRole(
		$slug: String
		$chainId: Int
		$roleId: uuid
	) {
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

export const GET_ALL_AGREEMENTS = gql`
	query AllAgreements($chainId: Int, $limit: Int, $offset: Int) {
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
		}
	}
`

export const SUB_MY_AGREEMENTS = gql`
	subscription MyAgreementsSubscription(
		$walletAddress: String
		$chainId: Int
	) {
		Agreements(
			where: {
				AgreementTokens: {
					Wallet: { address: { _ilike: $walletAddress } }
				}
				chainId: { _eq: $chainId }
			}
			order_by: { AgreementTokens_aggregate: { count: desc } }
		) {
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
			AgreementTokens {
				Wallet {
					address
					ens
				}
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
