import log from '@kengoldfarb/log'
import { Text, Space, Modal, Divider, Button } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { makeFetcher, MeemAPI } from '@meemproject/api'
import router from 'next/router'
// eslint-disable-next-line import/no-extraneous-dependencies
import React, { useState } from 'react'
import { AlertCircle, CircleCheck } from 'tabler-icons-react'
import { Club, ClubRole } from '../../../../model/club/club'
import { useGlobalStyles } from '../../../Styles/GlobalStyles'

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
	const { classes: design } = useGlobalStyles()

	const [isDeletingRole, setIsDeletingRole] = useState(false)

	const deleteRole = async () => {
		if (role && club) {
			setIsDeletingRole(true)

			try {
				const updateRoleFetcher = makeFetcher<
					MeemAPI.v1.DeleteMeemContractRole.IQueryParams,
					MeemAPI.v1.DeleteMeemContractRole.IRequestBody,
					MeemAPI.v1.DeleteMeemContractRole.IResponseBody
				>({
					method: MeemAPI.v1.DeleteMeemContractRole.method
				})

				log.debug(
					`path: ${MeemAPI.v1.DeleteMeemContractRole.path({
						meemContractId: club.id ?? '',
						meemContractRoleId: role.id ?? ''
					})}`
				)

				await updateRoleFetcher(
					MeemAPI.v1.DeleteMeemContractRole.path({
						meemContractId: club.id ?? '',
						meemContractRoleId: role.id ?? ''
					})
				)

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
					color: 'red',
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
				title={<Text className={design.tMediumBold}>Delete Role</Text>}
				onClose={() => {
					onModalClosed()
				}}
			>
				<Divider />
				<Space h={24} />
				<Text
					className={design.tMediumBold}
				>{`Are you sure you want to delete this role?`}</Text>
				<Space h={32} />
				<div className={design.row}>
					<Button
						loading={isDeletingRole}
						className={design.buttonBlack}
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
								className={design.buttonGrey}
							>
								Cancel
							</Button>
						</>
					)}
				</div>
			</Modal>
		</>
	)
}
