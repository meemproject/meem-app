import { gql } from '@apollo/client'

export const MEEM_ID_SUBSCRIPTION = gql`
	subscription MeemIdSubscription($walletAddress: String) {
		Users(where: { Wallets: { address: { _ilike: $walletAddress } } }) {
			profilePicUrl
			id
			displayName
			createdAt
			DefaultWallet {
				address
				ens
			}
			UserIdentities {
				metadata
				visibility
				IdentityProviderId
				IdentityProvider {
					description
					icon
					id
					name
					connectionName
					connectionId
				}
			}
		}
	}
`

export const IDENTITY_PROVIDERS_QUERY = gql`
	query GetIdentityProviders {
		IdentityProviders {
			description
			icon
			id
			name
			connectionName
			connectionId
		}
	}
`
