import { gql } from '@apollo/client'

export const SUB_TWITTER = gql`
	subscription SubTwitter($agreementId: uuid!) {
		AgreementTwitters(where: { agreementId: { _eq: $agreementId } }) {
			id
			agreementId
			Twitter {
				username
			}
		}
	}
`

export const SUB_DISCORD = gql`
	subscription SubDiscord($agreementId: uuid!) {
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

export const SUB_SLACK = gql`
	subscription SubSlack($agreementId: uuid!) {
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

export const SUB_RULES = gql`
	subscription SubRules($agreementId: uuid!) {
		Rules(where: { agreementId: { _eq: $agreementId } }) {
			id
			agreementId
			definition
		}
	}
`
