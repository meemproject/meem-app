import { MeemAPI } from '@meemproject/sdk'

export enum SymphonyConnectionType {
	InputOnly,
	InputAndOutput,
	OutputOnly
}

export interface SymphonyConnection {
	id: string
	name: string
	type: SymphonyConnectionType
	platform: MeemAPI.RuleIo
	icon?: string

	// Twitter
	twitterUsername?: string

	// Discord
	discordServerId?: string

	// Slack
	slackWorkspaceId?: string
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
	definition: MeemAPI.IRule
	description?: string | null
	abridgedDescription?: string | null
	webhookUrl?: string
	webhookPrivateKey?: string
}
