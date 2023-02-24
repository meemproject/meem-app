/* eslint-disable react/prop-types */
import { Space } from '@mantine/core'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import { AgreementHome } from '../../components/AgreementHome/AgreementHome'
import { DiscussionsProvider } from '../../components/Extensions/Discussions/DiscussionProvider'
import { MeemFooter } from '../../components/Footer/MeemFooter'
import { HeaderMenu } from '../../components/Header/Header'
import { meemCommunityDescription } from '../../utils/sitedescriptions'
import { deslugify } from '../../utils/strings'

const AgreementDetailPage: NextPage = () => {
	const router = useRouter()
	const agreementSlug = router.asPath.split('/')[1]
	const agreementName = deslugify(agreementSlug ?? '')
	const pageTitle = `${agreementName} | Meem`

	return (
		<>
			<Head>
				<title>{pageTitle}</title>
				<meta name="title" content={pageTitle} />
				<meta name="description" content={meemCommunityDescription} />
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://app.meem.wtf/" />
				<meta property="og:title" content={pageTitle} />
				<meta
					property="og:description"
					content={meemCommunityDescription}
				/>
				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:url" content="https://app.meem.wtf/" />
				<meta property="twitter:title" content={pageTitle} />
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

			<DiscussionsProvider>
				<AgreementHome />
			</DiscussionsProvider>
			<Space h={64} />
			<MeemFooter />
		</>
	)
}

export default AgreementDetailPage
