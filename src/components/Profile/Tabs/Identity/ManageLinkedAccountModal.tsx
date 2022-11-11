import log from '@kengoldfarb/log'
import { Text, Space, Modal, Divider, Radio, Button } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { MeemAPI } from '@meemproject/api'
import { useWallet } from '@meemproject/react'
import React, { useEffect, useState } from 'react'
import request from 'superagent'
import { AlertCircle } from 'tabler-icons-react'
import { IdentityIntegration } from '../../../../model/identity/identity'
import { colorPink, useClubsTheme } from '../../../Styles/ClubsTheme'
interface IProps {
	integration?: IdentityIntegration
	isOpened: boolean
	onModalClosed: () => void
}

export const ManageLinkedAccountModal: React.FC<IProps> = ({
	integration,
	isOpened,
	onModalClosed
}) => {
	const { classes: clubsTheme } = useClubsTheme()
	const wallet = useWallet()

	const [isSavingChanges, setIsSavingChanges] = useState(false)
	const [integrationVisibility, setIntegrationVisibility] = useState('')

	const saveChanges = async () => {
		setIsSavingChanges(true)

		log.debug(`integration id to edit: ${integration?.id}`)

		// Save the change to the db
		try {
			await request
				.post(
					`${
						process.env.NEXT_PUBLIC_API_URL
					}${MeemAPI.v1.CreateOrUpdateMeemIdIntegration.path({
						integrationId: integration?.id ?? ''
					})}`
				)
				.set('Authorization', `JWT ${wallet.jwt}`)
				.send({
					visibility: integrationVisibility
				})
			setIsSavingChanges(false)
			onModalClosed()
		} catch (e) {
			log.debug(e)
			setIsSavingChanges(false)

			showNotification({
				title: 'Oops!',
				autoClose: 5000,
				color: colorPink,
				icon: <AlertCircle />,
				message: `Unable to save changes to this account.`
			})
			return
		}
	}

	useEffect(() => {
		if (isOpened) {
			setIntegrationVisibility(integration?.visibility ?? 'anyone')
		}
	}, [integration?.visibility, isOpened])

	return (
		<>
			<Modal
				centered
				closeOnClickOutside={false}
				closeOnEscape={false}
				withCloseButton={!isSavingChanges}
				radius={16}
				overlayBlur={8}
				size={'50%'}
				padding={'sm'}
				opened={isOpened}
				title={
					<>
						{integration?.name === 'Twitter' && (
							<Text className={clubsTheme.tMediumBold}>
								Twitter Settings
							</Text>
						)}
						{integration?.name === 'Discord' && (
							<Text className={clubsTheme.tMediumBold}>
								Discord Settings
							</Text>
						)}
						{integration?.name === 'Email' && (
							<Text className={clubsTheme.tMediumBold}>
								Email Address Settings
							</Text>
						)}
					</>
				}
				onClose={() => {
					onModalClosed()
				}}
			>
				<Divider />

				<Space h={24} />

				<div className={clubsTheme.modalStepsContainer}>
					{integration?.name === 'Twitter' && (
						<Text>
							{`You've successfully verified @${integration.metadata?.twitterUsername} as your Twitter username.`}
						</Text>
					)}
					{integration?.name === 'Discord' && (
						<Text>
							{`You've successfully verified ${integration.metadata?.discordUsername} as your Discord username.`}
						</Text>
					)}
					{integration?.name === 'Email' && (
						<Text>
							{`You've successfully verified ${integration.metadata?.emailAddress} as your email address.`}
						</Text>
					)}
					<Space h={24} />
					{(integration?.name === 'Twitter' ||
						integration?.name === 'Discord') && (
						<Text className={clubsTheme.tExtraSmallBold}>
							{`Who can view this username?`}
						</Text>
					)}
					{integration?.name === 'Email' && (
						<Text className={clubsTheme.tExtraSmallBold}>
							{`who can view this email address?`}
						</Text>
					)}
					<Radio.Group
						orientation="vertical"
						spacing={10}
						size="sm"
						color="dark"
						value={integrationVisibility}
						onChange={(value: any) => {
							setIntegrationVisibility(value)
						}}
						required
					>
						<Radio value="anyone" label="Anyone" />
						<Radio
							value="mutual-club-members"
							label="Mutual club members"
						/>
						<Radio value="just-me" label="Just me" />
					</Radio.Group>
					<Space h={24} />

					<Button
						className={clubsTheme.buttonBlack}
						loading={isSavingChanges}
						onClick={() => {
							saveChanges()
						}}
					>
						Save Preferences
					</Button>
				</div>
			</Modal>
		</>
	)
}
