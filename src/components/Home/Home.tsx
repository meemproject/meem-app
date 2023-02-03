import { useQuery } from '@apollo/client'
import { Loader, Center, Space } from '@mantine/core'
import { useMeemApollo, useWallet } from '@meemproject/react'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
// eslint-disable-next-line import/namespace
import { GetIsMemberOfAgreementQuery } from '../../../generated/graphql'
import { GET_IS_MEMBER_OF_AGREEMENT } from '../../graphql/agreements'
import { hostnameToChainId } from '../App'

export function HomeComponent() {
	const router = useRouter()
	const { anonClient } = useMeemApollo()
	const wallet = useWallet()

	const {
		data: isMemberData,
		error: isMemberDataError,
		loading
	} = useQuery<GetIsMemberOfAgreementQuery>(GET_IS_MEMBER_OF_AGREEMENT, {
		variables: {
			walletAddress: wallet.isConnected ? wallet.accounts[0] : '',
			agreementSlug: 'meem',
			chainId:
				wallet.chainId ??
				hostnameToChainId(
					global.window ? global.window.location.host : ''
				)
		},
		client: anonClient
	})

	useEffect(() => {
		if (!loading && isMemberDataError) {
			router.push('/meem')
		} else if (!loading && isMemberData?.AgreementTokens.length === 0) {
			router.push('/meem')
		} else if (
			!loading &&
			isMemberData &&
			isMemberData?.AgreementTokens.length > 0
		) {
			router.push({
				pathname: '/profile',
				query: { tab: 'myCommunities' }
			})
		}
	}, [isMemberData, isMemberDataError, loading, router])

	return (
		<div>
			<Space h={120} />
			<Center>
				<Loader variant="oval" color="cyan" />
			</Center>
		</div>
	)
}
