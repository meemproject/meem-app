/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import log from '@kengoldfarb/log'
import {
	createStyles,
	Text,
	Space,
	Modal,
	Divider,
	Stepper,
	MantineProvider,
	TextInput,
	Radio,
	Button,
	Loader,
	Center,
	Image,
	Switch
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { MeemAPI } from '@meemproject/api'
import { useWallet } from '@meemproject/react'
// eslint-disable-next-line import/no-extraneous-dependencies
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import request from 'superagent'
import { AlertCircle, Check } from 'tabler-icons-react'
import twitterIntent from 'twitter-intent'
import { Club, Integration } from '../../../model/club/club'

const useStyles = createStyles(theme => ({
	header: {
		display: 'flex',
		alignItems: 'start',
		flexDirection: 'row',
		paddingTop: 8,
		paddingBottom: 8,
		position: 'relative'
	},
	modalTitle: {
		fontWeight: 600,
		fontSize: 18
	},
	headerTitle: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row'
	},
	headerClubName: {
		fontSize: 16,
		marginLeft: 16
	},
	clubLogoImage: {
		imageRendering: 'pixelated',
		width: 40,
		height: 40,
		minHeight: 40,
		minWidth: 40
	},
	stepsContainer: {
		border: '1px solid rgba(204, 204, 204, 1)',
		borderRadius: 16,
		padding: 16
	},
	buttonConfirm: {
		paddingTop: 8,
		paddingLeft: 16,
		paddingBottom: 8,
		paddingRight: 16,
		color: 'white',
		backgroundColor: 'black',
		cursor: 'pointer',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 24
	},
	title: { fontWeight: 600, fontSize: 18 },
	description: {
		fontSize: 14
	},
	currentTwitterVerification: {
		fontWeight: 600
	},
	isVerifiedSection: {
		paddingLeft: 8,
		paddingRight: 8
	},
	namespaceTextInputContainer: {
		position: 'relative'
	},
	namespaceTextInput: {
		paddingLeft: 153,
		paddingBottom: 3
	},
	namespaceTextInputUrlPrefix: {
		position: 'absolute',
		top: 8,
		left: 24,
		color: 'rgba(0, 0, 0, 0.5)'
	},
	clubNamespaceHint: {
		paddingLeft: 0,
		paddingBottom: 16,
		color: 'rgba(0, 0, 0, 0.5)'
	},
	radio: { fontWeight: 600, fontFamily: 'Inter' },
	successText: {
		fontWeight: 600,
		fontSize: 22,
		color: 'rgba(29, 173, 78, 1)'
	},
	successInfo: { textAlign: 'center' },
	paragraphFrame: { width: '100%', height: 200 }
}))

interface IProps {
	club: Club
	integration?: Integration
	isOpened: boolean
	onModalClosed: () => void
	onComplete: (slug: string, name: string, isEnabled: boolean) => void
}

enum Step {
	Start,
	OpenGnosis,
	Transaction,
	SavingIntegration,
	Success
}

