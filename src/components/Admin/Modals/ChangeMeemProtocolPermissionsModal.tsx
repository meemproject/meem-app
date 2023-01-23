/* eslint-disable @typescript-eslint/naming-convention */
import { useSubscription } from '@apollo/client'
import log from '@kengoldfarb/log'
import { Text, Space, Modal, Loader } from '@mantine/core'
import {
	useSDK,
	useSockets,
	useWallet,
	useMeemApollo
} from '@meemproject/react'
import { MeemAPI } from '@meemproject/sdk'
import { Contract } from 'ethers'
import React, { useCallback, useEffect, useState } from 'react'
// eslint-disable-next-line import/namespace
import {
	GetAgreementSubscriptionSubscription, // eslint-disable-next-line import/namespace
	GetBundleByIdQuery
} from '../../../../generated/graphql'
import { SUB_AGREEMENT_AS_MEMBER } from '../../../graphql/agreements'
import {
	Agreement,
	AgreementAdminRole
} from '../../../model/agreement/agreements'
import {
	showErrorNotification,
	showSuccessNotification
} from '../../../utils/notifications'
import { hostnameToChainId } from '../../App'
import { useMeemTheme } from '../../Styles/MeemTheme'

interface IProps {
	agreement?: Agreement
	isOpened: boolean
	onModalClosed: () => void
	bundleData: GetBundleByIdQuery | undefined
	smartContractPermission: string
}

export const ChangeMeemProtocolPermissionsModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed,
	agreement,
	bundleData,
	smartContractPermission
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
		async function changeMeemProtocolPermissions() {
			if (!wallet.web3Provider || !agreement) {
				log.debug('no web3provider or agreement')
				return
			}

			if (!isSavingChanges) {
				log.debug(`changing meem contract admin permissions...`)

				if (!bundleData) {
					showErrorNotification(
						'Oops!',
						'Bundle data not found. Please let us know about this!'
					)
					closeModal()
				}
				setIsSavingChanges(true)

				try {
					const agreementContract = new Contract(
						agreement?.address ?? '',
						bundleData?.Bundles[0].abi,
						wallet.signer
					)

					if (
						// If not controlled by meem api and the user wants to enable control...
						smartContractPermission === 'members-and-meem' &&
						!agreement.isAgreementControlledByMeemApi
					) {
						const tx = await agreementContract?.grantRole(
							AgreementAdminRole,
							process.env.NEXT_PUBLIC_MEEM_API_WALLET_ADDRESS
						)

						await tx.wait()
					} else if (
						// If controlled by meem api and user wants to remove control...
						smartContractPermission === 'members' &&
						agreement.isAgreementControlledByMeemApi
					) {
						const tx = await agreementContract?.revokeRole(
							AgreementAdminRole,
							process.env.NEXT_PUBLIC_MEEM_API_WALLET_ADDRESS
						)

						await tx.wait()
					}
				} catch (e) {
					log.debug(e)
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

					showSuccessNotification(
						'Success!',
						`${agreementData.Agreements[0].name} has been updated.`
					)
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
						showErrorNotification(
							'Transaction limit exceeded',
							'You have used all the transactions available to you today. Get in touch or wait until tomorrow.'
						)
					} else {
						showErrorNotification(
							'Error saving changes',
							'An error occurred while saving changes. Please try again.'
						)
					}

					closeModal()
				}
			})
		}

		if (isOpened && !hasSubscribedToSockets) {
			connect()
			changeMeemProtocolPermissions()
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
		sdk.agreement,
		bundleData,
		smartContractPermission
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
					>{`Changing Meem Protocol admin permissions...`}</Text>
					<Space h={24} />

					<Text
						className={meemTheme.tSmall}
						style={{ textAlign: 'center' }}
					>{`Please don’t refresh or close this window until this step is complete. This might take a few minutes.`}</Text>
				</div>
			</Modal>
		</>
	)
}
