// import log from '@kengoldfarb/log'
import { Space, Modal, Text, Grid, Image } from '@mantine/core'
// import { useAuth } from '@meemproject/react'
import { MoreVert } from 'iconoir-react'
import React, { useState } from 'react'
import { useMeemTheme } from '../../../Styles/MeemTheme'
import {
	SymphonyConnection,
	SymphonyConnectionPlatform
} from '../Model/symphony'
// import { API } from '../symphonyTypes.generated'
import { SymphonyDisconnectModal } from './SymphonyDisconnectModal'
import { SymphonyDiscordConnectionModal } from './SymphonyDiscordConnectionModal'

interface IProps {
	connections?: SymphonyConnection[]
	isOpened: boolean
	onModalClosed: () => void
}

export const SymphonyConnectionsModal: React.FC<IProps> = ({
	connections,
	isOpened,
	onModalClosed
}) => {
	// General params
	const { classes: meemTheme } = useMeemTheme()
	// const { agreement } = useAgreement()
	// const { jwt } = useAuth()
	// const router = useRouter()

	const [selectedConnection, setSelectedConnection] =
		useState<SymphonyConnection>()

	const [isConnectDiscordModalOpen, setIsConnectDiscordModalOpen] =
		useState(false)
	const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false)

	// Handle authentication for different services
	// const handleAuthTwitter = useCallback(async () => {
	// 	if (!agreement?.id || !jwt) {
	// 		return
	// 	}

	// 	router.push({
	// 		pathname: `${
	// 			process.env.NEXT_PUBLIC_SYMPHONY_API_URL
	// 		}${API.v1.AuthenticateWithTwitter.path()}`,
	// 		query: {
	// 			agreementId: agreement.id,
	// 			jwt,
	// 			returnUrl: window.location.toString()
	// 		}
	// 	})
	// }, [router, agreement, jwt])

	// const handleAuthSlack = useCallback(async () => {
	// 	if (!agreement?.id || !jwt) {
	// 		return
	// 	}

	// 	router.push({
	// 		pathname: `${
	// 			process.env.NEXT_PUBLIC_SYMPHONY_API_URL
	// 		}${API.v1.AuthenticateWithSlack.path()}`,
	// 		query: {
	// 			agreementId: agreement.id,
	// 			jwt,
	// 			returnUrl: window.location.toString()
	// 		}
	// 	})
	// }, [router, agreement, jwt])

	// const handleReauthenticate = useCallback(async () => {
	// 	if (selectedConnection) {
	// 		switch (selectedConnection.platform) {
	// 			case SymphonyConnectionPlatform.Discord:
	// 				setIsConnectDiscordModalOpen(true)
	// 				break

	// 			case SymphonyConnectionPlatform.Twitter:
	// 				handleAuthTwitter()
	// 				break

	// 			case SymphonyConnectionPlatform.Slack:
	// 				handleAuthSlack()
	// 				break

	// 			default:
	// 				log.warn(
	// 					`No matching selectedConnection for ${selectedConnection}`
	// 				)
	// 				break
	// 		}
	// 	}
	// }, [selectedConnection, handleAuthTwitter, handleAuthSlack])

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
		conns: SymphonyConnection[]
	}

	const ConnectionsGrid = ({ conns }: ConnectionsGridProps) => {
		return (
			<Grid>
				{conns.map(connection => (
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
		const twitterConnections = connections?.filter(
			c => c.platform === SymphonyConnectionPlatform.Twitter
		)

		const discordConnections = connections?.filter(
			c => c.platform === SymphonyConnectionPlatform.Discord
		)

		const slackConnections = connections?.filter(
			c => c.platform === SymphonyConnectionPlatform.Slack
		)

		return (
			<>
				{twitterConnections && twitterConnections.length > 0 && (
					<>
						<SectionHeader
							icon="/connect-twitter.png"
							text="Twitter Accounts"
						/>
						<ConnectionsGrid conns={twitterConnections} />
					</>
				)}

				{discordConnections && discordConnections.length > 0 && (
					<>
						<Space h={24} />
						<SectionHeader
							icon="/connect-discord.png"
							text="Discord Servers"
						/>
						<ConnectionsGrid conns={discordConnections} />
					</>
				)}

				{slackConnections && slackConnections.length > 0 && (
					<>
						<Space h={24} />
						<SectionHeader
							icon="/connect-slack.png"
							text="Slack Workspaces"
						/>
						<ConnectionsGrid conns={slackConnections} />
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
