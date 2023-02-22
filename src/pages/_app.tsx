import log, { LogLevel } from '@kengoldfarb/log'
import {
	Center,
	// eslint-disable-next-line import/named
	ColorScheme,
	ColorSchemeProvider,
	Loader,
	MantineProvider,
	Space
} from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import { NotificationsProvider } from '@mantine/notifications'
import { MeemProvider } from '@meemproject/react'
import { default as AbortController } from 'abort-controller'
import type { AppProps } from 'next/app'
import { Router, useRouter } from 'next/router'
import Script from 'next/script'
import React, { useEffect, useState } from 'react'
import TagManager from 'react-gtm-module'
import { AgreementProvider } from '../components/AgreementHome/AgreementProvider'
import { App, hostnameToChainId } from '../components/App'
import '@fontsource/inter'
import 'isomorphic-fetch'
import { HeaderMenu } from '../components/Header/Header'

// Fix an issue with SSR / ServerSideProps in NextJS
Object.assign(globalThis, {
	AbortController
})

function MyApp(props: AppProps) {
	const { Component, pageProps } = props

	const router = useRouter()

	useEffect(() => {
		TagManager.initialize({ gtmId: 'GTM-WPJD3LN' })
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

	const agreementSlug =
		router.query.slug === undefined ? undefined : `${router.query.slug}`

	const isMembershipRequired =
		router.pathname.includes('/admin') ||
		router.pathname.includes(
			'/settings' || router.pathname.includes('/roles')
		)

	const [loading, setLoading] = useState(false)
	useEffect(() => {
		const start = () => {
			if (
				!router.pathname.includes('/admin') &&
				!router.pathname.includes('profile')
			) {
				setLoading(true)
			}
		}
		const end = () => {
			setLoading(false)
		}
		Router.events.on('routeChangeStart', start)
		Router.events.on('routeChangeComplete', end)
		Router.events.on('routeChangeError', end)
		return () => {
			Router.events.off('routeChangeStart', start)
			Router.events.off('routeChangeComplete', end)
			Router.events.off('routeChangeError', end)
		}
	}, [router.pathname])

	return (
		<>
			<MeemProvider
				chainId={chainId}
				magicApiKey={process.env.NEXT_PUBLIC_MAGIC_API_KEY ?? ''}
			>
				{loading && (
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
								<HeaderMenu />
								<Space h={120} />
								<Center>
									<Loader variant="oval" color="cyan" />
								</Center>
							</MantineProvider>
						</ColorSchemeProvider>
					</>
				)}
				{!loading && (
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
										<App>
											<Component {...pageProps} />
										</App>
									</AgreementProvider>
								</NotificationsProvider>
							</MantineProvider>
						</ColorSchemeProvider>
					</>
				)}
			</MeemProvider>
			<Script src="https://desk.zoho.com/portal/api/web/inapp/829537000000317001?orgId=803188851" />
		</>
	)
}
export default MyApp
