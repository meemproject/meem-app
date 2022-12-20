/* eslint-disable no-unused-vars */
import log from '@kengoldfarb/log'
import { Text, Space, Modal, Divider, Button } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useSDK } from '@meemproject/react'
import router from 'next/router'
// eslint-disable-next-line import/no-extraneous-dependencies
import React, { useState } from 'react'
import { AlertCircle, CircleCheck } from 'tabler-icons-react'
import { Club, ClubRole } from '../../../../model/club/club'
import { colorBlue, useClubsTheme } from '../../../Styles/ClubsTheme'

interface IProps {
	isOpened: boolean
	onModalClosed: () => void
	role?: ClubRole
	club?: Club
}

export const DeleteRoleModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed,
	role,
	club
}) => {
	const { classes: clubsTheme } = useClubsTheme()

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { sdk } = useSDK()

	const [isDeletingRole, setIsDeletingRole] = useState(false)

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const deleteRole = async () => {
		if (role && club) {
			setIsDeletingRole(true)

			try {
				// TODO: Deleting a role not supported in the SDK yet.

				showNotification({
					title: 'Deleted role',
					autoClose: 5000,
					icon: <CircleCheck />,
					message: `Redirecting you. Please wait...`
				})

				router.reload()
			} catch (e) {
				log.debug(e)
				showNotification({
					title: 'Error',
					autoClose: 5000,
					color: colorBlue,
					icon: <AlertCircle />,
					message: `Unable to delete this role. Please let us know!`
				})
				setIsDeletingRole(false)
				return
			}
		}
	}

	return (
		<>
			<Modal
				centered
				radius={16}
				overlayBlur={8}
				size={'60%'}
				padding={'lg'}
				withCloseButton={!isDeletingRole}
				opened={isOpened}
				title={
					<Text className={clubsTheme.tMediumBold}>Delete Role</Text>
				}
				onClose={() => {
					onModalClosed()
				}}
			>
				<Divider />
				<Space h={24} />
				<Text
					className={clubsTheme.tMediumBold}
				>{`Deleting roles is coming soon.`}</Text>
				<Space h={16} />

				<Text
					className={clubsTheme.tSmall}
				>{`It's complicated. We're working on it!`}</Text>
				<Space h={32} />
				<Button
					onClick={() => {
						onModalClosed()
					}}
					className={clubsTheme.buttonGrey}
				>
					Close
				</Button>

				{/* <Text
					className={clubsTheme.tMediumBold}
				>{`Are you sure you want to delete this role?`}</Text>
				<Space h={32} />
				<div className={clubsTheme.row}>
					<Button
						loading={isDeletingRole}
						className={clubsTheme.buttonBlack}
						onClick={async () => {
							deleteRole()
						}}
					>
						{isDeletingRole ? 'Deleting' : 'Delete'}
					</Button>
					{!isDeletingRole && (
						<>
							<Space w={8} />
							<Button
								onClick={() => {
									onModalClosed()
								}}
								className={clubsTheme.buttonGrey}
							>
								Cancel
							</Button>
						</>
					)}
				</div> */}
			</Modal>
		</>
	)
}