export const ClubAdminParagraphIntegrationModal: React.FC<IProps> = ({
	club,
	integration,
	isOpened,
	onModalClosed,
	onComplete
}) => {
	const router = useRouter()

	const wallet = useWallet()

	const { classes } = useStyles()

	const [step, setStep] = useState<Step>(Step.Start)

	const [publicationName, setPublicationName] = useState('')
	const [publicationUrl, setPublicationUrl] = useState('')
	const [isClubMembersOnly, setIsClubMembersOnly] = useState(false)

	// The url with appropriate encoded params to send to paragraph
	const [paragraphIframeUrl, setParagraphIframeUrl] = useState('')
	const [hasAddedWindowListener, setHasAddedWindowListener] = useState(false)

	// Data received back from paragraph
	const [createdPublicationSlug, setCreatedPublicationSlug] = useState('')

	// Is this integration enabled?
	const [isIntegrationEnabled, setIsIntegrationEnabled] = useState(true)

	const [hasOpenedClubTreasury, setHasOpenedClubTreasury] = useState(false)

	const saveIntegration = async (isPublic: boolean) => {
		log.debug('saving integration')
		try {
			const postData = `${
				process.env.NEXT_PUBLIC_API_URL
			}${MeemAPI.v1.CreateOrUpdateMeemContractIntegration.path({
				meemContractId: club.id ?? '',
				integrationId: integration?.integrationId ?? ''
			})}`
			const data = {
				isEnabled: isIntegrationEnabled,
				isPublic,
				metadata: {
					externalUrl: `https://paragraph.xyz/@${publicationUrl}`,
					publicationSlug: publicationUrl,
					publicationName
				}
			}
			log.debug(JSON.stringify(postData))
			log.debug(JSON.stringify(data))
			await request
				.post(postData)
				.set('Authorization', `JWT ${wallet.jwt}`)
				.send(data)

			setStep(Step.Success)
		} catch (e) {
			log.debug(e)
			showNotification({
				title: 'Something went wrong',
				autoClose: 5000,
				color: 'red',
				icon: <AlertCircle />,
				message: `Please check that all fields are complete and try again.`
			})
			setStep(Step.Start)
			return
		}
	}

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
					setStep(Step.SavingIntegration)
					setCreatedPublicationSlug(`@${publicationUrl}`)
					saveIntegration(!isClubMembersOnly)
				}
			}
			window.addEventListener('message', listener)
		}
	}

	useEffect(() => {
		// Used when we want to show integration settings after being saved
		if (integration && integration.publicationSlug) {
			setCreatedPublicationSlug(integration.publicationSlug)
			setIsIntegrationEnabled(integration.isEnabled ?? false)
		}
	}, [hasAddedWindowListener, integration, isClubMembersOnly])

	return (
		<>
			<Modal
				centered
				closeOnClickOutside={false}
				closeOnEscape={false}
				withCloseButton={
					step !== Step.Transaction && step != Step.SavingIntegration
				}
				radius={16}
				size={'50%'}
				padding={'sm'}
				opened={isOpened}
				title={
					<Text className={classes.modalTitle}>
						{integration && integration.publicationSlug
							? 'Edit Paragraph settings'
							: 'Create a Paragraph Publication'}
					</Text>
				}
				onClose={() => {
					if (step === Step.Success) {
						onComplete(
							publicationUrl,
							publicationName,
							isIntegrationEnabled
						)
					}
					onModalClosed()
				}}
			>
				<Divider />

				<Space h={24} />

				<div className={classes.stepsContainer}>
					{integration && integration.publicationSlug && (
						<>
							<>
								<Space h={16} />
								<Switch
									checked={isIntegrationEnabled}
									onChange={event =>
										setIsIntegrationEnabled(
											event.currentTarget.checked
										)
									}
									label="Paragraph enabled for your club"
								/>
								<Space h={16} />

								<Button
									onClick={async () => {
										// Save the integration
										saveIntegration(
											integration.isPublic ?? true
										)
										// Update the local integration
										onComplete(
											publicationUrl,
											publicationName,
											isIntegrationEnabled
										)
										// Close our modal
										onModalClosed()
									}}
									className={classes.buttonConfirm}
								>
									Save
								</Button>
							</>
						</>
					)}
					{integration && !integration.publicationSlug && (
						<>
							{step === Step.Start && (
								<>
									<Text
										className={classes.title}
									>{`What's your Publication called?`}</Text>
									<Space h={2} />
									<Text className={classes.description}>
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
										className={classes.title}
									>{`Your visitors can find your publication at this URL.`}</Text>
									<Space h={2} />

									<Text className={classes.description}>
										Your visitors can find your publication
										at this URL.
									</Text>
									<Space h={16} />

									<div
										className={
											classes.namespaceTextInputContainer
										}
									>
										<TextInput
											classNames={{
												input: classes.namespaceTextInput
											}}
											radius="lg"
											size="md"
											value={publicationUrl}
											onChange={event => {
												setPublicationUrl(
													event.target.value
														.replaceAll(' ', '-')
														.toLowerCase()
												)
											}}
										/>
										<Text
											className={
												classes.namespaceTextInputUrlPrefix
											}
										>{`paragraph.xyz/@`}</Text>
									</div>
									<Space h={24} />

									<Text
										className={classes.title}
									>{`Who can read your publication?`}</Text>
									<Space h={2} />

									<Radio.Group
										classNames={{ label: classes.radio }}
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
										className={classes.buttonConfirm}
									>
										Create
									</Button>
								</>
							)}
							{step === Step.OpenGnosis && (
								<>
									<Space h={16} />

									<Text className={classes.title}>
										{`Let's connect your club's treasury.`}
									</Text>
									<Space h={12} />
									<Text>
										{`You'll need to sign a transaction on behalf of your club's treasury in the next step. Leave the tab open for now - we'll come back in a moment.`}
									</Text>
									<Space h={16} />
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
											className={classes.buttonConfirm}
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
											className={classes.buttonConfirm}
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
									<Text className={classes.title}>
										{`Connect to club treasury and sign`}
									</Text>
									<Space h={12} />
									<Text>
										{`Your Paragraph publication belongs to your club. In the window we just opened for you, click 'Connect wallet', scroll down and choose 'WalletConnect', then click 'copy to clipboard'. In the Gnosis Safe tab, paste into the field 'QR Code or connection link'.`}
									</Text>
									<Space h={12} />
									<Text>
										{`Next, sign the transaction that appears in your Gnosis Safe, then return to the Clubs tab to continue.`}
									</Text>
									<Space h={24} />
									<Center>
										<Loader variant="oval" color="red" />
									</Center>
									<Space h={16} />
								</>
							)}
							{step === Step.SavingIntegration && (
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
											src="/integration-paragraph.png"
											height={40}
											width={40}
										/>
									</Center>
									<Space h={16} />
									<Center>
										<Text className={classes.successText}>
											Success!
										</Text>
									</Center>
									<Space h={16} />

									<Text className={classes.successInfo}>
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
											className={classes.buttonConfirm}
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
