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

export function getDefaultIdentity(walletAddress: string): Identity {
	return {
		id: '',
		walletAddress,
		ensAddress: '',
		displayName: '',
		profilePic: '',
		integrations: []
	}
}

export async function identityFromApi(address: string): Promise<Identity> {
	// TODO: return default identity if the wallet doesn't have an identity yet
	return {
		id: 'id',
		walletAddress: address,
		ensAddress: 'gadsby.eth',
		displayName: 'James',
		profilePic: '/exampleclub.png',
		integrations: [
			{
				id: 'twitter',
				name: 'Twitter',
				icon: '/integration-twitter.png',
				metadata: { twitterUsername: 'gadsbee' },
				visibility: 'mutual-club-members'
			},
			{
				id: 'discord',
				name: 'Discord',
				icon: '/integration-discord.png',
				metadata: { discordUsername: 'jgads' },
				visibility: 'mutual-club-members'
			},
			{
				id: 'email',
				name: 'Email',
				icon: '/integration-email.png',
				metadata: { emailAddress: 'james.gadsby@gmail.com' },
				visibility: 'mutual-club-members'
			}
		]
	}
}
