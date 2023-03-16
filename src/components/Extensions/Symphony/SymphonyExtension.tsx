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
	Divider,
	Grid,
	Image
} from '@mantine/core'
import { useAuth } from '@meemproject/react'
import { createApolloClient, makeRequest } from '@meemproject/sdk'
import React, { useEffect, useState } from 'react'
import {
	SubDiscordsSubscription,
	SubRulesSubscription,
	SubSlacksSubscription,
	SubTwittersSubscription
} from '../../../../generated/graphql'
import { useAnalytics } from '../../../contexts/AnalyticsProvider'
import { extensionFromSlug } from '../../../model/agreement/agreements'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import { useMeemTheme } from '../../Styles/MeemTheme'
import { ExtensionBlankSlate, extensionIsReady } from '../ExtensionBlankSlate'
import { SymphonyConnectionsModal } from './Modals/SymphonyConnectionsModal'
import { SymphonyInputOutputModal } from './Modals/SymphonyInputOutputModal'
import {
	SymphonyConnection,
	SymphonyConnectionPlatform,
	SymphonyConnectionType,
	SymphonyRule
} from './Model/symphony'
import {
	SUB_DISCORDS,
	SUB_RULES,
	SUB_SLACKS,
	SUB_TWITTERS
} from './symphony.gql'
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

	const [previousConnectionsDataString, setPreviousConnectionsDataString] =
		useState('')
	const [isFetchingConnections, setIsFetchingConnections] = useState(false)
	const [hasFetchedConnections, setHasFetchedConnections] = useState(false)
	const [symphonyConnections, setSymphonyConnections] = useState<
		SymphonyConnection[]
	>([])

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

	const { data: discordConnectionData } =
		useSubscription<SubDiscordsSubscription>(SUB_DISCORDS, {
			variables: {
				agreementId: agreement?.id
			},
			skip: !symphonyClient || !agreement?.id,
			client: symphonyClient
		})

	const { data: twitterConnectionData } =
		useSubscription<SubTwittersSubscription>(SUB_TWITTERS, {
			variables: {
				agreementId: agreement?.id
			},
			skip: !symphonyClient || !agreement?.id,
			client: symphonyClient
		})

	const { data: slackConnectionData } =
		useSubscription<SubSlacksSubscription>(SUB_SLACKS, {
			variables: {
				agreementId: agreement?.id
			},
			skip: !symphonyClient || !agreement?.id,
			client: symphonyClient
		})

	// Parse connections from subscription
	useEffect(() => {
		if (
			discordConnectionData &&
			twitterConnectionData &&
			slackConnectionData
		) {
			const conns: SymphonyConnection[] = []
			discordConnectionData.AgreementDiscords.forEach(c => {
				const con: SymphonyConnection = {
					id: c.id,
					name: `Discord: ${c.Discord?.name}`,
					type: SymphonyConnectionType.InputOnly,
					platform: SymphonyConnectionPlatform.Discord,
					icon: c.Discord?.icon ?? ''
				}
				conns.push(con)
			})

			twitterConnectionData.AgreementTwitters.forEach(c => {
				const con: SymphonyConnection = {
					id: c.id,
					name: `Twitter: ${c.Twitter?.username}`,
					type: SymphonyConnectionType.OutputOnly,
					platform: SymphonyConnectionPlatform.Twitter
				}
				conns.push(con)
			})

			slackConnectionData.AgreementSlacks.forEach(c => {
				const con: SymphonyConnection = {
					id: c.id,
					name: `Slack: ${c.Slack?.name}`,
					type: SymphonyConnectionType.OutputOnly,
					platform: SymphonyConnectionPlatform.Twitter
				}
				conns.push(con)
			})

			const jsonConns = JSON.stringify(conns)
			if (jsonConns !== previousConnectionsDataString) {
				setPreviousConnectionsDataString(jsonConns)
				setSymphonyConnections(conns)
				setHasFetchedConnections(true)
				setIsFetchingConnections(true)
			}
		}
	}, [
		discordConnectionData,
		hasFetchedConnections,
		isFetchingConnections,
		previousConnectionsDataString,
		slackConnectionData,
		twitterConnectionData
	])

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

		const rulesToJson = JSON.stringify(newRules)
		if (rulesToJson !== previousRulesDataString) {
			setRules(newRules)
			setPreviousRulesDataString(rulesToJson)
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
							key={`rule-${rule.id}`}
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

	const connectionSummaryGridItem = (
		connectionPlatform: SymphonyConnectionPlatform,
		connectionCount: number
	) => (
		<>
			<div className={meemTheme.gridItemFlat} style={{ cursor: 'auto' }}>
				<div className={meemTheme.centeredRow}>
					<Image
						src={
							connectionPlatform ===
							SymphonyConnectionPlatform.Discord
								? '/connect-discord.png'
								: connectionPlatform ===
								  SymphonyConnectionPlatform.Slack
								? '/connect-slack.png'
								: '/connect-twitter.png'
						}
						width={24}
						height={24}
						style={{
							marginRight: 8
						}}
					/>
					<Text className={meemTheme.tSmallBold}>
						{connectionPlatform ===
						SymphonyConnectionPlatform.Discord
							? 'Discord'
							: connectionPlatform ===
							  SymphonyConnectionPlatform.Slack
							? 'Slack'
							: 'Twitter'}
					</Text>
				</div>
				<Space h={16} />
				<Text
					className={meemTheme.tExtraSmallFaded}
				>{`${connectionCount} ${
					connectionCount === 1 ? `account` : 'accounts'
				} connected`}</Text>
			</div>
		</>
	)

	const connectedDiscordAccounts = symphonyConnections
		? symphonyConnections.filter(
				c => c.platform === SymphonyConnectionPlatform.Discord
		  ).length
		: 0

	const connectedTwitterAccounts = symphonyConnections
		? symphonyConnections.filter(
				c => c.platform === SymphonyConnectionPlatform.Twitter
		  ).length
		: 0

	const connectedSlackAccounts = symphonyConnections
		? symphonyConnections.filter(
				c => c.platform === SymphonyConnectionPlatform.Slack
		  ).length
		: 0

	const mainState = (
		<>
			{agreement?.isCurrentUserAgreementMember && (
				<>
					<Text className={meemTheme.tMediumBold}>Connections</Text>
					<Space h={24} />
					<Text className={meemTheme.tExtraSmallLabel}>
						CONNECTED ACCOUNTS
					</Text>

					{symphonyConnections && (
						<>
							<Space h={24} />
							<Grid>
								{connectedDiscordAccounts > 0 && (
									<Grid.Col
										xs={12}
										md={6}
										key={SymphonyConnectionPlatform.Discord.toString()}
									>
										{connectionSummaryGridItem(
											SymphonyConnectionPlatform.Discord,
											connectedDiscordAccounts
										)}
									</Grid.Col>
								)}
								{connectedTwitterAccounts > 0 && (
									<Grid.Col
										xs={12}
										md={6}
										key={SymphonyConnectionPlatform.Twitter.toString()}
									>
										{connectionSummaryGridItem(
											SymphonyConnectionPlatform.Twitter,
											connectedTwitterAccounts
										)}
									</Grid.Col>
								)}
								{connectedSlackAccounts > 0 && (
									<Grid.Col
										xs={12}
										md={6}
										key={SymphonyConnectionPlatform.Slack.toString()}
									>
										{connectionSummaryGridItem(
											SymphonyConnectionPlatform.Slack,
											connectedSlackAccounts
										)}
									</Grid.Col>
								)}
							</Grid>
						</>
					)}

					<Space h={24} />
					<Button
						className={meemTheme.buttonWhite}
						onClick={() => {
							setIsManageConnectionsModalOpen(true)
							analytics.track('Symphony Manage Connections', {
								communityId: agreement.id,
								communityName: agreement?.name
							})
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
						connections={symphonyConnections}
						isOpened={isManageConnectionsModalOpen}
						onModalClosed={function (): void {
							setIsManageConnectionsModalOpen(false)
						}}
					/>

					<SymphonyInputOutputModal
						isOpened={isNewRuleModalOpen}
						connections={symphonyConnections}
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
