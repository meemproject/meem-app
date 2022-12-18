/* eslint-disable react/prop-types */
import log from '@kengoldfarb/log'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import { ClubAdminComponent } from '../../components/Admin/ClubAdmin'
import { hostnameToChainId } from '../../components/App'
import { ClubProvider } from '../../components/ClubHome/ClubProvider'
import { MeemFooter } from '../../components/Footer/MeemFooter'
import { HeaderMenu } from '../../components/Header/Header'
import { GET_CLUB_INFO } from '../../graphql/clubs'
import { ssrGraphqlClient } from '../../utils/ssr_graphql'
import { ClubPropViewModel } from '.'

interface IProps {
	club: ClubPropViewModel
}

const ClubAdminPage: NextPage<IProps> = ({ club }) => {
	const router = useRouter()

	const clubSlug =
		router.query.slug === undefined ? '' : `${router.query.slug}`
	return (
		<>
			<Head>
				<title>
					{club === undefined || club.isError
						? 'Not found'
						: `${club.responseBody.Agreements[0].name} | Admin | Clubs`}
				</title>
				<meta
					name="title"
					content={
						club === undefined || club.isError
							? 'Not found'
							: `${club.responseBody.Agreements[0].name} | Admin | Clubs`
					}
				/>
				<meta
					name="description"
					content={`Admin page for ${
						club === undefined || club.isError
							? 'an unknown club'
							: club.responseBody.Agreements[0].name
					}`}
				/>
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://clubs.link/" />
				<meta
					property="og:title"
					content={
						club === undefined || club.isError
							? 'Not found'
							: `${club.responseBody.Agreements[0].name} | Admin | Clubs`
					}
				/>
				<meta
					property="og:description"
					content={`Admin page for ${
						club === undefined || club.isError
							? 'an unknown club'
							: club.responseBody.Agreements[0].name
					}`}
				/>
				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:url" content="https://clubs.link/" />
				<meta
					property="twitter:title"
					content={
						club === undefined || club.isError
							? 'Not found'
							: `${club.responseBody.Agreements[0].name} | Admin | Clubs`
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
			<ClubProvider slug={clubSlug}>
				<ClubAdminComponent />
			</ClubProvider>

			<MeemFooter />
		</>
	)
}

export const getServerSideProps: GetServerSideProps = async ({
	params,
	req
}) => {
	let club: ClubPropViewModel | undefined
	const client = ssrGraphqlClient

	try {
		if (params?.slug) {
			const { data, errors } = await client.query({
				query: GET_CLUB_INFO,
				variables: {
					slug: params.slug,
					chainId: hostnameToChainId(req.headers.host ?? '')
				}
			})

			if (data.Agreements.length === 0) {
				club = {
					isError: true,
					description: 'This club does not exist. Yet.',
					responseBody: null
				}
			} else {
				club = {
					isError: false,
					responseBody: data,
					description: data.Agreements[0].metadata.description ?? ''
				}
			}
			return {
				props: {
					club,
					isError: !!errors,
					description: 'There was an error fetching club data'
				}
			}
		}

		return { props: {} }
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

export default ClubAdminPage
