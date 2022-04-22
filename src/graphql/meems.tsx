import { gql } from '@apollo/client'

export const GET_LAST_MEEM = gql`
	query GetLastMeem {
		Meems(limit: 1, order_by: { createdAt: desc }) {
			tokenId
			metadata
		}
	}
`
