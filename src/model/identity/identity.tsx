import { normalizeImageUrl } from '@meemproject/api'
import {
	GetIdentityIntegrationsQuery,
	MeemIdSubscriptionSubscription
} from '../../../generated/graphql'

export interface AvailableIdentityIntegration {
	id?: string
	name?: string
	icon?: string
	connectionName?: string
}

export interface IdentityIntegration {
	id?: string
	name?: string
	icon?: string
	metadata?: any
	visibility?: string
}

export interface Identity {
	id?: string
	walletAddress?: string
	ensAddress?: string
	displayName?: string
	profilePic?: string
	integrations?: IdentityIntegration[]
}

export function identityIntegrationFromApi(
	inteData: GetIdentityIntegrationsQuery | undefined
): AvailableIdentityIntegration[] {
	console.log({ inteData })

	if (inteData && inteData.IdentityIntegrations.length > 0) {
		const integrations: AvailableIdentityIntegration[] = []
		inteData.IdentityIntegrations.forEach(inte => {
			const integration: AvailableIdentityIntegration = {
				id: inte.id,
				name: inte.name,
				icon: inte.icon,
				connectionName: inte.connectionName
			}
			integrations.push(integration)
		})
		console.log({ integrations })
		return integrations
	} else {
		return []
	}
}

export function getDefaultIdentity(walletAddress: string): Identity {
	return {
		walletAddress
	}
}
export async function identityFromApi(
	address: string,
	identityData: MeemIdSubscriptionSubscription | undefined
): Promise<Identity> {
	const id = identityData?.Users[0]
	if (id) {
		// Integrations
		const integrations: IdentityIntegration[] = []
		if (id.UserIdentities.length > 0) {
			id.UserIdentities.forEach(inte => {
				const integration: IdentityIntegration = {
					id: inte.IdentityIntegrationId,
					name: inte.IdentityIntegration?.name,
					icon: inte.IdentityIntegration?.icon,
					visibility: inte.visibility,
					metadata: inte.metadata
				}

				if (integration.name !== 'Email') {
					integrations.push(integration)
				} else {
					if (integration.metadata.isVerified) {
						integrations.push(integration)
					}
				}
			})
		}

		return {
			id: id?.id,
			walletAddress: address,
			ensAddress: id?.DefaultWallet?.ens ?? undefined,
			displayName: id?.displayName ?? undefined,
			profilePic:
				id?.profilePicUrl && id?.profilePicUrl.length > 0
					? normalizeImageUrl(id?.profilePicUrl ?? '')
					: undefined,
			integrations
		}
	} else {
		return getDefaultIdentity(address)
	}
}
