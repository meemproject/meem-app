import log, { LogLevel } from '@kengoldfarb/log'
import {
	// eslint-disable-next-line import/named
	ColorScheme,
	ColorSchemeProvider,
	MantineProvider
} from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import { NotificationsProvider } from '@mantine/notifications'
import { WalletProvider, SocketProvider } from '@meemproject/react'
import type { AppProps } from 'next/app'
import React, { useEffect } from 'react'
import { App } from '../components/App'
import { ClubClubProvider } from '../components/ClubHome/ClubClubProvider'
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

	const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
		key: 'mantine-color-scheme',
		defaultValue: 'light',
		getInitialValueInEffect: true
	})
	const toggleColorScheme = (value?: ColorScheme) =>
		setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

	return (
		<ColorSchemeProvider
			colorScheme={colorScheme}
			toggleColorScheme={toggleColorScheme}
		>
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
					colorScheme,
					primaryColor: 'brand'
				}}
			>
				<SocketProvider wsUrl={process.env.NEXT_PUBLIC_WS_URL ?? ''}>
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
				</SocketProvider>
			</MantineProvider>
		</ColorSchemeProvider>
	)
}
export default MyApp
