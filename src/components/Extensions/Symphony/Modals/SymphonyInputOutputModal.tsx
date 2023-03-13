import { Modal, Text } from '@mantine/core'
import { useSDK, useAuth } from '@meemproject/react'
import { makeRequest, MeemAPI } from '@meemproject/sdk'
import React, { useState } from 'react'
import { extensionFromSlug } from '../../../../model/agreement/agreements'
import { useAgreement } from '../../../AgreementHome/AgreementProvider'
import { useMeemTheme } from '../../../Styles/MeemTheme'
import {
	SymphonyConnection,
	SymphonyConnectionPlatform,
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

	// Inputs and outputs for the provisional publishing flow (rule)
	const [inputs, setInputs] = useState<SymphonyConnection[]>([])
	const [outputs, setOutputs] = useState<SymphonyConnection[]>([])

	// The complete rule to save (returned from the rule builder)
	const [rule, setRule] = useState<SymphonyRule>()

	// Rule builder modal states
	const [
		isDiscordTwitterRuleBuilderOpened,
		setIsDiscordTwitterRuleBuilderOpened
	] = useState(false)

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

	const modalContents = <></>

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
