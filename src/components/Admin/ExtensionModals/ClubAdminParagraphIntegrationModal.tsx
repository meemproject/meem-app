import log from '@kengoldfarb/log'
import {
	Text,
	Space,
	Modal,
	Divider,
	TextInput,
	Radio,
	Button,
	Loader,
	Center,
	Image,
	Switch
} from '@mantine/core'
// eslint-disable-next-line import/no-extraneous-dependencies
import React, { useEffect, useState } from 'react'
import { Club, Extension } from '../../../model/club/club'
import { colorGreen, colorGrey, useClubsTheme } from '../../Styles/ClubsTheme'
interface IProps {
	club: Club
	extension?: Extension
	isOpened: boolean
	onModalClosed: () => void
	onComplete: (slug: string, name: string, isEnabled: boolean) => void
}

enum Step {
	Start,
	OpenGnosis,
	Transaction,
	SavingExtension,
	Success
}

export const ClubAdminParagraphExtensionModal: React.FC<IProps> = ({
	club,
	extension,
	isOpened,
	onModalClosed,
	onComplete
}) => {
	//const wallet = useWallet()

	const { classes: clubsTheme } = useClubsTheme()

	const [step, setStep] = useState<Step>(Step.Start)

	const [publicationName, setPublicationName] = useState('')
	const [publicationUrl, setPublicationUrl] = useState('')
	const [isClubMembersOnly, setIsClubMembersOnly] = useState(false)

	// Is this extension enabled?
	const [isExtensionEnabled, setIsExtensionEnabled] = useState(true)

	const [hasOpenedClubTreasury, setHasOpenedClubTreasury] = useState(false)

	// const saveExtension = async (isPublic: boolean) => {
	// 	log.debug('saving extension')
	// 	try {
	// 		const postData = `${
	// 			process.env.NEXT_PUBLIC_API_URL
	// 		}${MeemAPI.v1.CreateOrUpdateAgreementExtension.path({
	// 			agreementId: club.id ?? '',
	// 			integrationId: extension?.extensionId ?? ''
	// 		})}`
	// 		const data = {
	// 			isEnabled: isExtensionEnabled,
	// 			isPublic,
	// 			metadata: {
	// 				externalUrl: `https://paragraph.xyz/@${publicationUrl}`,
	// 				publicationSlug: publicationUrl,
	// 				publicationName
	// 			}
	// 		}
	// 		log.debug(JSON.stringify(postData))
	// 		log.debug(JSON.stringify(data))
	// 		await request
	// 			.post(postData)
	// 			.set('Authorization', `JWT ${wallet.jwt}`)
	// 			.send(data)

	// 		setStep(Step.Success)
	// 	} catch (e) {
	// 		log.debug(e)
	// 		showNotification({
	// 			title: 'Something went wrong',
	// 			autoClose: 5000,
	// 			color: colorPink,
	// 			icon: <AlertCircle />,
	// 			message: `Please check that all fields are complete and try again.`
	// 		})
	// 		setStep(Step.Start)
	// 		return
	// 	}
	// }

	const showParagraphPopup = () => {
		let url = `https://paragraph.xyz/link?publicationName=${encodeURIComponent(
			publicationName
		)}&publicationUrl=${publicationUrl}`

		if (isClubMembersOnly) {
			log.debug('set additional properties for members-only pub')
			const communityName = encodeURIComponent(`${club.name} Members`)
			const clubUrl = encodeURIComponent(
				`https://clubs.link/${club.slug}`
			)
			const membershipName = encodeURIComponent(`${club.name} Token`)
			url = `https://paragraph.xyz/link?publicationName=${encodeURIComponent(
				publicationName
			)}&publicationUrl=${publicationUrl}&tokenAddress=${
				club.address
			}&communityName=${communityName}&tokenUrl=${clubUrl}&membershipName=${membershipName}`
		}

		log.debug(`launching paragraph modal with url: ${url}`)

		const popup = window.open(url)

		if (popup) {
			const listener = function (e: any) {
				// Wait for Paragraph to signal that it's loaded.
				if (e.data === 'loaded') {
					// Send the 'init' message. This is required.
					popup.postMessage('init', 'https://paragraph.xyz')

					// When the Papragraph flow completes, we'll broadcast
					// this message.
				} else if (e.data === 'updated') {
					window.removeEventListener('message', listener)
					popup.close()
					setStep(Step.SavingExtension)
					//saveExtension(!isClubMembersOnly)
				}
			}
			window.addEventListener('message', listener)
		}
	}

	useEffect(() => {
		// Used when we want to show extension settings after being saved
		if (extension && extension.publicationSlug) {
			setIsExtensionEnabled(extension.isEnabled ?? false)
		}
	}, [extension, isClubMembersOnly])

	return (
		<>
			<Modal
				centered
				closeOnClickOutside={false}
				closeOnEscape={false}
				withCloseButton={
					step !== Step.Transaction && step != Step.SavingExtension
				}
				radius={16}
				size={'50%'}
				padding={'sm'}
				opened={isOpened}
				title={
					<Text className={clubsTheme.tMediumBold}>
						{extension && extension.publicationSlug
							? 'Edit Paragraph settings'
							: 'Create a Paragraph Publication'}
					</Text>
				}
				onClose={() => {
					if (step === Step.Success) {
						onComplete(
							publicationUrl,
							publicationName,
							isExtensionEnabled
						)
					}
					onModalClosed()
				}}
			>
				<Divider />

				<Space h={24} />

				<div className={clubsTheme.modalStepsContainer}>
					{extension && extension.publicationSlug && (
						<>
							<>
								<Space h={16} />
								<Switch
									checked={isExtensionEnabled}
									onChange={event =>
										setIsExtensionEnabled(
											event.currentTarget.checked
										)
									}
									label="Paragraph enabled for your club"
								/>
								<Space h={16} />

								<Button
									onClick={async () => {
										// Save the extension
										// saveExtension(
										// 	extension.isPublic ?? true
										// )
										// Update the local extension
										onComplete(
											publicationUrl,
											publicationName,
											isExtensionEnabled
										)
										// Close our modal
										onModalClosed()
									}}
									className={clubsTheme.buttonBlack}
								>
									Save
								</Button>
							</>
						</>
					)}
					{extension && !extension.publicationSlug && (
						<>
							{step === Step.Start && (
								<>
									<Text
										className={clubsTheme.tMediumBold}
									>{`What's your Publication called?`}</Text>
									<Space h={2} />
									<Text className={clubsTheme.tExtraSmall}>
										Catchy names are the best.
									</Text>
									<Space h={16} />

									<TextInput
										radius="lg"
										size="md"
										value={publicationName}
										onChange={event =>
											setPublicationName(
												event.currentTarget.value
											)
										}
									/>
									<Space h={24} />

									<Text
										className={clubsTheme.tMediumBold}
									>{`Your visitors can find your publication at this URL.`}</Text>
									<Space h={2} />

									<Text className={clubsTheme.tExtraSmall}>
										Your visitors can find your publication
										at this URL.
									</Text>
									<Space h={16} />

									<div style={{ position: 'relative' }}>
										<div>
											<TextInput
												classNames={{
													input: clubsTheme.paragraphIntTextInput
												}}
												radius="lg"
												size="md"
												value={publicationUrl}
												onChange={event => {
													setPublicationUrl(
														event.target.value
															.replaceAll(
																' ',
																'-'
															)
															.toLowerCase()
													)
												}}
											/>
										</div>
										<Text
											style={{
												position: 'absolute',
												top: 12,
												left: 12,
												color: colorGrey
											}}
										>{`paragraph.xyz/@`}</Text>
									</div>
									<Space h={24} />

									<Text
										className={clubsTheme.tMediumBold}
									>{`Who can read your publication?`}</Text>
									<Space h={2} />

									<Radio.Group
										classNames={{
											label: clubsTheme.fRadio
										}}
										orientation="vertical"
										spacing={10}
										size="md"
										color="dark"
										value={
											isClubMembersOnly
												? 'members'
												: 'anyone'
										}
										onChange={(value: any) => {
											switch (value) {
												case 'members':
													setIsClubMembersOnly(true)
													break
												case 'anyone':
													setIsClubMembersOnly(false)
													break
											}
										}}
										required
									>
										<Radio
											value="members"
											label="Club members"
										/>
										<Radio value="anyone" label="Anyone" />
									</Radio.Group>
									<Space h={32} />

									<Button
										disabled={
											publicationName.length === 0 ||
											publicationName.length > 50 ||
											publicationUrl.length === 0 ||
											publicationUrl.length > 30
										}
										onClick={async () => {
											setStep(Step.OpenGnosis)
										}}
										className={clubsTheme.buttonBlack}
									>
										Create
									</Button>
								</>
							)}
							{step === Step.OpenGnosis && (
								<>
									<Space h={16} />

									<Text className={clubsTheme.tMediumBold}>
										{`Let's connect your club's treasury.`}
									</Text>
									<Space h={16} />
									<Text className={clubsTheme.tSmall}>
										{`You'll need to sign a transaction on behalf of your club's treasury in the next step. Leave the tab open for now - we'll come back in a moment.`}
									</Text>
									<Space h={24} />
									{!hasOpenedClubTreasury && (
										<Button
											onClick={() => {
												setHasOpenedClubTreasury(true)
												window.open(
													`https://gnosis-safe.io/app/${
														process.env
															.NEXT_PUBLIC_CHAIN_ID ===
														'4'
															? 'rin'
															: 'matic'
													}:${
														club.gnosisSafeAddress
													}/apps?appUrl=https://apps.gnosis-safe.io/wallet-connect`
												)
												window.focus()
											}}
											className={clubsTheme.buttonBlack}
										>
											Open Treasury
										</Button>
									)}
									{hasOpenedClubTreasury && (
										<Button
											onClick={() => {
												setStep(Step.Transaction)
												showParagraphPopup()
											}}
											className={clubsTheme.buttonBlack}
										>
											Continue
										</Button>
									)}
									<Space h={16} />
								</>
							)}
							{step === Step.Transaction && (
								<>
									<Space h={16} />
									<Text className={clubsTheme.tMediumBold}>
										{`Connect to club treasury and sign`}
									</Text>
									<Space h={16} />
									<Text className={clubsTheme.tSmall}>
										{`Your Paragraph publication belongs to your club. In the window we just opened for you, click 'Connect wallet', scroll down and choose 'WalletConnect', then click 'copy to clipboard'. In the Gnosis Safe tab, paste into the field 'QR Code or connection link'.`}
									</Text>
									<Space h={16} />
									<Text className={clubsTheme.tSmall}>
										{`Next, sign the transaction that appears in your Gnosis Safe, then return to the Clubs tab to continue.`}
									</Text>
									<Space h={24} />
									<Center>
										<Loader variant="oval" color="red" />
									</Center>
									<Space h={16} />
								</>
							)}
							{step === Step.SavingExtension && (
								<>
									<Space h={16} />
									<Center>
										<Loader variant="oval" color="red" />
									</Center>
									<Space h={16} />
								</>
							)}
							{step === Step.Success && (
								<>
									<Space h={16} />

									<Center>
										<Image
											src="/extension-paragraph.png"
											height={40}
											width={40}
										/>
									</Center>
									<Space h={16} />
									<Center>
										<Text
											className={clubsTheme.tLargeBold}
											style={{ color: colorGreen }}
										>
											Success!
										</Text>
									</Center>
									<Space h={16} />

									<Text
										className={clubsTheme.centered}
										style={{ lineHeight: 1.4 }}
									>
										{`Your club's Paragraph publication has been
								created.`}
									</Text>
									<Space h={16} />

									<Center>
										<Button
											onClick={async () => {
												window.open(
													'https://paragraph.xyz'
												)
											}}
											className={clubsTheme.buttonBlack}
										>
											Launch Paragraph
										</Button>
									</Center>
									<Space h={16} />
								</>
							)}
						</>
					)}
				</div>
			</Modal>
		</>
	)
}