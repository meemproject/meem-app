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
import { AlertCircle, Check } from 'tabler-icons-react'
import twitterIntent from 'twitter-intent'
import { Club, Integration } from '../../../model/club/club'
import { colorGreen, colorPink, useClubsTheme } from '../../Styles/ClubsTheme'

interface IProps {
	club: Club
	integration?: Integration
	isOpened: boolean
	onModalClosed: () => void
	onSuccessfulVerification: (username: string) => void
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
	const { classes: clubsTheme } = useClubsTheme()
	const wallet = useWallet()

	const [step, setStep] = useState<Step>(Step.Start)

	const [twitterUsername, setTwitterUsername] = useState('')

	const verifyTweet = async () => {
		setStep(Step.Verifying)

		// Save the change to the db
		try {
			const { body } = await request
				.post(
					`${
						process.env.NEXT_PUBLIC_API_URL
					}${MeemAPI.v1.CreateOrUpdateMeemContractIntegration.path({
						meemContractId: club.id ?? '',
						integrationId: integration?.integrationId ?? ''
					})}`
				)
				.set('Authorization', `JWT ${wallet.jwt}`)
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
				radius: 'lg',
				title: 'Success!',
				autoClose: 5000,
				color: colorGreen,
				icon: <Check color={colorGreen} />,

				message: `Your club is now verified.`
			})
			onSuccessfulVerification(twitterUsername)
			onModalClosed()
		} catch (e) {
			log.debug(e)
			showNotification({
				radius: 'lg',
				title: 'Verification failed',
				autoClose: 5000,
				color: colorPink,
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
				overlayBlur={8}
				padding={'sm'}
				opened={isOpened}
				title={
					<Text className={clubsTheme.tMediumBold}>
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
					<div style={{ paddingLeft: 8, paddingRight: 8 }}>
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
								<span className={clubsTheme.tSmallBold}>
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
															clubsTheme.tExtraSmall
														}
													>
														You’ll need access to
														this Twitter account to
														verify.
													</Text>
													<Space h={4} />

													<TextInput
														radius={16}
														value={twitterUsername}
														onChange={event => {
															setTwitterUsername(
																event.target
																	.value
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
								label="Share a public post"
								description={
									step !== Step.Share ? (
										<Text
											className={clubsTheme.tExtraSmall}
										>
											Make a post to verify your identity
										</Text>
									) : (
										<>
											<div>
												<Text
													className={
														clubsTheme.tExtraSmall
													}
												>
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
														clubsTheme.buttonBlack
													}
												>
													Post on Twitter
												</Button>
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
											className={clubsTheme.tExtraSmall}
										>
											Complete your verification.
										</Text>
									) : (
										<>
											{step === Step.Verifying && (
												<>
													<Text
														className={
															clubsTheme.tExtraSmall
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
																clubsTheme.tExtraSmall
															}
														>
															Complete your
															verification.
														</Text>
														<Space h={16} />

														<Button
															onClick={
																verifyTweet
															}
															className={
																clubsTheme.buttonBlack
															}
														>
															Verify Tweet
														</Button>
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
