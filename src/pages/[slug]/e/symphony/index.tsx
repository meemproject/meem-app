/* eslint-disable react/prop-types */
import { Space } from '@mantine/core'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import React from 'react'
import { SymphonyExtensionOnboarding } from '../../../../components/Extensions/Symphony/SymphonyExtensionOnboarding'
import { MeemFooter } from '../../../../components/Footer/MeemFooter'
import { HeaderMenu } from '../../../../components/Header/Header'
import { deslugify } from '../../../../utils/strings'

interface IProps {
	agreementName: string
}

const SymphonySetupPage: NextPage<IProps> = ({ agreementName }) => {
	const pageTitle = `Community Tweets Setup | ${agreementName} | Meem`
	const pageDescription =
		'Collaborative publishing tools for portable communities'

	return (
		<>
			<Head>
				<title>{pageTitle}</title>
				<meta name="title" content={pageTitle} />
				<meta name="description" content={pageDescription} />
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://app.meem.wtf/" />
				<meta property="og:title" content={pageTitle} />
				<meta property="og:description" content={pageDescription} />
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

			<SymphonyExtensionOnboarding />
			<Space h={64} />
			<MeemFooter />
		</>
	)
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
	return {
		props: {
			agreementName: deslugify(params?.slug?.toString() ?? '')
		}
	}
}

export default SymphonySetupPage
