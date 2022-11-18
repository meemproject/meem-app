import log from '@kengoldfarb/log'
import { Text, Space, Modal, Divider, Radio, Button } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import type { UserIdentity } from '@meemproject/react'
import {
	MeemAPI,
	updateUserIdentity,
	detachUserIdentity
} from '@meemproject/sdk'
import React, { useEffect, useState } from 'react'
import { AlertCircle } from 'tabler-icons-react'
import { colorPink, useClubsTheme } from '../../../Styles/ClubsTheme'
interface IProps {
	userIdentity?: UserIdentity
	isOpened: boolean
	onModalClosed: () => void
}

export const ManageLinkedAccountModal: React.FC<IProps> = ({
	userIdentity,
	isOpened,
	onModalClosed
}) => {
	const { classes: clubsTheme } = useClubsTheme()

	const [isSavingChanges, setIsSavingChanges] = useState(false)
	const [integrationVisibility, setIntegrationVisibility] =
		useState<MeemAPI.IntegrationVisibility>()
	const integration = userIdentity?.IdentityIntegration

	const saveChanges = async () => {
		setIsSavingChanges(true)

		log.debug(`integration id to edit: ${integration?.id}`)

		// Save the change to the db
		try {
			// await request
			// 	.post(
			// 		`${
			// 			process.env.NEXT_PUBLIC_API_URL
			// 		}${MeemAPI.v1.CreateOrUpdateMeemIdIntegration.path({
			// 			integrationId: integration?.id ?? ''
			// 		})}`
			// 	)
			// 	.set('Authorization', `JWT ${wallet.jwt}`)
			// 	.send({
			// 		visibility: integrationVisibility
			// 	})
			if (integration?.id) {
				await updateUserIdentity({
					identityIntegrationId: integration.id,
					visibility: integrationVisibility
				})
			}
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
			setIntegrationVisibility(
				(userIdentity?.visibility as MeemAPI.IntegrationVisibility) ??
					MeemAPI.IntegrationVisibility.Anyone
			)
		}
	}, [userIdentity, isOpened])

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
							{`You've successfully verified @${userIdentity?.metadata?.twitterUsername} as your Twitter username.`}
						</Text>
					)}
					{integration?.name === 'Discord' && (
						<Text>
							{`You've successfully verified ${userIdentity?.metadata?.discordUsername} as your Discord username.`}
						</Text>
					)}
					{integration?.name === 'Email' && (
						<Text>
							{`You've successfully verified ${userIdentity?.metadata?.emailAddress} as your email address.`}
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
					<Space h={24} />
					<Button
						className={clubsTheme.buttonBlack}
						loading={isSavingChanges}
						onClick={() => {
							if (userIdentity?.IdentityIntegrationId) {
								detachUserIdentity({
									identityIntegrationId:
										userIdentity?.IdentityIntegrationId
								})
								onModalClosed()
							}
						}}
					>
						Detach Integration
					</Button>
				</div>
			</Modal>
		</>
	)
}
