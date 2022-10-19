import log from '@kengoldfarb/log'
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
import { showNotification } from '@mantine/notifications'
import { MeemAPI } from '@meemproject/api'
import { useWallet } from '@meemproject/react'
// eslint-disable-next-line import/no-extraneous-dependencies
import React, { useState } from 'react'
import request from 'superagent'
import { AlertCircle } from 'tabler-icons-react'
import { useGlobalStyles } from '../Styles/GlobalStyles'

interface IProps {
	isOpened: boolean
	onModalClosed: () => void
}

interface ConnectionMethod {
	id: string
	name: string
	icon: string
}

export const JoinClubsModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed
}) => {
	const { classes: styles } = useGlobalStyles()

	// Email state controls
	const [isEmailState, setIsEmailState] = useState(false)

	const [isLoading, setIsLoading] = useState(false)

	const [email, setEmail] = useState('')

	const wallet = useWallet()

	const methods: ConnectionMethod[] = [
		{
			id: 'walletconnect',
			name: 'WalletConnect',
			icon: 'connect-walletconnect.png'
		},
		{
			id: 'email',
			name: 'Email Address',
			icon: 'connect-email.png'
		},
		{
			id: 'discord',
			name: 'Discord',
			icon: 'connect-discord.png'
		},
		{
			id: 'twitter',
			name: 'Twitter',
			icon: 'connect-twitter.png'
		},
		{
			id: 'google',
			name: 'Google',
			icon: 'connect-google.png'
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
		// 		color: 'red',
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
						<Text className={styles.tBold}>Email Address</Text>
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
							className={styles.buttonBlack}
							onClick={() => {
								sendEmailVerificationLink()
							}}
						>
							Send Magic Link
						</Button>
					</Center>
					<Space h={32} />

					<Center>
						<Text className={styles.tPartialTransparent}>
							Changed your mind?
						</Text>
					</Center>
					<Center>
						<Text
							className={styles.tLink}
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
					opened={isOpened}
					title={
						<Text className={styles.tModalTitle}>
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
										className={
											styles.connectMethodButtonSmall
										}
										key={method.id}
										onClick={() => {
											connectWithMethod(method)
										}}
									>
										<Image
											src={method.icon}
											width={50}
											height={50}
										/>
										<Space w={16} />
										<Text className={styles.tBold}>
											{method.name}
										</Text>
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
					padding={isEmailState ? 'md' : 'lg'}
					size={isEmailState ? '' : '47%'}
					opened={isOpened}
					title={
						<Text className={styles.tModalTitle}>
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
												styles.connectMethodButton
											}
											onClick={() => {
												connectWithMethod(method)
											}}
										>
											<Center>
												<div
													className={
														styles.connectMethodButtonContent
													}
												>
													<Image
														src={method.icon}
														height={50}
														fit={'contain'}
													/>
													<Space h={16} />
													<Text
														className={styles.tBold}
													>
														{method.name}
													</Text>
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
