import { normalizeImageUrl } from '@meemproject/api'
import {
	GetIdentityIntegrationsQuery,
	MeemIdSubscriptionSubscription
} from '../../../generated/graphql'

export interface AvailableIdentityIntegration {
	id?: string
	name?: string
	icon?: string
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
	if (inteData && inteData.IdentityIntegrations.length > 0) {
		const integrations: AvailableIdentityIntegration[] = []
		inteData.IdentityIntegrations.forEach(inte => {
			const integration: AvailableIdentityIntegration = {
				id: inte.id,
				name: inte.name,
				icon: inte.icon
			}
			integrations.push(integration)
		})
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
	const id = identityData?.MeemIdentities[0]
	if (id) {
		// Integrations
		const integrations: IdentityIntegration[] = []
		if (id.MeemIdentityIntegrations.length > 0) {
			id.MeemIdentityIntegrations.forEach(inte => {
				const integration: IdentityIntegration = {
					id: inte.IdentityIntegrationId,
					name: inte.IdentityIntegration?.name,
					icon: inte.IdentityIntegration?.icon,
					visibility: inte.visibility,
					metadata: inte.metadata
				}
				integrations.push(integration)
			})
		}
		return {
			id: id?.id,
			walletAddress: address,
			ensAddress: id?.Wallet?.ens ?? undefined,
			displayName: id?.displayName ?? undefined,
			profilePic: normalizeImageUrl(id?.profilePicUrl ?? ''),
			integrations
		}
	} else {
		return getDefaultIdentity(address)
	}
}
