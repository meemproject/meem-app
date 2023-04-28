import { gql } from '@apollo/client'

export const MEEM_PARTS = gql`
	fragment MeemParts on AgreementTokens {
		tokenId
		AgreementId
		Agreement {
			address
			name
			symbol
			isOnChain
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
		isOnChain
	}
`

export const GET_AGREEMENT_EXISTS = gql`
	query GetAgreementExists($slug: String, $chainId: Int) {
		Agreements(
			where: { slug: { _eq: $slug }, chainId: { _eq: $chainId } }
		) {
			slug
		}
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
			isOnChain
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
					visibility
				}
				AgreementExtensionWidgets {
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
			}
			AgreementRoles {
				id
				name
				isAdminRole
				address
				metadata
			}
		}
	}
`
export const GET_AGREEMENT_AS_MEMBER = gql`
	query GetAgreementAsMemberQuery($slug: String, $chainId: Int) {
		Agreements(
			where: { slug: { _eq: $slug }, chainId: { _eq: $chainId } }
		) {
			slug
			address
			metadata
			createdAt
			name
			isLaunched
			isOnChain
			gnosisSafeAddress
			OwnerId
			AgreementTokens {
				OwnerId
				id
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
				isSetupComplete
				Extension {
					capabilities
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
				AgreementRoleTokens {
					OwnerId
				}
			}
			AgreementRoleTokens {
				OwnerId
				AgreementRoleId
				id
				tokenId
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
			isOnChain
			OwnerId
			AgreementTokens {
				OwnerId
				id
				Wallet {
					address
					ens
					User {
						displayName
						UserIdentities {
							metadata
							visibility
						}
					}
					id
				}
				tokenId
				mintedBy
			}
			symbol
			id
			AgreementExtensions {
				AgreementExtensionLinks {
					id
					isEnabled
					label
					url
					AgreementExtensionId
					visibility
				}
				AgreementExtensionWidgets {
					AgreementExtensionId
					id
					isEnabled
					metadata
					visibility
				}
				id
				metadata
			}
			AgreementRoles {
				id
				name
				isAdminRole
				address
				metadata
				AgreementRoleTokens {
					OwnerId
				}
				Agreement {
					isTransferrable
				}
			}
			AgreementRoleTokens {
				OwnerId
				AgreementRoleId
				id
				tokenId
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
			name
		}
	}
`

export const GET_EXTENSIONS = gql`
	query GetExtensions {
		Extensions(order_by: { slug: asc }) {
			capabilities
			category
			createdAt
			description
			guideUrl
			icon
			id
			isSetupRequired
			name
			slug
			updatedAt
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
			}
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
			order_by: { name: asc }
		) {
			id
			slug
			name
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
