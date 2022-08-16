export interface AvailableIdentityIntegration {
	id?: string
	name?: string
	icon?: string
}

export interface IdentityIntegration {
	id?: string
	name?: string
	icon?: string
}

export interface Identity {
	id?: string
	walletAddress?: string
	ensAddress?: string
	displayName?: string
	profilePic?: string
	integrations?: IdentityIntegration[]
}

export async function identityFromApi(address: string): Promise<Identity> {
	// TODO: return default identity if the wallet doesn't have an identity yet
	return {
		id: 'id',
		walletAddress: address,
		ensAddress: 'gadsby.eth',
		displayName: 'James',
		profilePic: '/exampleclub.png',
		integrations: []
	}
}
