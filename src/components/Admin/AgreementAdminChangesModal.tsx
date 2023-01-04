/* eslint-disable @typescript-eslint/naming-convention */
import { useSubscription } from '@apollo/client'
import log from '@kengoldfarb/log'
import { Text, Space, Modal, Loader } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import {
	useSDK,
	useSockets,
	useWallet,
	useMeemApollo
} from '@meemproject/react'
import { MeemAPI } from '@meemproject/sdk'
import React, { useCallback, useEffect, useState } from 'react'
import { Check } from 'tabler-icons-react'
// eslint-disable-next-line import/namespace
import {
	GetAgreementSubscriptionSubscription // eslint-disable-next-line import/namespace
} from '../../../generated/graphql'
import { SUB_AGREEMENT_AS_MEMBER } from '../../graphql/agreements'
import {
	Agreement,
	MembershipRequirementToMeemPermission
} from '../../model/agreement/agreements'
import { hostnameToChainId } from '../App'
import { colorGreen, colorBlue, useMeemTheme } from '../Styles/MeemTheme'

interface IProps {
	agreement?: Agreement
	isOpened: boolean
	onModalClosed: () => void
}

export const AgreementAdminChangesModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed,
	agreement
}) => {
	const wallet = useWallet()

	const { sdk } = useSDK()

	const { classes: meemTheme } = useMeemTheme()

	const { mutualMembersClient } = useMeemApollo()

	const [isSavingChanges, setIsSavingChanges] = useState(false)

	const [currentAgreementDataString, setCurrentAgreementDataString] =
		useState('')

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
		setCurrentAgreementDataString('')
	}, [onModalClosed, sockets])

	const {
		loading,
		error,
		data: agreementData
	} = useSubscription<GetAgreementSubscriptionSubscription>(
		SUB_AGREEMENT_AS_MEMBER,
		{
			variables: {
				slug: agreement?.slug ?? '',
				chainId:
					wallet.chainId ??
					hostnameToChainId(
						global.window ? global.window.location.host : ''
					)
			},
			client: mutualMembersClient
		}
	)

	useEffect(() => {
		async function reinitialize() {
			if (!wallet.web3Provider || !agreement) {
				log.debug('no web3provider or agreement')
				return
			}

			if (!isSavingChanges) {
				setIsSavingChanges(true)

				log.debug(`reinitialize...`)

				try {
					// const agreementSymbol = (agreement.name ?? '').split(' ')[0].toUpperCase()

					const applicationInstructions: string[] = []
					if (agreement.membershipSettings) {
						agreement.membershipSettings.requirements.forEach(
							requirement => {
								if (
									requirement.applicationInstructions &&
									requirement.applicationInstructions
										?.length > 0
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
					if (agreement.membershipSettings) {
						if (agreement.membershipSettings.membershipStartDate) {
							membershipStartUnix = Math.floor(
								new Date(
									agreement.membershipSettings.membershipStartDate
								).getTime() / 1000
							)
							log.debug(membershipStartUnix)
						}
						if (agreement.membershipSettings.membershipEndDate) {
							membershipEndUnix = Math.floor(
								new Date(
									agreement.membershipSettings.membershipEndDate
								).getTime() / 1000
							)
							log.debug(membershipEndUnix)
						}
					}

					let mintPermissions: MeemAPI.IMeemPermission[] = []
					if (agreement && agreement.membershipSettings) {
						mintPermissions =
							agreement.membershipSettings.requirements.map(
								mr => {
									return MembershipRequirementToMeemPermission(
										{
											...mr,
											costEth:
												agreement.membershipSettings
													?.costToJoin,
											mintStartTimestamp: agreement
												.membershipSettings
												?.membershipStartDate
												? agreement.membershipSettings?.membershipStartDate.getTime() /
												  1000
												: 0,
											mintEndTimestamp: agreement
												.membershipSettings
												?.membershipEndDate
												? agreement.membershipSettings?.membershipEndDate.getTime() /
												  1000
												: 0
										}
									)
								}
							)
					}

					if (!agreement.id) {
						showNotification({
							radius: 'lg',
							title: 'Error saving community settings',
							message: `Please get in touch!`,
							color: colorBlue
						})
						closeModal()
						return
					}

					if (mintPermissions.length === 0) {
						showNotification({
							radius: 'lg',
							title: 'Oops!',
							message: `This community has invalid membership requirements. Please double-check your entries and try again.`,
							color: colorBlue
						})
						closeModal()
						return
					}

					const data = {
						agreementId: agreement.id,
						metadata: {
							meem_metadata_type: 'Meem_AgreementContract',
							meem_metadata_version: '20221116',
							name: agreement.name,
							description: agreement.description,
							image: agreement.image,
							associations: [],
							external_url: `https://app.meem.wtf/${agreement.slug}`,
							application_instructions: applicationInstructions
						},
						name: agreement.name ?? '',
						admins: agreement.adminAddresses,
						minters: agreement.adminAddresses,
						maxSupply: !isNaN(
							agreement.membershipSettings?.membershipQuantity ??
								0
						)
							? `${agreement.membershipSettings?.membershipQuantity}`
							: '0',
						mintPermissions,
						splits:
							agreement.membershipSettings &&
							agreement.membershipSettings.membershipFundsAddress
								.length > 0
								? [
										{
											toAddress:
												agreement.membershipSettings
													? agreement
															.membershipSettings
															.membershipFundsAddress
													: wallet.accounts[0],
											// Amount in basis points 10000 == 100%
											amount: 10000,
											lockedBy: MeemAPI.zeroAddress
										}
								  ]
								: []
					}

					log.debug(data)
					const { txId } = await sdk.agreement.reInitialize(data)

					log.debug(`Reinitializing agreement w/ txId: ${txId}`)
				} catch (e) {
					log.debug(e)
					showNotification({
						radius: 'lg',
						title: 'Error saving community settings',
						message: `Please get in touch!`
					})
					closeModal()
				}
			}
		}
		function compareAgreementData() {
			if (agreementData) {
				const newAgreementDataString = JSON.stringify(agreementData)

				if (currentAgreementDataString === newAgreementDataString) {
					log.debug('nothing has changed on the agreement yet.')
				} else {
					log.debug('changes detected on the agreement.')
					closeModal()

					showNotification({
						radius: 'lg',
						title: 'Success!',
						autoClose: 5000,
						color: colorGreen,
						icon: <Check color="green" />,

						message: `${agreementData.Agreements[0].name} has been updated.`
					})
				}
			}
		}

		if (agreementData && !loading && !error && isOpened) {
			if (currentAgreementDataString.length === 0) {
				if (agreementData.Agreements.length > 0) {
					// Set initial agreement data
					log.debug('setting initial agreement data...')
					setCurrentAgreementDataString(JSON.stringify(agreementData))
				}
			} else {
				// compare to initial agreement fata
				compareAgreementData()
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

					if (err.detail.code === 'TX_LIMIT_EXCEEDED') {
						showNotification({
							radius: 'lg',
							title: 'Transaction limit exceeded',
							message:
								'You have used all the transactions available to you today. Get in touch or wait until tomorrow.',
							color: colorBlue
						})
					} else {
						showNotification({
							radius: 'lg',
							title: 'Error saving changes',
							message:
								'An error occurred while saving changes. Please try again.',
							color: colorBlue
						})
					}

					closeModal()
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
		agreement,
		agreementData,
		currentAgreementDataString,
		error,
		hasSubscribedToSockets,
		isOpened,
		loading,
		onModalClosed,
		sockets,
		wallet,
		sdk.agreement
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
				<div className={meemTheme.modalHeader}>
					<Loader color="blue" variant="oval" />
					<Space h={16} />
					<Text
						className={meemTheme.tMediumBold}
					>{`Saving changes...`}</Text>
					<Space h={24} />

					<Text
						className={meemTheme.tSmall}
						style={{ textAlign: 'center' }}
					>{`Please don’t refresh or close this window until this step is complete.`}</Text>
				</div>
				<Space h={16} />
			</Modal>
		</>
	)
}
