import log from '@kengoldfarb/log'
import { Text, Space, Modal, Divider, Loader } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useWallet } from '@meemproject/react'
import { MeemAPI } from '@meemproject/sdk'
import React, { useEffect } from 'react'
import request from 'superagent'
import { AlertCircle, Check } from 'tabler-icons-react'
import { colorPink, useClubsTheme } from '../../../Styles/ClubsTheme'

interface IProps {
	integrationId?: string
	discordAuthCode?: string
	isOpened: boolean
	onModalClosed: () => void
}

export const ProfileLinkDiscordModal: React.FC<IProps> = ({
	integrationId,
	discordAuthCode,
	isOpened,
	onModalClosed
}) => {
	const { classes: clubsTheme } = useClubsTheme()
	const wallet = useWallet()

	useEffect(() => {
		async function authenticateWithDiscord() {
			try {
				await request
					.post(
						`${
							process.env.NEXT_PUBLIC_API_URL
						}${MeemAPI.v1.CreateOrUpdateMeemIdIntegration.path({
							integrationId: integrationId ?? ''
						})}`
					)
					.set('Authorization', `JWT ${wallet.jwt}`)
					.send({
						visibility: 'mutual-club-members',
						metadata: {
							discordAuthCode,
							redirectUri: `${window.location.origin}/profile`
						}
					})
				showNotification({
					title: 'Success!',
					autoClose: 5000,
					color: 'green',
					icon: <Check color="green" />,
					message: `This Discord account is now linked!`
				})
				onModalClosed()
			} catch (e) {
				log.debug(e)
				showNotification({
					title: 'Verification failed',
					autoClose: 5000,
					color: colorPink,
					icon: <AlertCircle />,
					message: `Please try again or get in touch!`
				})
				onModalClosed()
				return
			}
		}

		if (isOpened && discordAuthCode && integrationId) {
			authenticateWithDiscord()
		}
	}, [discordAuthCode, integrationId, isOpened, onModalClosed, wallet])

	return (
		<>
			<Modal
				centered
				closeOnClickOutside={false}
				closeOnEscape={false}
				radius={16}
				size={'50%'}
				overlayBlur={8}
				padding={'sm'}
				opened={isOpened}
				title={
					<Text className={clubsTheme.tMediumBold}>
						Connect your Discord account
					</Text>
				}
				withCloseButton={false}
				onClose={() => {
					onModalClosed()
				}}
			>
				<Divider />

				<Space h={24} />

				<div className={clubsTheme.modalStepsContainer}>
					<Space h={8} />
					<Text className={clubsTheme.tMedium}>
						Saving Discord information to your profile...
					</Text>
					<Space h={8} />

					<Loader variant="oval" color="red" />
				</div>
			</Modal>
		</>
	)
}
