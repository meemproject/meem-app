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
	icon?: string

	// Twitter
	twitterUsername?: string

	// Discord
	discordServerId?: string

	// Slack
	slackWorkspaceId?: string

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
