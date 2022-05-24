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
import { WalletProvider } from '@meemproject/react'
import { createClient } from 'graphql-ws'
import type { AppProps } from 'next/app'
import React from 'react'
import '../styles/globals.scss'
import WebSocket from 'ws'

function MyApp({ Component, pageProps }: AppProps) {
	const httpLink = new HttpLink({
		uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL
	})

	const wsLink = new GraphQLWsLink(
		createClient({
			url: process.env.NEXT_PUBLIC_GRAPHQL_API_WS_URL ?? '',
			webSocketImpl: WebSocket
		})
	)

	// The split function takes three parameters:
	//
	// * A function that's called for each operation to execute
	// * The Link to use for an operation if the function returns a "truthy" value
	// * The Link to use for an operation if the function returns a "falsy" value
	const splitLink = split(
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

	const client = new ApolloClient({
		link: splitLink,
		cache: new InMemoryCache()
	})

	React.useEffect(() => {
		log.setOptions({
			level: (process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel) ?? LogLevel.Warn
		})
	}, [])

	return (
		<ApolloProvider client={client}>
			<WalletProvider
				infuraId={process.env.NEXT_PUBLIC_INFURA_ID ?? ''}
				networkName={process.env.NEXT_PUBLIC_NETWORK ?? ''}
				contractAddressMeem={
					process.env.NEXT_PUBLIC_MEEM_CONTRACT_ADDRESS ?? ''
				}
				contractAddressAuction={
					process.env.NEXT_PUBLIC_AUCTION_CONTRACT_ADDRESS
				}
				auctionCurrencyAddress={
					process.env.NEXT_PUBLIC_AUCTION_CURRENCY_ADDRESS
				}
				contractAddressMeemId={process.env.NEXT_PUBLIC_MEEM_ID_CONTRACT_ADDRESS}
			>
				<MantineProvider
					withGlobalStyles
					withNormalizeCSS
					theme={{
						fontFamily: 'Inter',
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
					<NotificationsProvider>
						<Component {...pageProps} />
					</NotificationsProvider>
				</MantineProvider>
			</WalletProvider>
		</ApolloProvider>
	)
}
export default MyApp
