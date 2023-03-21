import { Space, Modal, Text, Grid, Image, Center, Menu } from '@mantine/core'
import { useAuth } from '@meemproject/react'
import { MoreVert } from 'iconoir-react'
import { useRouter } from 'next/router'
import React, { useCallback, useState } from 'react'
import { useAgreement } from '../../../AgreementHome/AgreementProvider'
import { colorBlue, colorRed, useMeemTheme } from '../../../Styles/MeemTheme'
import { SymphonyConnection } from '../Model/symphony'
import { API } from '../symphonyTypes.generated'
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
	const { agreement } = useAgreement()
	const { jwt } = useAuth()
	const router = useRouter()

	// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
	const [selectedConnection, setSelectedConnection] =
		useState<SymphonyConnection>()

	const [isConnectDiscordModalOpen, setIsConnectDiscordModalOpen] =
		useState(false)
	const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false)

	//Handle authentication for different services
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

	interface AddNewConnectionTileProps {
		platform: API.RuleIo
	}

	const AddNewConnectionTile = ({ platform }: AddNewConnectionTileProps) => {
		return (
			<div
				className={meemTheme.gridItemBlue}
				onClick={() => {
					switch (platform) {
						case API.RuleIo.Discord:
							setIsConnectDiscordModalOpen(true)
							break
						case API.RuleIo.Twitter:
							handleAuthTwitter()
							break
						case API.RuleIo.Slack:
							handleAuthSlack()
							break
					}
				}}
			>
				<Center>
					<Text
						className={meemTheme.tSmallBold}
						style={{
							color: colorBlue,
							paddingTop: 8,
							paddingBottom: 6
						}}
					>
						{`+ Connect Another ${
							platform === API.RuleIo.Discord
								? 'Server'
								: platform === API.RuleIo.Slack
								? 'Workspace'
								: 'Account'
						}`}
					</Text>
				</Center>
			</div>
		)
	}

	const ConnectionTile = ({ connection }: ConnectionTileProps) => {
		return (
			<div className={meemTheme.gridItemFlat} style={{ cursor: 'auto' }}>
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
					<Menu radius={8} shadow={'lg'}>
						<Menu.Target>
							<MoreVert style={{ cursor: 'pointer' }} />
						</Menu.Target>
						<Menu.Dropdown>
							<Menu.Item
								onClick={() => {
									setSelectedConnection(connection)
									setIsDisconnectModalOpen(true)
								}}
							>
								<Text
									className={meemTheme.tSmallBold}
									color={colorRed}
								>
									Disconnect
								</Text>
							</Menu.Item>
						</Menu.Dropdown>
					</Menu>
				</div>
			</div>
		)
	}

	interface ConnectionsGridProps {
		conns: SymphonyConnection[]
		platform: API.RuleIo
	}

	const ConnectionsGrid = ({ conns, platform }: ConnectionsGridProps) => {
		return (
			<>
				<Space h={4} />
				<Grid>
					{conns.map(connection => (
						<Grid.Col xs={12} md={6} key={connection.id}>
							<ConnectionTile connection={connection} />
						</Grid.Col>
					))}
					<Grid.Col xs={12} md={6} key={platform}>
						<AddNewConnectionTile platform={platform} />
					</Grid.Col>
				</Grid>
			</>
		)
	}

	interface ConnectionTileProps {
		connection: SymphonyConnection
	}

	const ConnectionsList = () => {
		const twitterConnections = connections?.filter(
			c => c.platform === API.RuleIo.Twitter
		)

		const discordConnections = connections?.filter(
			c => c.platform === API.RuleIo.Discord
		)

		const slackConnections = connections?.filter(
			c => c.platform === API.RuleIo.Slack
		)

		return (
			<>
				<SectionHeader
					icon="/connect-twitter.png"
					text="Twitter Accounts"
				/>
				<ConnectionsGrid
					conns={twitterConnections ?? []}
					platform={API.RuleIo.Twitter}
				/>

				<Space h={32} />
				<SectionHeader
					icon="/connect-discord.png"
					text="Discord Servers"
				/>
				<ConnectionsGrid
					conns={discordConnections ?? []}
					platform={API.RuleIo.Discord}
				/>

				<Space h={32} />
				<SectionHeader
					icon="/connect-slack.png"
					text="Slack Workspaces"
				/>
				<ConnectionsGrid
					conns={slackConnections ?? []}
					platform={API.RuleIo.Slack}
				/>
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
