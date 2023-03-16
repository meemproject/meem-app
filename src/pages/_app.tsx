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
import { default as AbortController } from 'abort-controller'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import Script from 'next/script'
import React, { useEffect } from 'react'
import { AgreementProvider } from '../components/AgreementHome/AgreementProvider'
import { App } from '../components/App'
import '@fontsource/inter'
import 'isomorphic-fetch'
import { AnalyticsProvider } from '../contexts/AnalyticsProvider'

// Fix an issue with SSR / ServerSideProps in NextJS
Object.assign(globalThis, {
	AbortController
})

function MyApp(props: AppProps) {
	const { Component, pageProps } = props

	const router = useRouter()

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

	const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID)

	const agreementSlug =
		router.query.slug === undefined ? undefined : `${router.query.slug}`

	const isMembershipRequired =
		router.pathname.includes('/admin') ||
		router.pathname.includes(
			'/settings' || router.pathname.includes('/roles')
		)

	return (
		<>
			<MeemProvider
				chainId={chainId}
				magicApiKey={process.env.NEXT_PUBLIC_MAGIC_API_KEY ?? ''}
			>
				<>
					<ColorSchemeProvider
						colorScheme={colorScheme}
						toggleColorScheme={toggleColorScheme}
					>
						<MantineProvider
							withGlobalStyles
							withNormalizeCSS
							theme={{
								fontFamily: 'Inter, sans-serif',
								spacing: {
									xs: 15,
									sm: 20,
									md: 25,
									lg: 30,
									xl: 40
								},
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
										'#EFF7FF',
										'#bed2e2',
										'#266a9d',
										'#266a9d',
										'#266a9d',
										'#266a9d',
										'#266a9d',
										'#495CA8',
										'#4B588F',
										'#49537A'
									]
								},
								colorScheme,
								primaryColor: 'brand'
							}}
						>
							<NotificationsProvider>
								<AgreementProvider
									slug={agreementSlug}
									isMembersOnly={isMembershipRequired}
								>
									<AnalyticsProvider
										writeKey={
											process.env
												.NEXT_PUBLIC_SEGMENT_WRITE_KEY ??
											''
										}
									>
										<App>
											<Component {...pageProps} />
										</App>
									</AnalyticsProvider>
								</AgreementProvider>
							</NotificationsProvider>
						</MantineProvider>
					</ColorSchemeProvider>
				</>
			</MeemProvider>
			<Script src="https://desk.zoho.com/portal/api/web/inapp/829537000000317001?orgId=803188851" />
		</>
	)
}
export default MyApp
