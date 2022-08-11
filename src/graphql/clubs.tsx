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
	query GetIsMemberOfClub($walletAddress: String, $clubSlug: String) {
		Meems(
			where: {
				MeemContractId: { _is_null: false }
				MeemContract: { slug: { _eq: $clubSlug } }
			}
		) {
			...MeemParts
		}
	}
	${MEEM_PARTS}
`

export const GET_CLUBS_AUTOCOMPLETE = gql`
	query GetClubsAutocomplete($query: String) {
		MeemContracts(where: { name: { _ilike: $query } }) {
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
	query GetClub($slug: String) {
		MeemContracts(where: { slug: { _eq: $slug } }) {
			slug
			address
			metadata
			createdAt
			name
			gnosisSafeAddress
			Meems {
				Owner {
					address
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

export const SUB_CLUB = gql`
	subscription GetClubSubscription($slug: String) {
		MeemContracts(where: { slug: { _eq: $slug } }) {
			slug
			address
			metadata
			createdAt
			name
			Meems {
				Owner {
					address
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

export const SUB_CLUBS = gql`
	subscription ClubSubscription($address: String) {
		MeemContracts(where: { address: { _eq: $address } }) {
			slug
			address
			createdAt
			name
			metadata
			Meems {
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
					address
				}
			}
		}
	}
`

export const GET_MY_CLUBS = gql`
	query MyClubs($walletAddress: String) {
		Meems(
			where: { MeemContractId: { _is_null: false } }
			distinct_on: MeemContractId
		) {
			tokenId
			MeemContractId
			MeemContract {
				slug
				address
				createdAt
				name
				metadata
				splits
				mintPermissions
				symbol
				MeemContractWallets {
					role
					Wallet {
						address
					}
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

export const SUB_MY_CLUBS = gql`
	subscription MyClubsSubscription($walletAddress: String) {
		Meems(
			where: {
				MeemContractId: { _is_null: false }
				Owner: { address: { _ilike: $walletAddress } }
			}
			distinct_on: MeemContractId
		) {
			tokenId
			MeemContractId
			MeemContract {
				slug
				address
				createdAt
				name
				metadata
				splits
				mintPermissions
				symbol
				MeemContractWallets {
					role
					Wallet {
						address
					}
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
		}
	}
`
