import log, { LogLevel } from '@kengoldfarb/log'
import {
	// eslint-disable-next-line import/named
	ColorScheme,
	ColorSchemeProvider,
	MantineProvider
} from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import { NotificationsProvider } from '@mantine/notifications'
import { MeemProvider } from '@meemproject/react'
import type { AppProps } from 'next/app'
import React, { useEffect } from 'react'
import { App, hostnameToChainId } from '../components/App'
import '@fontsource/inter'
// import { CustomApolloProvider } from '../providers/ApolloProvider'

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

	let chainId

	if (process.env.NEXT_PUBLIC_CHAIN_ID) {
		chainId = +process.env.NEXT_PUBLIC_CHAIN_ID
	} else if (typeof window !== 'undefined') {
		chainId = hostnameToChainId(window.location.hostname)
	} else {
		chainId = 5
	}

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
							'#F0F2FA',
							'#CBD3F2',
							'#A2B2F3',
							'#748FFC',
							'#617CEA',
							'#546ED6',
							'#4B62C1',
							'#495CA8',
							'#4B588F',
							'#49537A'
						]
					},
					colorScheme,
					primaryColor: 'brand'
				}}
			>
				<MeemProvider
					chainId={chainId}
					magicApiKey={process.env.NEXT_PUBLIC_MAGIC_API_KEY ?? ''}
				>
					<NotificationsProvider>
						<App>
							<Component {...pageProps} />
						</App>
					</NotificationsProvider>
				</MeemProvider>
			</MantineProvider>
		</ColorSchemeProvider>
	)
}
export default MyApp
