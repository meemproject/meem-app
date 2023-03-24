import { gql } from '@apollo/client'

export const SUB_TWITTERS = gql`
	subscription SubTwitters($agreementId: uuid) {
		AgreementTwitters(where: { AgreementId: { _eq: $agreementId } }) {
			id
			AgreementId
			Twitter {
				username
			}
		}
	}
`

export const SUB_TWITTER = gql`
	subscription SubTwitter($agreementId: uuid, $twitterId: uuid) {
		AgreementTwitters(
			where: {
				AgreementId: { _eq: $agreementId }
				id: { _eq: $twitterId }
			}
		) {
			id
			AgreementId
			Twitter {
				username
			}
		}
	}
`

export const SUB_DISCORDS = gql`
	subscription SubDiscords($agreementId: uuid) {
		AgreementDiscords(where: { AgreementId: { _eq: $agreementId } }) {
			id
			AgreementId
			Discord {
				guildId
				name
				icon
			}
		}
	}
`

export const SUB_DISCORD = gql`
	subscription SubDiscord($agreementId: uuid, $discordId: uuid) {
		AgreementDiscords(
			where: {
				AgreementId: { _eq: $agreementId }
				id: { _eq: $discordId }
			}
		) {
			id
			AgreementId
			Discord {
				guildId
				name
				icon
			}
		}
	}
`

export const SUB_SLACKS = gql`
	subscription SubSlacks($agreementId: uuid) {
		AgreementSlacks(where: { AgreementId: { _eq: $agreementId } }) {
			id
			AgreementId
			Slack {
				name
				teamId
				icon
			}
		}
	}
`

export const SUB_SLACK = gql`
	subscription SubSlack($agreementId: uuid, $slackId: uuid) {
		AgreementSlacks(
			where: { AgreementId: { _eq: $agreementId }, id: { _eq: $slackId } }
		) {
			id
			AgreementId
			Slack {
				name
				teamId
				icon
			}
		}
	}
`

export const SUB_RULES = gql`
	subscription SubRules($agreementId: uuid) {
		Rules(where: { AgreementId: { _eq: $agreementId } }) {
			id
			AgreementId
			definition
			description
			abridgedDescription
			input
			inputRef
			output
			outputRef
			# webhookUrl
			# webhookSecret
		}
	}
`
