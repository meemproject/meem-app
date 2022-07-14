import log from '@kengoldfarb/log'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import { ClubAdminComponent } from '../../../components/Admin/ClubAdmin'
import { HeaderMenu } from '../../../components/Header/Header'
import { GET_CLUB } from '../../../graphql/clubs'
import { clubMetadataFromContractUri } from '../../../model/club/club_metadata'
import { ssrGraphqlClient } from '../../../utils/ssr_graphql'
import { MagPropViewModel } from '.'

interface IProps {
	mag: MagPropViewModel
}

const ClubAdminPage: NextPage<IProps> = ({ mag }) => {
	const router = useRouter()

	const magSlug =
		router.query.slug === undefined ? '' : `${router.query.slug}`
	return (
		<>
			<Head>
				<title>
					{mag === undefined || mag.isError
						? 'Not found'
						: `${mag.responseBody.MeemContracts[0].name} | Admin | Clubs`}
				</title>
				<meta
					name="title"
					content={
						mag === undefined || mag.isError
							? 'Not found'
							: `${mag.responseBody.MeemContracts[0].name} | Admin | Clubs`
					}
				/>
				<meta
					name="description"
					content={`Admin page for ${
						mag === undefined || mag.isError
							? 'an unknown club'
							: mag.responseBody.MeemContracts[0].name
					}`}
				/>
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://clubs.link/" />
				<meta
					property="og:title"
					content={
						mag === undefined || mag.isError
							? 'Not found'
							: `${mag.responseBody.MeemContracts[0].name} | Admin | Clubs`
					}
				/>
				<meta
					property="og:description"
					content={`Admin page for ${
						mag === undefined || mag.isError
							? 'an unknown club'
							: mag.responseBody.MeemContracts[0].name
					}`}
				/>
				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:url" content="https://clubs.link/" />
				<meta
					property="twitter:title"
					content={
						mag === undefined || mag.isError
							? 'Not found'
							: `${mag.responseBody.MeemContracts[0].name} | Admin | Clubs`
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
			<ClubAdminComponent slug={magSlug} />
		</>
	)
}

// TODO: setup mags
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
	let mag: MagPropViewModel | undefined
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
				mag = {
					isError: true,
					description: 'This mag does not exist. Yet.',
					responseBody: null
				}
			} else {
				const metadata = clubMetadataFromContractUri(
					data.MeemContracts[0].contractURI
				)
				mag = {
					isError: false,
					responseBody: data,
					description: metadata.description
				}
			}
		}

		return {
			props: {
				club: mag
			}
		}
	} catch (e) {
		log.debug(e)
		mag = {
			isError: true,
			responseBody: null,
			description: 'This mag does not exist. Yet.'
		}
		return {
			props: {
				club: mag
			}
		}
	}
}

export default ClubAdminPage
