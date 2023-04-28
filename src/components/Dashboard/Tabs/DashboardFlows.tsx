/* eslint-disable @typescript-eslint/no-unused-vars */
import log from '@kengoldfarb/log'
import { Text, Space, Image, Button, Accordion } from '@mantine/core'
import { useAuth, useSDK } from '@meemproject/react'
import { MeemAPI } from '@meemproject/sdk'
import React, { useState } from 'react'
import { toTitleCase } from '../../../utils/strings'
import { useAgreement } from '../../Providers/AgreementProvider'
import { useAnalytics } from '../../Providers/AnalyticsProvider'
import { useMeemTheme } from '../../Styles/MeemTheme'
import { CTInputOutputModal } from '../Flows/Modals/CTInputOutputModal'
import { CTConnection, CTRule } from '../Flows/Model/communityTweets'

interface IProps {
	rules: CTRule[]
	communityTweetsConnections: CTConnection[]
}

export const DashboardFlows: React.FC<IProps> = ({
	rules,
	communityTweetsConnections
}) => {
	const { classes: meemTheme } = useMeemTheme()

	const [selectedRule, setSelectedRule] = useState<CTRule>()

	const [isNewRuleModalOpen, setIsNewRuleModalOpen] = useState(false)

	const analytics = useAnalytics()

	const { jwt } = useAuth()

	const { sdk } = useSDK()

	const { agreement } = useAgreement()

	const removeRule = async (ruleId: string) => {
		if (!agreement?.id || !jwt) {
			log.warn('Invalid agreement or jwt')
			return
		}

		const rule = rules?.find(r => r.id === ruleId)

		await sdk.symphony.removeRules({
			agreementId: agreement.id,
			ruleIds: [ruleId]
		})

		analytics.track('Community Tweets Flow Deleted', {
			communityId: agreement.id,
			communityName: agreement?.name,
			inputType: rule?.input?.platform,
			outputType: rule?.output?.platform
		})

		setSelectedRule(undefined)
	}

	return (
		<div className={meemTheme.fullWidth}>
			{' '}
			<>
				<div>
					<Space h={24} />

					<Text className={meemTheme.tLargeBold}>Flows</Text>

					<Space h={32} />
				</div>

				<Text className={meemTheme.tExtraSmallLabel}>GET STARTED</Text>
				<Space h={12} />
				<Text className={meemTheme.tSmallBold}>
					{`Create a new flow to connect your community’s tools and streamline your processes around News, Libraries and Markets.`}
				</Text>
				<Space h={16} />

				{rules &&
					rules.map(rule => {
						const matchingInput = communityTweetsConnections.filter(
							c => c.id === rule.inputId
						)

						const matchingOutput =
							communityTweetsConnections.filter(
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
							: matchingOutput[0].platform ===
							  MeemAPI.RuleIo.Twitter
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
											<Text
												className={
													meemTheme.tExtraSmall
												}
											>
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
											<Text
												className={
													meemTheme.tExtraSmall
												}
											>
												Publishing to{' '}
												<span
													className={
														meemTheme.tExtraSmallBold
													}
												>
													{matchingOutput[0]
														? matchingOutput[0]
																?.name
														: `Custom Webhook: ${rule.webhookUrl}`}
												</span>
											</Text>
										</div>
									</div>
									<Space w={24} />
									{agreement?.isCurrentUserAgreementAdmin && (
										<div className={meemTheme.row}>
											<Button
												className={
													meemTheme.buttonBlack
												}
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

				<Space h={40} />
				<Text className={meemTheme.tExtraSmallLabel}>FAQ</Text>
				<Space h={12} />
				<Accordion variant="separated" defaultValue="customization">
					<Accordion.Item value="what">
						<Accordion.Control>
							<Text className={meemTheme.tSmallBold}>
								What’s a flow?
							</Text>
						</Accordion.Control>
						<Accordion.Panel>
							<Text>Info goes here</Text>
						</Accordion.Panel>
					</Accordion.Item>

					<Accordion.Item value="usage">
						<Accordion.Control>
							<Text className={meemTheme.tSmallBold}>
								What can I do with flows?
							</Text>
						</Accordion.Control>

						<Accordion.Panel>
							<Text>Info goes here</Text>
						</Accordion.Panel>
					</Accordion.Item>

					<Accordion.Item value="tools">
						<Accordion.Control>
							<Text className={meemTheme.tSmallBold}>
								What tools can I connect?
							</Text>
						</Accordion.Control>
						<Accordion.Panel>
							<Text>Info goes here</Text>
						</Accordion.Panel>
					</Accordion.Item>
				</Accordion>

				<CTInputOutputModal
					isOpened={isNewRuleModalOpen}
					connections={communityTweetsConnections}
					existingRule={selectedRule}
					onModalClosed={function (): void {
						setIsNewRuleModalOpen(false)
						setSelectedRule(undefined)
					}}
				/>
			</>
		</div>
	)
}
