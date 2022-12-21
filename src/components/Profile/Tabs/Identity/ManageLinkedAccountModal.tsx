import log from '@kengoldfarb/log'
import { Text, Space, Modal, Divider, Radio, Button } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useSDK } from '@meemproject/react'
import type { UserIdentity } from '@meemproject/react'
import { MeemAPI } from '@meemproject/sdk'
import React, { useEffect, useState } from 'react'
import { AlertCircle } from 'tabler-icons-react'
import { colorBlue, useMeemTheme } from '../../../Styles/MeemTheme'
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
	const { classes: meemTheme } = useMeemTheme()

	const [isSavingChanges, setIsSavingChanges] = useState(false)

	const { sdk } = useSDK()
	const [extensionVisibility, setIntegrationVisibility] =
		useState<MeemAPI.IUserIdentityVisibility>()
	const extension = userIdentity?.IdentityProvider

	const saveChanges = async () => {
		setIsSavingChanges(true)

		log.debug(`extension id to edit: ${extension?.id}`)

		// Save the change to the db
		try {
			// await request
			// 	.post(
			// 		`${
			// 			process.env.NEXT_PUBLIC_API_URL
			// 		}${MeemAPI.v1.CreateOrUpdateMeemIdIntegration.path({
			// 			extensionId: extension?.id ?? ''
			// 		})}`
			// 	)
			// 	.set('Authorization', `JWT ${wallet.jwt}`)
			// 	.send({
			// 		visibility: extensionVisibility
			// 	})
			if (userIdentity?.id) {
				await sdk.id.updateUserIdentity({
					userIdentityId: userIdentity.id,
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
				color: colorBlue,
				icon: <AlertCircle />,
				message: `Unable to save changes to this account.`
			})
			return
		}
	}

	useEffect(() => {
		if (isOpened) {
			setIntegrationVisibility(
				(userIdentity?.visibility as MeemAPI.IUserIdentityVisibility) ??
					MeemAPI.IUserIdentityVisibility.Anyone
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
							<Text className={meemTheme.tMediumBold}>
								Twitter Settings
							</Text>
						)}
						{extension?.name === 'Discord' && (
							<Text className={meemTheme.tMediumBold}>
								Discord Settings
							</Text>
						)}
						{extension?.name === 'Email' && (
							<Text className={meemTheme.tMediumBold}>
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

				<div className={meemTheme.modalStepsContainer}>
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
						<Text className={meemTheme.tExtraSmallBold}>
							{`Who can view this username?`}
						</Text>
					)}
					{extension?.name === 'Email' && (
						<Text className={meemTheme.tExtraSmallBold}>
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
							setIntegrationVisibility(value)
						}}
						required
					>
						<Radio value="anyone" label="Anyone" />
						<Radio
							value="mutual-agreement-members"
							label="Mutual agreement members"
						/>
						<Radio value="just-me" label="Just me" />
					</Radio.Group>
					<Space h={24} />

					<Button
						className={meemTheme.buttonBlack}
						loading={isSavingChanges}
						onClick={() => {
							saveChanges()
						}}
					>
						Save Preferences
					</Button>
					<Space h={24} />
					<Button
						className={meemTheme.buttonBlack}
						loading={isSavingChanges}
						onClick={() => {
							if (userIdentity?.id) {
								sdk.id.removeUserIdentity({
									userIdentityId: userIdentity.id
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
