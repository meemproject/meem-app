import log from '@kengoldfarb/log'
import {
	createStyles,
	Text,
	Space,
	Modal,
	Divider,
	Stepper,
	MantineProvider,
	TextInput
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { MeemAPI } from '@meemproject/api'
import { useWallet } from '@meemproject/react'
import React, { useState } from 'react'
import request from 'superagent'
import { AlertCircle } from 'tabler-icons-react'
import { Identity } from '../../../../model/identity/identity'

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
	stepDescription: {
		fontSize: 14
	},
	newEmailLink: {
		fontSize: 14,
		textDecoration: 'underline',
		cursor: 'pointer'
	},
	currentTwitterVerification: {
		fontWeight: 600
	},
	isVerifiedSection: {
		paddingLeft: 8,
		paddingRight: 8
	}
}))

interface IProps {
	identity: Identity
	isOpened: boolean
	onModalClosed: () => void
	integrationId?: string
}

enum Step {
	Start,
	SendEmail
}

export const ProfileLinkEmailModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed,
	integrationId
}) => {
	const { classes } = useStyles()

	const [step, setStep] = useState<Step>(Step.Start)

	const [isLoading, setIsLoading] = useState(false)

	const wallet = useWallet()

	const [emailAddress, setEmailAddress] = useState('')

	const sendVerificationLink = async () => {
		try {
			setIsLoading(true)
			await request
				.post(
					`${
						process.env.NEXT_PUBLIC_API_URL
					}${MeemAPI.v1.CreateOrUpdateMeemIdIntegration.path({
						integrationId: integrationId ?? ''
					})}`
				)
				.set('Authorization', `JWT ${wallet.jwt}`)
				.send({
					visibility: 'mutual-club-members',
					metadata: {
						email: emailAddress
					}
				})
			setIsLoading(false)
			setStep(Step.SendEmail)
		} catch (e) {
			log.debug(e)
			showNotification({
				title: 'Verification failed',
				autoClose: 5000,
				color: 'red',
				icon: <AlertCircle />,
				message: `Please make sure your tweet was public and try again.`
			})
			setIsLoading(false)
			setStep(Step.Start)
			return
		}
	}

	// TODO: Listen out for successful verification (subscription to identity?)

	return (
		<>
			<Modal
				centered
				closeOnClickOutside={false}
				closeOnEscape={false}
				radius={16}
				size={'50%'}
				overlayBlur={8}
				padding={'sm'}
				opened={isOpened}
				title={
					<Text className={classes.modalTitle}>
						Connect your Email Address
					</Text>
				}
				onClose={() => {
					onModalClosed()
					setStep(Step.Start)
				}}
			>
				<Divider />

				<Space h={24} />

				<div className={classes.stepsContainer}>
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
									: step === Step.SendEmail
									? 1
									: 2
							}
						>
							<Stepper.Step
								loading={isLoading}
								label="What's your email address?"
								description={
									step !== Step.Start &&
									step !== Step.SendEmail ? null : (
										<>
											{step === Step.Start && (
												<div>
													<Text
														className={
															classes.stepDescription
														}
													>
														{`We'll send you a
														verification link to
														confirm your identity.`}
													</Text>
													<Space h={4} />

													<TextInput
														value={emailAddress}
														onChange={event => {
															setEmailAddress(
																event.target
																	.value
															)
														}}
													/>
													<Space h={24} />

													<a
														onClick={() => {
															if (
																emailAddress.length ===
																	0 ||
																emailAddress.length >
																	50 ||
																!emailAddress.includes(
																	'@'
																)
															) {
																showNotification(
																	{
																		title: 'Oops!',
																		message:
																			'That email address is invalid.'
																	}
																)
															}

															setIsLoading(true)
															sendVerificationLink()
														}}
														className={
															classes.buttonConfirm
														}
													>
														Confirm
													</a>
												</div>
											)}
										</>
									)
								}
							/>
							<Stepper.Step
								label="Tap the link in the verification email we just sent."
								description={
									step !== Step.SendEmail ? (
										<Text
											className={classes.stepDescription}
										>
											A verification email should be
											arriving in your inbox within five
											minutes. Please check your spam and
											trash folders if you don’t see it.
										</Text>
									) : (
										<>
											<div>
												<Text
													className={
														classes.stepDescription
													}
												>
													A verification email should
													be arriving in your inbox
													within five minutes. Please
													check your spam and trash
													folders if you don’t see it.
												</Text>
												{/* <Space h={24} />

												<a
													onClick={() => {
														// TODO: Launch email app
													}}
													className={
														classes.buttonConfirm
													}
												>
													Launch Email App
												</a> */}

												<Space h={8} />
												<Text
													onClick={() => {
														sendVerificationLink()
													}}
													className={
														classes.newEmailLink
													}
												>
													{`Didn't receive an email? Send a new link`}
												</Text>
											</div>
										</>
									)
								}
							/>
						</Stepper>
					</MantineProvider>
				</div>
			</Modal>
		</>
	)
}
