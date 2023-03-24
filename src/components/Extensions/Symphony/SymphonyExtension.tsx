import { useSubscription } from '@apollo/client'
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
import { useAuth, useMeemApollo, useSDK } from '@meemproject/react'
import { MeemAPI } from '@meemproject/sdk'
import React, { useEffect, useState } from 'react'
import {
	SubDiscordsSubscription,
	SubRulesSubscription,
	SubSlacksSubscription,
	SubTwittersSubscription
} from '../../../../generated/graphql'
import { useAnalytics } from '../../../contexts/AnalyticsProvider'
import { extensionFromSlug } from '../../../model/agreement/agreements'
import { toTitleCase } from '../../../utils/strings'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import { useMeemTheme } from '../../Styles/MeemTheme'
import { ExtensionBlankSlate, extensionIsReady } from '../ExtensionBlankSlate'
import { SymphonyConnectionsModal } from './Modals/SymphonyConnectionsModal'
import { SymphonyInputOutputModal } from './Modals/SymphonyInputOutputModal'
import {
	SymphonyConnection,
	SymphonyConnectionType,
	SymphonyRule
} from './Model/symphony'
import {
	SUB_DISCORDS,
	SUB_RULES,
	SUB_SLACKS,
	SUB_TWITTERS
} from './symphony.gql'

