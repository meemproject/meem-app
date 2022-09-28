/* eslint-disable @typescript-eslint/naming-convention */
import { useSubscription } from '@apollo/client'
import log from '@kengoldfarb/log'
import { Text, Space, Modal, Loader } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { MeemAPI } from '@meemproject/api'
import { makeFetcher, useSockets, useWallet } from '@meemproject/react'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { AlertCircle, Check } from 'tabler-icons-react'
import {
	GetClubSubscriptionSubscription // eslint-disable-next-line import/namespace
} from '../../../../../generated/graphql'
import { SUB_CLUB } from '../../../../graphql/clubs'
import { Club, ClubMember, ClubRole } from '../../../../model/club/club'
import { useGlobalStyles } from '../../../Styles/GlobalStyles'
// eslint-disable-next-line import/namespace

interface IProps {
	club?: Club
	isExistingRole?: boolean
	role?: ClubRole
	roleMembers?: ClubMember[]
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

	const { classes: styles } = useGlobalStyles()

	const [isSavingChanges, setIsSavingChanges] = useState(false)

	const [currentClubDataString, setCurrentClubDataString] = useState('')

	const [hasSubscribedToSockets, setHasSubscribedToSockets] = useState(false)

	const { connect, sockets, isConnected: isSocketsConnected } = useSockets()

	const closeModal = useCallback(() => {
		if (sockets) {
			sockets.unsubscribe([
				{ type: MeemAPI.MeemEvent.Err },
				{ type: MeemAPI.MeemEvent.MeemIdUpdated },
				{ type: MeemAPI.MeemEvent.MeemMinted }
			])
		}
		onModalClosed()
		setHasSubscribedToSockets(false)
		setIsSavingChanges(false)
		setCurrentClubDataString('')
	}, [onModalClosed, sockets])

	const {
		loading,
		error,
		data: clubData
	} = useSubscription<GetClubSubscriptionSubscription>(SUB_CLUB, {
		variables: {
			slug: club?.slug ?? '',
			visibilityLevel: ['mutual-club-members', 'anyone'],
			showPublicApps: [true, false]
		}
	})

	useEffect(() => {
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
				permissionsArray.push(permission.id)
			})

			const membersArray: string[] = []
			if (roleMembers) {
				roleMembers.forEach(member => {
					membersArray.push(member.wallet)
				})
			}

			if (isExistingRole) {
				// Save the updates to the existing role
				try {
					const updateRoleFetcher = makeFetcher<
						MeemAPI.v1.UpdateMeemContractRole.IQueryParams,
						MeemAPI.v1.UpdateMeemContractRole.IRequestBody,
						MeemAPI.v1.UpdateMeemContractRole.IResponseBody
					>({
						method: MeemAPI.v1.UpdateMeemContractRole.method
					})

					await updateRoleFetcher(
						MeemAPI.v1.UpdateMeemContractRole.path({
							meemContractId: club.id ?? '',
							meemContractRoleId: role.id ?? ''
						}),
						undefined,
						{
							permissions: permissionsArray,
							members: membersArray
						}
					)

					// Now wait for change on club
				} catch (e) {
					log.debug(e)
					showNotification({
						title: 'Error',
						autoClose: 5000,
						color: 'red',
						icon: <AlertCircle />,
						message: `Unable to save role. Please let us know!`
					})
					setIsSavingChanges(false)
					return
				}
			} else {
				// Create a new role
				try {
					const saveRoleFetcher = makeFetcher<
						MeemAPI.v1.CreateMeemContractRole.IQueryParams,
						MeemAPI.v1.CreateMeemContractRole.IRequestBody,
						MeemAPI.v1.CreateMeemContractRole.IResponseBody
					>({
						method: MeemAPI.v1.CreateMeemContractRole.method
					})

					await saveRoleFetcher(
						MeemAPI.v1.CreateMeemContractRole.path({
							meemContractId: club.id ?? ''
						}),
						undefined,
						{
							name: role.name,
							permissions: permissionsArray,
							members: membersArray
						}
					)
					// Now wait for change on club
				} catch (e) {
					log.debug(e)
					showNotification({
						title: 'Error',
						autoClose: 5000,
						color: 'red',
						icon: <AlertCircle />,
						message: `Unable to save role. Please let us know!`
					})
					setIsSavingChanges(false)
					closeModal()
					return
				}
			}
		}
		function compareClubData() {
			if (clubData) {
				const newClubDataString = JSON.stringify(clubData)

				if (currentClubDataString === newClubDataString) {
					log.debug('nothing has changed on the club yet.')
				} else {
					log.debug('changes detected on the club.')
					closeModal()

					showNotification({
						radius: 'lg',
						title: 'Success!',
						autoClose: 5000,
						color: 'green',
						icon: <Check color="green" />,

						message: `${clubData.MeemContracts[0].name} has been updated.`
					})

					if (isExistingRole) {
						if (club && role) {
							// Navigate to the saved role
							router.push({
								pathname: `/${club.slug}/roles`,
								query: {
									role: `/${role.id}`
								}
							})
						}
					} else {
						// Navigate to the roles list
						if (club) {
							router.push({
								pathname: `/${club.slug}/roles`
							})
						}
					}
				}
			}
		}

		if (clubData && !loading && !error && isOpened) {
			if (currentClubDataString.length === 0) {
				if (clubData.MeemContracts.length > 0) {
					// Set initial club data
					log.debug('setting initial club data...')
					setCurrentClubDataString(JSON.stringify(clubData))
				}
			} else {
				// compare to initial club fata
				compareClubData()
			}
		}

		if (
			!hasSubscribedToSockets &&
			sockets &&
			wallet.accounts[0] &&
			isOpened
		) {
			setHasSubscribedToSockets(true)

			sockets.subscribe(
				[{ key: MeemAPI.MeemEvent.Err }],
				wallet.accounts[0]
			)
			sockets.on({
				eventName: MeemAPI.MeemEvent.Err,
				handler: err => {
					log.crit('SOCKET ERROR CAUGHT!!!!!!!!!!')
					log.crit(err)
					log.crit(err.detail.code)
					showNotification({
						radius: 'lg',
						title: 'Error saving changes',
						message:
							'An error occurred while saving changes. Please try again.',
						color: 'red'
					})

					closeModal()
				}
			})
		}

		if (isOpened && !hasSubscribedToSockets) {
			connect()
			saveRoleChanges()
		}
	}, [
		closeModal,
		connect,
		isSavingChanges,
		isSocketsConnected,
		club,
		clubData,
		currentClubDataString,
		error,
		hasSubscribedToSockets,
		isOpened,
		loading,
		onModalClosed,
		sockets,
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
				<div className={styles.modalHeader}>
					<Space h={128} />

					<Loader color="red" variant="oval" />
					<Space h={24} />
					<Text
						className={styles.tTitle}
					>{`There's magic happening on the blockchain.`}</Text>
					<Space h={24} />

					<Text
						className={styles.tSubtitle}
						styles={{ textAlign: 'center' }}
					>{`Please wait while your request is confirmed.\nThis could take up to a few minutes.`}</Text>
				</div>
				<Space h={12} />
			</Modal>
		</>
	)
}
