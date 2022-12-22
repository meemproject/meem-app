import {
	Container,
	Image,
	Text,
	Space,
	Center,
	Button,
	Divider,
	Switch
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { ArrowLeft, Check } from 'tabler-icons-react'
import { extensionFromSlug } from '../../../model/agreement/agreements'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import { colorGreen, useMeemTheme } from '../../Styles/MeemTheme'
import { ExtensionBlankSlate, extensionIsReady } from '../ExtensionBlankSlate'

export const ExampleExtensionSettings: React.FC = () => {
	// Default extension settings / properties - leave these alone if possible!
	const router = useRouter()
	const { classes: meemTheme } = useMeemTheme()
	const { agreement, isLoadingAgreement, error } = useAgreement()
	const agreementExtension = extensionFromSlug('example', agreement)

	const [isSavingChanges, setIsSavingChanges] = useState(false)
	const [isDisablingExtension, setIsDisablingExtension] = useState(false)
	const [shouldDisplayDashboardWidget, setShouldDisplayDashboardWidget] =
		useState(false)
	const [isPrivateExtension, setIsPrivateExtension] = useState(false)

	// TODO: Add your custom extension settings here

	/*
	TODO:
	Add your extension's name, which shows up as the page title.
	 */
	const extensionName = 'Example Extension'

	/*
	TODO
	Add your custom extension settings layout here.
	 */
	const customExtensionSettings = () => (
		<>
			<Space h={32} />
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
	const saveCustomChanges = async () => {}

	/*
	Boilerplate area - please don't edit the below code!
	===============================================================
	 */

	const saveChanges = async () => {
		setIsSavingChanges(true)
		await saveCustomChanges()
		setIsSavingChanges(false)
	}

	const navigateToAgreementHome = () => {
		router.push({
			pathname: `/${agreement?.slug}`
		})
	}

	const navigateToAllExtensions = () => {
		router.push({
			pathname: `/${agreement?.slug}/admin`,
			query: { tab: 'extensions' }
		})
	}

	const disableExtension = async () => {
		setIsDisablingExtension(true)
		setIsDisablingExtension(false)
	}

	return (
		<div>
			<ExtensionBlankSlate
				isLoadingAgreement
				agreement={agreement}
				error={error}
				extensionSlug={'example'}
			/>
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
							<div className={meemTheme.pageHeader}>
								<div className={meemTheme.spacedRowCentered}>
									<ArrowLeft
										className={meemTheme.clickable}
										onClick={() => {
											navigateToAllExtensions()
										}}
									/>
									<Space w={24} />
									<Image
										radius={8}
										height={80}
										width={80}
										className={meemTheme.imagePixelated}
										src={agreement?.image}
									/>
									{/* <Text className={classes.headerAgreementName}>{agreementName}</Text> */}
									<div
										className={
											meemTheme.pageHeaderTitleContainer
										}
									>
										<Text className={meemTheme.tLargeBold}>
											{agreement.name}
										</Text>
										<Space h={8} />
										<div className={meemTheme.row}>
											<Text
												className={
													meemTheme.tExtraSmallFaded
												}
											>{`${window.location.origin}/${agreement.slug}`}</Text>
											<Image
												className={meemTheme.copyIcon}
												src="/copy.png"
												height={20}
												onClick={() => {
													navigator.clipboard.writeText(
														`${window.location.origin}/${agreement.slug}`
													)
													showNotification({
														radius: 'lg',
														title: 'Community URL copied',
														autoClose: 2000,
														color: colorGreen,
														icon: <Check />,

														message: `This community's URL was copied to your clipboard.`
													})
												}}
												width={20}
											/>
										</div>
									</div>
								</div>
								<a
									className={meemTheme.pageHeaderExitButton}
									onClick={navigateToAgreementHome}
								>
									<Image
										src="/delete.png"
										width={24}
										height={24}
									/>
								</a>
							</div>

							<Container>
								<Space h={16} />
								<div
									className={meemTheme.spacedRow}
									style={{ marginBottom: 32 }}
								>
									<div>
										<Text
											className={
												meemTheme.tExtraSmallLabel
											}
										>
											SETTINGS
										</Text>
										<Space h={4} />
										<div className={meemTheme.centeredRow}>
											<Text
												className={meemTheme.tLargeBold}
											>
												{extensionName}
											</Text>
										</div>
									</div>
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
								</div>
								<Divider />
								<Space h={32} />
								<Text className={meemTheme.tExtraSmallLabel}>
									DISPLAY SETTINGS
								</Text>

								<div>
									<Space h={16} />
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
									className={meemTheme.buttonBlue}
									onClick={disableExtension}
								>
									Disable extension
								</Button>

								{customExtensionSettings()}
								<Space h={32} />
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
