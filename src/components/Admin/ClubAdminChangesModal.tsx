import { useSubscription } from '@apollo/client'
import log from '@kengoldfarb/log'
import { createStyles, Text, Space, Modal, Loader } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { MeemAPI } from '@meemproject/api'
import { makeFetcher, useSockets, useWallet } from '@meemproject/react'
import { ethers } from 'ethers'
import React, { useCallback, useEffect, useState } from 'react'
import { Check } from 'tabler-icons-react'
// eslint-disable-next-line import/namespace
import {
	GetClubSubscriptionSubscription // eslint-disable-next-line import/namespace
} from '../../../generated/graphql'
import { SUB_CLUB } from '../../graphql/clubs'
import { Club, MembershipReqType } from '../../model/club/club'

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
		fontSize: 20
	},
	info: {
		fontWeight: 600,
		textAlign: 'center',
		fontSize: 15
	}
}))

interface IProps {
	club?: Club
	isOpened: boolean
	onModalClosed: () => void
}

export const ClubAdminChangesModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed,
	club
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
		variables: { slug: club?.slug ?? '' }
	})

	useEffect(() => {
		async function reinitialize() {
			if (!wallet.web3Provider || !club) {
				log.debug('no web3provider or club')
				return
			}

			setIsSavingChanges(true)

			log.debug(`reinitialize...`)

			try {
				// const clubSymbol = (club.name ?? '').split(' ')[0].toUpperCase()

				const applicationInstructions: string[] = []
				if (club.membershipSettings) {
					club.membershipSettings.requirements.forEach(
						requirement => {
							if (
								requirement.applicationInstructions &&
								requirement.applicationInstructions?.length > 0
							) {
								applicationInstructions.push(
									requirement.applicationInstructions
								)
							}
						}
					)
				}

				let membershipStartUnix = -1
				let membershipEndUnix = -1
				if (club.membershipSettings) {
					if (club.membershipSettings.membershipStartDate) {
						membershipStartUnix = Math.floor(
							new Date(
								club.membershipSettings.membershipStartDate
							).getTime() / 1000
						)
						log.debug(membershipStartUnix)
					}
					if (club.membershipSettings.membershipEndDate) {
						membershipEndUnix = Math.floor(
							new Date(
								club.membershipSettings.membershipEndDate
							).getTime() / 1000
						)
						log.debug(membershipEndUnix)
					}
				}

				const joinCostInWei = club.membershipSettings
					? ethers.utils.parseEther(
							`${club.membershipSettings.costToJoin}`
					  )
					: 0

				const mintPermissions: any[] = []
				if (club.membershipSettings) {
					club.membershipSettings.requirements.forEach(
						requirement => {
							switch (requirement.type) {
								case MembershipReqType.None:
									// Anyone can join for X MATIC
									mintPermissions.push({
										permission: MeemAPI.Permission.Anyone,
										addresses: [],
										numTokens: 0,
										costWei: joinCostInWei,
										mintStartTimestamp: club
											.membershipSettings
											?.membershipStartDate
											? club.membershipSettings?.membershipStartDate.getTime() /
											  1000
											: 0,
										mintEndTimestamp: club
											.membershipSettings
											?.membershipEndDate
											? club.membershipSettings?.membershipEndDate.getTime() /
											  1000
											: 0
									})
									break
								case MembershipReqType.ApprovedApplicants:
									// Approved applicants join for X MATIC
									mintPermissions.push({
										permission:
											MeemAPI.Permission.Addresses,
										addresses:
											requirement.approvedAddresses,
										numTokens: 0,
										costWei: joinCostInWei,
										mintStartTimestamp: club
											.membershipSettings
											?.membershipStartDate
											? club.membershipSettings?.membershipStartDate.getTime() /
											  1000
											: 0,
										mintEndTimestamp: club
											.membershipSettings
											?.membershipEndDate
											? club.membershipSettings?.membershipEndDate.getTime() /
											  1000
											: 0
									})
									break
								case MembershipReqType.TokenHolders:
									//Token holders with X tokens can join for X MATIC
									mintPermissions.push({
										permission: MeemAPI.Permission.Holders,
										addresses: [
											requirement.tokenContractAddress
										],
										numTokens: requirement.tokenMinQuantity,
										costWei: joinCostInWei,
										mintStartTimestamp: club
											.membershipSettings
											?.membershipStartDate
											? club.membershipSettings?.membershipStartDate.getTime() /
											  1000
											: 0,
										mintEndTimestamp: club
											.membershipSettings
											?.membershipEndDate
											? club.membershipSettings?.membershipEndDate.getTime() /
											  1000
											: 0
									})
									break
								case MembershipReqType.OtherClubMember:
									// Members of X club can join for X MATIC
									mintPermissions.push({
										permission: MeemAPI.Permission.Holders,
										addresses: [
											requirement.clubContractAddress
										],
										numTokens: requirement.tokenMinQuantity,
										costWei: joinCostInWei,
										mintStartTimestamp: club
											.membershipSettings
											?.membershipStartDate
											? club.membershipSettings?.membershipStartDate.getTime() /
											  1000
											: 0,
										mintEndTimestamp: club
											.membershipSettings
											?.membershipEndDate
											? club.membershipSettings?.membershipEndDate.getTime() /
											  1000
											: 0
									})
									break
							}
						}
					)

					// Now push special 'admin mint' permissions which bypass the other requirements
					log.debug('adding admin permissions...')
					club.admins?.forEach(admin => {
						mintPermissions.push({
							permission: MeemAPI.Permission.Addresses,
							addresses: [admin],
							numTokens: 0,
							costWei: 0,
							mintStartTimestamp: club.membershipSettings
								?.membershipStartDate
								? club.membershipSettings?.membershipStartDate.getTime() /
								  1000
								: 0,
							mintEndTimestamp: club.membershipSettings
								?.membershipEndDate
								? club.membershipSettings?.membershipEndDate.getTime() /
								  1000
								: 0
						})
					})
				}

				const reInitializeContractFetcher = makeFetcher<
					MeemAPI.v1.ReInitializeMeemContract.IQueryParams,
					MeemAPI.v1.ReInitializeMeemContract.IRequestBody,
					MeemAPI.v1.ReInitializeMeemContract.IResponseBody
				>({
					method: MeemAPI.v1.ReInitializeMeemContract.method
				})

				if (!club.id) {
					showNotification({
						radius: 'lg',
						title: 'Error saving club settings',
						message: `Please get in touch!`,
						color: 'red'
					})
					return
				}

				const data = {
					shouldMintAdminTokens: true,
					metadata: {
						meem_contract_type: 'meem-club',
						meem_metadata_version: 'MeemClub_Contract_20220718',
						name: club.name,
						description: club.description,
						image: club.image,
						associations: [],
						external_url: `https://clubs.link/${club.slug}`,
						application_instructions: applicationInstructions
					},
					name: club.name ?? '',
					admins: club.admins,
					minters: club.admins,
					maxSupply: !isNaN(
						club.membershipSettings?.membershipQuantity ?? 0
					)
						? `${club.membershipSettings?.membershipQuantity}`
						: '0',
					mintPermissions,
					splits:
						club.membershipSettings &&
						club.membershipSettings.membershipFundsAddress.length >
							0
							? [
									{
										toAddress: club.membershipSettings
											? club.membershipSettings
													.membershipFundsAddress
											: wallet.accounts[0],
										// Amount in basis points 10000 == 100%
										amount: 10000,
										lockedBy: MeemAPI.zeroAddress
									}
							  ]
							: [],
					adminTokenMetadata: {
						meem_metadata_version: 'MeemClub_Token_20220718',
						description: `Membership token for ${club.name}`,
						name: `${club.name} membership token`,
						image: club.image,
						associations: [],
						external_url: `https://clubs.link/${club.slug}`,
						application_instructions: applicationInstructions
					}
				}

				// log.debug(JSON.stringify(data))
				log.debug(data)

				await reInitializeContractFetcher(
					MeemAPI.v1.ReInitializeMeemContract.path({
						meemContractId: club.id
					}),
					undefined,
					data
				)

				// Now we wait for an update on the db.
			} catch (e) {
				log.debug(e)
				showNotification({
					radius: 'lg',
					title: 'Error saving club settings',
					message: `Please get in touch!`
				})
				closeModal()
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
					if (err.detail.code === 'CONTRACT_CREATION_FAILED') {
						showNotification({
							radius: 'lg',
							title: 'Error saving changes',
							message:
								'An error occurred while saving changes. Please try again.',
							color: 'red'
						})

						closeModal()
					}
					log.crit('SOCKET ERROR CAUGHT!!!!!!!!!!')
					log.crit(err)
					log.crit(err.detail.code)
				}
			})
		}

		if (isOpened && !hasSubscribedToSockets) {
			connect()
			reinitialize()
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
				centered
				withCloseButton={false}
				closeOnClickOutside={false}
				closeOnEscape={false}
				overlayBlur={8}
				radius={16}
				size={'lg'}
				padding={'sm'}
				opened={isOpened}
				onClose={() => {
					closeModal()
				}}
			>
				<div className={classes.header}>
					<Loader color="red" variant="bars" />
					<Space h={16} />
					<Text className={classes.title}>{`Saving changes...`}</Text>
					<Space h={24} />

					<Text
						className={classes.info}
					>{`Please don’t refresh or close this window until this step is complete.`}</Text>
				</div>
				<Space h={12} />
			</Modal>
		</>
	)
}
