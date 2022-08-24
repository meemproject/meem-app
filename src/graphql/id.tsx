import { gql } from '@apollo/client'

export const MEEM_ID_SUBSCRIPTION = gql`
	subscription MeemIdSubscription($walletAddress: String) {
		MeemIdentities(
			where: { Wallet: { address: { _ilike: $walletAddress } } }
		) {
			updatedAt
			profilePicUrl
			id
			displayName
			deletedAt
			createdAt
			Wallet {
				address
				ens
			}
			MeemIdentityIntegrations {
				metadata
				visibility
				IdentityIntegrationId
				IdentityIntegration {
					description
					icon
					id
					name
				}
			}
		}
	}
`

export const IDENTITY_INTEGRATIONS_QUERY = gql`
	query GetIdentityIntegrations {
		IdentityIntegrations {
			description
			icon
			id
			name
		}
	}
`
