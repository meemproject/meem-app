import log from '@kengoldfarb/log'
import { Text, Space, Modal, Button, Center, Loader } from '@mantine/core'
import { useAuth } from '@meemproject/react'
import { makeRequest } from '@meemproject/sdk'
// eslint-disable-next-line import/no-extraneous-dependencies
import React, { useCallback, useState } from 'react'
import {
	showSuccessNotification,
	showErrorNotification
} from '../../../../utils/notifications'
import { useAgreement } from '../../../AgreementHome/AgreementProvider'
import { useMeemTheme } from '../../../Styles/MeemTheme'
import { SymphonyConnection, SymphonyConnectionType } from '../Model/symphony'
import { API } from '../symphonyTypes.generated'

interface IProps {
	connection?: SymphonyConnection
	isOpened: boolean
	onModalClosed: () => void
}

export const SymphonyDisconnectModal: React.FC<IProps> = ({
	connection,
	isOpened,
	onModalClosed
}) => {
	const { classes: meemTheme } = useMeemTheme()
	const [isDisconnecting, setIsDisconnecting] = useState(false)

	const { agreement } = useAgreement()
	const { jwt } = useAuth()

	const handleDisconnect = useCallback(async () => {
		if (!jwt || !agreement?.id || !connection) {
			return
		}

		setIsDisconnecting(true)

		try {
			// TODO: Slack
			switch (connection.platform) {
				case API.RuleIo.Discord:
					await makeRequest<API.v1.DisconnectDiscord.IDefinition>(
						`${
							process.env.NEXT_PUBLIC_SYMPHONY_API_URL
						}${API.v1.DisconnectDiscord.path()}`,
						{
							method: API.v1.DisconnectDiscord.method,
							body: {
								jwt,
								agreementDiscordId: connection.id
							}
						}
					)
					showSuccessNotification(
						'Discord Disconnected',
						'Discord has been disconnected'
					)
					onModalClosed()
					setIsDisconnecting(false)
					break

				case API.RuleIo.Twitter:
					await makeRequest<API.v1.DisconnectTwitter.IDefinition>(
						`${
							process.env.NEXT_PUBLIC_SYMPHONY_API_URL
						}${API.v1.DisconnectTwitter.path()}`,
						{
							method: API.v1.DisconnectTwitter.method,
							body: {
								jwt,
								agreementTwitterId: connection.id
							}
						}
					)
					showSuccessNotification(
						'Twitter Disconnected',
						'Twitter has been disconnected'
					)
					onModalClosed()
					setIsDisconnecting(false)

					break

				case API.RuleIo.Slack:
					await makeRequest<API.v1.DisconnectSlack.IDefinition>(
						`${
							process.env.NEXT_PUBLIC_SYMPHONY_API_URL
						}${API.v1.DisconnectSlack.path()}`,
						{
							method: API.v1.DisconnectSlack.method,
							body: {
								jwt,
								agreementSlackId: connection.id
							}
						}
					)
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
	}, [jwt, agreement?.id, connection, onModalClosed])

	return (
		<>
			<Modal
				opened={isOpened}
				onClose={() => onModalClosed()}
				overlayBlur={8}
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

				{isDisconnecting && (
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
											API.RuleIo.Discord
												? 'Discord'
												: connection.platform ===
												  API.RuleIo.Twitter
												? 'Twitter'
												: 'Slack'
										} from
					Symphony?`}
									</Text>
								</Center>
								<Space h={24} />
								<Center>
									{(connection.type ===
										SymphonyConnectionType.InputOnly ||
										connection.type ===
											SymphonyConnectionType.InputAndOutput) && (
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
										SymphonyConnectionType.OutputOnly && (
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
