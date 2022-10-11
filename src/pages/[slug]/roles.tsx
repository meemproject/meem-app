/* eslint-disable react/prop-types */
import log from '@kengoldfarb/log'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import { MeemFooter } from '../../components/Footer/MeemFooter'
import { HeaderMenu } from '../../components/Header/Header'
import { RolesManager } from '../../components/Roles/RolesManager'
import { GET_CLUB } from '../../graphql/clubs'
import { ssrGraphqlClient } from '../../utils/ssr_graphql'
import { ClubPropViewModel } from '.'

interface IProps {
	club: ClubPropViewModel
}

const ClubRolesPage: NextPage<IProps> = ({ club }) => {
	const router = useRouter()

	const clubSlug =
		router.query.slug === undefined ? '' : `${router.query.slug}`
	return (
		<>
			<Head>
				<title>
					{club === undefined || club.isError
						? 'Not found'
						: `${club.responseBody.MeemContracts[0].name} | Roles | Clubs`}
				</title>
				<meta
					name="title"
					content={
						club === undefined || club.isError
							? 'Not found'
							: `${club.responseBody.MeemContracts[0].name} | Roles | Clubs`
					}
				/>
				<meta
					name="description"
					content={`Roles page for ${
						club === undefined || club.isError
							? 'an unknown club'
							: club.responseBody.MeemContracts[0].name
					}`}
				/>
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://clubs.link/" />
				<meta
					property="og:title"
					content={
						club === undefined || club.isError
							? 'Not found'
							: `${club.responseBody.MeemContracts[0].name} | Roles | Clubs`
					}
				/>
				<meta
					property="og:description"
					content={`Roles page for ${
						club === undefined || club.isError
							? 'an unknown club'
							: club.responseBody.MeemContracts[0].name
					}`}
				/>
				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:url" content="https://clubs.link/" />
				<meta
					property="twitter:title"
					content={
						club === undefined || club.isError
							? 'Not found'
							: `${club.responseBody.MeemContracts[0].name} | Roles | Clubs`
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
			<RolesManager slug={clubSlug} />
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
					visibilityLevel: ['anyone'],
					showPublicApps: [true]
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

export default ClubRolesPage