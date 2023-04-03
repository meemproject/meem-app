import { MeemAPI } from '@meemproject/sdk'

export enum ComTweetsConnectionType {
	InputOnly,
	InputAndOutput,
	OutputOnly
}

export interface ComTweetsConnection {
	id: string
	name: string
	type: ComTweetsConnectionType
	platform: MeemAPI.RuleIo
	icon?: string

	// Twitter
	twitterUsername?: string

	// Discord
	discordServerId?: string

	// Slack
	slackWorkspaceId?: string
}

export interface ComTweetsRule {
	id: string
	input?: ComTweetsConnection
	inputId?: string
	inputPlatformString?: string
	output?: ComTweetsConnection
	outputId?: string
	outputPlatformString?: string
	agreementId: string
	definition: MeemAPI.IRule
	description?: string | null
	abridgedDescription?: string | null
	webhookUrl?: string
	webhookPrivateKey?: string
}
