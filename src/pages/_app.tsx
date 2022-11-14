import { Auth0Provider } from '@auth0/auth0-react'
import log, { LogLevel } from '@kengoldfarb/log'
import { MantineProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import { WalletProvider, SocketProvider } from '@meemproject/react'
import type { AppProps } from 'next/app'
import React, { useEffect } from 'react'
import { App } from '../components/App'
import { ClubClubProvider } from '../components/Detail/ClubClubProvider'
import '@fontsource/inter'
import { IdentityProvider } from '../components/Profile/IdentityProvider'
import { CustomApolloProvider } from '../providers/ApolloProvider'

function MyApp(props: AppProps) {
	const { Component, pageProps } = props

	useEffect(() => {
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
				lineHeight: 1,
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
				<Auth0Provider
					domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN ?? ''}
					clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID ?? ''}
					redirectUri={
						typeof window !== 'undefined'
							? window.location.origin
							: ''
					}
				>
					<WalletProvider rpcs={rpcs}>
						<CustomApolloProvider>
							<NotificationsProvider>
								<ClubClubProvider>
									<IdentityProvider>
										<App>
											<Component {...pageProps} />
										</App>
									</IdentityProvider>
								</ClubClubProvider>
							</NotificationsProvider>
						</CustomApolloProvider>
					</WalletProvider>
				</Auth0Provider>
			</SocketProvider>
		</MantineProvider>
	)
}
export default MyApp
