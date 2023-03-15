import log from '@kengoldfarb/log'
import { Space, Modal, Text, Grid, Image } from '@mantine/core'
import { useAuth } from '@meemproject/react'
import { MoreVert } from 'iconoir-react'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { useAgreement } from '../../../AgreementHome/AgreementProvider'
import { useMeemTheme } from '../../../Styles/MeemTheme'
import {
	SymphonyConnection,
	SymphonyConnectionPlatform,
	SymphonyConnectionType
} from '../Model/symphony'
import { API } from '../symphonyTypes.generated'
import { SymphonyDisconnectModal } from './SymphonyDisconnectModal'
import { SymphonyDiscordConnectionModal } from './SymphonyDiscordConnectionModal'

interface IProps {
	isOpened: boolean
	onModalClosed: () => void
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

	const [isFetchingConnections, setIsFetchingConnections] = useState(false)
	const [hasFetchedConnections, setHasFetchedConnections] = useState(false)
	const [symphonyConnections, setSymphonyConnections] = useState<
		SymphonyConnection[]
	>([])

	const [selectedConnection, setSelectedConnection] =
		useState<SymphonyConnection>()

	const [isConnectDiscordModalOpen, setIsConnectDiscordModalOpen] =
		useState(false)
	const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false)

	useEffect(() => {
		if (!isFetchingConnections && !hasFetchedConnections) {
			//TODO use real data
			const connections: SymphonyConnection[] = []
			const con1: SymphonyConnection = {
				id: '1',
				name: 'Twitter: (username)',
				type: SymphonyConnectionType.OutputOnly,
				platform: SymphonyConnectionPlatform.Twitter
			}
			const con3: SymphonyConnection = {
				id: '1',
				name: 'Twitter: (username)',
				type: SymphonyConnectionType.OutputOnly,
				platform: SymphonyConnectionPlatform.Twitter
			}
			connections.push(con1)
			connections.push(con3)
			const con2: SymphonyConnection = {
				id: '2',
				name: 'Discord: (server name)',
				type: SymphonyConnectionType.InputOnly,
				platform: SymphonyConnectionPlatform.Discord
			}
			connections.push(con2)
			setSymphonyConnections(connections)
			setHasFetchedConnections(true)
			setIsFetchingConnections(true)
		}
	}, [hasFetchedConnections, isFetchingConnections])

	// Handle authentication for different services
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
		if (selectedConnection) {
			switch (selectedConnection.platform) {
				case SymphonyConnectionPlatform.Discord:
					setIsConnectDiscordModalOpen(true)
					break

				case SymphonyConnectionPlatform.Twitter:
					handleAuthTwitter()
					break

				case SymphonyConnectionPlatform.Slack:
					handleAuthSlack()
					break

				default:
					log.warn(
						`No matching selectedConnection for ${selectedConnection}`
					)
					break
			}
		}
	}, [selectedConnection, handleAuthTwitter, handleAuthSlack])

	interface SectionHeaderProps {
		icon: string
		text: string
	}

	const SectionHeader = ({ icon, text }: SectionHeaderProps) => {
		return (
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					paddingBottom: 8
				}}
			>
				<Image
					src={icon}
					width={18}
					height={18}
					style={{ marginRight: 8 }}
				/>
				<Text
					className={meemTheme.tExtraSmallFaded}
				>{`${text.toUpperCase()}`}</Text>
			</div>
		)
	}

	const ConnectionTile = ({ connection }: ConnectionTileProps) => {
		return (
			<div className={meemTheme.gridItemFlat}>
				<div className={meemTheme.spacedRowCentered}>
					<div className={meemTheme.centeredRow}>
						<Image
							src={'/meem-icon.png'}
							width={36}
							height={36}
							style={{ marginRight: 12 }}
						/>
						<Text weight={500} style={{ marginRight: 'auto' }}>
							{connection.name}
						</Text>
					</div>
					<MoreVert />
				</div>
			</div>
		)
	}

	interface ConnectionsGridProps {
		connections: SymphonyConnection[]
	}

	const ConnectionsGrid = ({ connections }: ConnectionsGridProps) => {
		return (
			<Grid>
				{connections.map(connection => (
					<Grid.Col xs={12} md={6} key={connection.id}>
						<ConnectionTile connection={connection} />
					</Grid.Col>
				))}
			</Grid>
		)
	}

	interface ConnectionTileProps {
		connection: SymphonyConnection
	}

	const ConnectionsList = () => {
		const twitterConnections = symphonyConnections.filter(
			c => c.platform === SymphonyConnectionPlatform.Twitter
		)

		const discordConnections = symphonyConnections.filter(
			c => c.platform === SymphonyConnectionPlatform.Discord
		)

		const slackConnections = symphonyConnections.filter(
			c => c.platform === SymphonyConnectionPlatform.Slack
		)

		return (
			<>
				{twitterConnections.length > 0 && (
					<>
						<SectionHeader
							icon="/connect-twitter.png"
							text="Twitter Accounts"
						/>
						<ConnectionsGrid connections={twitterConnections} />
					</>
				)}

				{discordConnections.length > 0 && (
					<>
						<Space h={24} />
						<SectionHeader
							icon="/connect-discord.png"
							text="Discord Servers"
						/>
						<ConnectionsGrid connections={discordConnections} />
					</>
				)}

				{slackConnections.length > 0 && (
					<>
						<Space h={24} />
						<SectionHeader
							icon="/connect-slack.png"
							text="Slack Workspaces"
						/>
						<ConnectionsGrid connections={slackConnections} />
					</>
				)}
			</>
		)
	}

	const modalContents = (
		<>
			<ConnectionsList />

			<SymphonyDiscordConnectionModal
				isOpened={isConnectDiscordModalOpen}
				onModalClosed={function (): void {
					setIsConnectDiscordModalOpen(false)
				}}
			/>

			<SymphonyDisconnectModal
				connection={selectedConnection}
				isOpened={isDisconnectModalOpen}
				onModalClosed={function (): void {
					setIsDisconnectModalOpen(false)
				}}
			/>
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
