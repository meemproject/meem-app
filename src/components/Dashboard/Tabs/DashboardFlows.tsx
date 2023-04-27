/* eslint-disable @typescript-eslint/no-unused-vars */
import log from '@kengoldfarb/log'
import { Text, Space, Image, Button } from '@mantine/core'
import { useAuth, useSDK } from '@meemproject/react'
import { MeemAPI } from '@meemproject/sdk'
import React, { useState } from 'react'
import { useAnalytics } from '../../../contexts/AnalyticsProvider'
import { toTitleCase } from '../../../utils/strings'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import { CTInputOutputModal } from '../../Extensions/CommunityTweets/Modals/CTInputOutputModal'
import {
	CTConnection,
	CTRule
} from '../../Extensions/CommunityTweets/Model/communityTweets'
import { useMeemTheme } from '../../Styles/MeemTheme'

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

				{agreement?.isCurrentUserAgreementMember &&
					(!rules || (rules && rules.length === 0)) && (
						<Text className={meemTheme.tSmallBold}>
							This community has no Community Tweets rules set up
							yet.
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
