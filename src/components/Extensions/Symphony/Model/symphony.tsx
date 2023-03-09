import { API } from '../symphonyTypes.generated'

export enum SymphonyConnectionType {
	InputOnly,
	InputAndOutput,
	OutputOnly
}

export enum SymphonyConnectionPlatform {
	Twitter,
	Discord,
	Slack,
	WebHook
}

export interface SymphonyConnection {
	id: string
	name: string
	type: SymphonyConnectionType
	platform: SymphonyConnectionPlatform

	// Twitter
	twitterUserId?: string
	twitterUsername?: string

	// Discord
	discordServerId?: string
	discordServerName?: string
	discordChannels?: API.IDiscordChannel[]
	discordRoles?: API.IDiscordRole[]

	// Slack
	slackWorkspaceId?: string
	slackWorkspaceName?: string
	// TODO: add slack channels / roles here

	// WebHook
	webHookUrl?: string
}

export interface SymphonyRule {
	id: string
	input: SymphonyConnection
	output: SymphonyConnection
	agreementId: string
	definition: API.IRule
}
