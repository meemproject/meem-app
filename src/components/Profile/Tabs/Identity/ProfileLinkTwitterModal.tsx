import log from '@kengoldfarb/log'
import {
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
import { AlertCircle, Check } from 'tabler-icons-react'
import twitterIntent from 'twitter-intent'
import { AvailableIdentityIntegration } from '../../../../model/identity/identity'
import { useGlobalStyles } from '../../../Styles/GlobalStyles'
interface IProps {
	integration?: AvailableIdentityIntegration
	isOpened: boolean
	onModalClosed: () => void
}

enum Step {
	Start,
	Share,
	Verify,
	Verifying
}

export const ProfileLinkTwitterModal: React.FC<IProps> = ({
	isOpened,
	integration,
	onModalClosed
}) => {
	const { classes: design } = useGlobalStyles()
	const wallet = useWallet()

	const [step, setStep] = useState<Step>(Step.Start)

	const [twitterUsername, setTwitterUsername] = useState('')

	const verifyTweet = async () => {
		setStep(Step.Verifying)

		log.debug(`integration id to enable: ${integration?.id}`)

		// Save the change to the db
		try {
			await request
				.post(
					`${
						process.env.NEXT_PUBLIC_API_URL
					}${MeemAPI.v1.CreateOrUpdateMeemIdIntegration.path({
						integrationId: integration?.id ?? ''
					})}`
				)
				.set('Authorization', `JWT ${wallet.jwt}`)
				.send({
					visibility: 'mutual-club-members',
					metadata: {
						twitterUsername
					}
				})
			showNotification({
				title: 'Success!',
				autoClose: 5000,
				color: 'green',
				icon: <Check color="green" />,
				message: `This Twitter account is now linked!`
			})
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
				size={'50%'}
				overlayBlur={8}
				padding={'sm'}
				opened={isOpened}
				title={
					<Text className={design.tMediumBold}>
						Connect your Twitter account
					</Text>
				}
				onClose={() => {
					onModalClosed()
					setStep(Step.Start)
				}}
			>
				<Divider />

				<Space h={24} />

				<div className={design.modalStepsContainer}>
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
								label="What's your Twitter username?"
								description={
									step !== Step.Start &&
									step !== Step.Share ? null : (
										<>
											{step === Step.Start && (
												<div>
													<Text
														className={
															design.tExtraSmall
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
																return
															}
															setStep(Step.Share)
														}}
														className={
															design.buttonBlack
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
										<Text className={design.tExtraSmall}>
											Make a post to verify your identity
										</Text>
									) : (
										<>
											<div>
												<Text
													className={
														design.tExtraSmall
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
																	text: `Verifying that this Twitter account belongs to me!
																	 ${wallet.accounts[0] ?? ''}`
																}
															)

														// Open it
														window.open(href)
														setStep(Step.Verify)
													}}
													className={
														design.buttonBlack
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
										<Text className={design.tExtraSmall}>
											Complete your verification.
										</Text>
									) : (
										<>
											{step === Step.Verifying && (
												<>
													<Text
														className={
															design.tExtraSmall
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
																design.tExtraSmall
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
																design.buttonBlack
															}
														>
															Verify Tweet
														</a>
														<Space h={16} />
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
