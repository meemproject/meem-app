import { MeemAPI } from '@meemproject/sdk'

// eslint-disable-next-line kengoldfarb/prefer-pascal-case-enums
export enum ConnectedAccountType {
	InputOnly,
	InputAndOutput,
	OutputOnly
}

export interface ConnectedAccount {
	id: string
	name: string
	type: ConnectedAccountType
	platform: MeemAPI.RuleIo
	icon?: string

	// Twitter
	twitterUsername?: string

	// Discord
	discordServerId?: string

	// Slack
	slackWorkspaceId?: string
}

export interface Rule {
	id: string
	input?: ConnectedAccount
	inputId?: string
	inputPlatformString?: string
	output?: ConnectedAccount
	outputId?: string
	outputPlatformString?: string
	agreementId: string
	definition: MeemAPI.IRule
	description?: string | null
	abridgedDescription?: string | null
	webhookUrl?: string
	webhookPrivateKey?: string
}
