import { ApolloClient, useSubscription } from '@apollo/client'
import type { NormalizedCacheObject } from '@apollo/client'
import log from '@kengoldfarb/log'
import {
	Container,
	Text,
	Space,
	Center,
	Button,
	Loader,
	Divider
} from '@mantine/core'
import { useAuth } from '@meemproject/react'
import { createApolloClient, makeRequest } from '@meemproject/sdk'
import React, { useEffect, useState } from 'react'
import { SubRulesSubscription } from '../../../../generated/graphql'
import { useAnalytics } from '../../../contexts/AnalyticsProvider'
import { extensionFromSlug } from '../../../model/agreement/agreements'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import { useMeemTheme } from '../../Styles/MeemTheme'
import { ExtensionBlankSlate, extensionIsReady } from '../ExtensionBlankSlate'
import { SymphonyConnectionsModal } from './Modals/SymphonyConnectionsModal'
import { SymphonyInputOutputModal } from './Modals/SymphonyInputOutputModal'
import {
	SymphonyConnectionPlatform,
	SymphonyConnectionType,
	SymphonyRule
} from './Model/symphony'
import { SUB_RULES } from './symphony.gql'
import { API } from './symphonyTypes.generated'

export const SymphonyExtension: React.FC = () => {
	// General params
	const { classes: meemTheme } = useMeemTheme()
	const { jwt } = useAuth()
	const { agreement, isLoadingAgreement } = useAgreement()
	const agreementExtension = extensionFromSlug('symphony', agreement)
	const analytics = useAnalytics()

	// Extension data
	const [symphonyClient, setSymphonyClient] =
		useState<ApolloClient<NormalizedCacheObject>>()

	useEffect(() => {
		const c = createApolloClient({
			httpUrl: `https://${process.env.NEXT_PUBLIC_SYMPHONY_GQL_HOST}`,
			wsUri: `wss://${process.env.NEXT_PUBLIC_SYMPHONY_GQL_HOST}`
		})

		setSymphonyClient(c)
	}, [])

	const [previousRulesDataString, setPreviousRulesDataString] = useState('')
	const [rules, setRules] = useState<SymphonyRule[]>()
	const [selectedRule, setSelectedRule] = useState<SymphonyRule>()

	// Page state
	const [isManageConnectionsModalOpen, setIsManageConnectionsModalOpen] =
		useState(false)
	const [isNewRuleModalOpen, setIsNewRuleModalOpen] = useState(false)

	const { data: rulesData } = useSubscription<SubRulesSubscription>(
		SUB_RULES,
		{
			variables: {
				agreementId: agreement?.id
			},
			skip: !symphonyClient || !agreement?.id,
			client: symphonyClient
		}
	)

	// Parse rules from subscription
	useEffect(() => {
		// TODO: Will need to be refactored to support per-rule connections

		const newRules: SymphonyRule[] = []
		if (rulesData) {
			rulesData.Rules.forEach(rule => {
				// Hardcoded as Discord input to Twitter output until APIs are updated
				const newRule: SymphonyRule = {
					id: rule.id,
					agreementId: rule.agreementId,
					definition: rule.definition,
					input: {
						id: 'discord',
						name: `Discord: (serverName)`, // todo
						type: SymphonyConnectionType.InputOnly,
						platform: SymphonyConnectionPlatform.Discord,
						discordServerId: '' // todo
					},
					output: {
						id: 'twitter',
						name: `Twitter: (username)`, // todo
						type: SymphonyConnectionType.OutputOnly,
						platform: SymphonyConnectionPlatform.Twitter,
						twitterUsername: '' // todo
					}
				}

				newRules.push(newRule)
			})
		}

		if (previousRulesDataString) {
			const rulesToJson = JSON.stringify(newRules)
			if (rulesToJson !== previousRulesDataString) {
				setRules(newRules)
				setPreviousRulesDataString(rulesToJson)
			}
		}
	}, [previousRulesDataString, rulesData])

	const removeRule = async (ruleId: string) => {
		if (!agreement?.id || !jwt) {
			log.warn('Invalid agreement or jwt')
			return
		}

		await makeRequest<API.v1.RemoveRules.IDefinition>(
			`${
				process.env.NEXT_PUBLIC_SYMPHONY_API_URL
			}${API.v1.RemoveRules.path()}`,
			{
				method: API.v1.RemoveRules.method,
				body: {
					jwt,
					agreementId: agreement.id,
					ruleIds: [ruleId]
				}
			}
		)

		setSelectedRule(undefined)
	}

	// Integration data states
	const hasFetchedData = !!rulesData

	const rulesSection = () => (
		<>
			{rules &&
				rules.map(rule => {
					return (
						<div
							key={`rule-${rule.definition.ruleId}`}
							className={meemTheme.gridItem}
							style={{ marginBottom: 16 }}
						>
							<div className={meemTheme.row}>
								<div>
									<Text
										className={meemTheme.tSmallBold}
									>{`Discord to Twitter flow`}</Text>
								</div>
								<Space w={24} />
								{agreement?.isCurrentUserAgreementAdmin && (
									<div>
										<Button
											className={meemTheme.buttonWhite}
											onClick={() => {
												setSelectedRule(rule)
												setIsNewRuleModalOpen(true)
											}}
										>
											Edit
										</Button>
										<Space h={8} />
										<Button
											className={
												meemTheme.buttonOrangeRedBordered
											}
											onClick={() => {
												removeRule(rule.id)
											}}
										>
											Remove
										</Button>
									</div>
								)}
							</div>
						</div>
					)
				})}
			{rulesData && <Space h={16} />}

			{!agreement?.isCurrentUserAgreementAdmin &&
				agreement?.isCurrentUserAgreementMember &&
				(!rules || (rules && rules.length === 0)) && (
					<Center>
						<Text className={meemTheme.tSmallBold}>
							This community has no Symphony rules set up yet.
						</Text>
					</Center>
				)}

			{agreement?.isCurrentUserAgreementAdmin && (
				<Button
					className={meemTheme.buttonDarkGrey}
					onClick={() => {
						setIsNewRuleModalOpen(true)
					}}
				>
					+ Add New Flow
				</Button>
			)}
		</>
	)

	const mainState = (
		<>
			{agreement?.isCurrentUserAgreementMember && (
				<>
					<Text className={meemTheme.tMediumBold}>Connections</Text>
					<Space h={24} />
					<Text className={meemTheme.tExtraSmallLabel}>
						CONNECTED ACCOUNTS
					</Text>
					<Space h={24} />
					<Button
						className={meemTheme.buttonWhite}
						onClick={() => {
							setIsManageConnectionsModalOpen(true)
						}}
					>
						Manage Connections
					</Button>
					<Space h={32} />

					<Divider />
					<Space h={32} />
					<Text className={meemTheme.tMediumBold}>
						Publishing Flows
					</Text>
					<Space h={24} />
					<Text className={meemTheme.tExtraSmallLabel}>RULES</Text>
					<Space h={4} />
					<Text className={meemTheme.tExtraSmall}>
						{`Add logic to dictate how new posts will be proposed and published, as well as which community members will manage each part of the process.`}
					</Text>

					<Space h={16} />
					{rulesSection()}
				</>
			)}
			{!agreement?.isCurrentUserAgreementMember && (
				<>
					<Center>
						<Text className={meemTheme.tSmallBold}>
							Symphony rules are only available to community
							members.
						</Text>
					</Center>
				</>
			)}
		</>
	)

	return (
		<div>
			<ExtensionBlankSlate />
			{extensionIsReady(
				isLoadingAgreement,
				agreement,
				agreementExtension
			) && (
				<>
					<div>
						{!hasFetchedData && (
							<Container>
								<Space h={16} />
								<Center>
									<Loader color="cyan" variant="oval" />
								</Center>
							</Container>
						)}
						{hasFetchedData && (
							<>
								<>{mainState}</>
							</>
						)}
					</div>
					<SymphonyConnectionsModal
						isOpened={isManageConnectionsModalOpen}
						onModalClosed={function (): void {
							setIsManageConnectionsModalOpen(false)
						}}
					/>

					<SymphonyInputOutputModal
						isOpened={isNewRuleModalOpen}
						existingRule={selectedRule}
						onModalClosed={function (): void {
							setIsNewRuleModalOpen(false)
						}}
					/>
				</>
			)}
		</div>
	)
}
