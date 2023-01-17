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
import React, { useState } from 'react'
import { extensionFromSlug } from '../../../model/agreement/agreements'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import { useMeemTheme } from '../../Styles/MeemTheme'
import { ExtensionBlankSlate, extensionIsReady } from '../ExtensionBlankSlate'
import { ExtensionPageHeader } from '../ExtensionPageHeader'

export const DiscordLinkExtensionSettings: React.FC = () => {
	// Default extension settings / properties - leave these alone if possible!
	const { classes: meemTheme } = useMeemTheme()
	const { agreement, isLoadingAgreement } = useAgreement()
	const agreementExtension = extensionFromSlug('discord', agreement)

	const [isSavingChanges, setIsSavingChanges] = useState(false)
	const [isDisablingExtension, setIsDisablingExtension] = useState(false)
	const [shouldDisplayInSidebar, setShouldDisplayInSidebar] = useState(false)
	const [shouldDisplayInFavoriteLinks, setShouldDisplayInFavoriteLinks] =
		useState(false)

	const [isPrivateExtension, setIsPrivateExtension] = useState(false)
	const [linkUrl, setAgreementName] = useState('')

	/*
	/*
	Boilerplate area - please don't edit the below code!
	===============================================================
	 */

	const saveChanges = async () => {
		setIsSavingChanges(true)
		setIsSavingChanges(false)
	}

	const disableExtension = async () => {
		setIsDisablingExtension(true)
		setIsDisablingExtension(false)
	}

	return (
		<div>
			<ExtensionBlankSlate extensionSlug={'discord'} />
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
							<ExtensionPageHeader extensionSlug={'discord'} />

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
											setAgreementName(event.target.value)
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
