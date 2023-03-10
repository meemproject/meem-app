import log from '@kengoldfarb/log'
import {
	Space,
	Center,
	Image,
	Modal,
	Text,
	Button,
	Loader,
	Stepper,
	useMantineColorScheme,
	Code
} from '@mantine/core'
import { useAuth } from '@meemproject/react'
import { makeRequest } from '@meemproject/sdk'
import { useRouter } from 'next/router'
import React, { useCallback, useState } from 'react'
import {
	showSuccessNotification,
	showErrorNotification
} from '../../../utils/notifications'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import { useMeemTheme } from '../../Styles/MeemTheme'
import { SymphonyConnection } from './Model/symphony'
import { API } from './symphonyTypes.generated'

interface IProps {
	isOpened: boolean
	onModalClosed: () => void
}

export enum SelectedConnection {
	ConnectionDiscord = 'discord',
	ConnectionTwitter = 'twitter',
	ConnectionSlack = 'slack'
}

export const SymphonyConnectionsModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed
}) => {
	// General params
	const { classes: meemTheme } = useMeemTheme()
	const { agreement } = useAgreement()
	const { jwt } = useAuth()
	const router = useRouter()

	const [symphonyConnections, setSymphonyConnections] = useState<
		SymphonyConnection[]
	>([])

	const [selectedConnection, setSelectedConnection] =
		useState<SelectedConnection>()

	const [botCode, setBotCode] = useState<string>('')

	const [isConnectDiscordModalOpen, setIsConnectDiscordModalOpen] =
		useState(false)
	const [connectDiscordStep, setConnectDiscordStep] = useState(0)
	const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false)
	const { colorScheme } = useMantineColorScheme()
	const isDarkTheme = colorScheme === 'dark'

	// Handle authentication for different services
	const handleInviteBot = useCallback(async () => {
		if (!agreement?.id || !jwt) {
			return
		}
		const { code, inviteUrl } =
			await makeRequest<API.v1.InviteDiscordBot.IDefinition>(
				`${
					process.env.NEXT_PUBLIC_SYMPHONY_API_URL
				}${API.v1.InviteDiscordBot.path()}`,
				{ query: { agreementId: agreement?.id, jwt } }
			)

		setBotCode(code)

		window.open(inviteUrl, '_blank')
	}, [agreement, jwt])

	const handleAuthTwitter = useCallback(async () => {
		if (!agreement?.id || !jwt) {
			return
		}

		router.push({
			pathname: `${
				process.env.NEXT_PUBLIC_SYMPHONY_API_URL
			}${API.v1.AuthenticateWithTwitter.path()}`,
			query: {
				agreementId: agreement.id,
				jwt,
				returnUrl: window.location.toString()
			}
		})
	}, [router, agreement, jwt])

	const handleAuthSlack = useCallback(async () => {
		if (!agreement?.id || !jwt) {
			return
		}

		router.push({
			pathname: `${
				process.env.NEXT_PUBLIC_SYMPHONY_API_URL
			}${API.v1.AuthenticateWithSlack.path()}`,
			query: {
				agreementId: agreement.id,
				jwt,
				returnUrl: window.location.toString()
			}
		})
	}, [router, agreement, jwt])

	const handleReauthenticate = useCallback(async () => {
		const dataLayer = (window as any).dataLayer ?? null

		switch (selectedConnection) {
			case SelectedConnection.ConnectionDiscord:
				handleInviteBot()
				dataLayer?.push({
					event: 'event',
					eventProps: {
						category: 'Symphony Extension',
						action: 'Manage Connection',
						label: 'Reconnect Discord'
					}
				})
				break

			case SelectedConnection.ConnectionTwitter:
				handleAuthTwitter()
				dataLayer?.push({
					event: 'event',
					eventProps: {
						category: 'Symphony Extension',
						action: 'Manage Connection',
						label: 'Reconnect Twitter'
					}
				})
				break

			case SelectedConnection.ConnectionSlack:
				handleAuthSlack()
				dataLayer?.push({
					event: 'event',
					eventProps: {
						category: 'Symphony Extension',
						action: 'Manage Connection',
						label: 'Reconnect Slack'
					}
				})
				break

			default:
				log.warn(
					`No matching selectedConnection for ${selectedConnection}`
				)
				break
		}
	}, [
		selectedConnection,
		handleAuthTwitter,
		handleInviteBot,
		handleAuthSlack
	])

	const handleDisconnect = useCallback(async () => {
		const dataLayer = (window as any).dataLayer ?? null

		if (!jwt || !agreement?.id) {
			return
		}
		try {
			switch (selectedConnection) {
				case SelectedConnection.ConnectionDiscord:
					await makeRequest<API.v1.DisconnectDiscord.IDefinition>(
						`${
							process.env.NEXT_PUBLIC_SYMPHONY_API_URL
						}${API.v1.DisconnectDiscord.path()}`,
						{
							method: API.v1.DisconnectDiscord.method,
							body: {
								jwt,
								agreementId: agreement?.id
							}
						}
					)
					showSuccessNotification(
						'Discord Disconnected',
						'Discord has been disconnected'
					)
					setIsDisconnectModalOpen(false)

					dataLayer?.push({
						event: 'event',
						eventProps: {
							category: 'Symphony Extension',
							action: 'Manage Connection',
							label: 'Disconnect Discord'
						}
					})
					break

				case SelectedConnection.ConnectionTwitter:
					await makeRequest<API.v1.DisconnectTwitter.IDefinition>(
						`${
							process.env.NEXT_PUBLIC_SYMPHONY_API_URL
						}${API.v1.DisconnectTwitter.path()}`,
						{
							method: API.v1.DisconnectTwitter.method,
							body: {
								jwt,
								agreementId: agreement?.id
							}
						}
					)
					showSuccessNotification(
						'Twitter Disconnected',
						'Twitter has been disconnected'
					)
					setIsDisconnectModalOpen(false)
					dataLayer?.push({
						event: 'event',
						eventProps: {
							category: 'Symphony Extension',
							action: 'Manage Connection',
							label: 'Disconnect Twitter'
						}
					})
					break

				default:
					log.warn('Invalid case for handleDisconnect')
					break
			}
		} catch (e) {
			showErrorNotification('Something went wrong', 'Please try again ')
		}
	}, [selectedConnection, agreement, jwt])

	const modalContents = (
		<>
			<Space h={24} className={meemTheme.visibleDesktopOnly} />

			<div className={meemTheme.rowResponsive}>
				<Text>Hello world</Text>
			</div>

			{/* TODO: This modal should probably be its own class */}
			<Modal
				opened={isConnectDiscordModalOpen}
				onClose={() => setIsConnectDiscordModalOpen(false)}
				overlayBlur={8}
				withCloseButton={false}
				radius={16}
				size={'lg'}
				padding={'sm'}
			>
				<Space h={16} />

				<Center>
					<Text
						className={meemTheme.tMediumBold}
						style={{ textAlign: 'center' }}
					>
						{`Connect to Discord`}
					</Text>
				</Center>
				<Space h={24} />
				<Stepper
					active={connectDiscordStep}
					breakpoint="sm"
					orientation="vertical"
				>
					<Stepper.Step
						label="Invite Symphony bot"
						description={
							<>
								<Text className={meemTheme.tExtraSmall}>
									{connectDiscordStep === 1
										? `You've invited the Symphony bot to your Discord server.`
										: `Please invite the Symphony bot to manage your Discord server.`}
								</Text>
								{connectDiscordStep === 0 && (
									<>
										<Space h={16} />
										<div className={meemTheme.row}>
											<Button
												leftIcon={
													<Image
														width={16}
														src={`/integration-discord-white.png`}
													/>
												}
												className={
													meemTheme.buttonDiscordBlue
												}
												onClick={() => {
													handleInviteBot()
												}}
											>
												{`Invite Symphony Bot`}
											</Button>
										</div>
										<Space h={16} />

										{botCode && (
											<>
												<div className={meemTheme.row}>
													<Button
														className={
															meemTheme.buttonBlack
														}
														onClick={() => {
															setConnectDiscordStep(
																1
															)
														}}
													>
														{`Next`}
													</Button>
												</div>
												<Space h={16} />
											</>
										)}
									</>
								)}
							</>
						}
					/>
					<Stepper.Step
						label="Activate Symphony in Discord"
						description={
							<>
								<Text className={meemTheme.tExtraSmall}>
									Type{' '}
									<span style={{ fontWeight: '600' }}>
										/activate
									</span>{' '}
									in any public channel of your Discord
									server, then enter the code below:
								</Text>
								{connectDiscordStep === 1 && (
									<>
										<Space h={16} />
										<Code
											style={{ cursor: 'pointer' }}
											onClick={() => {
												navigator.clipboard.writeText(
													`${botCode}`
												)
												showSuccessNotification(
													'Copied to clipboard',
													`The code was copied to your clipboard.`
												)
											}}
											block
										>{`${botCode}`}</Code>
										<Space h={16} />

										<div className={meemTheme.centeredRow}>
											<Loader
												variant="oval"
												color="cyan"
												size={24}
											/>
											<Space w={8} />
											<Text
												className={
													meemTheme.tExtraExtraSmall
												}
											>
												Waiting for activation...
											</Text>
										</div>
									</>
								)}
							</>
						}
					></Stepper.Step>
				</Stepper>
			</Modal>
			<Modal
				opened={isDisconnectModalOpen}
				onClose={() => setIsDisconnectModalOpen(false)}
				overlayBlur={8}
				withCloseButton={false}
				radius={16}
				size={'lg'}
				padding={'sm'}
			>
				<Space h={16} />

				<Center>
					<Text
						className={meemTheme.tMediumBold}
						style={{ textAlign: 'center' }}
					>
						{`Are you sure you want to disconnect ${
							selectedConnection ===
							SelectedConnection.ConnectionDiscord
								? 'Discord'
								: selectedConnection ===
								  SelectedConnection.ConnectionTwitter
								? 'Twitter'
								: 'Slack'
						} from
					Symphony?`}
					</Text>
				</Center>
				<Space h={24} />
				<Center>
					<Text
						className={meemTheme.tSmallFaded}
						style={{ textAlign: 'center', lineHeight: 1.4 }}
					>
						{`Symphony will not be able to publish any community
						tweets unless connection is restored. ${
							selectedConnection ===
							SelectedConnection.ConnectionDiscord
								? 'All Discord-related rules will also be deleted.'
								: ''
						}`}
					</Text>
				</Center>
				<Space h={24} />
				<Center>
					<Button
						className={meemTheme.buttonRed}
						onClick={() => {
							handleDisconnect()
						}}
					>
						Disconnect
					</Button>
				</Center>
				<Space h={16} />
				<Center>
					<Button
						className={meemTheme.buttonGrey}
						onClick={() => {
							setIsDisconnectModalOpen(false)
						}}
					>
						Cancel
					</Button>
				</Center>
				<Space h={16} />
			</Modal>
		</>
	)

	return (
		<>
			<Modal
				className={meemTheme.visibleDesktopOnly}
				centered
				radius={16}
				overlayBlur={8}
				size={'60%'}
				padding={'lg'}
				opened={isOpened}
				title={
					<Text className={meemTheme.tMediumBold}>
						Manage Connections
					</Text>
				}
				onClose={() => {
					onModalClosed()
				}}
			>
				{modalContents}
			</Modal>
			<Modal
				className={meemTheme.visibleMobileOnly}
				fullScreen
				padding={'lg'}
				opened={isOpened}
				title={
					<Text className={meemTheme.tMediumBold}>
						Manage Connections
					</Text>
				}
				onClose={() => {
					onModalClosed()
				}}
			>
				{modalContents}
			</Modal>
		</>
	)
}
