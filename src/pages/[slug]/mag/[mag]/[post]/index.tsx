import log from '@kengoldfarb/log'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import { ClubDetailComponent } from '../../../../../components/Detail/ClubDetail'
import { HeaderMenu } from '../../../../../components/Header/Header'
import { GET_CLUB } from '../../../../../graphql/clubs'
import { clubMetadataFromContractUri } from '../../../../../model/club/club_metadata'
import { ssrGraphqlClient } from '../../../../../utils/ssr_graphql'

export interface PostPropViewModel {
	responseBody: any
	description: string
	isError: boolean
}

interface IProps {
	post: PostPropViewModel
}

const MagPostPage: NextPage<IProps> = ({ post }) => {
	const router = useRouter()

	const magSlug =
		router.query.slug === undefined ? '' : `${router.query.slug}`
	return (
		<>
			<Head>
				<title>
					{post === undefined || post.isError
						? 'Not found'
						: `${post.responseBody.MeemContracts[0].name} | Clubs`}
				</title>
				<meta
					name="title"
					content={
						post === undefined || post.isError
							? 'Not found'
							: `${post.responseBody.MeemContracts[0].name} | Clubs`
					}
				/>
				<meta name="description" content={post.description} />
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://clubs.link/" />
				<meta
					property="og:title"
					content={
						post === undefined || post.isError
							? 'Not found'
							: `${post.responseBody.MeemContracts[0].name} | Clubs`
					}
				/>
				<meta property="og:description" content={post.description} />
				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:url" content="https://clubs.link/" />
				<meta
					property="twitter:title"
					content={
						post === undefined || post.isError
							? 'Not found'
							: `${post.responseBody.MeemContracts[0].name} | Clubs`
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

// TODO: update for mag post
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
	let mag: PostPropViewModel | undefined
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
					description: 'This post does not exist. Yet.',
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
			description: 'This post does not exist. Yet.'
		}
		return {
			props: {
				club: mag
			}
		}
	}
}

export default MagPostPage
