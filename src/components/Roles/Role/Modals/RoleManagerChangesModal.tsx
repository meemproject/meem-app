/* eslint-disable @typescript-eslint/naming-convention */
import log from '@kengoldfarb/log'
import { Text, Space, Modal, Loader } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useSDK, useWallet } from '@meemproject/react'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { AlertCircle, Check } from 'tabler-icons-react'
import {
	Agreement,
	AgreementMember,
	AgreementRole
} from '../../../../model/agreement/agreements'
import { colorBlue, useMeemTheme } from '../../../Styles/MeemTheme'

interface IProps {
	agreement?: Agreement
	isExistingRole?: boolean
	role?: AgreementRole
	roleMembers?: AgreementMember[]
	roleName?: string
	isOpened: boolean
	onModalClosed: () => void
}

export const RoleManagerChangesModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed,
	agreement,
	role,
	roleName,
	isExistingRole,
	roleMembers
}) => {
	const wallet = useWallet()

	const router = useRouter()

	const { sdk } = useSDK()

	const { classes: meemTheme } = useMeemTheme()

	const [isSavingChanges, setIsSavingChanges] = useState(false)

	const [currentAgreementDataString, setCurrentAgreementDataString] =
		useState('')

	const closeModal = useCallback(() => {
		onModalClosed()
		setIsSavingChanges(false)
		setCurrentAgreementDataString('')
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
			if (agreement) {
				if (router.query.createRole) {
					router.push({
						pathname: `/${agreement.slug}/admin`,
						query: { tab: 'roles' }
					})
				} else {
					router.reload()
				}
			}
		}

		async function saveRoleChanges() {
			if (!wallet.web3Provider || !agreement) {
				log.debug('no web3provider or agreement')
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
						agreementId: agreement?.id ?? '',
						agreementRoleId: role?.id,
						name: role.name,
						metadata: {
							meem_metadata_type: 'Meem_AgreementRoleContract',
							meem_metadata_version: '20221116',
							name: role.name,
							description: '',
							meem_agreement_address: agreement.address
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
							meem_metadata_type: 'Meem_AgreementRoleContract',
							meem_metadata_version: '20221116',
							name: roleName ?? '',
							description: '',
							meem_agreement_address: agreement.address
						},
						maxSupply: '0',
						agreementId: agreement.id ?? ''
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
		agreement,
		currentAgreementDataString,
		isOpened,
		onModalClosed,
		wallet,
		role,
		isExistingRole,
		roleMembers,
		roleName,
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
				<div className={meemTheme.modalHeader}>
					<Space h={128} />

					<Loader color="blue" variant="oval" />
					<Space h={24} />
					<Text
						className={meemTheme.tLargeBold}
					>{`There's magic happening on the blockchain.`}</Text>
					<Space h={24} />

					<Text
						className={meemTheme.tMediumBold}
						styles={{ textAlign: 'center' }}
					>{`Please wait while your request is confirmed.\nThis could take up to a few minutes.`}</Text>
				</div>
				<Space h={16} />
			</Modal>
		</>
	)
}
