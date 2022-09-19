/* eslint-disable @typescript-eslint/naming-convention */
import { useSubscription } from '@apollo/client'
import log from '@kengoldfarb/log'
import { createStyles, Text, Space, Modal, Loader } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { MeemAPI } from '@meemproject/api'
import { makeFetcher, useSockets, useWallet } from '@meemproject/react'
import React, { useCallback, useEffect, useState } from 'react'
import { Check } from 'tabler-icons-react'
import {
	GetClubSubscriptionSubscription // eslint-disable-next-line import/namespace
} from '../../../../../generated/graphql'
import { SUB_CLUB } from '../../../../graphql/clubs'
import { Club, ClubMember, ClubRole } from '../../../../model/club/club'
// eslint-disable-next-line import/namespace

const useStyles = createStyles(() => ({
	header: {
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'column',
		paddingTop: 8,
		paddingBottom: 8,
		paddingLeft: 16,
		paddingRight: 16,
		position: 'relative'
	},
	modalTitle: {
		fontWeight: 600,
		fontSize: 18
	},
	title: {
		fontWeight: 600,
		fontSize: 24
	},
	info: {
		fontWeight: 600,
		textAlign: 'center',
		fontSize: 18
	}
}))

interface IProps {
	club?: Club
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
	roleMembers
}) => {
	const wallet = useWallet()

	const { classes } = useStyles()

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

			// TODO: Save role change(s)

			//setIsSavingChanges(false)
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
		wallet
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
				<div className={classes.header}>
					<Space h={128} />

					<Loader color="red" variant="oval" />
					<Space h={24} />
					<Text
						className={classes.title}
					>{`There's magic happening on the blockchain.`}</Text>
					<Space h={24} />

					<Text
						className={classes.info}
					>{`Please wait while your request is confirmed.\nThis could take up to a few minutes.`}</Text>
				</div>
				<Space h={12} />
			</Modal>
		</>
	)
}
