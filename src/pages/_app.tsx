import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	HttpLink,
	split
} from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import log, { LogLevel } from '@kengoldfarb/log'
import { MantineProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import { WalletProvider, SocketProvider } from '@meemproject/react'
import { createClient } from 'graphql-ws'
import type { AppProps } from 'next/app'
import React from 'react'
import { ClubClubProvider } from '../components/Detail/ClubClubProvider'
import '@fontsource/inter'

function MyApp(props: AppProps) {
	const { Component, pageProps } = props

	const httpLink = new HttpLink({
		uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL
	})

	const wsLink =
		typeof window !== 'undefined'
			? new GraphQLWsLink(
					createClient({
						url: process.env.NEXT_PUBLIC_GRAPHQL_API_WS_URL ?? ''
					})
			  )
			: null

	// The split function takes three parameters:
	//
	// * A function that's called for each operation to execute
	// * The Link to use for an operation if the function returns a "truthy" value
	// * The Link to use for an operation if the function returns a "falsy" value
	const splitLink =
		typeof window !== 'undefined' && wsLink != null
			? split(
					({ query }) => {
						const definition = getMainDefinition(query)
						return (
							definition.kind === 'OperationDefinition' &&
							definition.operation === 'subscription'
						)
					},
					wsLink,
					httpLink
			  )
			: httpLink

	const client = new ApolloClient({
		link: splitLink,
		cache: new InMemoryCache()
	})

	React.useEffect(() => {
		const jssStyles = document.querySelector('#jss-server-side')
		if (jssStyles) {
			jssStyles.parentElement?.removeChild(jssStyles)
		}
		log.setOptions({
			level:
				(process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel) ?? LogLevel.Warn
		})
	}, [])

	const rpcs: {
		[chainId: string]: string[]
	} = {}

	if (process.env.NEXT_PUBLIC_RINKEBY_RPC_URL) {
		rpcs['4'] = [process.env.NEXT_PUBLIC_RINKEBY_RPC_URL]
	}

	if (process.env.NEXT_PUBLIC_MATIC_RPC_URL) {
		rpcs['137'] = [process.env.NEXT_PUBLIC_MATIC_RPC_URL]
	}

	return (
		<MantineProvider
			withGlobalStyles
			withNormalizeCSS
			theme={{
				fontFamily: 'Inter, sans-serif',
				spacing: { xs: 15, sm: 20, md: 25, lg: 30, xl: 40 },
				breakpoints: {
					xs: 500,
					sm: 800,
					md: 1000,
					lg: 1200,
					xl: 1400
				},
				colors: {
					brand: [
						'#FAF3F2',
						'#F0D3D0',
						'#ECB2AA',
						'#F18E81',
						'#FF6651',
						'#EA5844',
						'#D44E3C',
						'#B94B3C',
						'#9B4C41',
						'#844B43'
					]
				},
				primaryColor: 'brand'
			}}
		>
			<SocketProvider wsUrl={process.env.NEXT_PUBLIC_WS_URL ?? ''}>
				<ApolloProvider client={client}>
					<WalletProvider rpcs={rpcs}>
						<NotificationsProvider>
							<ClubClubProvider>
								<Component {...pageProps} />
							</ClubClubProvider>
						</NotificationsProvider>
					</WalletProvider>
				</ApolloProvider>
			</SocketProvider>
		</MantineProvider>
	)
}
export default MyApp
