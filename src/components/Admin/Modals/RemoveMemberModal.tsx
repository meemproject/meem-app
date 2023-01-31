import { useSubscription } from '@apollo/client'
import log from '@kengoldfarb/log'
import { Text, Space, Modal, Loader, Stepper } from '@mantine/core'
import { useSDK, useWallet, useMeemApollo } from '@meemproject/react'
import { MeemAPI } from '@meemproject/sdk'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { GetTransactionsSubscription } from '../../../../generated/graphql'
import { SUB_TRANSACTIONS } from '../../../graphql/transactions'
import { Agreement, AgreementMember } from '../../../model/agreement/agreements'
import {
	showErrorNotification,
	showSuccessNotification
} from '../../../utils/notifications'
import { hostnameToChainId } from '../../App'
import { useMeemTheme } from '../../Styles/MeemTheme'
interface IProps {
	agreement: Agreement
	member: AgreementMember
	isOpened: boolean
	onModalClosed: () => void
}

export const CreationProgressModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed,
	agreement,
	member
}) => {
	const router = useRouter()

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
		log.debug('creating agreement...')

		if (!wallet.web3Provider || !wallet.chainId) {
			log.debug('no web3 provider, returning.')
			showErrorNotification(
				'Error creating community',
				'Please connect your wallet first.'
			)
			closeModal()
			setIsBurningToken(false)
			return
		}

		try {
		} catch (e) {
			log.crit(e)
			showErrorNotification(
				'Error removing member',
				`An error occurred while removing this member from the community. Please let us know!`
			)

			closeModal()
			setIsBurningToken(false)
		}
	}, [wallet, closeModal])

	useEffect(() => {
		// Create the agreement
		if (isOpened && !isBurningToken) {
			setIsBurningToken(true)
			removeMember()
		}
	}, [isBurningToken, isOpened, removeMember])

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
					<Text className={meemTheme.tMediumBold}>{`Removing ${
						(member.displayName ?? '').length > 0
							? member.displayName
							: (member.ens ?? '').length > 0
							? member.ens
							: member.wallet
					}...`}</Text>
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
