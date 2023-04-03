import log from '@kengoldfarb/log'
import {
	ActionIcon,
	Button,
	Center,
	Loader,
	Modal,
	Select,
	// eslint-disable-next-line import/named
	SelectItem,
	Space,
	Text,
	TextInput
} from '@mantine/core'
import { useSDK, useAuth } from '@meemproject/react'
import { MeemAPI } from '@meemproject/sdk'
import { IconCopy } from '@tabler/icons'
import React, { useCallback, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useAnalytics } from '../../../../contexts/AnalyticsProvider'
import { extensionFromSlug } from '../../../../model/agreement/agreements'
import {
	showErrorNotification,
	showSuccessNotification
} from '../../../../utils/notifications'
import { useAgreement } from '../../../AgreementHome/AgreementProvider'
import { colorDarkBlue, useMeemTheme } from '../../../Styles/MeemTheme'
import {
	ComTweetsConnection,
	ComTweetsConnectionType,
	ComTweetsRule
} from '../Model/communityTweets'
import {
	IOnSave,
	CTDiscordTwitterRulesBuilder
} from '../RuleBuilders/CTDiscordTwitterRuleBuilder'
import { CTDiscordWebhookRulesBuilder } from '../RuleBuilders/CTDiscordWebhookRuleBuilder'
import { CTSlackTwitterRulesBuilder } from '../RuleBuilders/CTSlackTwitterRuleBuilder'
import { CTSlackWebhookRulesBuilder } from '../RuleBuilders/CTSlackWebhookRuleBuilder'

interface IProps {
	existingRule?: ComTweetsRule
	connections?: ComTweetsConnection[]
	isOpened: boolean
	onModalClosed: () => void
}

