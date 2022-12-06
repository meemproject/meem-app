/* eslint-disable @typescript-eslint/naming-convention */
import log from '@kengoldfarb/log'
import { Text, Space, Modal, Loader } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useWallet } from '@meemproject/react'
import { makeFetcher, MeemAPI } from '@meemproject/sdk'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { AlertCircle, Check } from 'tabler-icons-react'
import { Club, ClubMember, ClubRole } from '../../../../model/club/club'
import { colorPink, useClubsTheme } from '../../../Styles/ClubsTheme'

interface IProps {
	club?: Club
	isExistingRole?: boolean
	role?: ClubRole
	roleMembers?: ClubMember[]
	roleName?: string
	isOpened: boolean
	onModalClosed: () => void
}

export const RoleManagerChangesModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed,
	club,
	role,
	isExistingRole,
	roleMembers
}) => {
	const wallet = useWallet()

	const router = useRouter()

	const { classes: clubsTheme } = useClubsTheme()

	const [isSavingChanges, setIsSavingChanges] = useState(false)

	const [currentClubDataString, setCurrentClubDataString] = useState('')

	const closeModal = useCallback(() => {
		onModalClosed()
		setIsSavingChanges(false)
		setCurrentClubDataString('')
	}, [onModalClosed])

	useEffect(() => {
		function onRoleChangesSaved() {
			log.debug('role changes saved')

			showNotification({
				radius: 'lg',
				title: 'Role saved!',
				autoClose: 5000,
				color: 'green',
				icon: <Check color="green" />,
				message: `This role has been saved. Please wait...`
			})
			if (club) {
				if (router.query.createRole) {
					router.push({
						pathname: `/${club.slug}/admin`,
						query: { tab: 'roles' }
					})
				} else {
					router.reload()
				}
			}
		}

		async function saveRoleChanges() {
			if (!wallet.web3Provider || !club) {
				log.debug('no web3provider or club')
				return
			}

			setIsSavingChanges(true)

			if (!role) {
				closeModal()
				return
			}

			const permissionsArray: string[] = []
			role.permissions.forEach(permission => {
				if (permission.enabled) {
					permissionsArray.push(permission.id)
				}
			})

			const membersArray: string[] = []
			if (roleMembers && roleMembers.length > 0) {
				roleMembers.forEach(member => {
					membersArray.push(member.wallet)
				})
			}

			if (isExistingRole) {
				// Save the updates to the existing role
				try {
					const updateRoleFetcher = makeFetcher<
						MeemAPI.v1.UpdateAgreementRole.IQueryParams,
						MeemAPI.v1.UpdateAgreementRole.IRequestBody,
						MeemAPI.v1.UpdateAgreementRole.IResponseBody
					>({
						method: MeemAPI.v1.UpdateAgreementRole.method
					})

					log.debug(
						`path: ${MeemAPI.v1.UpdateAgreementRole.path({
							agreementId: club.id ?? '',
							agreementRoleId: role.id ?? ''
						})}`
					)

					log.debug(
						`data: ${JSON.stringify({
							permissions: permissionsArray,
							members: membersArray
						})}`
					)

					await updateRoleFetcher(
						MeemAPI.v1.UpdateAgreementRole.path({
							agreementId: club.id ?? '',
							agreementRoleId: role.id ?? ''
						}),
						undefined,
						{
							name: role.name,
							permissions: permissionsArray,
							members: membersArray
						}
					)

					onRoleChangesSaved()
				} catch (e) {
					log.debug(e)
					showNotification({
						title: 'Error',
						autoClose: 5000,
						color: colorPink,
						icon: <AlertCircle />,
						message: `Unable to save role. Please let us know!`
					})
					setIsSavingChanges(false)
					return
				}
			} else {
				// Create a new role
				try {
					// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
					const saveRoleFetcher = makeFetcher<
						MeemAPI.v1.CreateAgreementRole.IQueryParams,
						MeemAPI.v1.CreateAgreementRole.IRequestBody,
						MeemAPI.v1.CreateAgreementRole.IResponseBody
					>({
						method: MeemAPI.v1.CreateAgreementRole.method
					})

					// await saveRoleFetcher(
					// 	MeemAPI.v1.CreateAgreementRole.path({
					// 		agreementId: club.id ?? ''
					// 	}),
					// 	undefined,
					// 	{
					// 		name: role.name,
					// 		permissions: permissionsArray,
					// 		members: membersArray,
					// 		isTokenBasedRole: true,
					// 		isTokenTransferrable: role.isTransferrable ?? false
					// 	}
					// )

					onRoleChangesSaved()
				} catch (e) {
					log.debug(e)
					showNotification({
						title: 'Error',
						autoClose: 5000,
						color: colorPink,
						icon: <AlertCircle />,
						message: `Unable to save role. Please let us know!`
					})
					setIsSavingChanges(false)
					closeModal()
					return
				}
			}
		}

		if (isOpened && !isSavingChanges) {
			saveRoleChanges()
		}
	}, [
		closeModal,
		isSavingChanges,
		club,
		currentClubDataString,
		isOpened,
		onModalClosed,
		wallet,
		role,
		isExistingRole,
		roleMembers,
		router
	])

	return (
		<>
			<Modal
				fullScreen
				withCloseButton={false}
				closeOnClickOutside={false}
				closeOnEscape={false}
				size={'lg'}
				padding={'sm'}
				opened={isOpened}
				onClose={() => {
					closeModal()
				}}
			>
				<div className={clubsTheme.modalHeader}>
					<Space h={128} />

					<Loader color="red" variant="oval" />
					<Space h={24} />
					<Text
						className={clubsTheme.tLargeBold}
					>{`There's magic happening on the blockchain.`}</Text>
					<Space h={24} />

					<Text
						className={clubsTheme.tMediumBold}
						styles={{ textAlign: 'center' }}
					>{`Please wait while your request is confirmed.\nThis could take up to a few minutes.`}</Text>
				</div>
				<Space h={16} />
			</Modal>
		</>
	)
}
