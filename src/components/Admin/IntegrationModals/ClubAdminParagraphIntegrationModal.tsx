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
	RadioGroup,
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
		paddingLeft: 154,
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
	successText: { fontWeight: 600, color: 'rgba(29, 173, 78, 1)' }
}))

interface IProps {
	club: Club
	integration?: Integration
	isOpened: boolean
	onModalClosed: () => void
	onComplete: (slug: string, isEnabled: boolean) => void
}

enum Step {
	Start,
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
	const [isIntegrationEnabled, setIsIntegrationEnabled] = useState(false)

	const submitToParagraph = () => {
		// TODO: Assemble the correct URL
		const url = 'https://paragraph.xyz'
		setParagraphIframeUrl(url)

		// Show iFrame step - paragraph will handle the rest
		setStep(Step.Transaction)
	}

	const saveIntegration = useCallback(
		async (isPublic: boolean) => {
			setStep(Step.SavingIntegration)
			try {
				const jwtToken = Cookies.get('meemJwtToken')
				const { body } = await request
					.post(
						`${
							process.env.NEXT_PUBLIC_API_URL
						}${MeemAPI.v1.CreateOrUpdateMeemContractIntegration.path(
							{
								meemContractId: club.id ?? '',
								integrationId: integration?.integrationId ?? ''
							}
						)}`
					)
					.set('Authorization', `JWT ${jwtToken}`)
					.send({
						isEnabled: isIntegrationEnabled,
						isPublic,
						metadata: {
							// TODO: Make sure this URL is correct
							externalUrl: `https://paragraph.xyz/${createdPublicationSlug}`,
							paragraphSlug: createdPublicationSlug
						}
					})
				log.debug(body)
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
		},
		[
			club.id,
			createdPublicationSlug,
			integration?.integrationId,
			isIntegrationEnabled
		]
	)

	useEffect(() => {
		// Listen out for changes from the Paragraph iFrame
		if (!hasAddedWindowListener) {
			setHasAddedWindowListener(true)
			log.debug('Paragraph modal is listening for data from Paragraph...')
			window.addEventListener(
				'message',
				(ev: MessageEvent<{ type: string; message: string }>) => {
					log.debug(ev)
					log.debug(ev.data)

					// TODO: handle message data
					setCreatedPublicationSlug('publication-slug')
					saveIntegration(true)
				}
			)
		}

		// Used when we want to show integration settings after being saved
		if (integration && integration.paragraphSlug) {
			setCreatedPublicationSlug(integration.paragraphSlug)
		}
	}, [
		hasAddedWindowListener,
		integration,
		isClubMembersOnly,
		saveIntegration
	])

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
				padding={'sm'}
				opened={isOpened}
				title={
					<Text className={classes.modalTitle}>
						Create a Paragraph Publication
					</Text>
				}
				onClose={() => {
					if (step === Step.Success) {
						onComplete(createdPublicationSlug, isIntegrationEnabled)
					}
					onModalClosed()
				}}
			>
				<Divider />

				<Space h={24} />

				<div className={classes.stepsContainer}>
					{integration && integration.paragraphSlug && (
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
									label="Enable app"
								/>
								<Button
									onClick={async () => {
										// Save the integration
										saveIntegration(
											integration.isPublic ?? true
										)
										// Update the local integration
										onComplete(
											createdPublicationSlug,
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
					{integration && !integration.paragraphSlug && (
						<>
							{step === Step.Start && (
								<>
									<Text
										className={classes.title}
									>{`What's your Publication called?`}</Text>
									<Text>Catchy names are the best.</Text>
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
									<Text
										className={classes.title}
									>{`Your visitors can find your publication at this URL.`}</Text>
									<Text>Catchy names are the best.</Text>
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
														.replaceAll(' ', '')
														.toLowerCase()
												)
											}}
										/>
										<Text
											className={
												classes.namespaceTextInputUrlPrefix
											}
										>{`paragraph.xyz/`}</Text>
									</div>
									<Text
										className={classes.title}
									>{`Who can read your publication?`}</Text>
									<RadioGroup
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
										onChange={value => {
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
										<Button
											disabled={
												publicationName.length === 0 ||
												publicationName.length > 50 ||
												publicationUrl.length === 0 ||
												publicationUrl.length > 30
											}
											onClick={async () => {
												submitToParagraph()
											}}
											className={classes.buttonConfirm}
										>
											Create
										</Button>
									</RadioGroup>
								</>
							)}
							{step === Step.Transaction && (
								<>
									<iframe src={paragraphIframeUrl} />
								</>
							)}
							{step === Step.SavingIntegration && (
								<>
									<Center>
										<Loader />
									</Center>
								</>
							)}
							{step === Step.Success && (
								<>
									<Image src="/integration-paragraph.png" />
									<Text className={classes.successText}>
										Success!
									</Text>
									<Text>
										{`Your club's Paragraph publication has been
								created.`}
									</Text>
									<Button
										onClick={async () => {
											// TODO: open paragraph publication editor
											window.open('https://paragraph.xyz')
										}}
										className={classes.buttonConfirm}
									>
										Launch Paragraph
									</Button>
								</>
							)}
						</>
					)}
				</div>
			</Modal>
		</>
	)
}
