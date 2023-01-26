import {
	Container,
	Text,
	Space,
	Center,
	Button,
	Divider,
	Switch
} from '@mantine/core'
import { useSDK } from '@meemproject/react'
import React, { useState } from 'react'
import { extensionFromSlug } from '../../../model/agreement/agreements'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import { useMeemTheme } from '../../Styles/MeemTheme'
import { ExtensionBlankSlate, extensionIsReady } from '../ExtensionBlankSlate'
import { ExtensionPageHeader } from '../ExtensionPageHeader'

export const ExampleExtensionSettings: React.FC = () => {
	// Default extension settings / properties - leave these alone if possible!
	const { classes: meemTheme } = useMeemTheme()
	const { sdk } = useSDK()
	const { agreement, isLoadingAgreement } = useAgreement()
	const agreementExtension = extensionFromSlug('example', agreement)

	const [isSavingChanges, setIsSavingChanges] = useState(false)
	const [isDisablingExtension, setIsDisablingExtension] = useState(false)
	const [shouldDisplayDashboardWidget, setShouldDisplayDashboardWidget] =
		useState(false)
	const [isPrivateExtension, setIsPrivateExtension] = useState(false)

	/*
	TODO
	Add your custom extension settings layout here.
	 */
	const customExtensionSettings = () => (
		<>
			<Space h={40} />
			<Text className={meemTheme.tExtraSmallLabel}>CONFIGURATION</Text>
			<Space h={16} />
			This extension does not provide any additional settings.
			<Space h={8} />
		</>
	)

	/*
	TODO
	Add your custom extension permissions layout here.
	 */
	const customExtensionPermissions = () => (
		<>This extension does not provide any permissions.</>
	)

	/*
	TODO
	Use this function to save any specific settings you have created for this extension and make any calls you need to external APIs.
	 */
	const saveCustomChanges = async () => {
		await sdk.agreementExtension.updateAgreementExtension({
			agreementId: agreement?.id ?? '',
			agreementExtensionId: agreementExtension?.id,
			isSetupComplete: true
			// ---------------------------------------------
			// Include externalLink if you'd like to add or update
			// an external link to your community home page.
			// Setting this to null will remove an existing link.
			// ---------------------------------------------
			// externalLink: {
			// 	url: '',
			// 	label: ''
			// },
			// ---------------------------------------------
			// Store/update non-sensitive metadata for configuring your extension.
			// We also recommend versioning your extension so you can gracefully
			// handle any future updates to metadata schema
			// ---------------------------------------------
			// metadata: {
			// 	version: '1.0.0',
			// 	customProperty: 'boop'
			// }
		})
	}

	/*
	Boilerplate area - please don't edit the below code!
	===============================================================
	 */

	const saveChanges = async () => {
		setIsSavingChanges(true)
		await saveCustomChanges()
		setIsSavingChanges(false)
	}

	const disableExtension = async () => {
		setIsDisablingExtension(true)
		setIsDisablingExtension(false)
	}

	return (
		<div>
			<ExtensionBlankSlate extensionSlug={'example'} />
			{extensionIsReady(
				isLoadingAgreement,
				agreement,
				agreementExtension
			) && (
				<>
					{!agreement?.isCurrentUserAgreementAdmin && (
						<Container>
							<Space h={120} />
							<Center>
								<Text>
									Sorry, you do not have permission to view
									this page. Contact the community owner for
									help.
								</Text>
							</Center>
						</Container>
					)}

					{agreement?.isCurrentUserAgreementAdmin && (
						<div>
							<ExtensionPageHeader extensionSlug={'example'} />

							<Container>
								<div>
									<div
										className={meemTheme.spacedRowCentered}
									>
										<Switch
											color={'green'}
											label={'Display dashboard widget'}
											checked={
												shouldDisplayDashboardWidget
											}
											onChange={value => {
												if (value) {
													setShouldDisplayDashboardWidget(
														value.currentTarget
															.checked
													)
												}
											}}
										/>
									</div>
									<Space h={16} />
									<Divider />
								</div>
								<div>
									<Space h={4} />
									<div
										className={meemTheme.spacedRowCentered}
									>
										<Switch
											color={'green'}
											label={
												'Hide widget if viewer is not a community member'
											}
											checked={isPrivateExtension}
											onChange={value => {
												if (value) {
													setIsPrivateExtension(
														value.currentTarget
															.checked
													)
												}
											}}
										/>
									</div>
									<Space h={16} />
									<Divider />
								</div>
								<Space h={16} />

								<Button
									disabled={isDisablingExtension}
									loading={isDisablingExtension}
									className={meemTheme.buttonAsh}
									onClick={disableExtension}
								>
									Disable extension
								</Button>

								{customExtensionSettings()}
								<Space h={40} />
								<Text className={meemTheme.tExtraSmallLabel}>
									PERMISSIONS
								</Text>
								<Space h={16} />

								{customExtensionPermissions()}
								<Space h={48} />
								<Button
									disabled={isSavingChanges}
									loading={isSavingChanges}
									onClick={() => {
										saveChanges()
									}}
									className={meemTheme.buttonBlack}
								>
									Save Changes
								</Button>
							</Container>
						</div>
					)}
				</>
			)}
		</div>
	)
}
