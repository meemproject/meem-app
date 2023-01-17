import {
	Container,
	Text,
	Space,
	Center,
	Button,
	Divider,
	Switch,
	TextInput,
	MantineProvider,
	Stepper
} from '@mantine/core'
import { useSDK } from '@meemproject/react'
import { MeemAPI } from '@meemproject/sdk'
import React, { useEffect, useState } from 'react'
import twitterIntent from 'twitter-intent'
import { extensionFromSlug } from '../../../model/agreement/agreements'
import {
	showErrorNotification,
	showSuccessNotification
} from '../../../utils/notifications'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import { useMeemTheme } from '../../Styles/MeemTheme'
import { ExtensionBlankSlate, extensionIsReady } from '../ExtensionBlankSlate'
import { ExtensionPageHeader } from '../ExtensionPageHeader'

export const TwitterLinkExtensionSettings: React.FC = () => {
	const { classes: meemTheme } = useMeemTheme()
	const { agreement, isLoadingAgreement } = useAgreement()
	const agreementExtension = extensionFromSlug('twitter', agreement)
	const sdk = useSDK()

	const [isSavingChanges, setIsSavingChanges] = useState(false)
	const [isDisablingExtension, setIsDisablingExtension] = useState(false)
	const [shouldDisplayInSidebar, setShouldDisplayInSidebar] = useState(true)
	const [shouldDisplayInFavoriteLinks, setShouldDisplayInFavoriteLinks] =
		useState(true)

	enum Step {
		Start,
		Share,
		Verify,
		Verifying
	}

	const [isPrivateExtension, setIsPrivateExtension] = useState(false)
	const [isExistingDataSetup, setIsExistingDataSetup] = useState(false)
	const [step, setStep] = useState<Step>(Step.Start)
	const [twitterUrl, setTwitterUrl] = useState('')
	const [twitterUsername, setTwitterUsername] = useState('')

	useEffect(() => {
		if (
			!isExistingDataSetup &&
			agreementExtension &&
			agreementExtension.AgreementExtensionLinks[0]
		) {
			setIsExistingDataSetup(true)
			setTwitterUsername(agreementExtension.metadata.twitterUsername)
			setTwitterUrl(agreementExtension.AgreementExtensionLinks[0].url)
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
		if (twitterUsername.length === 0 || twitterUsername.length > 50) {
			showErrorNotification(
				'Oops!',
				'Please enter a valid Twitter username first.'
			)
			return
		}

		setIsSavingChanges(true)
		try {
			await sdk.sdk.agreementExtension.updateAgreementExtension({
				agreementId: agreement?.id ?? '',
				agreementExtensionId: agreementExtension?.id,
				metadata: {
					sidebarVisible: shouldDisplayInSidebar,
					favoriteLinksVisible: shouldDisplayInFavoriteLinks,
					twitterUsername
				},
				externalLink: {
					url: twitterUrl,
					isEnabled: true,
					visibility: isPrivateExtension
						? MeemAPI.AgreementExtensionVisibility.TokenHolders
						: MeemAPI.AgreementExtensionVisibility.Anyone
				}
			})
			showSuccessNotification(
				'Success!',
				'This extension has been updated.'
			)
			setIsSavingChanges(false)
		} catch (e) {}
	}

	const disableExtension = async () => {
		setIsDisablingExtension(true)
		setIsDisablingExtension(false)
	}

	const verifyTwitterSteps = (
		<>
			<Space h={24} />
			<Text className={meemTheme.tExtraSmallLabel}>VERIFY TWITTER</Text>
			<Space h={24} />
			<div>
				<MantineProvider
					theme={{
						colors: {
							brand: [
								'#1DAD4E',
								'#1DAD4E',
								'#1DAD4E',
								'#1DAD4E',
								'#1DAD4E',
								'#1DAD4E',
								'#1DAD4E',
								'#1DAD4E',
								'#1DAD4E',
								'#1DAD4E'
							]
						},
						primaryColor: 'brand'
					}}
				>
					<Stepper
						size="md"
						color="green"
						orientation="vertical"
						active={
							step === Step.Start
								? 0
								: step === Step.Share
								? 1
								: 2
						}
					>
						<Stepper.Step
							label="What's your community's Twitter username?"
							description={
								step !== Step.Start &&
								step !== Step.Share ? null : (
									<>
										{step === Step.Start && (
											<div>
												<Text>
													You’ll need access to this
													Twitter account to verify.
												</Text>
												<Space h={4} />

												<TextInput
													value={twitterUsername}
													onChange={event => {
														setTwitterUsername(
															event.target.value
														)
													}}
												/>
												<Space h={16} />

												<Button
													onClick={() => {
														if (
															twitterUsername.length ===
																0 ||
															twitterUsername.length >
																15
														) {
															showErrorNotification(
																'Oops!',
																'That Twitter username is invalid.'
															)
														}
														setStep(Step.Share)
													}}
													className={
														meemTheme.buttonBlack
													}
												>
													Confirm
												</Button>
												<Space h={24} />
											</div>
										)}
									</>
								)
							}
						/>
						<Stepper.Step
							label="Share a public post"
							description={
								step !== Step.Share ? (
									<Text>
										Make a post to verify your identity
									</Text>
								) : (
									<>
										<div>
											<Text>
												Make a post to verify your
												identity
											</Text>
											<Space h={16} />

											<Button
												onClick={() => {
													// Generate intent
													const href =
														twitterIntent.tweet.url(
															{
																text: `Verifying that this is the official Twitter account of ${
																	agreement?.name ??
																	''
																}!`,
																url: `${
																	window
																		.location
																		.origin
																}/${
																	agreement?.slug ??
																	''
																}`
															}
														)

													// Open it
													window.open(href)
													setStep(Step.Verify)
												}}
												className={
													meemTheme.buttonBlack
												}
											>
												Post on Twitter
											</Button>
											<Space h={24} />
										</div>
									</>
								)
							}
						/>
						<Stepper.Step
							label="Verify your tweet"
							loading={step === Step.Verifying}
							description={
								step !== Step.Verify &&
								step != Step.Verifying ? (
									<Text>Complete your verification.</Text>
								) : (
									<>
										{step === Step.Verifying && (
											<>
												<Text>Please wait...</Text>
											</>
										)}
										{step !== Step.Verifying && (
											<>
												<div>
													<Text>
														Complete your
														verification.
													</Text>
													<Space h={16} />

													<Button
														onClick={saveChanges}
														loading={
															isSavingChanges
														}
														disabled={
															isSavingChanges
														}
														className={
															meemTheme.buttonBlack
														}
													>
														Verify Tweet
													</Button>
													<Space h={12} />
												</div>
											</>
										)}
									</>
								)
							}
						/>
					</Stepper>
				</MantineProvider>
			</div>
		</>
	)

	const verifiedLayout = (
		<>
			<>
				<Text
					className={meemTheme.tSmall}
				>{`This community is currently linked to ${twitterUsername} on Twitter.`}</Text>
				<Space h={40} />
				<Text className={meemTheme.tExtraSmallLabel}>
					LINK DISPLAY SETTINGS
				</Text>
				<Space h={8} />
				<div className={meemTheme.spacedRowCentered}>
					<Switch
						color={'green'}
						label={'Display link in sidebar'}
						checked={shouldDisplayInSidebar}
						onChange={value => {
							if (value) {
								setShouldDisplayInSidebar(
									value.currentTarget.checked
								)
							}
						}}
					/>
				</div>
				<Space h={16} />
				<Divider />
				<div>
					<Space h={4} />
					<div className={meemTheme.spacedRowCentered}>
						<Switch
							color={'green'}
							label={'Display link in Favorite Links section'}
							checked={shouldDisplayInFavoriteLinks}
							onChange={value => {
								if (value) {
									setShouldDisplayInFavoriteLinks(
										value.currentTarget.checked
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
					<div className={meemTheme.spacedRowCentered}>
						<Switch
							color={'green'}
							label={
								'Hide links if viewer is not a community member'
							}
							checked={isPrivateExtension}
							onChange={value => {
								if (value) {
									setIsPrivateExtension(
										value.currentTarget.checked
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
			</>
		</>
	)

	return (
		<div>
			<ExtensionBlankSlate extensionSlug={'twitter'} />
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
							<ExtensionPageHeader extensionSlug={'twitter'} />

							<Container>
								<div>
									{twitterUrl && verifiedLayout}
									{!twitterUrl && verifyTwitterSteps}
								</div>
							</Container>
						</div>
					)}
				</>
			)}
		</div>
	)
}
