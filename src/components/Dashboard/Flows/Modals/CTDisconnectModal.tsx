import log from '@kengoldfarb/log'
import { Text, Space, Modal, Button, Center, Loader } from '@mantine/core'
import { useSDK } from '@meemproject/react'
import { MeemAPI } from '@meemproject/sdk'
// eslint-disable-next-line import/no-extraneous-dependencies
import React, { useCallback, useState } from 'react'
import {
	showSuccessNotification,
	showErrorNotification
} from '../../../../utils/notifications'
import { useAgreement } from '../../../Providers/AgreementProvider'
import { useMeemTheme } from '../../../Styles/MeemTheme'
import { CTConnection, CTConnectionType } from '../Model/communityTweets'

interface IProps {
	connection?: CTConnection
	isOpened: boolean
	onModalClosed: () => void
}

export const CTDisconnectModal: React.FC<IProps> = ({
	connection,
	isOpened,
	onModalClosed
}) => {
	const { classes: meemTheme } = useMeemTheme()
	const [isDisconnecting, setIsDisconnecting] = useState(false)

	const { agreement } = useAgreement()
	const { sdk } = useSDK()

	const handleDisconnect = useCallback(async () => {
		if (!agreement?.id || !connection) {
			return
		}

		setIsDisconnecting(true)

		try {
			// TODO: Slack
			switch (connection.platform) {
				case MeemAPI.RuleIo.Discord:
					await sdk.symphony.disconnectDiscord({
						agreementDiscordId: connection.id
					})
					showSuccessNotification(
						'Discord Disconnected',
						'Discord has been disconnected'
					)
					onModalClosed()
					setIsDisconnecting(false)
					break

				case MeemAPI.RuleIo.Twitter:
					await sdk.symphony.disconnectTwitter({
						agreementTwitterId: connection.id
					})
					showSuccessNotification(
						'Twitter Disconnected',
						'Twitter has been disconnected'
					)
					onModalClosed()
					setIsDisconnecting(false)

					break

				case MeemAPI.RuleIo.Slack:
					await sdk.symphony.disconnectSlack({
						agreementSlackId: connection.id
					})
					showSuccessNotification(
						'Slack Disconnected',
						'Slack has been disconnected'
					)
					onModalClosed()
					setIsDisconnecting(false)

					break

				default:
					log.warn('Invalid case for handleDisconnect')
					setIsDisconnecting(false)

					break
			}
		} catch (e) {
			showErrorNotification('Something went wrong', 'Please try again ')
			setIsDisconnecting(false)
		}
	}, [agreement?.id, connection, onModalClosed, sdk])

	return (
		<>
			<Modal
				opened={isOpened}
				onClose={() => onModalClosed()}
				overlayProps={{ blur: 8 }}
				withCloseButton={false}
				radius={16}
				size={'lg'}
				padding={'sm'}
			>
				<Space h={16} />

				{isDisconnecting && (
					<Center>
						<Loader variant="oval" color="cyan" />
						<Space h={16} />
					</Center>
				)}

				{!isDisconnecting && (
					<>
						{!connection && (
							<Center>
								<Text>No connection provided.</Text>
								<Space h={16} />
							</Center>
						)}

						{connection && (
							<>
								<Center>
									<Text
										className={meemTheme.tMediumBold}
										style={{ textAlign: 'center' }}
									>
										{`Are you sure you want to disconnect ${
											connection.platform ===
											MeemAPI.RuleIo.Discord
												? 'Discord'
												: connection.platform ===
												  MeemAPI.RuleIo.Twitter
												? 'Twitter'
												: 'Slack'
										} from
					CommunityTweets?`}
									</Text>
								</Center>
								<Space h={24} />
								<Center>
									{(connection.type ===
										CTConnectionType.InputOnly ||
										connection.type ===
											CTConnectionType.InputAndOutput) && (
										<>
											<Text
												className={
													meemTheme.tSmallFaded
												}
												style={{
													textAlign: 'center',
													lineHeight: 1.4
												}}
											>
												{`All proposal flows using this source will be deleted.`}
											</Text>
										</>
									)}
									{connection.type ===
										CTConnectionType.OutputOnly && (
										<>
											<Text
												className={
													meemTheme.tSmallFaded
												}
												style={{
													textAlign: 'center',
													lineHeight: 1.4
												}}
											>
												{`Proposal flows using this connection will no longer publish.`}
											</Text>
										</>
									)}
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
							</>
						)}
						<Space h={16} />
						<Center>
							<Button
								className={meemTheme.buttonGrey}
								onClick={() => {
									onModalClosed()
								}}
							>
								Cancel
							</Button>
						</Center>
					</>
				)}

				<Space h={16} />
			</Modal>
		</>
	)
}
