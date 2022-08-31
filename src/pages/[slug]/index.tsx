import log from '@kengoldfarb/log'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import { ClubDetailComponent } from '../../components/Detail/ClubDetail'
import { MeemFooter } from '../../components/Footer/MeemFooter'
import { HeaderMenu } from '../../components/Header/Header'
import { GET_CLUB } from '../../graphql/clubs'
import { ssrGraphqlClient } from '../../utils/ssr_graphql'

export interface ClubPropViewModel {
	responseBody: any
	description: string
	isError: boolean
}

interface IProps {
	club: ClubPropViewModel
}

const ClubDetailPage: NextPage<IProps> = ({ club }) => {
	const router = useRouter()

	const clubSlug =
		router.query.slug === undefined ? '' : `${router.query.slug}`
	return (
		<>
			<Head>
				<title>
					{club === undefined || club.isError
						? 'Not found'
						: `${club.responseBody.MeemContracts[0].name} | Clubs`}
				</title>
				<meta
					name="title"
					content={
						club === undefined || club.isError
							? 'Not found'
							: `${club.responseBody.MeemContracts[0].name} | Clubs`
					}
				/>
				<meta name="description" content={club.description} />
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://clubs.link/" />
				<meta
					property="og:title"
					content={
						club === undefined || club.isError
							? 'Not found'
							: `${club.responseBody.MeemContracts[0].name} | Clubs`
					}
				/>
				<meta property="og:description" content={club.description} />
				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:url" content="https://clubs.link/" />
				<meta
					property="twitter:title"
					content={
						club === undefined || club.isError
							? 'Not found'
							: `${club.responseBody.MeemContracts[0].name} | Clubs`
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
			<ClubDetailComponent slug={clubSlug} />
			<MeemFooter />
		</>
	)
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
	let club: ClubPropViewModel | undefined
	const client = ssrGraphqlClient

	try {
		if (params?.slug) {
			const { data } = await client.query({
				query: GET_CLUB,
				variables: {
					slug: params.slug,
					visibilityLevel: ['anyone']
				}
			})

			if (data.MeemContracts.length === 0) {
				club = {
					isError: true,
					description: 'This club does not exist. Yet.',
					responseBody: null
				}
			} else {
				club = {
					isError: false,
					responseBody: data,
					description:
						data.MeemContracts[0].metadata.description ?? ''
				}
			}
		}

		return {
			props: {
				club
			}
		}
	} catch (e) {
		log.debug(e)
		club = {
			isError: true,
			responseBody: null,
			description: 'This club does not exist. Yet.'
		}
		return {
			props: {
				club
			}
		}
	}
}

export default ClubDetailPage
