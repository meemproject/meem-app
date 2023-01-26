/* eslint-disable @typescript-eslint/naming-convention */
import { useSubscription } from '@apollo/client'
import log from '@kengoldfarb/log'
import { Text, Space, Modal, Loader } from '@mantine/core'
import { useSDK, useWallet, useMeemApollo } from '@meemproject/react'
import { MeemAPI } from '@meemproject/sdk'
import React, { useCallback, useEffect, useState } from 'react'
// eslint-disable-next-line import/namespace
import { GetTransactionsSubscription } from '../../../generated/graphql'
import { SUB_TRANSACTIONS } from '../../graphql/transactions'
import {
	Agreement,
	MembershipRequirementToMeemPermission
} from '../../model/agreement/agreements'
import {
	showErrorNotification,
	showSuccessNotification
} from '../../utils/notifications'
import { useMeemTheme } from '../Styles/MeemTheme'

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

	const { anonClient } = useMeemApollo()

	const [isSavingChanges, setIsSavingChanges] = useState(false)

	const [txIds, setTxIds] = useState<string[]>([])

	const closeModal = useCallback(() => {
		onModalClosed()
		setIsSavingChanges(false)
		setTxIds([])
	}, [onModalClosed])

	const { error, data: transactions } =
		useSubscription<GetTransactionsSubscription>(SUB_TRANSACTIONS, {
			variables: {
				transactionIds: txIds
			},
			client: anonClient,
			skip: txIds.length === 0
		})

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
												?.membershipSettings
												?.membershipStartDate
												? new Date(
														agreement.membershipSettings.membershipStartDate
												  ).getTime() / 1000
												: 0,
											mintEndTimestamp: agreement
												?.membershipSettings
												?.membershipEndDate
												? new Date(
														agreement.membershipSettings.membershipEndDate
												  ).getTime() / 1000
												: 0
										}
									)
								}
							)
					}

					if (!agreement.id) {
						showErrorNotification(
							'Error saving community settings',
							`Please get in touch!`
						)
						closeModal()
						return
					}

					if (mintPermissions.length === 0) {
						showErrorNotification(
							'Oops!',
							`This community has invalid membership requirements. Please double-check your entries and try again.`
						)
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
					setTxIds([txId])
				} catch (e) {
					log.debug(e)
					closeModal()

					showErrorNotification(
						'Error saving community settings',
						`Please get in touch!`
					)
				}
			}
		}
		function checkTransactionCompletion() {
			if (transactions && transactions.Transactions.length > 0) {
				const currentTx = transactions.Transactions[0]

				log.debug(
					`watching tx ${currentTx.id}, current status = ${currentTx.status}`
				)

				if (currentTx.status === 'success') {
					closeModal()

					showSuccessNotification(
						'Success!',
						`Your community settings have been updated.`
					)
				} else if (currentTx.status === 'failure') {
					closeModal()
					showErrorNotification(
						'Error saving community settings',
						`Please get in touch!`
					)
				}
			} else if (error) {
				log.debug(JSON.stringify(error))
				closeModal()
				showErrorNotification(
					'Error saving community settings',
					`Please get in touch!`
				)
			} else {
				log.debug(`no tx to monitor right now`)
			}
		}

		if (isOpened && !isSavingChanges) {
			log.debug(`should reinit`)
			reinitialize()
		}

		if (isOpened) {
			checkTransactionCompletion()
		}
	}, [
		closeModal,
		isSavingChanges,
		agreement,
		error,
		isOpened,
		onModalClosed,
		wallet,
		sdk.agreement,
		transactions
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
					>{`Please don’t refresh or close this window until this step is complete. This might take a few minutes.`}</Text>
				</div>
			</Modal>
		</>
	)
}
