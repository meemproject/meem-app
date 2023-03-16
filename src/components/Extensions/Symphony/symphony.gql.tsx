import { gql } from '@apollo/client'

export const SUB_TWITTERS = gql`
	subscription SubTwitters($agreementId: uuid) {
		AgreementTwitters(where: { agreementId: { _eq: $agreementId } }) {
			id
			agreementId
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
				agreementId: { _eq: $agreementId }
				id: { _eq: $twitterId }
			}
		) {
			id
			agreementId
			Twitter {
				username
			}
		}
	}
`

export const SUB_DISCORDS = gql`
	subscription SubDiscords($agreementId: uuid) {
		AgreementDiscords(where: { agreementId: { _eq: $agreementId } }) {
			id
			agreementId
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
				agreementId: { _eq: $agreementId }
				id: { _eq: $discordId }
			}
		) {
			id
			agreementId
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
		AgreementSlacks(where: { agreementId: { _eq: $agreementId } }) {
			id
			agreementId
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
			where: { agreementId: { _eq: $agreementId }, id: { _eq: $slackId } }
		) {
			id
			agreementId
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
		Rules(where: { agreementId: { _eq: $agreementId } }) {
			id
			agreementId
			definition
		}
	}
`
