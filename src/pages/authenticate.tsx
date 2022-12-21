import type { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'
import Authenticate from '../components/Authenticate/Authenticate'
import { MeemFooter } from '../components/Footer/MeemFooter'
import { HeaderMenu } from '../components/Header/Header'

const AuthenticatePage: NextPage = () => {
	return (
		<div style={{ position: 'relative' }}>
			<Head>
				<title>Authenticate | Meem</title>
				<meta name="title" content="Agreements" />
				<meta
					name="description"
					content="Effortless access management and collaborative
							publishing tools for your online community"
				/>
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://app.meem.wtf/" />
				<meta property="og:title" content="Agreements" />
				<meta
					property="og:description"
					content="Effortless access management and collaborative
							publishing tools for your online community"
				/>
				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:url" content="https://app.meem.wtf/" />
				<meta property="twitter:title" content="Agreements!" />
				<meta
					property="twitter:title"
					content="Effortless access management and collaborative
							publishing tools for your online community"
				/>

				<meta
					name="viewport"
					content="initial-scale=1, width=device-width"
				/>
				<meta property="twitter:image" content="/link-preview.png" />
				<meta property="og:image" content="/link-preview.png" />
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicon.png"
				/>
			</Head>
			<HeaderMenu />
			<Authenticate />
			<MeemFooter />
		</div>
	)
}

export default AuthenticatePage
