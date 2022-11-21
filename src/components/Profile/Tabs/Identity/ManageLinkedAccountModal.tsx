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
	const [extensionVisibility, setExtensionVisibility] =
		useState<MeemAPI.ExtensionVisibility>()
	const extension = userIdentity?.IdentityExtension

	const saveChanges = async () => {
		setIsSavingChanges(true)

		log.debug(`extension id to edit: ${extension?.id}`)

		// Save the change to the db
		try {
			// await request
			// 	.post(
			// 		`${
			// 			process.env.NEXT_PUBLIC_API_URL
			// 		}${MeemAPI.v1.CreateOrUpdateMeemIdExtension.path({
			// 			extensionId: extension?.id ?? ''
			// 		})}`
			// 	)
			// 	.set('Authorization', `JWT ${wallet.jwt}`)
			// 	.send({
			// 		visibility: extensionVisibility
			// 	})
			if (extension?.id) {
				await updateUserIdentity({
					identityExtensionId: extension.id,
					visibility: extensionVisibility
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
			setExtensionVisibility(
				(userIdentity?.visibility as MeemAPI.ExtensionVisibility) ??
					MeemAPI.ExtensionVisibility.Anyone
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
						{extension?.name === 'Twitter' && (
							<Text className={clubsTheme.tMediumBold}>
								Twitter Settings
							</Text>
						)}
						{extension?.name === 'Discord' && (
							<Text className={clubsTheme.tMediumBold}>
								Discord Settings
							</Text>
						)}
						{extension?.name === 'Email' && (
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
					{extension?.name === 'Twitter' && (
						<Text>
							{`You've successfully verified @${userIdentity?.metadata?.twitterUsername} as your Twitter username.`}
						</Text>
					)}
					{extension?.name === 'Discord' && (
						<Text>
							{`You've successfully verified ${userIdentity?.metadata?.discordUsername} as your Discord username.`}
						</Text>
					)}
					{extension?.name === 'Email' && (
						<Text>
							{`You've successfully verified ${userIdentity?.metadata?.emailAddress} as your email address.`}
						</Text>
					)}
					<Space h={24} />
					{(extension?.name === 'Twitter' ||
						extension?.name === 'Discord') && (
						<Text className={clubsTheme.tExtraSmallBold}>
							{`Who can view this username?`}
						</Text>
					)}
					{extension?.name === 'Email' && (
						<Text className={clubsTheme.tExtraSmallBold}>
							{`who can view this email address?`}
						</Text>
					)}
					<Radio.Group
						orientation="vertical"
						spacing={10}
						size="sm"
						color="dark"
						value={extensionVisibility}
						onChange={(value: any) => {
							setExtensionVisibility(value)
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
							if (userIdentity?.IdentityExtensionId) {
								detachUserIdentity({
									identityExtensionId:
										userIdentity?.IdentityExtensionId
								})
								onModalClosed()
							}
						}}
					>
						Detach Extension
					</Button>
				</div>
			</Modal>
		</>
	)
}
