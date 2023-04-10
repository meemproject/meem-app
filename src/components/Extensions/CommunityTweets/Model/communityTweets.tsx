import { MeemAPI } from '@meemproject/sdk'

// eslint-disable-next-line kengoldfarb/prefer-pascal-case-enums
export enum CTConnectionType {
	InputOnly,
	InputAndOutput,
	OutputOnly
}

export interface CTConnection {
	id: string
	name: string
	type: CTConnectionType
	platform: MeemAPI.RuleIo
	icon?: string

	// Twitter
	twitterUsername?: string

	// Discord
	discordServerId?: string

	// Slack
	slackWorkspaceId?: string
}

export interface CTRule {
	id: string
	input?: CTConnection
	inputId?: string
	inputPlatformString?: string
	output?: CTConnection
	outputId?: string
	outputPlatformString?: string
	agreementId: string
	definition: MeemAPI.IRule
	description?: string | null
	abridgedDescription?: string | null
	webhookUrl?: string
	webhookPrivateKey?: string
}
