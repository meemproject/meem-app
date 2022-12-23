/* eslint-disable @typescript-eslint/naming-convention */
import { ApolloError, useSubscription } from '@apollo/client'
import log from '@kengoldfarb/log'
import { useWallet, useMeemApollo } from '@meemproject/react'
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
	GetIsMemberOfAgreementSubscriptionSubscription
} from '../../../generated/graphql'
import {
	SUB_AGREEMENT,
	SUB_AGREEMENT_AS_MEMBER,
	SUB_IS_MEMBER_OF_AGREEMENT
} from '../../graphql/agreements'
import agreementFromAgreement, {
	Agreement
} from '../../model/agreement/agreements'
import { hostnameToChainId } from '../App'

const defaultState: {
	agreement?: Agreement
	isLoadingAgreement: boolean
	error?: ApolloError | undefined
} = {
	isLoadingAgreement: false
}

const AgreementContext = createContext(defaultState)

export default AgreementContext

export interface IAgreementProviderProps {
	children?: ReactNode
	slug: string
}

export const AgreementProvider: FC<IAgreementProviderProps> = ({
	slug,
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

	// Subscriptions
	const {
		data: isCurrentUserAgreementMemberData,
		error: userAgreementMemberError
	} = useSubscription<GetIsMemberOfAgreementSubscriptionSubscription>(
		SUB_IS_MEMBER_OF_AGREEMENT,
		{
			variables: {
				walletAddress: wallet.isConnected ? wallet.accounts[0] : '',
				agreementSlug: slug,
				chainId:
					wallet.chainId ??
					hostnameToChainId(
						global.window ? global.window.location.host : ''
					)
			},
			client: anonClient
		}
	)

	const {
		loading: loadingAnonAgreement,
		error: errorAnonAgreement,
		data: anonAgreementData
	} = useSubscription<GetAgreementSubscriptionSubscription>(SUB_AGREEMENT, {
		variables: {
			slug,
			chainId:
				wallet.chainId ??
				hostnameToChainId(
					global.window ? global.window.location.host : ''
				)
		},
		client: anonClient,
		skip:
			!isCurrentUserAgreementMemberData ||
			isCurrentUserAgreementMemberData.AgreementTokens.length > 0
	})

	const {
		loading: loadingMemberAgreement,
		error: errorMemberAgreement,
		data: memberAgreementData
	} = useSubscription<GetAgreementSubscriptionSubscription>(
		SUB_AGREEMENT_AS_MEMBER,
		{
			variables: {
				slug,
				chainId:
					wallet.chainId ??
					hostnameToChainId(
						global.window ? global.window.location.host : ''
					)
			},
			client: mutualMembersClient,
			skip:
				!isCurrentUserAgreementMemberData ||
				isCurrentUserAgreementMemberData.AgreementTokens.length === 0
		}
	)

	useEffect(() => {
		if (errorAnonAgreement) {
			log.debug(JSON.stringify(errorAnonAgreement))
			setIsLoadingAgreement(false)
		}

		if (errorMemberAgreement) {
			log.debug(JSON.stringify(errorMemberAgreement))
			setIsLoadingAgreement(false)
		}

		async function getAgreement() {
			const agreementData = memberAgreementData ?? anonAgreementData

			if (!agreementData) {
				return
			}

			if (agreementData.Agreements.length === 0) {
				setIsLoadingAgreement(false)
				return
			}
			// TODO: Why do I have to compare strings to prevent an infinite useEffect loop?

			if (previousAgreementDataString) {
				const currentData = JSON.stringify(agreementData)
				if (previousAgreementDataString === currentData) {
					return
				}
			}
			const possibleAgreement = await agreementFromAgreement(
				wallet,
				wallet.isConnected ? wallet.accounts[0] : '',
				agreementData.Agreements[0] as Agreements
			)

			if (possibleAgreement && possibleAgreement.name) {
				setAgreement(possibleAgreement)
				setIsLoadingAgreement(false)
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

		if (
			errorMemberAgreement &&
			errorMemberAgreement.graphQLErrors.length > 0 &&
			errorMemberAgreement.graphQLErrors[0].extensions.code ===
				'invalid-jwt'
		) {
			router.push({
				pathname: '/authenticate',
				query: {
					return: window.location.pathname
				}
			})
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
		isCurrentUserAgreementMemberData
	])
	const value = useMemo(
		() => ({
			agreement,
			isLoadingAgreement,
			error: errorAnonAgreement || errorMemberAgreement
		}),
		[
			agreement,
			errorAnonAgreement,
			errorMemberAgreement,
			isLoadingAgreement
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