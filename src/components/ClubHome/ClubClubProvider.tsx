/* eslint-disable @typescript-eslint/naming-convention */
import { useSubscription } from '@apollo/client'
import { useWallet, useMeemApollo } from '@meemproject/react'
import React, {
	useState,
	useEffect,
	createContext,
	FC,
	useMemo,
	ReactNode
} from 'react'
import { GetIsMemberOfClubSubscriptionSubscription } from '../../../generated/graphql'
import { SUB_IS_MEMBER_OF_CLUB } from '../../graphql/clubs'
import { hostnameToChainId } from '../App'

const defaultState = {
	isMember: false
}

const ClubClubContext = createContext(defaultState)

export default ClubClubContext

export interface IClubClubProviderProps {
	children?: ReactNode
}

export const ClubClubProvider: FC<IClubClubProviderProps> = ({ ...props }) => {
	const [isMember, setIsMember] = useState(defaultState.isMember)

	const wallet = useWallet()

	const { anonClient } = useMeemApollo()

	const {
		loading,
		error: errorFetchingIsClubClub,
		data: clubClubData
	} = useSubscription<GetIsMemberOfClubSubscriptionSubscription>(
		SUB_IS_MEMBER_OF_CLUB,
		{
			variables: {
				walletAddress: wallet.isConnected ? wallet.accounts[0] : '',
				clubSlug: 'club-club',
				chainId:
					wallet.chainId ??
					hostnameToChainId(
						global.window ? global.window.location.host : ''
					)
			},

			client: anonClient
		}
	)

	useEffect(() => {
		if (!loading && !errorFetchingIsClubClub && clubClubData) {
			if (clubClubData.AgreementTokens.length > 0) {
				setIsMember(true)
			} else {
				setIsMember(false)
			}
		}
	}, [clubClubData, errorFetchingIsClubClub, loading])

	const value = useMemo(
		() => ({
			isMember:
				process.env.NEXT_PUBLIC_IGNORE_CLUB_CLUB_MEMBERSHIP ===
					'true' || isMember
		}),
		[isMember]
	)
	return <ClubClubContext.Provider value={value} {...props} />
}
