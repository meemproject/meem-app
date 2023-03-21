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
import { makeRequest, MeemAPI } from '@meemproject/sdk'
import { IconCopy } from '@tabler/icons'
import React, { useCallback, useEffect, useState } from 'react'
import { useAnalytics } from '../../../../contexts/AnalyticsProvider'
import { extensionFromSlug } from '../../../../model/agreement/agreements'
import {
	showErrorNotification,
	showSuccessNotification
} from '../../../../utils/notifications'
import { useAgreement } from '../../../AgreementHome/AgreementProvider'
import { useMeemTheme } from '../../../Styles/MeemTheme'
import {
	SymphonyConnection,
	SymphonyConnectionType,
	SymphonyRule
} from '../Model/symphony'
import {
	IOnSave,
	SymphonyDiscordTwitterRulesBuilder
} from '../RuleBuilders/SymphonyDiscordTwitterRuleBuilder'
import { SymphonyDiscordWebhookRulesBuilder } from '../RuleBuilders/SymphonyDiscordWebhookRuleBuilder'
import { SymphonySlackTwitterRulesBuilder } from '../RuleBuilders/SymphonySlackTwitterRuleBuilder'
import { SymphonySlackWebhookRulesBuilder } from '../RuleBuilders/SymphonySlackWebhookRuleBuilder'
import { API } from '../symphonyTypes.generated'

interface IProps {
	existingRule?: SymphonyRule
	connections?: SymphonyConnection[]
	isOpened: boolean
	onModalClosed: () => void
}

export const SymphonyInputOutputModal: React.FC<IProps> = ({
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
	const agreementExtension = extensionFromSlug('symphony', agreement)
	const analytics = useAnalytics()

	// Inputs and outputs for the provisional publishing flow (rule)
	const [inputs, setInputs] = useState<SymphonyConnection[]>([])
	const [inputValues, setInputValues] = useState<SelectItem[]>([])
	const [selectedInput, setSelectedInput] = useState<SymphonyConnection>()
	const [selectedInputValue, setSelectedInputValue] = useState<string | null>(
		null
	)
	const [outputs, setOutputs] = useState<SymphonyConnection[]>([])
	const [outputValues, setOutputValues] = useState<SelectItem[]>([])
	const [selectedOutput, setSelectedOutput] = useState<SymphonyConnection>()
	const [selectedOutputValue, setSelectedOutputValue] = useState<
		string | null
	>(null)
	const [webhookUrl, setWebhookUrl] = useState('')
	const [webhookPrivateKey, setWebhookPrivateKey] = useState('')
	const [hasFetchedIO, setHasFetchedIO] = useState(false)
	const [isSavingRule, setIsSavingRule] = useState(false)

	// The complete rule to save (returned from the rule builder)
	const [rule, setRule] = useState<SymphonyRule>()

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

		await makeRequest<API.v1.SaveRule.IDefinition>(
			`${
				process.env.NEXT_PUBLIC_SYMPHONY_API_URL
			}${API.v1.SaveRule.path()}`,
			{
				method: API.v1.SaveRule.method,
				body: {
					jwt,
					agreementId: agreement.id,
					rule: {
						...values,
						input:
							existingRule?.input?.platform ??
							selectedInput.platform,
						inputRef:
							existingRule?.input?.id ?? selectedInput?.id ?? '',
						output:
							existingRule?.output?.platform ??
							selectedOutput.platform,
						outputRef:
							existingRule?.output?.id ??
							selectedOutput?.id ??
							'',
						isEnabled: true,
						ruleId: existingRule?.id ?? rule?.id,
						webhookUrl,
						webhookSecret: webhookPrivateKey
					}
				}
			}
		)

		if (!existingRule) {
			analytics.track('Symphony Flow Created', {
				communityId: agreement?.id,
				communityName: agreement?.name,
				inputType: 'Discord',
				outputType: 'Twitter'
			})
		} else {
			analytics.track('Symphony Flow Edited', {
				communityId: agreement?.id,
				communityName: agreement?.name,
				inputType: 'Discord',
				outputType: 'Twitter',
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
		(input: SymphonyConnection, output: SymphonyConnection) => {
			if (
				input.platform === API.RuleIo.Discord &&
				output.platform === API.RuleIo.Twitter &&
				!isDiscordTwitterRuleBuilderOpened
			) {
				// Discord to Twitter flow
				setIsDiscordTwitterRuleBuilderOpened(true)
			} else if (
				input.platform === API.RuleIo.Slack &&
				output.platform === API.RuleIo.Twitter &&
				!isSlackTwitterRuleBuilderOpened
			) {
				// Discord to Twitter flow
				setIsSlackTwitterRuleBuilderOpened(true)
			} else if (
				input.platform === API.RuleIo.Discord &&
				output.platform === API.RuleIo.Webhook &&
				!isDiscordWebhookRuleBuilderOpened
			) {
				// Discord to Webhook flow
				setIsDiscordWebhookRuleBuilderOpened(true)
			} else if (
				input.platform === API.RuleIo.Slack &&
				output.platform === API.RuleIo.Webhook &&
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
			// TODO: fetch private key
			setWebhookPrivateKey('private key')

			const filteredInputs = connections.filter(
				c => c.type === SymphonyConnectionType.InputOnly
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
				c => c.type === SymphonyConnectionType.OutputOnly
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
			// TODO: Set webhook url and private key for existing rules here
			if (filteredInput.length > 0 && filteredOutput.length > 0) {
				log.debug('found inputs and outputs for existing rule')
				// Find output
				setSelectedInput(filteredInput[0])
				setSelectedOutput(filteredOutput[0])
				openRuleBuilder(filteredInput[0], filteredOutput[0])
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
		selectedInput,
		selectedOutput
	])

	const shouldShowNext =
		selectedInput &&
		selectedOutput &&
		(selectedOutput.platform !== API.RuleIo.Webhook ||
			(webhookUrl && webhookUrl.includes('https://')))

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
						selectedOutput.platform === API.RuleIo.Webhook && (
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
												'https://docs.meem.wtf/meem-protocol/symphony/webhooks'
											)
										}}
										className={meemTheme.tSmallBold}
										style={{ cursor: 'pointer' }}
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
					<SymphonyDiscordTwitterRulesBuilder
						onSave={function (values: IOnSave): void {
							handleRuleSave(values)
						}}
						input={existingRule?.input ?? selectedInput}
						output={existingRule?.output ?? selectedOutput}
						rule={existingRule}
						isOpened={isDiscordTwitterRuleBuilderOpened}
						onModalClosed={function (): void {
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
					<SymphonyDiscordWebhookRulesBuilder
						onSave={function (values: IOnSave): void {
							handleRuleSave(values)
						}}
						input={existingRule?.input ?? selectedInput}
						webhookUrl={webhookUrl}
						webhookPrivateKey={webhookPrivateKey}
						rule={existingRule}
						isOpened={isDiscordWebhookRuleBuilderOpened}
						onModalClosed={function (): void {
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
					<SymphonySlackTwitterRulesBuilder
						onSave={function (values: IOnSave): void {
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
					<SymphonySlackWebhookRulesBuilder
						onSave={function (values: IOnSave): void {
							handleRuleSave(values)
						}}
						input={existingRule?.input ?? selectedInput}
						webhookUrl={webhookUrl}
						webhookPrivateKey={webhookPrivateKey}
						rule={existingRule}
						isOpened={isSlackWebhookRuleBuilderOpened}
						onModalClosed={function (): void {
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