export const CTInputOutputModal: React.FC<IProps> = ({
	existingRule,
	connections,
	isOpened,
	onModalClosed
}) => {
	// General params
	const { classes: meemTheme } = useMeemTheme()
	const { sdk } = useSDK()
	const { jwt } = useAuth()
	const { agreement } = useAgreement()
	const agreementExtension = extensionFromSlug('communityTweets', agreement)
	const analytics = useAnalytics()

	// Inputs and outputs for the provisional publishing flow (rule)
	const [inputs, setInputs] = useState<ComTweetsConnection[]>([])
	const [inputValues, setInputValues] = useState<SelectItem[]>([])
	const [selectedInput, setSelectedInput] = useState<ComTweetsConnection>()
	const [selectedInputValue, setSelectedInputValue] = useState<string | null>(
		null
	)
	const [outputs, setOutputs] = useState<ComTweetsConnection[]>([])
	const [outputValues, setOutputValues] = useState<SelectItem[]>([])
	const [selectedOutput, setSelectedOutput] = useState<ComTweetsConnection>()
	const [selectedOutputValue, setSelectedOutputValue] = useState<
		string | null
	>(null)
	const [webhookUrl, setWebhookUrl] = useState('')
	const [webhookPrivateKey, setWebHookPrivateKey] = useState('')
	const [hasFetchedIO, setHasFetchedIO] = useState(false)
	const [isSavingRule, setIsSavingRule] = useState(false)

	// The complete rule to save (returned from the rule builder)
	const [rule, setRule] = useState<ComTweetsRule>()

	// Rule builder modal states
	const [
		isDiscordTwitterRuleBuilderOpened,
		setIsDiscordTwitterRuleBuilderOpened
	] = useState(false)

	const [
		isSlackTwitterRuleBuilderOpened,
		setIsSlackTwitterRuleBuilderOpened
	] = useState(false)

	const [
		isDiscordWebhookRuleBuilderOpened,
		setIsDiscordWebhookRuleBuilderOpened
	] = useState(false)

	const [
		isSlackWebhookRuleBuilderOpened,
		setIsSlackWebhookRuleBuilderOpened
	] = useState(false)

	// Save the rule
	const handleRuleSave = async (values: IOnSave) => {
		if (!agreement?.id || !jwt || !selectedInput || !selectedOutput) {
			return
		}

		setIsSavingRule(true)

		await sdk.symphony.saveRule({
			agreementId: agreement.id,
			rule: {
				...values,
				input: existingRule?.input?.platform ?? selectedInput.platform,
				inputRef: existingRule?.input?.id ?? selectedInput?.id ?? '',
				output:
					existingRule?.output?.platform ?? selectedOutput.platform,
				outputRef: existingRule?.output?.id ?? selectedOutput?.id ?? '',
				isEnabled: true,
				ruleId: existingRule?.id ?? rule?.id,
				webhookUrl,
				webhookSecret: webhookPrivateKey
			}
		})

		const inputPlatform =
			existingRule?.input?.platform ?? selectedInput.platform
		const outputPlatform =
			existingRule?.output?.platform ?? selectedOutput.platform

		if (!existingRule) {
			analytics.track('Community Tweets Flow Created', {
				communityId: agreement?.id,
				communityName: agreement?.name,
				inputType: inputPlatform,
				outputType: outputPlatform
			})
		} else {
			analytics.track('Community Tweets Flow Edited', {
				communityId: agreement?.id,
				communityName: agreement?.name,
				inputType: inputPlatform,
				outputType: outputPlatform,
				ruleId: existingRule.id
			})
		}

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

		setRule(undefined)
		onModalClosed()
		setIsSavingRule(false)
	}

	const openRuleBuilder = useCallback(
		(input: ComTweetsConnection, output?: ComTweetsConnection) => {
			if (
				input.platform === MeemAPI.RuleIo.Discord &&
				output?.platform === MeemAPI.RuleIo.Twitter &&
				!isDiscordTwitterRuleBuilderOpened
			) {
				// Discord to Twitter flow
				setIsDiscordTwitterRuleBuilderOpened(true)
			} else if (
				input.platform === MeemAPI.RuleIo.Slack &&
				output?.platform === MeemAPI.RuleIo.Twitter &&
				!isSlackTwitterRuleBuilderOpened
			) {
				// Discord to Twitter flow
				setIsSlackTwitterRuleBuilderOpened(true)
			} else if (
				input.platform === MeemAPI.RuleIo.Discord &&
				output?.platform === MeemAPI.RuleIo.Webhook &&
				!isDiscordWebhookRuleBuilderOpened
			) {
				// Discord to Webhook flow
				setIsDiscordWebhookRuleBuilderOpened(true)
			} else if (
				input.platform === MeemAPI.RuleIo.Slack &&
				output?.platform === MeemAPI.RuleIo.Webhook &&
				!isSlackWebhookRuleBuilderOpened
			) {
				// Slack to Webhook flow
				setIsSlackWebhookRuleBuilderOpened(true)
			}
		},
		[
			isDiscordTwitterRuleBuilderOpened,
			isDiscordWebhookRuleBuilderOpened,
			isSlackTwitterRuleBuilderOpened,
			isSlackWebhookRuleBuilderOpened
		]
	)

	useEffect(() => {
		function fetchConnectionsForNewRule() {
			if (!connections) {
				log.debug('no connections available')
				return
			}

			setWebHookPrivateKey(uuidv4())

			const filteredInputs = connections.filter(
				c => c.type === ComTweetsConnectionType.InputOnly
			)

			const filteredInputValues: SelectItem[] = []
			filteredInputs.forEach(inp => {
				const inputVal = {
					value: inp.id,
					label: inp.name
				}
				filteredInputValues.push(inputVal)
			})

			setInputs(filteredInputs)
			setInputValues(filteredInputValues)

			const filteredOutputs = connections.filter(
				c => c.type === ComTweetsConnectionType.OutputOnly
			)

			const filteredOutputValues: SelectItem[] = []
			filteredOutputs.forEach(out => {
				const outVal = {
					value: out.id,
					label: out.name
				}
				filteredOutputValues.push(outVal)
			})

			setOutputs(filteredOutputs)
			setOutputValues(filteredOutputValues)
			setHasFetchedIO(true)
		}

		function fetchConnectionsForExistingRule() {
			if (!connections) {
				onModalClosed()
				log.debug('no connections available for this rule')
				return
			}

			// Find input
			const filteredInput = connections.filter(
				c => c.id === existingRule?.inputId
			)
			const filteredOutput = connections.filter(
				c => c.id === existingRule?.outputId
			)
			if (
				filteredInput.length > 0 &&
				(filteredOutput.length > 0 || existingRule?.webhookUrl)
			) {
				log.debug('found inputs and outputs for existing rule')
				setSelectedInput(filteredInput[0])

				// If this is a regular rule, it'll have an output connection
				if (filteredOutput[0]) {
					setSelectedOutput(filteredOutput[0])
					openRuleBuilder(filteredInput[0], filteredOutput[0])
				} else {
					// If it's a webhook rule, it'll not have an output
					// so we'll want to set our webhook props instead
					// and create a synthetic 'selected output'
					const syntheticOutput: ComTweetsConnection = {
						id: 'webhook',
						name: 'Webhook',
						type: ComTweetsConnectionType.OutputOnly,
						platform: MeemAPI.RuleIo.Webhook
					}
					setSelectedOutput(syntheticOutput)
					setWebHookPrivateKey(existingRule?.webhookPrivateKey ?? '')
					setWebhookUrl(existingRule?.webhookUrl ?? '')
					openRuleBuilder(filteredInput[0], syntheticOutput)
				}

				setHasFetchedIO(true)
			} else {
				showErrorNotification(
					'Oops!',
					'This rule is invalid. Please delete it and create a new one.'
				)
				onModalClosed()
			}
		}

		// Handle editing
		if (isOpened && !hasFetchedIO && existingRule && connections) {
			log.debug('fetchConnectionsForExistingRule')
			fetchConnectionsForExistingRule()
		}

		// Reset state so that new data can be fetched upon refresh
		if (!isOpened && hasFetchedIO) {
			log.debug('closed modal, set has fetched io = false')
			setHasFetchedIO(false)
		}

		if (isOpened && !hasFetchedIO && !existingRule && connections) {
			log.debug('fetchConnectionsForNewRule')
			fetchConnectionsForNewRule()
		}
	}, [
		connections,
		existingRule,
		hasFetchedIO,
		isOpened,
		onModalClosed,
		openRuleBuilder,
		rule?.webhookPrivateKey,
		rule?.webhookUrl,
		selectedInput,
		selectedOutput,
		webhookUrl
	])

	const shouldShowNext =
		selectedInput &&
		selectedOutput &&
		(selectedOutput.platform !== MeemAPI.RuleIo.Webhook ||
			(webhookUrl &&
				(webhookUrl.toLowerCase().includes('https://') ||
					webhookUrl.toLowerCase().includes('localhost'))))

	const modalContents = (
		<>
			{(!hasFetchedIO || isSavingRule) && (
				<Center>
					<Loader variant="oval" color="cyan" />
				</Center>
			)}
			{hasFetchedIO && !isSavingRule && (
				<>
					<Text className={meemTheme.tExtraSmallLabel}>
						PROPOSALS
					</Text>
					<Space h={24} />
					<Text className={meemTheme.tSmallBold}>
						Where will proposals be made?
					</Text>
					<Space h={8} />
					<Text className={meemTheme.tSmall}>
						Rules can only be made for one account at a time. Create
						additional rules to accept proposals on multiple
						platforms or accounts.
					</Text>
					<Space h={8} />
					<Select
						placeholder="Pick proposal source"
						data={inputValues}
						radius={12}
						size={'md'}
						value={selectedInputValue}
						onChange={event => {
							if (event) {
								setSelectedInputValue(event)
								inputs.forEach(i => {
									if (i.id === event) {
										setSelectedInput(i)
									}
								})
							}
						}}
					/>
					<Space h={40} />

					<Text className={meemTheme.tExtraSmallLabel}>
						PUBLISHING
					</Text>
					<Space h={24} />
					<Text className={meemTheme.tSmallBold}>
						Where will posts be published?
					</Text>
					<Space h={8} />
					<Text className={meemTheme.tSmall}>
						Rules can only be made for one account at a time. Create
						additional rules to publish on multiple platforms or
						accounts.
					</Text>
					<Space h={8} />
					<Select
						placeholder="Pick publishing destination"
						data={outputValues}
						value={selectedOutputValue}
						radius={12}
						size={'md'}
						onChange={event => {
							if (event) {
								setSelectedOutputValue(event)
								outputs.forEach(o => {
									if (o.id === event) {
										setSelectedOutput(o)
									}
								})
							}
						}}
					/>
					{selectedOutput &&
						selectedOutput.platform === MeemAPI.RuleIo.Webhook && (
							<>
								<Space h={24} />
								<Text className={meemTheme.tSmallBold}>
									Webhook URL
								</Text>
								<Space h={8} />
								<Text className={meemTheme.tSmall}>
									Read more about setting up webhooks in our{' '}
									<span
										onClick={() => {
											window.open(
												'https://docs.meem.wtf/meem-protocol/community-publishing/webhooks'
											)
										}}
										className={meemTheme.tSmallBold}
										style={{
											cursor: 'pointer',
											color: colorDarkBlue
										}}
									>
										dev docs.
									</span>
								</Text>
								<Space h={8} />
								<TextInput
									radius="lg"
									size="md"
									value={webhookUrl}
									onChange={event =>
										setWebhookUrl(event.currentTarget.value)
									}
								/>
								<Space h={24} />
								<Text className={meemTheme.tSmallBold}>
									Private Key
								</Text>
								<Space h={8} />
								<div className={meemTheme.centeredRow}>
									<TextInput
										style={{ maxWidth: 250 }}
										radius="lg"
										size="md"
										disabled
										value={webhookPrivateKey}
									/>
									<Space w={8} />
									<ActionIcon
										variant="outline"
										onClick={() => {
											navigator.clipboard.writeText(
												webhookPrivateKey
											)
											showSuccessNotification(
												'Private Key copied',
												`The Webhook Private Key was copied to your clipboard.`
											)
										}}
									>
										<IconCopy size="1.125rem" />
									</ActionIcon>
								</div>
							</>
						)}
					{shouldShowNext && (
						<>
							<Space h={24} />
							<Button
								className={meemTheme.buttonBlack}
								onClick={() => {
									openRuleBuilder(
										selectedInput,
										selectedOutput
									)
								}}
							>
								Next
							</Button>
						</>
					)}
				</>
			)}
		</>
	)

	return (
		<>
			{!existingRule && (
				<>
					<Modal
						className={meemTheme.visibleDesktopOnly}
						centered
						radius={16}
						overlayBlur={8}
						size={'60%'}
						padding={'lg'}
						opened={isOpened}
						title={
							<Text className={meemTheme.tMediumBold}>
								Add New Flow
							</Text>
						}
						onClose={() => {
							onModalClosed()
						}}
					>
						{modalContents}
					</Modal>
					<Modal
						className={meemTheme.visibleMobileOnly}
						fullScreen
						padding={'lg'}
						opened={isOpened}
						title={
							<Text className={meemTheme.tMediumBold}>
								Add New Flow
							</Text>
						}
						onClose={() => {
							onModalClosed()
						}}
					>
						{modalContents}
					</Modal>
				</>
			)}

			{isOpened && isDiscordTwitterRuleBuilderOpened && (
				<>
					<CTDiscordTwitterRulesBuilder
						onSave={values => {
							handleRuleSave(values)
						}}
						input={existingRule?.input ?? selectedInput}
						output={existingRule?.output ?? selectedOutput}
						rule={existingRule}
						isOpened={isDiscordTwitterRuleBuilderOpened}
						onModalClosed={() => {
							setIsDiscordTwitterRuleBuilderOpened(false)
							if (existingRule) {
								onModalClosed()
							}
						}}
					/>
				</>
			)}

			{isOpened && isDiscordWebhookRuleBuilderOpened && (
				<>
					<CTDiscordWebhookRulesBuilder
						onSave={values => {
							handleRuleSave(values)
						}}
						input={existingRule?.input ?? selectedInput}
						webhookUrl={webhookUrl}
						privateKey={webhookPrivateKey}
						rule={existingRule}
						isOpened={isDiscordWebhookRuleBuilderOpened}
						onModalClosed={() => {
							setIsDiscordWebhookRuleBuilderOpened(false)
							if (existingRule) {
								onModalClosed()
							}
						}}
					/>
				</>
			)}

			{isOpened && isSlackTwitterRuleBuilderOpened && (
				<>
					<CTSlackTwitterRulesBuilder
						onSave={values => {
							handleRuleSave(values)
						}}
						input={existingRule?.input ?? selectedInput}
						output={existingRule?.output ?? selectedOutput}
						rule={existingRule}
						isOpened={isSlackTwitterRuleBuilderOpened}
						onModalClosed={function (): void {
							setIsSlackTwitterRuleBuilderOpened(false)
							if (existingRule) {
								onModalClosed()
							}
						}}
					/>
				</>
			)}

			{isOpened && isSlackWebhookRuleBuilderOpened && (
				<>
					<CTSlackWebhookRulesBuilder
						onSave={values => {
							handleRuleSave(values)
						}}
						input={existingRule?.input ?? selectedInput}
						webhookUrl={webhookUrl}
						privateKey={webhookPrivateKey}
						rule={existingRule}
						isOpened={isSlackWebhookRuleBuilderOpened}
						onModalClosed={() => {
							setIsSlackWebhookRuleBuilderOpened(false)
							if (existingRule) {
								onModalClosed()
							}
						}}
					/>
				</>
			)}
		</>
	)
}
