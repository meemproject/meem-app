import { gql } from '@apollo/client'

export const GET_IS_MEMBER_OF_CLUB = gql`
	query IsCurrentUserClubClubMember(
		$walletAddress: String
		$clubContractId: String
	) {
		Meems(
			where: {
				MeemContractId: { _is_null: false }
				owner: { _eq: $walletAddress }
				MeemContract: { address: { _eq: $clubContractId } }
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
				address
				name
				symbol
			}
		}
	}
`
