import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { MantineProvider } from '@mantine/core'
import { WalletProvider } from '@meemproject/react'
import type { AppProps } from 'next/app'
import React from 'react'

function MyApp({ Component, pageProps }: AppProps) {
	const client = new ApolloClient({
		uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL,
		cache: new InMemoryCache()
	})

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
					theme={{
						fontFamily: 'Helvetica',
						spacing: { xs: 15, sm: 20, md: 25, lg: 30, xl: 40 }
					}}
				>
					<Component {...pageProps} />
				</MantineProvider>
			</WalletProvider>
		</ApolloProvider>
	)
}
export default MyApp
