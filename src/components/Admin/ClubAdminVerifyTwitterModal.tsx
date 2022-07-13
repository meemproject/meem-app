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
	TextInput
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { MeemAPI } from '@meemproject/api'
import { useWallet } from '@meemproject/react'
// eslint-disable-next-line import/no-extraneous-dependencies
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import request from 'superagent'
import { AlertCircle, Check } from 'tabler-icons-react'
import twitterIntent from 'twitter-intent'
import { Club, Integration } from '../../model/club/club'

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
	currentTwitterVerification: {
		fontWeight: 600
	},
	isVerifiedSection: {
		paddingLeft: 8,
		paddingRight: 8
	}
}))

interface IProps {
	club: Club
	integration?: Integration
	isOpened: boolean
	onModalClosed: () => void
	onSuccessfulVerification: () => void
}

enum Step {
	Start,
	Share,
	Verify,
	Verifying
}

export const ClubAdminVerifyTwitterModal: React.FC<IProps> = ({
	club,
	integration,
	isOpened,
	onModalClosed,
	onSuccessfulVerification
}) => {
	const router = useRouter()

	const wallet = useWallet()

	const { classes } = useStyles()

	const [step, setStep] = useState<Step>(Step.Start)

	const [twitterUsername, setTwitterUsername] = useState('')

	const verifyTweet = async () => {
		setStep(Step.Verifying)

		// Save the change to the db
		try {
			const jwtToken = Cookies.get('meemJwtToken')
			const { body } = await request
				.post(
					`${
						process.env.NEXT_PUBLIC_API_URL
					}${MeemAPI.v1.CreateOrUpdateMeemContractIntegration.path({
						meemContractId: club.id ?? '',
						integrationId: integration?.integrationId ?? ''
					})}`
				)
				.set('Authorization', `JWT ${jwtToken}`)
				.send({
					isEnabled: true,
					isPublic: true,
					metadata: {
						externalUrl: integration?.integrationId,
						twitterUsername
					}
				})
			log.debug(body)
			showNotification({
				title: 'Success!',
				autoClose: 5000,
				color: 'green',
				icon: <Check color="green" />,

				message: `Your club is now verified.`
			})
			onSuccessfulVerification()
			onModalClosed()
		} catch (e) {
			log.debug(e)
			showNotification({
				title: 'Verification failed',
				autoClose: 5000,
				color: 'red',
				icon: <AlertCircle />,
				message: `Please make sure your tweet was public and try again.`
			})
			setStep(Step.Verify)
			return
		}
	}
	return (
		<>
			<Modal
				centered
				closeOnClickOutside={false}
				closeOnEscape={false}
				withCloseButton={step !== Step.Verifying}
				radius={16}
				padding={'sm'}
				opened={isOpened}
				title={
					<Text className={classes.modalTitle}>
						Verify with Twitter
					</Text>
				}
				onClose={() => {
					onModalClosed()
					setStep(Step.Start)
				}}
			>
				<Divider />

				{integration && integration.isVerified && (
					<div className={classes.isVerifiedSection}>
						<Space h={24} />

						<Text size={'sm'}>
							This club is currently verified with{' '}
							<a
								onClick={() => {
									window.open(
										`https://twitter.com/${integration.verifiedTwitterUser}`
									)
								}}
							>
								<span
									className={
										classes.currentTwitterVerification
									}
								>
									{integration.verifiedTwitterUser}
								</span>
							</a>{' '}
							on Twitter.
						</Text>
						<Space h={16} />

						<Text size={'sm'}>
							Use the steps below to verify with a different
							Twitter account.
						</Text>
					</div>
				)}

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
									: step === Step.Share
									? 1
									: 2
							}
						>
							<Stepper.Step
								label="What's your Club's Twitter username?"
								description={
									step !== Step.Start &&
									step !== Step.Share ? null : (
										<>
											{step === Step.Start && (
												<div>
													<Text
														className={
															classes.stepDescription
														}
													>
														You’ll need access to
														this Twitter account to
														verify.
													</Text>
													<Space h={4} />

													<TextInput
														value={twitterUsername}
														onChange={event => {
															setTwitterUsername(
																event.target
																	.value
															)
														}}
													/>
													<Space h={24} />

													<a
														onClick={() => {
															if (
																twitterUsername.length ===
																	0 ||
																twitterUsername.length >
																	15
															) {
																showNotification(
																	{
																		title: 'Oops!',
																		message:
																			'That Twitter username is invalid.'
																	}
																)
															}
															setStep(Step.Share)
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
								label="Share a public post"
								description={
									step !== Step.Share ? (
										<Text
											className={classes.stepDescription}
										>
											Make a post to verify your identity
										</Text>
									) : (
										<>
											<div>
												<Text
													className={
														classes.stepDescription
													}
												>
													Make a post to verify your
													identity
												</Text>
												<Space h={24} />

												<a
													onClick={() => {
														// Generate intent
														const href =
															twitterIntent.tweet.url(
																{
																	text: `Verifying that this is the official Twitter account of ${
																		club.name ??
																		''
																	}!`,
																	url: `${
																		window
																			.location
																			.origin
																	}/${
																		club.slug ??
																		''
																	}`
																}
															)

														// Open it
														window.open(href)
														setStep(Step.Verify)
													}}
													className={
														classes.buttonConfirm
													}
												>
													Post on Twitter
												</a>
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
										<Text
											className={classes.stepDescription}
										>
											Complete your verification.
										</Text>
									) : (
										<>
											{step === Step.Verifying && (
												<>
													<Text
														className={
															classes.stepDescription
														}
													>
														Please wait...
													</Text>
												</>
											)}
											{step !== Step.Verifying && (
												<>
													<div>
														<Text
															className={
																classes.stepDescription
															}
														>
															Complete your
															verification.
														</Text>
														<Space h={24} />

														<a
															onClick={
																verifyTweet
															}
															className={
																classes.buttonConfirm
															}
														>
															Verify Tweet
														</a>
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
			</Modal>
		</>
	)
}
