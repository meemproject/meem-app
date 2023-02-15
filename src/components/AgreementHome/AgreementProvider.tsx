/* eslint-disable @typescript-eslint/naming-convention */
import { ApolloError, useSubscription } from '@apollo/client'
import log from '@kengoldfarb/log'
import { hideNotification, showNotification } from '@mantine/notifications'
import { useWallet, useMeemApollo } from '@meemproject/react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, {
	useState,
	useEffect,
	createContext,
	FC,
	useMemo,
	ReactNode,
	useContext
} from 'react'
import {
	Agreements,
	GetAgreementSubscriptionSubscription,
	GetIsMemberOfAgreementSubscriptionSubscription,
	GetTransactionsSubscription
} from '../../../generated/graphql'
import {
	SUB_AGREEMENT,
	SUB_AGREEMENT_AS_MEMBER,
	SUB_IS_MEMBER_OF_AGREEMENT
} from '../../graphql/agreements'
import { SUB_TRANSACTIONS } from '../../graphql/transactions'
import agreementFromDb, {
	Agreement,
	isJwtError
} from '../../model/agreement/agreements'
import { CookieKeys } from '../../utils/cookies'
import {
	showErrorNotification,
	showSuccessNotification
} from '../../utils/notifications'
import { hostnameToChainId } from '../App'

const defaultState: {
	agreement?: Agreement
	isLoadingAgreement: boolean
	error?: ApolloError | undefined
	isMembersOnly?: boolean
	txIds?: string[]
	isTransactionInProgress: boolean
	watchTransactions: (txIds: string[]) => void
	setSlugManually: (slug: string) => void
} = {
	isLoadingAgreement: false,
	isTransactionInProgress: false,
	watchTransactions: () => {},
	setSlugManually: () => {}
}

const AgreementContext = createContext(defaultState)

export default AgreementContext

export interface IAgreementProviderProps {
	children?: ReactNode
	slug?: string
	isMembersOnly?: boolean
}

