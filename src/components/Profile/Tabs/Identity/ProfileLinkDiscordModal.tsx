import log from '@kengoldfarb/log'
import { Text, Space, Modal, Divider, Loader } from '@mantine/core'
import { useSDK, useWallet } from '@meemproject/react'
import { MeemAPI } from '@meemproject/sdk'
import React, { useEffect } from 'react'
import {
	showErrorNotification,
	showSuccessNotification
} from '../../../../utils/notifications'
import { useMeemTheme } from '../../../Styles/MeemTheme'

interface IProps {
	extensionId?: string
	discordAuthCode?: string
	isOpened: boolean
	onModalClosed: () => void
}

export const ProfileLinkDiscordModal: React.FC<IProps> = ({
	extensionId,
	discordAuthCode,
	isOpened,
	onModalClosed
}) => {
	const { classes: meemTheme } = useMeemTheme()
	const wallet = useWallet()

	const { sdk } = useSDK()

	useEffect(() => {
		async function authenticateWithDiscord() {
			try {
				await sdk.id.updateUserIdentity({
					// TODO: Fix this
					// @ts-ignore
					identityIntegrationId: extensionId ?? '',
					visibility: MeemAPI.IUserIdentityVisibility.TokenHolders,
					metadata: {
						discordAuthCode,
						redirectUri: `${window.location.origin}/profile`
					}
				})

				showSuccessNotification(
					'Success!',
					`This Discord account is now linked!`
				)
				onModalClosed()
			} catch (e) {
				log.debug(e)
				showErrorNotification(
					'Verification failed',
					`Please try again or contact us using the top-right link on this page.`
				)
				onModalClosed()
				return
			}
		}

		if (isOpened && discordAuthCode && extensionId) {
			authenticateWithDiscord()
		}
	}, [discordAuthCode, extensionId, isOpened, onModalClosed, sdk.id, wallet])

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
					<Text className={meemTheme.tMediumBold}>
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

				<div className={meemTheme.modalStepsContainer}>
					<Space h={8} />
					<Text className={meemTheme.tMedium}>
						Saving Discord information to your profile...
					</Text>
					<Space h={8} />

					<Loader variant="oval" color="cyan" />
				</div>
			</Modal>
		</>
	)
}
