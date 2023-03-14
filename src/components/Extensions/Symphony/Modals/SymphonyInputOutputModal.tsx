import {
	Button,
	Center,
	Loader,
	Modal,
	Select,
	// eslint-disable-next-line import/named
	SelectItem,
	Space,
	Text
} from '@mantine/core'
import { useSDK, useAuth } from '@meemproject/react'
import { makeRequest, MeemAPI } from '@meemproject/sdk'
import React, { useEffect, useState } from 'react'
import { useAnalytics } from '../../../../contexts/AnalyticsProvider'
import { extensionFromSlug } from '../../../../model/agreement/agreements'
import { useAgreement } from '../../../AgreementHome/AgreementProvider'
import { useMeemTheme } from '../../../Styles/MeemTheme'
import {
	SymphonyConnection,
	SymphonyConnectionPlatform,
	SymphonyConnectionType,
	SymphonyRule
} from '../Model/symphony'
import {
	IOnSave,
	SymphonyDiscordTwitterRulesBuilder
} from '../RuleBuilders/SymphonyDiscordTwitterRuleBuilder'
import { API } from '../symphonyTypes.generated'

interface IProps {
	existingRule?: SymphonyRule
	isOpened: boolean
	onModalClosed: () => void
}

export const SymphonyInputOutputModal: React.FC<IProps> = ({
	existingRule,
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
	const [hasFetchedIO, setHasFetchedIO] = useState(false)

	// The complete rule to save (returned from the rule builder)
	const [rule, setRule] = useState<SymphonyRule>()

	// Rule builder modal states
	const [
		isDiscordTwitterRuleBuilderOpened,
		setIsDiscordTwitterRuleBuilderOpened
	] = useState(false)

	// Save the rule
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
							ruleId: rule?.id
						}
					]
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
	}

	useEffect(() => {
		// Reset state so that new data can be fetched upon refresh
		if (!isOpened && hasFetchedIO) {
			setHasFetchedIO(false)
		}

		if (!hasFetchedIO) {
			// TODO: This is mock data obviously
			setHasFetchedIO(true)

			const fetchedInputs = [
				{
					id: 'discord',
					name: `Discord: (serverName)`, // todo
					type: SymphonyConnectionType.InputOnly,
					platform: SymphonyConnectionPlatform.Discord,
					discordServerId: '' // todo
				}
			]

			const fetchedInputValues: SelectItem[] = []
			fetchedInputs.forEach(inp => {
				const inputVal = {
					value: inp.id,
					label: inp.name
				}
				fetchedInputValues.push(inputVal)
			})

			setInputs(fetchedInputs)
			setInputValues(fetchedInputValues)

			const fetchedOutputs = [
				{
					id: 'twitter',
					name: `Twitter: (username)`, // todo
					type: SymphonyConnectionType.OutputOnly,
					platform: SymphonyConnectionPlatform.Twitter,
					twitterUsername: '' // todo
				}
			]

			const fetchedOutputValues: SelectItem[] = []
			fetchedOutputs.forEach(out => {
				const outVal = {
					value: out.id,
					label: out.name
				}
				fetchedOutputValues.push(outVal)
			})

			setOutputs(fetchedOutputs)
			setOutputValues(fetchedOutputValues)
		}
	}, [hasFetchedIO, isOpened])

	const openRuleBuilder = () => {
		if (selectedInput && selectedOutput) {
			if (
				selectedInput.platform === SymphonyConnectionPlatform.Discord &&
				selectedOutput.platform === SymphonyConnectionPlatform.Twitter
			) {
				// Discord to Twitter flow
				setIsDiscordTwitterRuleBuilderOpened(true)
			}
		}
	}

	const modalContents = (
		<>
			{!hasFetchedIO && (
				<Center>
					<Loader variant="oval" color="cyan" />
				</Center>
			)}
			{hasFetchedIO && (
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
					{selectedInput && selectedOutput && (
						<>
							<Space h={24} />
							<Button
								className={meemTheme.buttonBlack}
								onClick={() => {
									openRuleBuilder()
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

			{isOpened && (
				<>
					<SymphonyDiscordTwitterRulesBuilder
						onSave={function (values: IOnSave): void {
							handleRuleSave(values)
						}}
						isOpened={isDiscordTwitterRuleBuilderOpened}
						onModalClosed={function (): void {
							setIsDiscordTwitterRuleBuilderOpened(false)
						}}
					/>
				</>
			)}
		</>
	)
}