export const AgreementProvider: FC<IAgreementProviderProps> = ({
	slug,
	isMembersOnly,
	...props
}) => {
	// General imports
	const wallet = useWallet()

	// Agreement data
	const { anonClient, mutualMembersClient } = useMeemApollo()
	const [agreement, setAgreement] = useState<Agreement | undefined>()
	const [previousAgreementDataString, setPreviousAgreementDataString] =
		useState('')
	const router = useRouter()

	const [isLoadingAgreement, setIsLoadingAgreement] = useState(true)

	// Transactions
	const [transactionIds, setTransactionIds] = useState<string[]>([])
	const [isTransactionInProgress, setIsTransactionInProgress] =
		useState(false)

	// Has the agreement slug changed? (i.e. from page navigation)
	const [originalSlug, setOriginalSlug] = useState('')
	const [agreementSlug, setAgreementSlug] = useState(slug)

	// Subscriptions
	const {
		data: isCurrentUserAgreementMemberData,
		error: userAgreementMemberError
	} = useSubscription<GetIsMemberOfAgreementSubscriptionSubscription>(
		SUB_IS_MEMBER_OF_AGREEMENT,
		{
			variables: {
				walletAddress: wallet.isConnected ? wallet.accounts[0] : '',
				agreementSlug,
				chainId:
					wallet.chainId ??
					hostnameToChainId(
						global.window ? global.window.location.host : ''
					)
			},
			skip: !agreementSlug || isMembersOnly,
			client: anonClient
		}
	)

	const {
		loading: loadingMemberAgreement,
		error: errorMemberAgreement,
		data: memberAgreementData
	} = useSubscription<GetAgreementSubscriptionSubscription>(
		SUB_AGREEMENT_AS_MEMBER,
		{
			variables: {
				agreementSlug,
				chainId:
					wallet.chainId ??
					hostnameToChainId(
						global.window ? global.window.location.host : ''
					)
			},
			client: mutualMembersClient,
			skip:
				!agreementSlug ||
				(isMembersOnly && !wallet.isConnected) ||
				(!isMembersOnly &&
					(!isCurrentUserAgreementMemberData ||
						isCurrentUserAgreementMemberData.AgreementTokens
							.length === 0))
		}
	)

	const {
		loading: loadingAnonAgreement,
		error: errorAnonAgreement,
		data: anonAgreementData
	} = useSubscription<GetAgreementSubscriptionSubscription>(SUB_AGREEMENT, {
		variables: {
			agreementSlug,
			chainId:
				wallet.chainId ??
				hostnameToChainId(
					global.window ? global.window.location.host : ''
				)
		},
		client: anonClient,
		skip:
			!agreementSlug ||
			agreement !== undefined ||
			isMembersOnly ||
			!isCurrentUserAgreementMemberData ||
			isCurrentUserAgreementMemberData.AgreementTokens.length > 0
	})

	const { error, data: transactions } =
		useSubscription<GetTransactionsSubscription>(SUB_TRANSACTIONS, {
			variables: {
				transactionIds
			},
			client: anonClient,
			skip: transactionIds?.length === 0
		})

	useEffect(() => {
		if (errorAnonAgreement) {
			log.debug('Loading anonymous agreement failed:')
			log.debug(JSON.stringify(errorAnonAgreement))
			setOriginalSlug(agreementSlug ?? '')
			setIsLoadingAgreement(false)
		}

		if (errorMemberAgreement) {
			log.debug('Loading member-access agreement failed:')
			log.debug(JSON.stringify(errorMemberAgreement))
			setOriginalSlug(agreementSlug ?? '')
			setIsLoadingAgreement(false)
		}

		function onTxSuccess() {
			hideNotification('changesModal')
			log.debug('all tx in queue succeeded.')
			setTransactionIds([])
			setIsTransactionInProgress(false)
			showSuccessNotification(
				'Success!',
				`Your community settings have been updated.`
			)
		}

		function onPartialTxFailure(apError?: ApolloError) {
			log.debug(JSON.stringify(apError))
			hideNotification('changesModal')
			setTransactionIds([])
			setIsTransactionInProgress(false)
			showErrorNotification(
				'Transactions completed with errors.',
				`Contact us using the top-right link on this page.`
			)
		}

		function onTxFailure(apError?: ApolloError) {
			log.debug(JSON.stringify(apError))
			hideNotification('changesModal')
			setTransactionIds([])
			setIsTransactionInProgress(false)
			showErrorNotification(
				'Error saving community settings',
				`Contact us using the top-right link on this page.`
			)
		}

		function checkTransactionCompletion() {
			if (transactions && transactions.Transactions.length > 0) {
				const totalTx = transactions.Transactions.length
				let numComplete = 0
				let numFailures = 0
				let numPending = 0
				transactions.Transactions.forEach(tx => {
					if (tx.status === 'success') {
						numComplete = numComplete + 1
					} else if (tx.status === 'failure') {
						numFailures = numFailures + 1
					} else if (tx.status === 'pending') {
						numPending = numPending + 1
					}
				})

				if (numComplete === totalTx) {
					onTxSuccess()
				} else if (
					numComplete > 0 &&
					numComplete + numFailures === totalTx
				) {
					onPartialTxFailure()
				} else if (numFailures === totalTx) {
					onTxFailure()
				} else {
					log.debug(`watching ${totalTx} tx. pending = ${numPending}`)
				}
			} else if (error) {
				onTxFailure(error)
			} else {
				log.debug(`no tx to monitor right now`)
			}
		}

		async function getAgreement() {
			const agreementData = memberAgreementData ?? anonAgreementData

			if (!agreementData) {
				return
			}

			// Agreement does not exist
			if (
				anonAgreementData &&
				anonAgreementData.Agreements.length === 0
			) {
				setIsLoadingAgreement(false)
				setOriginalSlug(agreementSlug ?? '')
				return
			}

			// TODO: Why do I have to compare strings to prevent an infinite useEffect loop?

			if (previousAgreementDataString) {
				const currentData = JSON.stringify(agreementData)
				if (previousAgreementDataString === currentData) {
					return
				}
			}
			const possibleAgreement = await agreementFromDb(
				wallet,
				wallet.isConnected ? wallet.accounts[0] : '',
				agreementData.Agreements[0] as Agreements
			)

			if (possibleAgreement && possibleAgreement.name) {
				setAgreement(possibleAgreement)
				setIsLoadingAgreement(false)
				setOriginalSlug(agreementSlug ?? '')
				log.debug('got agreement')
			}

			setPreviousAgreementDataString(JSON.stringify(agreementData))
		}

		// Parse data for anonymous agreement
		if (!loadingAnonAgreement && !errorAnonAgreement && anonAgreementData) {
			getAgreement()
		}

		// Parse data as agreement member
		if (
			!loadingMemberAgreement &&
			!errorMemberAgreement &&
			memberAgreementData
		) {
			getAgreement()
		}

		if (isJwtError(errorMemberAgreement)) {
			if (window && !window.location.href.includes('/authenticate')) {
				Cookies.set(
					CookieKeys.authRedirectUrl,
					window.location.toString()
				)
			}
			router.push({
				pathname: '/authenticate'
			})
		}

		if (agreementSlug !== originalSlug) {
			setAgreement(undefined)
			if (agreementSlug) {
				setOriginalSlug(agreementSlug)
			}
			setIsLoadingAgreement(true)
		}

		// User does not have access to this page
		if (isMembersOnly && memberAgreementData?.Agreements.length === 0) {
			setIsLoadingAgreement(false)
		}

		if (transactionIds.length > 0) {
			checkTransactionCompletion()
		}
	}, [
		agreement,
		previousAgreementDataString,
		wallet,
		loadingAnonAgreement,
		errorAnonAgreement,
		anonAgreementData,
		loadingMemberAgreement,
		errorMemberAgreement,
		memberAgreementData,
		userAgreementMemberError,
		router,
		isCurrentUserAgreementMemberData,
		agreementSlug,
		originalSlug,
		isMembersOnly,
		transactionIds.length,
		transactions,
		error
	])

	// eslint-disable-next-line react-hooks/exhaustive-deps
	function setSlugManually(newSlug: string) {
		setOriginalSlug(slug ?? '')
		setAgreementSlug(newSlug)
	}

	function watchTransactions(txIds: string[]) {
		setTransactionIds(txIds)
		setIsTransactionInProgress(true)

		showNotification({
			id: 'changesModal',
			title: 'Saving changes',
			message: 'Please wait...',
			autoClose: false,
			disallowClose: true,
			loading: true
		})
	}

	const value = useMemo(
		() => ({
			agreement,
			isLoadingAgreement,
			error: errorAnonAgreement || errorMemberAgreement,
			isMembersOnly,
			txIds: transactionIds,
			isTransactionInProgress,
			watchTransactions,
			setSlugManually
		}),
		[
			agreement,
			errorAnonAgreement,
			errorMemberAgreement,
			isLoadingAgreement,
			isMembersOnly,
			isTransactionInProgress,
			setSlugManually,
			transactionIds
		]
	)
	return <AgreementContext.Provider value={value} {...props} />
}

export function useAgreement() {
	const context = useContext(AgreementContext)

	if (typeof context === 'undefined') {
		throw new Error('useAgreement must be used within a AgreementProvider')
	}
	return context
}