export const SymphonyExtension: React.FC = () => {
	// General params
	const { classes: meemTheme } = useMeemTheme()
	const { jwt } = useAuth()
	const { agreement, isLoadingAgreement } = useAgreement()
	const agreementExtension = extensionFromSlug('symphony', agreement)
	const analytics = useAnalytics()

	// Extension data
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

	const { sdk } = useSDK()

	// Page state
	const [isManageConnectionsModalOpen, setIsManageConnectionsModalOpen] =
		useState(false)
	const [isNewRuleModalOpen, setIsNewRuleModalOpen] = useState(false)

	const { mutualMembersClient } = useMeemApollo()

	const { data: rulesData } = useSubscription<SubRulesSubscription>(
		SUB_RULES,
		{
			variables: {
				agreementId: agreement?.id
			},
			skip: !agreement?.id,
			client: mutualMembersClient
		}
	)

	const {
		data: discordConnectionData,
		loading: isFetchingDiscordConnections
	} = useSubscription<SubDiscordsSubscription>(SUB_DISCORDS, {
		variables: {
			agreementId: agreement?.id
		},
		skip: !mutualMembersClient || !agreement?.id,
		client: mutualMembersClient
	})

	const {
		data: twitterConnectionData,
		loading: isFetchingTwitterConnections
	} = useSubscription<SubTwittersSubscription>(SUB_TWITTERS, {
		variables: {
			agreementId: agreement?.id
		},
		skip: !mutualMembersClient || !agreement?.id,
		client: mutualMembersClient
	})

	const { data: slackConnectionData, loading: isFetchingSlackConnections } =
		useSubscription<SubSlacksSubscription>(SUB_SLACKS, {
			variables: {
				agreementId: agreement?.id
			},
			skip: !mutualMembersClient || !agreement?.id,
			client: mutualMembersClient
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
					platform: MeemAPI.RuleIo.Discord,
					icon: c.Discord?.icon ?? ''
				}
				conns.push(con)
			})

			twitterConnectionData.AgreementTwitters.forEach(c => {
				const con: SymphonyConnection = {
					id: c.id,
					name: `Twitter: ${c.Twitter?.username}`,
					type: SymphonyConnectionType.OutputOnly,
					platform: MeemAPI.RuleIo.Twitter
				}
				conns.push(con)
			})

			slackConnectionData.AgreementSlacks.forEach(c => {
				const con: SymphonyConnection = {
					id: c.id,
					name: `Slack: ${c.Slack?.name}`,
					type: SymphonyConnectionType.InputOnly,
					platform: MeemAPI.RuleIo.Slack
				}
				conns.push(con)
			})

			// Add Webhook connection
			const webhookCon: SymphonyConnection = {
				id: 'webhook',
				name: 'Add a custom Webhook',
				type: SymphonyConnectionType.OutputOnly,
				platform: MeemAPI.RuleIo.Webhook
			}
			conns.push(webhookCon)

			const jsonConns = JSON.stringify(conns)
			if (jsonConns !== previousConnectionsDataString) {
				setPreviousConnectionsDataString(jsonConns)
				setSymphonyConnections(conns)
				setHasFetchedConnections(true)
				setIsFetchingConnections(false)
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
		const newRules: SymphonyRule[] = []
		if (rulesData) {
			rulesData.Rules.forEach(rule => {
				const newRule: SymphonyRule = {
					id: rule.id,
					agreementId: rule.AgreementId,
					inputPlatformString: rule.input ?? '',
					inputId: rule.inputRef,
					definition: rule.definition,
					outputPlatformString: rule.output ?? '',
					outputId: rule.outputRef,
					description: rule.description,
					abridgedDescription: rule.abridgedDescription,
					// webhookUrl: rule.webhookUrl,
					// webhookPrivateKey: rule.webhookSecret
					webhookUrl: 'example url',
					webhookPrivateKey: 'example private key'
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

		await sdk.symphony.removeRules({
			agreementId: agreement.id,
			ruleIds: [ruleId]
		})

		setSelectedRule(undefined)
	}

	// Integration data states
	const hasFetchedData = !!rulesData

	const rulesSection = () => (
		<>
			<Text className={meemTheme.tExtraSmallLabel}>RULES</Text>
			{agreement?.isCurrentUserAgreementAdmin && (
				<>
					<Space h={8} />
					<Text className={meemTheme.tExtraSmall}>
						{`Add logic to dictate how new posts will be proposed and published, as well as which community members will manage each part of the process.`}
					</Text>
				</>
			)}
			<Space h={16} />

			{rules &&
				rules.map(rule => {
					const matchingInput = symphonyConnections.filter(
						c => c.id === rule.inputId
					)

					const matchingOutput = symphonyConnections.filter(
						c => c.id === rule.outputId
					)

					if (!matchingInput || matchingInput.length === 0) {
						return <div key={`rule-${rule.id}`} />
					}

					const inputIcon =
						matchingInput[0].platform === MeemAPI.RuleIo.Discord
							? '/connect-discord.png'
							: '/connect-slack.png'

					const outputIcon = !matchingOutput[0]
						? '/connect-webhook.png'
						: matchingOutput[0].platform === MeemAPI.RuleIo.Twitter
						? '/connect-twitter.png'
						: '/connect-webhook.png'

					return (
						<div
							key={`rule-${rule.id}`}
							className={meemTheme.gridItemFlat}
							style={{ marginBottom: 16, cursor: 'auto' }}
						>
							<div className={meemTheme.spacedRow}>
								<div>
									<Text
										className={meemTheme.tSmallBold}
									>{`${toTitleCase(
										rule.inputPlatformString ?? ''
									)} to ${toTitleCase(
										rule.outputPlatformString ?? ''
									)} flow`}</Text>
									<Space h={8} />
									<Text className={meemTheme.tExtraSmall}>
										{rule.abridgedDescription}
									</Text>

									<Space h={16} />
									<div className={meemTheme.centeredRow}>
										<Image
											width={18}
											height={18}
											src={inputIcon}
										/>
										<Space w={8} />
										<Text className={meemTheme.tExtraSmall}>
											Proposals in{' '}
											<span
												className={
													meemTheme.tExtraSmallBold
												}
											>
												{matchingInput[0].name}
											</span>
										</Text>
									</div>
									<Space h={8} />
									<div className={meemTheme.centeredRow}>
										<Image
											width={18}
											height={18}
											src={outputIcon}
										/>
										<Space w={8} />
										<Text className={meemTheme.tExtraSmall}>
											Publishing to{' '}
											<span
												className={
													meemTheme.tExtraSmallBold
												}
											>
												{matchingOutput[0]
													? matchingOutput[0]?.name
													: `Custom Webhook: ${rule.webhookUrl}`}
											</span>
										</Text>
									</div>
								</div>
								<Space w={24} />
								{agreement?.isCurrentUserAgreementAdmin && (
									<div className={meemTheme.row}>
										<Button
											className={meemTheme.buttonBlack}
											onClick={() => {
												setSelectedRule(rule)
												setIsNewRuleModalOpen(true)
											}}
										>
											Edit
										</Button>
										<Space w={8} />
										<Button
											className={meemTheme.buttonRed}
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

			{agreement?.isCurrentUserAgreementMember &&
				(!rules || (rules && rules.length === 0)) && (
					<Text className={meemTheme.tSmallBold}>
						This community has no Symphony rules set up yet.
					</Text>
				)}

			{agreement?.isCurrentUserAgreementAdmin && (
				<>
					<Space h={16} />
					<Button
						className={meemTheme.buttonDarkGrey}
						onClick={() => {
							setSelectedRule(undefined)
							setIsNewRuleModalOpen(true)
						}}
					>
						+ Add New Flow
					</Button>
				</>
			)}
		</>
	)

	const connectionSummaryGridItem = (
		connectionPlatform: MeemAPI.RuleIo,
		connectionCount: number
	) => (
		<>
			<div className={meemTheme.gridItemFlat} style={{ cursor: 'auto' }}>
				<div className={meemTheme.centeredRow}>
					<Image
						src={
							connectionPlatform === MeemAPI.RuleIo.Discord
								? '/connect-discord.png'
								: connectionPlatform === MeemAPI.RuleIo.Slack
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
						{connectionPlatform === MeemAPI.RuleIo.Discord
							? 'Discord'
							: connectionPlatform === MeemAPI.RuleIo.Slack
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
		? symphonyConnections.filter(c => c.platform === MeemAPI.RuleIo.Discord)
				.length
		: 0

	const connectedTwitterAccounts = symphonyConnections
		? symphonyConnections.filter(c => c.platform === MeemAPI.RuleIo.Twitter)
				.length
		: 0

	const connectedSlackAccounts = symphonyConnections
		? symphonyConnections.filter(c => c.platform === MeemAPI.RuleIo.Slack)
				.length
		: 0

	const mainState = (
		<>
			{agreement?.isCurrentUserAgreementMember && (
				<>
					{agreement?.isCurrentUserAgreementAdmin && (
						<>
							<Text className={meemTheme.tMediumBold}>
								Connections
							</Text>
							<Space h={40} />
							<Text className={meemTheme.tExtraSmallLabel}>
								CONNECTED ACCOUNTS
							</Text>

							{(isFetchingDiscordConnections ||
								isFetchingSlackConnections ||
								isFetchingTwitterConnections ||
								isFetchingConnections) && (
								<>
									<Space h={24} />
									<Loader variant="oval" color="cyan" />
								</>
							)}

							{symphonyConnections &&
								!isFetchingConnections &&
								!isFetchingDiscordConnections &&
								!isFetchingSlackConnections &&
								!isFetchingTwitterConnections && (
									<>
										<Space h={24} />
										<Grid>
											{connectedDiscordAccounts > 0 && (
												<Grid.Col
													xs={12}
													md={6}
													key={MeemAPI.RuleIo.Discord.toString()}
												>
													{connectionSummaryGridItem(
														MeemAPI.RuleIo.Discord,
														connectedDiscordAccounts
													)}
												</Grid.Col>
											)}
											{connectedTwitterAccounts > 0 && (
												<Grid.Col
													xs={12}
													md={6}
													key={MeemAPI.RuleIo.Twitter.toString()}
												>
													{connectionSummaryGridItem(
														MeemAPI.RuleIo.Twitter,
														connectedTwitterAccounts
													)}
												</Grid.Col>
											)}
											{connectedSlackAccounts > 0 && (
												<Grid.Col
													xs={12}
													md={6}
													key={MeemAPI.RuleIo.Slack.toString()}
												>
													{connectionSummaryGridItem(
														MeemAPI.RuleIo.Slack,
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
									analytics.track(
										'Symphony Manage Connections',
										{
											communityId: agreement.id,
											communityName: agreement?.name
										}
									)
								}}
							>
								Manage Connections
							</Button>
							<Space h={32} />

							<Divider />
							<Space h={32} />
						</>
					)}
					{agreement.isCurrentUserAgreementAdmin && (
						<>
							<Text className={meemTheme.tMediumBold}>
								Publishing Flows
							</Text>
							<Space h={40} />
						</>
					)}

					{rulesSection()}
				</>
			)}
			{!agreement?.isCurrentUserAgreementMember && (
				<>
					<Center>
						<Text className={meemTheme.tSmallBold}>
							Symphony rules are only visible to community
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
							setSelectedRule(undefined)
						}}
					/>
				</>
			)}
		</div>
	)
}
