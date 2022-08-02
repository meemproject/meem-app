import { gql } from '@apollo/client'

export const GET_MEEM_ID = gql`
	query GetMeemId($walletAddress: String!) {
		MeemIdentifications(
			where: { Wallets: { address: { _eq: $walletAddress } } }
		) {
			Wallets {
				address
			}
			id
			hasOnboarded
			# Twitters {
			# 	twitterId
			# 	id
			# }
		}
	}
`
