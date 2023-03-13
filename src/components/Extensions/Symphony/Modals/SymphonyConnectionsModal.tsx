import log from '@kengoldfarb/log'
import { Space, Modal, Text } from '@mantine/core'
import { useAuth } from '@meemproject/react'
import { useRouter } from 'next/router'
import React, { useCallback, useState } from 'react'
import { useAgreement } from '../../../AgreementHome/AgreementProvider'
import { useMeemTheme } from '../../../Styles/MeemTheme'
import {
	SymphonyConnection,
	SymphonyConnectionPlatform
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

	const [symphonyConnections, setSymphonyConnections] = useState<
		SymphonyConnection[]
	>([])

	const [selectedConnection, setSelectedConnection] =
		useState<SymphonyConnection>()

	const [isConnectDiscordModalOpen, setIsConnectDiscordModalOpen] =
		useState(false)
	const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false)

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
		const dataLayer = (window as any).dataLayer ?? null

		if (selectedConnection) {
			switch (selectedConnection.platform) {
				case SymphonyConnectionPlatform.Discord:
					setIsConnectDiscordModalOpen(true)
					dataLayer?.push({
						event: 'event',
						eventProps: {
							category: 'Symphony Extension',
							action: 'Manage Connection',
							label: 'Reconnect Discord'
						}
					})
					break

				case SymphonyConnectionPlatform.Twitter:
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

				case SymphonyConnectionPlatform.Slack:
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
		}
	}, [selectedConnection, handleAuthTwitter, handleAuthSlack])

	const modalContents = (
		<>
			<Space h={24} className={meemTheme.visibleDesktopOnly} />

			<div className={meemTheme.rowResponsive}>
				<Text>Hello world</Text>
			</div>

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
