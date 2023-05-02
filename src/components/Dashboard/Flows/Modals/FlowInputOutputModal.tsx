import log from '@kengoldfarb/log'
import {
	ActionIcon,
	Button,
	Center,
	Container,
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
import { Cancel, Copy } from 'iconoir-react'
import React, { useCallback, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { extensionFromSlug } from '../../../../model/agreement/agreements'
import {
	showErrorNotification,
	showSuccessNotification
} from '../../../../utils/notifications'
import { useAgreement } from '../../../Providers/AgreementProvider'
import { useAnalytics } from '../../../Providers/AnalyticsProvider'
import { colorDarkBlue, useMeemTheme } from '../../../Styles/MeemTheme'
import { ConnectedAccount, ConnectedAccountType, Rule } from '../Model/flows'
import { FlowDiscordTwitterRulesBuilder } from '../RuleBuilders/FlowDiscordTwitterRuleBuilder'
import {
	FlowDiscordWebhookRulesBuilder,
	IOnSave
} from '../RuleBuilders/FlowDiscordWebhookRuleBuilder'
import { FlowSlackTwitterRulesBuilder } from '../RuleBuilders/FlowSlackTwitterRuleBuilder'
import { FlowSlackWebhookRulesBuilder } from '../RuleBuilders/FlowSlackWebhookRuleBuilder'

interface IProps {
	existingRule?: Rule
	connectedAccounts?: ConnectedAccount[]
	isOpened: boolean
	onModalClosed: () => void
}

export const FlowInputOutputModal: React.FC<IProps> = ({
	existingRule,
	connectedAccounts: connections,
	isOpened,
	onModalClosed
}) => {
	// General params
	const { classes: meemTheme } = useMeemTheme()
	const { sdk } = useSDK()
	const { jwt } = useAuth()
	const { agreement } = useAgreement()
	const agreementExtension = extensionFromSlug('community-tweets', agreement)
	const analytics = useAnalytics()

	// Inputs and outputs for the provisional publishing flow (rule)
	const [inputs, setInputs] = useState<ConnectedAccount[]>([])
	const [inputValues, setInputValues] = useState<SelectItem[]>([])
	const [selectedInput, setSelectedInput] = useState<ConnectedAccount>()
	const [selectedInputValue, setSelectedInputValue] = useState<string | null>(
		null
	)
	const [outputs, setOutputs] = useState<ConnectedAccount[]>([])
	const [outputValues, setOutputValues] = useState<SelectItem[]>([])
	const [selectedOutput, setSelectedOutput] = useState<ConnectedAccount>()
	const [selectedOutputValue, setSelectedOutputValue] = useState<
		string | null
	>(null)
	const [webhookUrl, setWebhookUrl] = useState('')
	const [webhookPrivateKey, setWebHookPrivateKey] = useState('')
	const [hasFetchedIO, setHasFetchedIO] = useState(false)
	const [isSavingRule, setIsSavingRule] = useState(false)

	// The complete rule to save (returned from the rule builder)
	const [rule, setRule] = useState<Rule>()

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

	function clear() {
		setRule(undefined)
		setSelectedInput(undefined)
		setSelectedInputValue(null)
		setSelectedOutput(undefined)
		setSelectedOutputValue(null)
		setIsSlackTwitterRuleBuilderOpened(false)
		setIsSlackWebhookRuleBuilderOpened(false)
		setIsDiscordTwitterRuleBuilderOpened(false)
		setIsDiscordWebhookRuleBuilderOpened(false)
		setHasFetchedIO(false)
		setWebhookUrl('')
	}

	// Save the rule
	const handleRuleSave = async (values: IOnSave) => {
		if (!agreement?.id || !jwt || !selectedInput || !selectedOutput) {
			return
		}

		setIsSavingRule(true)

		const ruleData = {
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
				webhookUrl: existingRule?.webhookUrl ?? webhookUrl,
				webhookSecret:
					existingRule?.webhookPrivateKey ?? webhookPrivateKey
			}
		}

		try {
			log.debug(`saving rule with data ${JSON.stringify(ruleData)}`)
			await sdk.symphony.saveRule(ruleData)

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

			clear()
			onModalClosed()
			setIsSavingRule(false)
		} catch (e) {
			log.debug(e)
			setIsSavingRule(false)
			showErrorNotification(
				'Error saving this rule',
				'There was an error saving this rule. Please let us know using the link in the top right of this page.'
			)
		}
	}

	const openRuleBuilder = useCallback(
		(input: ConnectedAccount, output?: ConnectedAccount) => {
			onModalClosed()

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
			isSlackWebhookRuleBuilderOpened,
			onModalClosed
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
				c => c.type === ConnectedAccountType.InputOnly
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
				c => c.type === ConnectedAccountType.OutputOnly
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
				clear()
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
					const syntheticOutput: ConnectedAccount = {
						id: 'webhook',
						name: 'Webhook',
						type: ConnectedAccountType.OutputOnly,
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
				clear()
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
		<div style={{ position: 'relative' }}>
			<Space h={32} />
			<Center>
				<Text className={meemTheme.tLargeBold}>Add New Flow</Text>
			</Center>
			<Space h={8} />
			<Center>
				<Text>
					Select the accounts you’ll use to propose and publish posts.
				</Text>
			</Center>

			<Space h={48} />
			<Container size={'sm'}>
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
							Rules can only be made for one account at a time.
							Create additional rules to accept proposals on
							multiple platforms or accounts.
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
							Rules can only be made for one account at a time.
							Create additional rules to publish on multiple
							platforms or accounts.
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
							selectedOutput.platform ===
								MeemAPI.RuleIo.Webhook && (
								<>
									<Space h={24} />
									<Text className={meemTheme.tSmallBold}>
										Webhook URL
									</Text>
									<Space h={8} />
									<Text className={meemTheme.tSmall}>
										Read more about setting up webhooks in
										our{' '}
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
											setWebhookUrl(
												event.currentTarget.value
											)
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
											<Copy
												height="1.125rem"
												width="1.125rem"
											/>
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
			</Container>
			<Cancel
				style={{
					position: 'absolute',
					top: 8,
					right: 8,
					cursor: 'pointer'
				}}
				onClick={() => {
					onModalClosed()
				}}
			/>
		</div>
	)

	return (
		<>
			{!existingRule && (
				<>
					<Modal
						fullScreen
						padding={'lg'}
						classNames={{
							root: meemTheme.backgroundMeem,
							content: meemTheme.backgroundMeem
						}}
						transitionProps={{ transition: 'pop', duration: 0 }}
						withCloseButton={false}
						opened={isOpened}
						onClose={() => {
							clear()
							onModalClosed()
						}}
					>
						{modalContents}
					</Modal>
				</>
			)}

			{isDiscordTwitterRuleBuilderOpened && (
				<>
					<FlowDiscordTwitterRulesBuilder
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
								clear()
								onModalClosed()
							}
						}}
					/>
				</>
			)}

			{isDiscordWebhookRuleBuilderOpened && (
				<>
					<FlowDiscordWebhookRulesBuilder
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
								clear()
								onModalClosed()
							}
						}}
					/>
				</>
			)}

			{isSlackTwitterRuleBuilderOpened && (
				<>
					<FlowSlackTwitterRulesBuilder
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
								clear()
								onModalClosed()
							}
						}}
					/>
				</>
			)}

			{isSlackWebhookRuleBuilderOpened && (
				<>
					<FlowSlackWebhookRulesBuilder
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
								clear()
								onModalClosed()
							}
						}}
					/>
				</>
			)}
		</>
	)
}
