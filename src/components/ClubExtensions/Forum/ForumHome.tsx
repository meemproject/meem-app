/* eslint-disable @typescript-eslint/naming-convention */
import { useSubscription } from '@apollo/client'
import log from '@kengoldfarb/log'
import {
	Container,
	Text,
	TextInput,
	Image,
	Space,
	Loader,
	Center,
	Button
} from '@mantine/core'
import { useWallet } from '@meemproject/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Search } from 'tabler-icons-react'
import {
	GetClubSubscriptionSubscription,
	GetIsMemberOfClubSubscriptionSubscription,
	MeemContracts
} from '../../../../generated/graphql'
import {
	SUB_CLUB,
	SUB_CLUB_AS_MEMBER,
	SUB_IS_MEMBER_OF_CLUB
} from '../../../graphql/clubs'
import clubFromMeemContract, { Club } from '../../../model/club/club'
import { ForumPost } from '../../../model/club/forum/forumPost'
import { useCustomApollo } from '../../../providers/ApolloProvider'
import { hostnameToChainId } from '../../App'
import { useClubsTheme } from '../../Styles/ClubsTheme'
import { ForumPostPreview } from './ForumPostPreview'

interface IProps {
	slug: string
}

export const ForumHome: React.FC<IProps> = ({ slug }) => {
	const { classes: clubsTheme } = useClubsTheme()
	const router = useRouter()
	const wallet = useWallet()
	const { anonClient, mutualMembersClient } = useCustomApollo()

	const [club, setClub] = useState<Club | undefined>()

	const [previousClubDataString, setPreviousClubDataString] = useState('')

	const { data: isCurrentUserClubMemberData, error: userClubMemberError } =
		useSubscription<GetIsMemberOfClubSubscriptionSubscription>(
			SUB_IS_MEMBER_OF_CLUB,
			{
				variables: {
					walletAddress: wallet.isConnected ? wallet.accounts[0] : '',
					clubSlug: slug,
					chainId:
						wallet.chainId ??
						hostnameToChainId(
							global.window ? global.window.location.host : ''
						)
				},
				client: anonClient
			}
		)

	const {
		loading: loadingAnonClub,
		error: errorAnonClub,
		data: anonClubData
	} = useSubscription<GetClubSubscriptionSubscription>(SUB_CLUB, {
		variables: {
			slug,
			chainId:
				wallet.chainId ??
				hostnameToChainId(
					global.window ? global.window.location.host : ''
				)
		},
		client: anonClient,
		skip:
			!isCurrentUserClubMemberData ||
			isCurrentUserClubMemberData.Meems.length > 0
	})

	const {
		loading: loadingMemberClub,
		error: errorMemberClub,
		data: memberClubData
	} = useSubscription<GetClubSubscriptionSubscription>(SUB_CLUB_AS_MEMBER, {
		variables: {
			slug,
			chainId:
				wallet.chainId ??
				hostnameToChainId(
					global.window ? global.window.location.host : ''
				)
		},
		client: mutualMembersClient,
		skip:
			!isCurrentUserClubMemberData ||
			isCurrentUserClubMemberData.Meems.length === 0
	})

	const [isLoadingClub, setIsLoadingClub] = useState(true)

	useEffect(() => {
		if (errorAnonClub) {
			log.debug(JSON.stringify(errorAnonClub))
			setIsLoadingClub(false)
		}

		if (errorMemberClub) {
			log.debug(JSON.stringify(errorMemberClub))
			setIsLoadingClub(false)
		}

		async function getClub() {
			const clubData = memberClubData ?? anonClubData

			if (!clubData) {
				return
			}

			if (clubData.MeemContracts.length === 0) {
				setIsLoadingClub(false)
				return
			}
			// TODO: Why do I have to compare strings to prevent an infinite useEffect loop?
			// TODO: Why does this page cause a loop but MyClubs.tsx doesn't?
			if (previousClubDataString) {
				const currentData = JSON.stringify(clubData)
				if (previousClubDataString === currentData) {
					return
				}
			}
			const possibleClub = await clubFromMeemContract(
				wallet,
				wallet.isConnected ? wallet.accounts[0] : '',
				clubData.MeemContracts[0] as MeemContracts
			)

			if (possibleClub && possibleClub.name) {
				setClub(possibleClub)
				setIsLoadingClub(false)
				log.debug('got club')
			}

			setPreviousClubDataString(JSON.stringify(clubData))
		}

		// Parse data for anonymous club
		if (!loadingAnonClub && !errorAnonClub && anonClubData) {
			getClub()
		}

		// Parse data as club member
		if (!loadingMemberClub && !errorMemberClub && memberClubData) {
			getClub()
		}

		if (
			errorMemberClub &&
			errorMemberClub.graphQLErrors.length > 0 &&
			errorMemberClub.graphQLErrors[0].extensions.code === 'invalid-jwt'
		) {
			router.push({
				pathname: '/authenticate',
				query: {
					return: `/browse`
				}
			})
		}
	}, [
		club,
		previousClubDataString,
		wallet,
		loadingAnonClub,
		errorAnonClub,
		anonClubData,
		loadingMemberClub,
		errorMemberClub,
		memberClubData,
		userClubMemberError,
		router,
		isCurrentUserClubMemberData
	])

	const posts: ForumPost[] = [
		{
			id: '1',
			title: 'Test post one',
			tags: ['funny', 'crazy'],
			content: 'This is just a small test post.',
			user: club && club.members ? club.members[0] : { wallet: '' }
		},
		{
			id: '2',
			title: 'Test post two',
			tags: ['funny', 'crazy'],
			content: 'And another test post',
			user: club && club.members ? club.members[0] : { wallet: '' }
		}
	]

	return (
		<>
			{isLoadingClub && (
				<Container>
					<Space h={120} />
					<Center>
						<Loader color="red" variant="oval" />
					</Center>
				</Container>
			)}
			{!isLoadingClub &&
				!errorAnonClub &&
				!errorMemberClub &&
				!club?.name && (
					<Container>
						<Space h={120} />
						<Center>
							<Text>Sorry, that club does not exist!</Text>
						</Center>
					</Container>
				)}
			{!isLoadingClub && (errorAnonClub || errorMemberClub) && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>
							There was an error loading this club. Please let us
							know!
						</Text>
					</Center>
				</Container>
			)}
			{!isLoadingClub && club?.name && (
				<>
					<Container>
						<Space h={48} />

						<Center>
							<Image
								className={clubsTheme.imagePixelated}
								height={100}
								width={100}
								src={club.image}
							/>
						</Center>

						<Space h={24} />
						<Center>
							<Text className={clubsTheme.tLargeBold}>
								{club.name}
							</Text>
						</Center>
						<Space h={8} />

						<Center>
							<Text className={clubsTheme.tMedium}>
								{club.description}
							</Text>
						</Center>
						<Space h={24} />

						<Center>
							<Button className={clubsTheme.buttonBlack}>
								+ Start a discussion
							</Button>
						</Center>
						<Space h={48} />
						<div className={clubsTheme.centeredRow}>
							<TextInput
								radius={20}
								classNames={{
									input: clubsTheme.fTextField
								}}
								icon={<Search />}
								placeholder={'Search discussions'}
								className={clubsTheme.fullWidth}
								size={'lg'}
								onChange={event => {
									log.debug(event.target.value)
									// TODO
								}}
							/>
							<Space w={16} />
							<Button className={clubsTheme.buttonBlack}>
								Sort
							</Button>
						</div>
						<Space h={32} />
						{posts.map(post => (
							<ForumPostPreview key={post.id} post={post} />
						))}
					</Container>
				</>
			)}
		</>
	)
}
