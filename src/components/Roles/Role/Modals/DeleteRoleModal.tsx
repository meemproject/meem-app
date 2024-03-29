/* eslint-disable no-unused-vars */
import log from '@kengoldfarb/log'
import { Text, Space, Modal, Divider, Button } from '@mantine/core'
import { useSDK } from '@meemproject/react'
import router from 'next/router'
// eslint-disable-next-line import/no-extraneous-dependencies
import React, { useState } from 'react'
import {
	Agreement,
	AgreementRole
} from '../../../../model/agreement/agreements'
import {
	showErrorNotification,
	showSuccessNotification
} from '../../../../utils/notifications'
import { useMeemTheme } from '../../../Styles/MeemTheme'

interface IProps {
	isOpened: boolean
	onModalClosed: () => void
	role?: AgreementRole
	agreement?: Agreement
}

export const DeleteRoleModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed,
	role,
	agreement
}) => {
	const { classes: meemTheme } = useMeemTheme()

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { sdk } = useSDK()

	const [isDeletingRole, setIsDeletingRole] = useState(false)

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const deleteRole = async () => {
		if (role && agreement) {
			setIsDeletingRole(true)

			try {
				// TODO: Deleting a role not supported in the SDK yet.

				showSuccessNotification(
					'Deleted role',
					`Redirecting you. Please wait...`
				)

				router.reload()
			} catch (e) {
				log.debug(e)
				showErrorNotification(
					'Error',
					`Unable to delete this role. Contact us using the top-right link on this page.!`
				)
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
				overlayProps={{ blur: 8 }}
				size={'60%'}
				padding={'lg'}
				withCloseButton={!isDeletingRole}
				opened={isOpened}
				title={
					<Text className={meemTheme.tMediumBold}>Delete Role</Text>
				}
				onClose={() => {
					onModalClosed()
				}}
			>
				<Divider />
				<Space h={24} />
				<Text
					className={meemTheme.tMediumBold}
				>{`Deleting roles is coming soon.`}</Text>
				<Space h={16} />

				<Text
					className={meemTheme.tSmall}
				>{`It's complicated. We're working on it!`}</Text>
				<Space h={32} />
				<Button
					onClick={() => {
						onModalClosed()
					}}
					className={meemTheme.buttonGrey}
				>
					Close
				</Button>

				{/* <Text
					className={meemTheme.tMediumBold}
				>{`Are you sure you want to delete this role?`}</Text>
				<Space h={32} />
				<div className={meemTheme.row}>
					<Button
						loading={isDeletingRole}
						className={meemTheme.buttonBlack}
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
								className={meemTheme.buttonGrey}
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
