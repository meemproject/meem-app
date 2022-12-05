/* eslint-disable @typescript-eslint/naming-convention */
import { useSubscription } from '@apollo/client'
import log from '@kengoldfarb/log'
import { Container, Text, Space, Loader, Center } from '@mantine/core'
import { useWallet, useMeemApollo } from '@meemproject/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import {
	GetClubSubscriptionSubscription,
	GetIsMemberOfClubSubscriptionSubscription,
	Agreements
} from '../../../generated/graphql'
import {
	SUB_CLUB,
	SUB_CLUB_AS_MEMBER,
	SUB_IS_MEMBER_OF_CLUB
} from '../../graphql/clubs'
import clubFromAgreement, { Club } from '../../model/club/club'
import { hostnameToChainId } from '../App'
import { ClubDiscussionWidget } from '../Extensions/Discussion/ClubDiscussionWidget'
import { useClubsTheme } from '../Styles/ClubsTheme'
import { ClubAddAppsWidget } from './CoreWidgets/ClubAddAppsWidget'
import { ClubExtensionLinksWidget } from './CoreWidgets/ClubExtensionLinksWidget'
import { ClubInfoWidget } from './CoreWidgets/ClubInfoWidget'
import { ClubMembersWidget } from './CoreWidgets/ClubMembersWidget'
import { ClubRequirementsWidget } from './CoreWidgets/ClubRequirementsWidget'

interface IProps {
	slug: string
}

export const ClubDetailComponent: React.FC<IProps> = ({ slug }) => {
	// General imports
	const { classes: clubsTheme } = useClubsTheme()
	const router = useRouter()
	const wallet = useWallet()

	// Club data
	const { anonClient, mutualMembersClient } = useMeemApollo()
	const [club, setClub] = useState<Club | undefined>()
	const [previousClubDataString, setPreviousClubDataString] = useState('')
	const [isLoadingClub, setIsLoadingClub] = useState(true)
	const [doesMeetAllRequirements, setDoesMeetAllRequirements] =
		useState(false)

	// Subscriptions
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
			isCurrentUserClubMemberData.AgreementTokens.length > 0
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
			isCurrentUserClubMemberData.AgreementTokens.length === 0
	})

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

			if (clubData.Agreements.length === 0) {
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
			const possibleClub = await clubFromAgreement(
				wallet,
				wallet.isConnected ? wallet.accounts[0] : '',
				clubData.Agreements[0] as Agreements
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
				<div>
					<Container
						size={1000}
						className={clubsTheme.pageZeroPaddingMobileContainer}
					>
						<div className={clubsTheme.pageResponsiveContainer}>
							<div className={clubsTheme.pageLeftColumn}>
								<ClubInfoWidget
									club={club}
									meetsReqs={doesMeetAllRequirements}
								/>
							</div>
							<div className={clubsTheme.pageRightColumn}>
								<ClubDiscussionWidget club={club} />
								<ClubExtensionLinksWidget club={club} />
								<ClubAddAppsWidget club={club} />
								<ClubRequirementsWidget
									club={club}
									onMeetsAllReqsChanged={meetsReqs => {
										setDoesMeetAllRequirements(meetsReqs)
									}}
								/>
								<ClubMembersWidget club={club} />
								<Space h={64} />
							</div>
						</div>
					</Container>
				</div>
			)}
		</>
	)
}
