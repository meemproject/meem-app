import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { MantineProvider } from '@mantine/core'
import { WalletProvider } from '@meemproject/react'
import type { AppProps } from 'next/app'
import React from 'react'
import '../styles/globals.scss'

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
						fontFamily: 'Inter',
						spacing: { xs: 15, sm: 20, md: 25, lg: 30, xl: 40 },
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
					<Component {...pageProps} />
				</MantineProvider>
			</WalletProvider>
		</ApolloProvider>
	)
}
export default MyApp
