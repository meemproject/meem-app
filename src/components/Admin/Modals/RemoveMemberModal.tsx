import { useSubscription } from '@apollo/client'
import log from '@kengoldfarb/log'
import { Text, Space, Modal, Loader } from '@mantine/core'
import { useSDK, useWallet, useMeemApollo } from '@meemproject/react'
import React, { useCallback, useEffect, useState } from 'react'
import { GetTransactionsSubscription } from '../../../../generated/graphql'
import { SUB_TRANSACTIONS } from '../../../graphql/transactions'
import { Agreement, AgreementMember } from '../../../model/agreement/agreements'
import {
	showErrorNotification,
	showSuccessNotification
} from '../../../utils/notifications'
import { useMeemTheme } from '../../Styles/MeemTheme'
interface IProps {
	agreement?: Agreement
	member: AgreementMember
	isOpened: boolean
	onModalClosed: () => void
}

export const RemoveMemberModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed,
	agreement,
	member
}) => {
	const { sdk } = useSDK()

	const wallet = useWallet()

	const { anonClient } = useMeemApollo()

	const { classes: meemTheme } = useMeemTheme()

	const [isBurningToken, setIsBurningToken] = useState(false)

	const [transactionIds, setTransactionIds] = useState<string[]>([])

	const { error, data: transactions } =
		useSubscription<GetTransactionsSubscription>(SUB_TRANSACTIONS, {
			variables: {
				transactionIds
			},
			// @ts-ignore
			client: anonClient
		})

	useEffect(() => {
		if (error) {
			log.crit(error)
			showErrorNotification(
				'Error Fetching Data',
				'Please reload and try again.'
			)
		}
	}, [error])

	const closeModal = useCallback(() => {
		onModalClosed()

		setIsBurningToken(false)
	}, [onModalClosed])

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

			setTransactionIds([result.txId])
		} catch (e) {
			log.crit(e)
			showErrorNotification(
				'Error removing member',
				`An error occurred while removing this member from the community. Please let us know!`
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
		member.ownerId
	])

	useEffect(() => {
		function checkTransactionCompletion() {
			if (transactions && transactions.Transactions.length > 0) {
				const currentTx = transactions.Transactions[0]

				log.debug(
					`watching tx ${currentTx.id}, current status = ${currentTx.status}`
				)

				if (currentTx.status === 'success') {
					closeModal()
					setTransactionIds([])

					showSuccessNotification(
						'Success!',
						`This member has been removed from your community.`
					)
				} else if (currentTx.status === 'failure') {
					closeModal()
					setTransactionIds([])
					showErrorNotification(
						'Error removing member',
						`An error occurred while removing this member from the community. Please let us know!`
					)
				}
			} else if (error) {
				log.debug(JSON.stringify(error))
				closeModal()
				setTransactionIds([])
				showErrorNotification(
					'Error removing member',
					`An error occurred while removing this member from the community. Please let us know!`
				)
			} else {
				log.debug(`no tx to monitor right now`)
			}
		}
		// Burn the member token
		if (isOpened && !isBurningToken && agreement) {
			setIsBurningToken(true)
			removeMember()
		}

		// Check tx status
		if (isOpened) {
			checkTransactionCompletion()
		}
	}, [
		agreement,
		closeModal,
		error,
		isBurningToken,
		isOpened,
		removeMember,
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
					<Loader color="cyan" variant="oval" />
					<Space h={16} />
					<Text
						className={meemTheme.tMediumBold}
					>{`Removing ${member.identity}...`}</Text>
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
