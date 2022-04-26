import type { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'
import { HomeComponent } from '../components/Home/Home'

const Home: NextPage = () => {
	return (
		<>
			<Head>
				<title>Clubs</title>
				<meta name="title" content="Clubs clubs" />
				<meta name="description" content="Clubs! Clubs!" />
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://clubs.link/" />
				<meta property="og:title" content="Clubs! clubs clubs" />
				<meta property="og:description" content="Clubs! Clubs!" />
				{/* <meta
					property="og:image"
					content="https://meem.wtf/images/meem-share-twitter.png"
				/> */}
				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:url" content="https://clubs.link/" />
				<meta property="twitter:title" content="Clubs! Clubs" />
				<meta
					property="twitter:description"
					content="Clubs! clubs clubs! CLUBS!"
				/>
				{/* <meta
					property="twitter:image"
					content="https://meem.wtf/images/meem-share-twitter.png"
				/>
				<meta name="viewport" content="initial-scale=1, width=device-width" />
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicon-16x16.png"
				/> */}
			</Head>
			<HomeComponent />
		</>
	)
}

export default Home
