import { gql } from '@apollo/client'

export const SUB_TRANSACTIONS = gql`
	subscription GetTransactions($transactionIds: [uuid!]) {
		Transactions(where: { id: { _in: $transactionIds } }) {
			id
			hash
			status
			Agreements {
				slug
			}
		}
	}
`
