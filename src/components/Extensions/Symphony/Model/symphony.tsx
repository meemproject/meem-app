import { API } from '../symphonyTypes.generated'

export enum SymphonyConnectionType {
	InputOnly,
	InputAndOutput,
	OutputOnly
}

export interface SymphonyConnection {
	id: string
	name: string
	type: SymphonyConnectionType
	platform: API.RuleIo
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
	input?: SymphonyConnection
	inputId?: string
	inputPlatformString?: string
	output?: SymphonyConnection
	outputId?: string
	outputPlatformString?: string
	agreementId: string
	definition: API.IRule
	description?: string | null
	abridgedDescription?: string | null
}
