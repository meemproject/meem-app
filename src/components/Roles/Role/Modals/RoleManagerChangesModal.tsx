/* eslint-disable @typescript-eslint/naming-convention */
import log from '@kengoldfarb/log'
import { Text, Space, Modal, Loader } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useSDK, useWallet } from '@meemproject/react'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { AlertCircle, Check } from 'tabler-icons-react'
import { Club, ClubMember, ClubRole } from '../../../../model/club/club'
import { colorBlue, useClubsTheme } from '../../../Styles/ClubsTheme'

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

	const { sdk } = useSDK()

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
					await sdk.agreement.reInitializeAgreementRole({
						agreementId: club?.id ?? '',
						agreementRoleId: role?.id,
						name: role.name,
						metadata: {
							meem_metadata_type: 'Meem_AgreementContract',
							meem_metadata_version: '20221116',
							permissions: permissionsArray,
							members: membersArray,
							isTokenBasedRole: true,
							isTokenTransferrable: role.isTransferrable ?? false
						}
					})

					onRoleChangesSaved()
				} catch (e) {
					log.debug(e)
					showNotification({
						title: 'Error',
						autoClose: 5000,
						color: colorBlue,
						icon: <AlertCircle />,
						message: `Unable to save role. Please let us know!`
					})
					setIsSavingChanges(false)
					return
				}
			} else {
				// Create a new role
				try {
					await sdk.agreement.createAgreementRole({
						name: role.name,
						metadata: {
							meem_metadata_type: 'Meem_AgreementContract',
							meem_metadata_version: '20221116',
							permissions: permissionsArray,
							members: membersArray,
							isTokenBasedRole: true,
							isTokenTransferrable: role.isTransferrable ?? false
						},
						maxSupply: '0',
						agreementId: club.id ?? ''
					})

					onRoleChangesSaved()
				} catch (e) {
					log.debug(e)
					showNotification({
						title: 'Error',
						autoClose: 5000,
						color: colorBlue,
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
		router,
		sdk.agreement
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

					<Loader color="blue" variant="oval" />
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
