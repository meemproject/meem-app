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
	GetClubSubscriptionSubscription,
	GetIsMemberOfClubSubscriptionSubscription
} from '../../../generated/graphql'
import {
	SUB_CLUB,
	SUB_CLUB_AS_MEMBER,
	SUB_IS_MEMBER_OF_CLUB
} from '../../graphql/clubs'
import clubFromAgreement, { Club } from '../../model/club/club'
import { hostnameToChainId } from '../App'

const defaultState: {
	club?: Club
	isLoadingClub: boolean
	error?: ApolloError | undefined
} = {
	isLoadingClub: false
}

const ClubContext = createContext(defaultState)

export default ClubContext

export interface IClubProviderProps {
	children?: ReactNode
	slug: string
}

export const ClubProvider: FC<IClubProviderProps> = ({ slug, ...props }) => {
	// General imports
	const wallet = useWallet()

	// Club data
	const { anonClient, mutualMembersClient } = useMeemApollo()
	const [club, setClub] = useState<Club | undefined>()
	const [previousClubDataString, setPreviousClubDataString] = useState('')
	const router = useRouter()
	const [isLoadingClub, setIsLoadingClub] = useState(true)

	// Subscriptions
	const { data: isCurrentUserClubMemberData, error: userClubMemberError } =
		useSubscription<GetIsMemberOfClubSubscriptionSubscription>(
			SUB_IS_MEMBER_OF_CLUB,
			{
				variables: {
					walletAddress: wallet.isConnected ? wallet.accounts[0] : '',
					clubSlug: slug,
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
		loading: loadingAnonClub,
		error: errorAnonClub,
		data: anonClubData
	} = useSubscription<GetClubSubscriptionSubscription>(SUB_CLUB, {
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
			!isCurrentUserClubMemberData ||
			isCurrentUserClubMemberData.AgreementTokens.length > 0
	})

	const {
		loading: loadingMemberClub,
		error: errorMemberClub,
		data: memberClubData
	} = useSubscription<GetClubSubscriptionSubscription>(SUB_CLUB_AS_MEMBER, {
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
			!isCurrentUserClubMemberData ||
			isCurrentUserClubMemberData.AgreementTokens.length === 0
	})

	useEffect(() => {
		if (errorAnonClub) {
			log.debug(JSON.stringify(errorAnonClub))
			setIsLoadingClub(false)
		}

		if (errorMemberClub) {
			log.debug(JSON.stringify(errorMemberClub))
			setIsLoadingClub(false)
		}

		async function getClub() {
			const clubData = memberClubData ?? anonClubData

			if (!clubData) {
				return
			}

			if (clubData.Agreements.length === 0) {
				setIsLoadingClub(false)
				return
			}
			// TODO: Why do I have to compare strings to prevent an infinite useEffect loop?

			if (previousClubDataString) {
				const currentData = JSON.stringify(clubData)
				if (previousClubDataString === currentData) {
					return
				}
			}
			const possibleClub = await clubFromAgreement(
				wallet,
				wallet.isConnected ? wallet.accounts[0] : '',
				clubData.Agreements[0] as Agreements
			)

			if (possibleClub && possibleClub.name) {
				setClub(possibleClub)
				setIsLoadingClub(false)
				log.debug('got club')
			}

			setPreviousClubDataString(JSON.stringify(clubData))
		}

		// Parse data for anonymous club
		if (!loadingAnonClub && !errorAnonClub && anonClubData) {
			getClub()
		}

		// Parse data as club member
		if (!loadingMemberClub && !errorMemberClub && memberClubData) {
			getClub()
		}

		if (
			errorMemberClub &&
			errorMemberClub.graphQLErrors.length > 0 &&
			errorMemberClub.graphQLErrors[0].extensions.code === 'invalid-jwt'
		) {
			router.push({
				pathname: '/authenticate',
				query: {
					return: window.location.pathname
				}
			})
		}
	}, [
		club,
		previousClubDataString,
		wallet,
		loadingAnonClub,
		errorAnonClub,
		anonClubData,
		loadingMemberClub,
		errorMemberClub,
		memberClubData,
		userClubMemberError,
		router,
		isCurrentUserClubMemberData
	])
	const value = useMemo(
		() => ({
			club,
			isLoadingClub,
			error: errorAnonClub || errorMemberClub
		}),
		[club, errorAnonClub, errorMemberClub, isLoadingClub]
	)
	return <ClubContext.Provider value={value} {...props} />
}

export function useClub() {
	const context = useContext(ClubContext)

	if (typeof context === 'undefined') {
		throw new Error('useClub must be used within a ClubProvider')
	}
	return context
}
