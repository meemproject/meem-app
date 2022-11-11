import {
	Text,
	Space,
	Modal,
	Image,
	Divider,
	Grid,
	Center,
	MediaQuery,
	TextInput,
	Button,
	Loader
} from '@mantine/core'
import { useWallet } from '@meemproject/react'
// eslint-disable-next-line import/no-extraneous-dependencies
import React, { useState } from 'react'
import {
	colorLightestGrey,
	colorWhite,
	useClubsTheme
} from '../Styles/ClubsTheme'

interface IProps {
	isOpened: boolean
	onModalClosed: () => void
	isLoginForced: boolean
}

interface ConnectionMethod {
	id: string
	name: string
	icon: string
	enabled: boolean
}

export const JoinClubsModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed,
	isLoginForced
}) => {
	const { classes: clubsTheme } = useClubsTheme()

	// Email state controls
	const [isEmailState, setIsEmailState] = useState(false)

	// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
	const [isLoading, setIsLoading] = useState(false)

	const [email, setEmail] = useState('')

	const wallet = useWallet()

	const methods: ConnectionMethod[] = [
		{
			id: 'walletconnect',
			name: 'WalletConnect',
			icon: 'connect-walletconnect.png',
			enabled: true
		},
		{
			id: 'email',
			name: 'Email Address',
			icon: 'connect-email.png',
			enabled: false
		},
		{
			id: 'discord',
			name: 'Discord',
			icon: 'connect-discord.png',
			enabled: false
		},
		{
			id: 'twitter',
			name: 'Twitter',
			icon: 'connect-twitter.png',
			enabled: false
		},
		{
			id: 'google',
			name: 'Google',
			icon: 'connect-google.png',
			enabled: false
		}
	]

	const connectWallet = async () => {
		onModalClosed()
		await wallet.connectWallet()
	}

	const connectEmail = () => {
		setIsEmailState(true)
	}

	const sendEmailVerificationLink = async () => {
		// TODO: Use the correct endpoint here
		// try {
		// 	setIsLoading(true)
		// 	await request
		// 		.post(
		// 			`${
		// 				process.env.NEXT_PUBLIC_API_URL
		// 			}${MeemAPI.v1.CreateOrUpdateMeemIdIntegration.path({
		// 				integrationId: ''
		// 			})}`
		// 		)
		// 		.set('Authorization', `JWT ${wallet.jwt}`)
		// 		.send({
		// 			visibility: 'mutual-club-members',
		// 			metadata: {
		// 				email
		// 			}
		// 		})
		// 	showNotification({
		// 		title: 'Email sent',
		// 		autoClose: 5000,
		// 		color: 'green',
		// 		icon: <CheckCircle />,
		// 		message: `Please check your email and look for a verification message.`
		// 	})
		// 	closeSafely()
		//
		// } catch (e) {
		// 	log.debug(e)
		// 	showNotification({
		// 		title: 'Verification failed',
		// 		autoClose: 5000,
		// 		color: colorPink,
		// 		icon: <AlertCircle />,
		// 		message: `Please make sure your email address exists and try again.`
		// 	})
		// 	setIsLoading(false)
		// 	return
		// }
	}

	// TODO: these sign in methods
	const connectTwitter = () => {}
	const connectDiscord = () => {}
	const connectGoogle = () => {}

	const connectWithMethod = (method: ConnectionMethod) => {
		switch (method.id) {
			case 'walletconnect':
				connectWallet()
				break
			case 'email':
				connectEmail()
				break
			case 'discord':
				connectDiscord()
				break
			case 'twitter':
				connectTwitter()
				break
			case 'google':
				connectGoogle()
				break
		}
	}

	const closeSafely = async () => {
		onModalClosed()
		await new Promise(resolve => setTimeout(resolve, 500))
		setIsEmailState(false)
		setEmail('')
	}

	const emailState = () => (
		<>
			{isLoading && (
				<Center>
					<Space h={24} />
					<Loader variant={'oval'} color={'red'} />
					<Space h={24} />
				</Center>
			)}
			{!isLoading && (
				<div>
					<Space h={24} />
					<Center>
						<Text className={clubsTheme.tSmallBold}>
							Email Address
						</Text>
					</Center>

					<Space h={16} />
					<TextInput
						size="lg"
						radius={16}
						value={email}
						onChange={event => {
							setEmail(event.target.value)
						}}
					/>
					<Space h={40} />
					<Center>
						<Button
							className={clubsTheme.buttonBlack}
							onClick={() => {
								sendEmailVerificationLink()
							}}
						>
							Send Magic Link
						</Button>
					</Center>
					<Space h={32} />

					<Center>
						<Text className={clubsTheme.tSmallFaded}>
							Changed your mind?
						</Text>
					</Center>
					<Center>
						<Text
							className={clubsTheme.tLink}
							onClick={() => {
								setIsEmailState(false)
								setEmail('')
							}}
						>
							Choose another sign in method
						</Text>
					</Center>
				</div>
			)}
		</>
	)

	return (
		<>
			<MediaQuery largerThan="md" styles={{ display: 'none' }}>
				<Modal
					centered
					radius={16}
					overlayBlur={8}
					padding={'sm'}
					fullScreen
					withCloseButton={!isLoginForced}
					closeOnClickOutside={!isLoginForced}
					opened={isOpened}
					title={
						<Text className={clubsTheme.tMediumBold}>
							{isEmailState
								? 'Sign In with Email'
								: 'Connect to Clubs'}
						</Text>
					}
					onClose={async () => {
						closeSafely()
					}}
				>
					{isEmailState && emailState()}
					{!isEmailState && (
						<div>
							{methods.map(method => (
								<div key={method.id}>
									<div
										style={{
											position: 'relative'
										}}
										className={
											clubsTheme.connectMethodGridItemMobile
										}
										key={method.id}
										onClick={() => {
											if (method.enabled) {
												connectWithMethod(method)
											}
										}}
									>
										<Image
											src={method.icon}
											width={50}
											height={50}
										/>
										<Space w={16} />
										<Text className={clubsTheme.tSmallBold}>
											{method.name}
										</Text>
										{!method.enabled && (
											<div className={clubsTheme.row}>
												<Space w={8} />
												<Text
													className={
														clubsTheme.tSmallFaded
													}
												>
													Coming soon
												</Text>
											</div>
										)}
										{!method.enabled && (
											<div
												style={{
													position: 'absolute',
													top: 0,
													left: 0,
													borderRadius: 32,
													width: '100%',
													height: '100%',
													backgroundColor: colorWhite,
													opacity: '0.7'
												}}
											/>
										)}
									</div>
									<Space h={16} />
								</div>
							))}

							<Space h={24} />
						</div>
					)}
				</Modal>
			</MediaQuery>
			<MediaQuery smallerThan="md" styles={{ display: 'none' }}>
				<Modal
					centered
					radius={16}
					overlayBlur={8}
					withCloseButton={!isLoginForced}
					closeOnClickOutside={!isLoginForced}
					padding={isEmailState ? 'md' : 'lg'}
					size={isEmailState ? '' : '47%'}
					opened={isOpened}
					title={
						<Text className={clubsTheme.tMediumBold}>
							{isEmailState
								? 'Sign In with Email'
								: 'Connect to Clubs'}
						</Text>
					}
					onClose={async () => {
						closeSafely()
					}}
				>
					{isEmailState && emailState()}
					{!isEmailState && (
						<div>
							<Divider />
							<Space h={24} />

							<Grid>
								{methods.map(method => (
									<Grid.Col
										md={6}
										lg={6}
										xl={4}
										key={method.id}
									>
										<div
											className={
												clubsTheme.connectMethodGridItem
											}
											style={{
												position: 'relative'
											}}
											onClick={() => {
												if (method.enabled) {
													connectWithMethod(method)
												}
											}}
										>
											<Center>
												<div
													className={
														clubsTheme.connectMethodGridItemContent
													}
												>
													<Image
														src={method.icon}
														height={50}
														fit={'contain'}
													/>
													<Space h={16} />
													<Text
														className={
															clubsTheme.tSmallBold
														}
													>
														{method.name}
													</Text>
													{!method.enabled && (
														<Text
															className={
																clubsTheme.tSmallFaded
															}
															style={{
																fontSize: 14,
																marginTop: 4
															}}
														>
															Coming soon
														</Text>
													)}
													{!method.enabled && (
														<div
															style={{
																position:
																	'absolute',
																top: 0,
																left: 0,
																borderRadius: 20,
																width: '100%',
																height: '100%',
																backgroundColor:
																	colorLightestGrey,
																opacity: '0.7'
															}}
														/>
													)}
												</div>
											</Center>
										</div>
									</Grid.Col>
								))}
							</Grid>

							<Space h={24} />
						</div>
					)}
				</Modal>
			</MediaQuery>
		</>
	)
}
