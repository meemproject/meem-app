import { gql } from '@apollo/client'

export const MEEM_ID_SUBSCRIPTION = gql`
	subscription MeemIdSubscription($walletAddress: String) {
		Users(where: { Wallets: { address: { _ilike: $walletAddress } } }) {
			updatedAt
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
				IdentityExtensionId
				IdentityExtension {
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

export const IDENTITY_INTEGRATIONS_QUERY = gql`
	query GetIdentityExtensions {
		IdentityExtensions {
			description
			icon
			id
			name
			connectionName
			connectionId
		}
	}
`
