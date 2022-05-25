import { gql } from '@apollo/client'

export const GET_IS_MEMBER_OF_CLUB = gql`
	query GetIsMemberOfClub($walletAddress: String, $clubSlug: String) {
		Meems(
			where: {
				MeemContractId: { _is_null: false }
				owner: { _eq: $walletAddress }
				MeemContract: { slug: { _eq: $clubSlug } }
			}
		) {
			owner
			tokenId
			MeemContractId
			MeemContract {
				address
				name
				symbol
			}
		}
	}
`

export const GET_CLUBS_AUTOCOMPLETE = gql`
	query GetClubsAutocomplete($query: String) {
		MeemContracts(where: { name: { _ilike: $query } }) {
			id
			name
			contractURI
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
			contractURI
			createdAt
			name
			Meems {
				owner
				tokenId
				tokenURI
				mintedAt
				mintedBy
				data
			}
			splits
			mintEndAt
			mintStartAt
			mintPermissions
			originalsPerWallet
			totalOriginalsSupply
			symbol
		}
	}
`

export const SUB_CLUB = gql`
	subscription ClubSubscription($address: String) {
		MeemContracts(where: { address: { _eq: $address } }) {
			slug
			address
			contractURI
			createdAt
			name
			Meems {
				owner
				tokenId
				tokenURI
				mintedAt
				mintedBy
				data
			}
			splits
			mintEndAt
			mintStartAt
			mintPermissions
			originalsPerWallet
			totalOriginalsSupply
			symbol
		}
	}
`

export const GET_MY_CLUBS = gql`
	query MyClubs($walletAddress: String) {
		Meems(
			where: {
				MeemContractId: { _is_null: false }
				owner: { _eq: $walletAddress }
			}
			distinct_on: MeemContractId
		) {
			owner
			tokenId
			MeemContractId
			MeemContract {
				slug
				address
				contractURI
				createdAt
				name
				splits
				mintEndAt
				mintStartAt
				mintPermissions
				originalsPerWallet
				totalOriginalsSupply
				symbol
			}
		}
	}
`
