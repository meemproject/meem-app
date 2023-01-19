import {
	Container,
	Text,
	Space,
	Center,
	Button,
	Divider,
	Switch,
	TextInput
} from '@mantine/core'
import { useSDK } from '@meemproject/react'
import { MeemAPI } from '@meemproject/sdk'
import React, { useEffect, useState } from 'react'
import { extensionFromSlug } from '../../../model/agreement/agreements'
import {
	showErrorNotification,
	showSuccessNotification
} from '../../../utils/notifications'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import { useMeemTheme } from '../../Styles/MeemTheme'
import { ExtensionBlankSlate, extensionIsReady } from '../ExtensionBlankSlate'
import { ExtensionPageHeader } from '../ExtensionPageHeader'

export const GitcoinLinkExtensionSettings: React.FC = () => {
	const { classes: meemTheme } = useMeemTheme()
	const { agreement, isLoadingAgreement } = useAgreement()
	const agreementExtension = extensionFromSlug('gitcoin', agreement)
	const sdk = useSDK()

	const [isSavingChanges, setIsSavingChanges] = useState(false)
	const [isDisablingExtension, setIsDisablingExtension] = useState(false)
	const [shouldDisplayInSidebar, setShouldDisplayInSidebar] = useState(true)
	const [shouldDisplayInFavoriteLinks, setShouldDisplayInFavoriteLinks] =
		useState(true)

	const [isPrivateExtension, setIsPrivateExtension] = useState(false)
	const [isExistingDataSetup, setIsExistingDataSetup] = useState(false)
	const [linkUrl, setLinkUrl] = useState('')

	useEffect(() => {
		if (
			!isExistingDataSetup &&
			agreementExtension &&
			agreementExtension.AgreementExtensionLinks[0]
		) {
			setIsExistingDataSetup(true)
			setLinkUrl(agreementExtension.AgreementExtensionLinks[0].url)
			setShouldDisplayInSidebar(
				agreementExtension.metadata.sidebarVisible
			)
			setShouldDisplayInFavoriteLinks(
				agreementExtension.metadata.favoriteLinksVisible
			)
			setIsPrivateExtension(
				agreementExtension.AgreementExtensionLinks[0].visibility ===
					MeemAPI.AgreementExtensionVisibility.TokenHolders
			)
		}
	}, [agreementExtension, isExistingDataSetup])

	const saveChanges = async () => {
		if (
			linkUrl.length === 0 ||
			linkUrl.length > 100
		) {
			showErrorNotification('Oops!', 'Please enter a valid URL.')
			return
		}

		setIsSavingChanges(true)
		await sdk.sdk.agreementExtension.updateAgreementExtension({
			agreementId: agreement?.id ?? '',
			agreementExtensionId: agreementExtension?.id,
			metadata: {
				sidebarVisible: shouldDisplayInSidebar,
				favoriteLinksVisible: shouldDisplayInFavoriteLinks
			},
			externalLink: {
				url: linkUrl,
				isEnabled: true,
				visibility: isPrivateExtension
					? MeemAPI.AgreementExtensionVisibility.TokenHolders
					: MeemAPI.AgreementExtensionVisibility.Anyone
			}
		})
		showSuccessNotification('Success!', 'This extension has been updated.')
		setIsSavingChanges(false)
	}

	const disableExtension = async () => {
		setIsDisablingExtension(true)
		setIsDisablingExtension(false)
	}

	return (
		<div>
			<ExtensionBlankSlate extensionSlug={'gitcoin'} />
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
							<ExtensionPageHeader
								extensionSlug={'gitcoin'}
							/>

							<Container>
								<div>
									<Text
										className={meemTheme.tExtraSmallLabel}
									>
										{`Link URL`.toUpperCase()}
									</Text>
									<Space h={12} />
									<TextInput
										radius="lg"
										size="md"
										value={linkUrl ?? ''}
										onChange={(event: {
											target: {
												value: React.SetStateAction<string>
											}
										}) => {
											setLinkUrl(event.target.value)
										}}
									/>
									<Space h={40} />
									<Text
										className={meemTheme.tExtraSmallLabel}
									>
										LINK DISPLAY SETTINGS
									</Text>
									<Space h={8} />
									<div
										className={meemTheme.spacedRowCentered}
									>
										<Switch
											color={'green'}
											label={'Display link in sidebar'}
											checked={shouldDisplayInSidebar}
											onChange={value => {
												if (value) {
													setShouldDisplayInSidebar(
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
												'Display link in Favorite Links section'
											}
											checked={
												shouldDisplayInFavoriteLinks
											}
											onChange={value => {
												if (value) {
													setShouldDisplayInFavoriteLinks(
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
												'Hide links if viewer is not a community member'
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
