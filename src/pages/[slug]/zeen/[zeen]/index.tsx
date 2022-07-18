import log from '@kengoldfarb/log'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import { ClubDetailComponent } from '../../../../components/Detail/ClubDetail'
import { HeaderMenu } from '../../../../components/Header/Header'
import { GET_CLUB } from '../../../../graphql/clubs'
import { clubMetadataFromContractUri } from '../../../../model/club/club_metadata'
import { ssrGraphqlClient } from '../../../../utils/ssr_graphql'

export interface ZeenPropViewModel {
	responseBody: any
	description: string
	isError: boolean
}

interface IProps {
	zeen: ZeenPropViewModel
}

const ZeenDetailPage: NextPage<IProps> = ({ zeen }) => {
	const router = useRouter()

	const magSlug =
		router.query.slug === undefined ? '' : `${router.query.slug}`
	return (
		<>
			<Head>
				<title>
					{zeen === undefined || zeen.isError
						? 'Not found'
						: `${zeen.responseBody.MeemContracts[0].name} | Clubs`}
				</title>
				<meta
					name="title"
					content={
						zeen === undefined || zeen.isError
							? 'Not found'
							: `${zeen.responseBody.MeemContracts[0].name} | Clubs`
					}
				/>
				<meta name="description" content={zeen.description} />
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://clubs.link/" />
				<meta
					property="og:title"
					content={
						zeen === undefined || zeen.isError
							? 'Not found'
							: `${zeen.responseBody.MeemContracts[0].name} | Clubs`
					}
				/>
				<meta property="og:description" content={zeen.description} />
				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:url" content="https://clubs.link/" />
				<meta
					property="twitter:title"
					content={
						zeen === undefined || zeen.isError
							? 'Not found'
							: `${zeen.responseBody.MeemContracts[0].name} | Clubs`
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
			<ClubDetailComponent slug={magSlug} />
		</>
	)
}

// TODO: update for mags
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
	let zeen: ZeenPropViewModel | undefined
	const client = ssrGraphqlClient

	try {
		if (params?.slug) {
			const { data } = await client.query({
				query: GET_CLUB,
				variables: {
					slug: params.slug
				}
			})

			if (data.MeemContracts.length === 0) {
				zeen = {
					isError: true,
					description: 'This zeen does not exist. Yet.',
					responseBody: null
				}
			} else {
				const metadata = clubMetadataFromContractUri(
					data.MeemContracts[0].contractURI
				)
				zeen = {
					isError: false,
					responseBody: data,
					description: metadata.description
				}
			}
		}

		return {
			props: {
				zeen
			}
		}
	} catch (e) {
		log.debug(e)
		zeen = {
			isError: true,
			responseBody: null,
			description: 'This zeen does not exist. Yet.'
		}
		return {
			props: {
				zeen
			}
		}
	}
}

export default ZeenDetailPage