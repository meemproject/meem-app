import { ApolloClient, useSubscription } from '@apollo/client'
import type { NormalizedCacheObject } from '@apollo/client'
import log from '@kengoldfarb/log'
import {
	Container,
	Text,
	Space,
	Center,
	Button,
	Modal,
	Loader
} from '@mantine/core'
import { useAuth, useSDK } from '@meemproject/react'
import { createApolloClient, makeRequest, MeemAPI } from '@meemproject/sdk'
import React, { useEffect, useState } from 'react'
import { SubRulesSubscription } from '../../../../generated/graphql'
import { extensionFromSlug } from '../../../model/agreement/agreements'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import { useMeemTheme } from '../../Styles/MeemTheme'
import { ExtensionBlankSlate, extensionIsReady } from '../ExtensionBlankSlate'
import {
	SymphonyConnectionPlatform,
	SymphonyConnectionType,
	SymphonyRule
} from './Model/symphony'
import {
	IOnSave,
	SymphonyDiscordTwitterRulesBuilder
} from './RuleBuilders/SymphonyDiscordTwitterRuleBuilder'
import { SUB_RULES } from './symphony.gql'
import { API } from './symphonyTypes.generated'

export const SymphonyExtension: React.FC = () => {
	// General params
	const { classes: meemTheme } = useMeemTheme()
	const { sdk } = useSDK()
	const { jwt } = useAuth()
	const { agreement, isLoadingAgreement } = useAgreement()
	const agreementExtension = extensionFromSlug('symphony', agreement)

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

	const [isRuleBuilderOpen, setIsRuleBuilderOpen] = useState(false)

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

	const handleRuleSave = async (values: IOnSave) => {
		if (!agreement?.id || !jwt) {
			return
		}

		await makeRequest<API.v1.SaveRules.IDefinition>(
			`${
				process.env.NEXT_PUBLIC_SYMPHONY_API_URL
			}${API.v1.SaveRules.path()}`,
			{
				method: API.v1.SaveRules.method,
				body: {
					jwt,
					agreementId: agreement.id,
					rules: [
						{
							...values,
							action: API.PublishAction.Tweet,
							isEnabled: true,
							ruleId: selectedRule?.id
						}
					]
				}
			}
		)

		// If extension is not yet marked as 'setup complete', set as complete
		if (!agreementExtension?.isSetupComplete) {
			// Note: we don't need to await this request
			sdk.agreementExtension.updateAgreementExtension({
				agreementId: agreement?.id ?? '',
				isSetupComplete: true,
				agreementExtensionId: agreementExtension?.id,
				widget: {
					isEnabled: true,
					visibility:
						MeemAPI.AgreementExtensionVisibility.TokenHolders
				}
			})
		}

		setSelectedRule(undefined)
		setIsRuleBuilderOpen(false)
	}

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
												setIsRuleBuilderOpen(true)
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
						setIsRuleBuilderOpen(true)
						const dataLayer = (window as any).dataLayer ?? null

						dataLayer?.push({
							event: 'event',
							eventProps: {
								category: 'Symphony Extension',
								action: 'Add Rule'
							}
						})
					}}
				>
					+ Add rule
				</Button>
			)}
			<Modal
				title={
					<Text className={meemTheme.tMediumBold}>Add New Rule</Text>
				}
				className={meemTheme.visibleDesktopOnly}
				padding={24}
				overlayBlur={8}
				radius={16}
				size={'lg'}
				opened={isRuleBuilderOpen}
				onClose={() => {
					setSelectedRule(undefined)
					setIsRuleBuilderOpen(false)
				}}
			>
				<SymphonyDiscordTwitterRulesBuilder
					rule={selectedRule}
					onSave={handleRuleSave}
				/>
			</Modal>
			<Modal
				title={
					<Text className={meemTheme.tMediumBold}>Add New Rule</Text>
				}
				className={meemTheme.visibleMobileOnly}
				padding={24}
				fullScreen
				size={'lg'}
				opened={isRuleBuilderOpen}
				onClose={() => {
					setSelectedRule(undefined)
					setIsRuleBuilderOpen(false)
				}}
			>
				<SymphonyDiscordTwitterRulesBuilder
					rule={selectedRule}
					onSave={handleRuleSave}
				/>
			</Modal>
		</>
	)

	const mainState = (
		<>
			{agreement?.isCurrentUserAgreementAdmin && (
				<>
					<Text></Text>
					<Space h={40} />
					<Text className={meemTheme.tExtraSmallLabel}>
						PUBLISHING FLOWS
					</Text>
					<Space h={4} />
					<Text className={meemTheme.tExtraSmall}>
						{`Add logic to dictate how new posts will be proposed and published, as well as which community members will manage each part of the process.`}
					</Text>

					<Space h={16} />
				</>
			)}

			{agreement?.isCurrentUserAgreementMember && <>{rulesSection()}</>}
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
				</>
			)}
		</div>
	)
}
