import log from '@kengoldfarb/log'
import {
	Text,
	Space,
	Modal,
	Divider,
	Stepper,
	MantineProvider,
	TextInput,
	Button
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { MeemAPI } from '@meemproject/api'
import { useWallet } from '@meemproject/react'
import React, { useState } from 'react'
import request from 'superagent'
import { AlertCircle } from 'tabler-icons-react'
import { Identity } from '../../../../model/identity/identity'
import { colorPink, useClubsTheme } from '../../../Styles/ClubsTheme'
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
	const { classes: clubsTheme } = useClubsTheme()

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
				color: colorPink,
				icon: <AlertCircle />,
				message: `Please make sure your email address exists and try again.`
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
					<Text className={clubsTheme.tMediumBold}>
						Connect your Email Address
					</Text>
				}
				onClose={() => {
					onModalClosed()
					setStep(Step.Start)
				}}
			>
				<Divider color={colorLightGrey} />

				<Space h={24} />

				<div className={clubsTheme.modalStepsContainer}>
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
															clubsTheme.tExtraSmall
														}
													>
														{`We'll send you a
														verification link to
														confirm your identity.`}
													</Text>
													<Space h={4} />

													<TextInput
														value={emailAddress}
														radius={16}
														onChange={event => {
															setEmailAddress(
																event.target
																	.value
															)
														}}
													/>
													<Space h={24} />

													<Button
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
															clubsTheme.buttonBlack
														}
													>
														Confirm
													</Button>
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
											className={clubsTheme.tExtraSmall}
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
														clubsTheme.tExtraSmall
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
														clubsTheme.buttonBlack
													}
												>
													Launch Email App
												</a> */}

												<Space h={8} />
												<Text
													onClick={() => {
														sendVerificationLink()
													}}
													className={clubsTheme.tLink}
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
