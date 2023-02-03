/* eslint-disable @typescript-eslint/naming-convention */
import log from '@kengoldfarb/log'
import { useSDK, useWallet } from '@meemproject/react'
import React, { useCallback, useEffect, useState } from 'react'
// eslint-disable-next-line import/namespace
import { Agreement } from '../../../model/agreement/agreements'
import { showErrorNotification } from '../../../utils/notifications'
import { useAgreement } from '../../AgreementHome/AgreementProvider'

interface IProps {
	agreement?: Agreement
	isRequestInProgress: boolean
	onRequestComplete: () => void
}

export const CreateSafeModal: React.FC<IProps> = ({
	isRequestInProgress,
	onRequestComplete,
	agreement
}) => {
	const wallet = useWallet()

	const { sdk } = useSDK()

	const { watchTransactions } = useAgreement()

	const [isSavingChanges, setIsSavingChanges] = useState(false)

	const completeRequest = useCallback(() => {
		onRequestComplete()
		setIsSavingChanges(false)
	}, [onRequestComplete])

	useEffect(() => {
		async function createSafe() {
			if (!wallet.web3Provider || !agreement) {
				log.debug('no web3provider or agreement')
				return
			}

			if (!isSavingChanges) {
				setIsSavingChanges(true)

				log.debug(`creating safe...`)

				try {
					const result = await sdk.agreement.createSafe({
						safeOwners: agreement.adminAddresses ?? [],
						agreementId: agreement?.id ?? ''
					})

					watchTransactions([result.txId])
				} catch (e) {
					log.debug(e)
					completeRequest()

					showErrorNotification(
						'Error creating community safe',
						`Please get in touch!`
					)
				}
			}
		}

		if (isRequestInProgress && !isSavingChanges) {
			createSafe()
		}
	}, [
		completeRequest,
		isSavingChanges,
		agreement,
		onRequestComplete,
		wallet,
		sdk.agreement,
		watchTransactions,
		isRequestInProgress
	])

	return <></>
}
