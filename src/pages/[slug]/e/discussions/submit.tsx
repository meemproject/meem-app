/* eslint-disable react/prop-types */
import log from '@kengoldfarb/log'
import { Space } from '@mantine/core'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import React from 'react'
import { hostnameToChainId } from '../../../../components/App'
import { DiscussionPostSubmit } from '../../../../components/Extensions/Discussion/DiscussionPostSubmit'
import { DiscussionsProvider } from '../../../../components/Extensions/Discussion/DiscussionProvider'
import { MeemFooter } from '../../../../components/Footer/MeemFooter'
import { HeaderMenu } from '../../../../components/Header/Header'
import { GET_AGREEMENT_INFO } from '../../../../graphql/agreements'
import { ssrGraphqlClient } from '../../../../utils/ssr_graphql'

export interface AgreementPropViewModel {
	responseBody: any
	description: string
	isError: boolean
}

interface IProps {
	agreement: AgreementPropViewModel
}

const DiscussionPostSubmitPage: NextPage<IProps> = ({ agreement }) => {
	return (
		<>
			<Head>
				<title>
					{agreement === undefined || agreement.isError
						? 'Not found'
						: `${agreement.responseBody.Agreements[0].name} | Submit Post | Meem`}
				</title>
				<meta
					name="title"
					content={
						agreement === undefined || agreement.isError
							? 'Not found'
							: `${agreement.responseBody.Agreements[0].name} | Submit Post | Meem`
					}
				/>
				<meta name="description" content={agreement.description} />
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://app.meem.wtf/" />
				<meta
					property="og:title"
					content={
						agreement === undefined || agreement.isError
							? 'Not found'
							: `${agreement.responseBody.Agreements[0].name} | Submit Post | Meem`
					}
				/>
				<meta
					property="og:description"
					content={agreement.description}
				/>
				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:url" content="https://app.meem.wtf/" />
				<meta
					property="twitter:title"
					content={
						agreement === undefined || agreement.isError
							? 'Not found'
							: `${agreement.responseBody.Agreements[0].name} | Submit Post | Meem`
					}
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

			<DiscussionsProvider>
				<DiscussionPostSubmit />
			</DiscussionsProvider>
			<Space h={64} />
			<MeemFooter />
		</>
	)
}

export const getServerSideProps: GetServerSideProps = async ({
	params,
	req
}) => {
	let agreement: AgreementPropViewModel | undefined
	const client = ssrGraphqlClient

	try {
		if (params?.slug) {
			const { data, errors } = await client.query({
				query: GET_AGREEMENT_INFO,
				variables: {
					slug: params.slug,
					chainId: hostnameToChainId(req.headers.host ?? '')
				}
			})

			if (data.Agreements.length === 0) {
				agreement = {
					isError: true,
					description: 'This community does not exist. Yet.',
					responseBody: null
				}
			} else {
				agreement = {
					isError: false,
					responseBody: data,
					description: `Effortless access management and collaborative
					publishing tools for your online community`
				}
			}
			return {
				props: {
					agreement,
					isError: !!errors,
					description: 'There was an error fetching community data'
				}
			}
		}

		return { props: {} }
	} catch (e) {
		log.debug(e)
		agreement = {
			isError: true,
			responseBody: null,
			description: 'This community does not exist. Yet.'
		}
		return {
			props: {
				agreement
			}
		}
	}
}

export default DiscussionPostSubmitPage
