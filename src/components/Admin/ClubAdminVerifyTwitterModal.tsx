/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	ApolloClient,
	HttpLink,
	InMemoryCache,
	useLazyQuery,
	useSubscription
} from '@apollo/client'
import log from '@kengoldfarb/log'
import {
	createStyles,
	Container,
	Text,
	Image,
	Button,
	Space,
	Grid,
	Modal,
	Divider,
	Stepper,
	Loader,
	MantineProvider,
	TextInput
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { MeemAPI } from '@meemproject/api'
import { Chain, Permission, UriSource } from '@meemproject/meem-contracts'
import * as meemContracts from '@meemproject/meem-contracts'
import meemABI from '@meemproject/meem-contracts/types/Meem.json'
import { useWallet } from '@meemproject/react'
import { Contract, ethers } from 'ethers'
// eslint-disable-next-line import/no-extraneous-dependencies
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import {
	BrandDiscord,
	BrandTwitter,
	Check,
	CircleCheck,
	Settings
} from 'tabler-icons-react'
import {
	ClubSubscriptionSubscription,
	MeemContracts
} from '../../../generated/graphql'
import { GET_CLUB_SLUG, SUB_CLUB } from '../../graphql/clubs'
import clubFromMeemContract, {
	Integration,
	MembershipReqType,
	MembershipSettings
} from '../../model/club/club'
import { CookieKeys } from '../../utils/cookies'

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
	}
}))

interface IProps {
	clubAddress: string
	isOpened: boolean
	onModalClosed: () => void
}

enum Step {
	Start,
	Share,
	Verify,
	Verifying
}

export const ClubAdminVerifyTwitterModal: React.FC<IProps> = ({
	clubAddress,
	isOpened,
	onModalClosed
}) => {
	const router = useRouter()

	const wallet = useWallet()

	const { classes } = useStyles()

	const [step, setStep] = useState<Step>(Step.Start)

	const [twitterUsername, setTwitterUsername] = useState('')

	const verifyTweet = async () => {
		setStep(Step.Verifying)
	}

	// Club subscription - watch for specific changes in order to update correctly
	const { data: clubData, loading } =
		useSubscription<ClubSubscriptionSubscription>(SUB_CLUB, {
			variables: { address: clubAddress }
		})

	// Listen for change on the club that indicates Twitter was successfully verified.
	useEffect(() => {
		async function checkClubState(data: ClubSubscriptionSubscription) {
			if (data.MeemContracts.length > 0 && step === Step.Verifying) {
				// TODO
			}
		}

		if (clubData && wallet.accounts.length > 0) {
			checkClubState(clubData)
		} else {
			log.debug('No club data (yet) or wallet not connected...')
		}
	}, [clubData, router, step, wallet])

	return (
		<>
			<Modal
				centered
				closeOnClickOutside={false}
				closeOnEscape={false}
				radius={16}
				padding={'sm'}
				opened={isOpened}
				title={
					<Text className={classes.modalTitle}>
						Verify with Twitter
					</Text>
				}
				onClose={() => onModalClosed()}
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
														defaultValue={
															'@username'
														}
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
														window.open(
															'https://twitter.com/intent/tweet?text=I%20am%20validating%20that%20I%20am%20the%20owner%20of%20this%20Twitter%20account.&hashtags=%23clubs'
														)
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
									step !== Step.Verifying ? (
										<Text
											className={classes.stepDescription}
										>
											Complete your verification.
										</Text>
									) : (
										<>
											<div>
												<Text
													className={
														classes.stepDescription
													}
												>
													Complete your verification.
												</Text>
												<Space h={24} />

												<a
													onClick={verifyTweet}
													className={
														classes.buttonConfirm
													}
												>
													Verify Tweet
												</a>
												<Space h={12} />
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
