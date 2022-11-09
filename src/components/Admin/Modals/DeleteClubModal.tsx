/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import log from '@kengoldfarb/log'
import { Text, Space, Modal, Divider, Button } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { makeFetcher, MeemAPI } from '@meemproject/api'
import router from 'next/router'
// eslint-disable-next-line import/no-extraneous-dependencies
import React, { useState } from 'react'
import { AlertCircle, CircleCheck } from 'tabler-icons-react'
import { Club } from '../../../model/club/club'
import { useGlobalStyles } from '../../Styles/GlobalStyles'

interface IProps {
	isOpened: boolean
	onModalClosed: () => void
	club?: Club
}

export const DeleteClubModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed,
	club
}) => {
	const { classes: design } = useGlobalStyles()

	const [isDeletingClub, setIsDeletingClub] = useState(false)

	const deleteClub = async () => {
		if (club) {
			setIsDeletingClub(true)

			try {
				// const updateRoleFetcher = makeFetcher<
				// 	MeemAPI.v1.DeleteMeemContractRole.IQueryParams,
				// 	MeemAPI.v1.DeleteMeemContractRole.IRequestBody,
				// 	MeemAPI.v1.DeleteMeemContractRole.IResponseBody
				// >({
				// 	method: MeemAPI.v1.DeleteMeemContractRole.method
				// })

				// await updateRoleFetcher(
				// 	MeemAPI.v1.DeleteMeemContractRole.path({
				// 		meemContractId: club.id ?? '',
				// 		meemContractRoleId: role.id ?? ''
				// 	})
				// )

				showNotification({
					title: 'Deleted Club',
					autoClose: 5000,
					icon: <CircleCheck />,
					message: `Redirecting you. Please wait...`
				})

				router.push('/')
			} catch (e) {
				log.debug(e)
				showNotification({
					title: 'Error',
					autoClose: 5000,
					color: 'red',
					icon: <AlertCircle />,
					message: `Unable to delete this club. Please let us know!`
				})
				setIsDeletingClub(false)
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
				withCloseButton={false}
				opened={isOpened}
				onClose={() => {
					onModalClosed()
				}}
			>
				<Space h={24} />
				<Text
					className={design.tSectionTitle}
				>{`Are you sure you want to delete this club?`}</Text>
				<Space h={8} />
				<Text>This action is permanent and cannot be undone.</Text>
				<Space h={32} />
				<Button
					loading={isDeletingClub}
					className={design.buttonRed}
					onClick={async () => {
						deleteClub()
					}}
				>
					{isDeletingClub ? 'Deleting...' : 'Delete Club'}
				</Button>
				{!isDeletingClub && (
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
			</Modal>
		</>
	)
}
