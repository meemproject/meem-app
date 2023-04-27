import log from '@kengoldfarb/log'
import { useSDK, useWallet } from '@meemproject/react'
import React, { useCallback, useEffect, useState } from 'react'
import { Agreement, AgreementMember } from '../../../model/agreement/agreements'
import { showErrorNotification } from '../../../utils/notifications'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
interface IProps {
	agreement?: Agreement
	member: AgreementMember
	isRequestInProgress: boolean
	onRequestComplete: () => void
}

export const RemoveMemberComponent: React.FC<IProps> = ({
	isRequestInProgress,
	onRequestComplete,
	agreement,
	member
}) => {
	const { sdk } = useSDK()

	const wallet = useWallet()

	const { watchTransactions } = useAgreement()

	const [isBurningToken, setIsBurningToken] = useState(false)

	const closeModal = useCallback(() => {
		onRequestComplete()
		setIsBurningToken(false)
	}, [onRequestComplete])

	const removeMember = useCallback(async () => {
		log.debug('removing member...')

		if (!wallet.web3Provider || !wallet.chainId) {
			log.debug('no web3 provider, returning.')
			showErrorNotification(
				'Error removing member',
				'Please connect your wallet first.'
			)
			closeModal()
			setIsBurningToken(false)
			return
		}

		try {
			let tokenId = ''

			agreement?.rawAgreement?.AgreementTokens.forEach(token => {
				if (token.OwnerId === member.ownerId) {
					tokenId = token.tokenId
				}
			})
			const result = await sdk.agreement.bulkBurn({
				agreementId: agreement?.id ?? '',
				tokenIds: [tokenId]
			})
			if (result?.txId) {
				watchTransactions([result?.txId])
			}
			closeModal()
		} catch (e) {
			log.crit(e)
			showErrorNotification(
				'Error removing member',
				`An error occurred while removing this member from the community. Contact us using the top-right link on this page.`
			)

			closeModal()
			setIsBurningToken(false)
		}
	}, [
		wallet.web3Provider,
		wallet.chainId,
		closeModal,
		agreement?.rawAgreement?.AgreementTokens,
		agreement?.id,
		sdk.agreement,
		watchTransactions,
		member.ownerId
	])

	useEffect(() => {
		// Burn the member token
		if (isRequestInProgress && !isBurningToken && agreement) {
			setIsBurningToken(true)
			removeMember()
		}
	}, [
		agreement,
		closeModal,
		isBurningToken,
		isRequestInProgress,
		removeMember
	])

	return <></>
}
