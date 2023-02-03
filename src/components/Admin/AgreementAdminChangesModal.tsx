/* eslint-disable @typescript-eslint/naming-convention */
import log from '@kengoldfarb/log'
import { useSDK, useWallet } from '@meemproject/react'
import { MeemAPI } from '@meemproject/sdk'
import React, { useCallback, useEffect, useState } from 'react'
// eslint-disable-next-line import/namespace
import {
	Agreement,
	MembershipRequirementToMeemPermission
} from '../../model/agreement/agreements'
import { showErrorNotification } from '../../utils/notifications'
import { useAgreement } from '../AgreementHome/AgreementProvider'

interface IProps {
	agreement?: Agreement
	isRequestInProgress: boolean
	onRequestComplete: () => void
}

export const AgreementAdminChangesModal: React.FC<IProps> = ({
	agreement,
	isRequestInProgress,
	onRequestComplete
}) => {
	const wallet = useWallet()

	const { sdk } = useSDK()

	const { startTransactions } = useAgreement()

	const [isSavingChanges, setIsSavingChanges] = useState(false)

	const completeRequest = useCallback(() => {
		onRequestComplete()
		setIsSavingChanges(false)
	}, [onRequestComplete])

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
						completeRequest()
						return
					}

					if (mintPermissions.length === 0) {
						showErrorNotification(
							'Oops!',
							`This community has invalid membership requirements. Please double-check your entries and try again.`
						)
						completeRequest()
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

					startTransactions([txId])
					completeRequest()

					log.debug(`Reinitializing agreement w/ txId: ${txId}`)
				} catch (e) {
					log.debug(e)
					completeRequest()
					showErrorNotification(
						'Error saving community settings',
						`Please get in touch!`
					)
				}
			}
		}

		if (isRequestInProgress && !isSavingChanges) {
			log.debug(`should reinit`)
			reinitialize()
		}
	}, [
		completeRequest,
		isSavingChanges,
		agreement,
		wallet,
		sdk.agreement,
		startTransactions,
		isRequestInProgress
	])

	return <></>
}
