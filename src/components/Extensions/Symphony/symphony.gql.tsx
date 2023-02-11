import { gql } from '@apollo/client'

export const SUB_TWITTER = gql`
	subscription SubTwitter($agreementId: uuid!) {
		Twitters(where: { agreementId: { _eq: $agreementId } }) {
			id
			agreementId
			username
		}
	}
`

export const SUB_DISCORD = gql`
	subscription SubDiscord($agreementId: uuid!) {
		Discords(where: { agreementId: { _eq: $agreementId } }) {
			id
			agreementId
			name
			icon
		}
	}
`

export const SUB_SLACK = gql`
	subscription SubSlack($agreementId: uuid!) {
		Slacks(where: { agreementId: { _eq: $agreementId } }) {
			id
			agreementId
			name
			teamId
			icon
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
