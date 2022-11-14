/* eslint-disable @typescript-eslint/naming-convention */
import { useSubscription } from '@apollo/client'
import { Text, Image, Space, Loader, Grid, Badge } from '@mantine/core'
import { useWallet } from '@meemproject/react'
import { Group } from 'iconoir-react'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import {
	MeemContracts,
	MyClubsSubscriptionSubscription
} from '../../../../generated/graphql'
import { SUB_MY_CLUBS } from '../../../graphql/clubs'
import { Club, clubSummaryFromMeemContract } from '../../../model/club/club'
import { useCustomApollo } from '../../../providers/ApolloProvider'
import { hostnameToChainId } from '../../App'
import { useClubsTheme } from '../../Styles/ClubsTheme'

export const MyClubsComponent: React.FC = () => {
	const { classes: clubsTheme } = useClubsTheme()
	const router = useRouter()
	const wallet = useWallet()
	const { mutualMembersClient } = useCustomApollo()

	const {
		loading,
		data: clubData,
		error
	} = useSubscription<MyClubsSubscriptionSubscription>(SUB_MY_CLUBS, {
		variables: {
			chainId:
				wallet.chainId ??
				hostnameToChainId(
					global.window ? global.window.location.host : ''
				),
			walletAddress:
				wallet.accounts &&
				wallet.accounts[0] &&
				wallet.accounts[0].toLowerCase()
		},
		client: mutualMembersClient
	})

	useEffect(() => {
		if (
			error?.graphQLErrors &&
			error.graphQLErrors.length > 0 &&
			error.graphQLErrors[0].extensions.code === 'invalid-jwt'
		) {
			router.push({
				pathname: '/authenticate',
				query: {
					return: `/profile?tab=myClubs`
				}
			})
		}
	}, [error, router])

	const navigateToCreate = () => {
		router.push({ pathname: '/' })
	}

	const navigateToClub = (club: string) => {
		router.push({ pathname: `/${club}` })
	}

	const clubs: Club[] = []

	clubData?.Meems.forEach(meem => {
		const possibleClub = clubSummaryFromMeemContract(
			meem.MeemContract as MeemContracts
		)

		if (possibleClub.name) {
			clubs.push(possibleClub)
		}
	})

	return (
		<>
			{loading && (
				<>
					<Space h={16} />
					<Loader variant="oval" color="red" />
				</>
			)}
			{clubs.length === 0 && !loading && (
				<>
					<Space h={16} />
					<Text className={clubsTheme.tMediumBold}>My Clubs</Text>
					<Space h={32} />
					<Text className={clubsTheme.tMediumBold}>
						{`You haven't joined any clubs!`}
					</Text>
					<Space h={16} />
					<Text className={clubsTheme.tLink}>
						<a onClick={navigateToCreate}>Start a new one?</a>
					</Text>
				</>
			)}
			{clubs.length > 0 && !loading && (
				<>
					<Space h={12} />
					<Text className={clubsTheme.tLargeBold}>My Clubs</Text>
					<Space h={32} />

					<Grid style={{ maxWidth: 1000 }}>
						{clubs.map(club => (
							<Grid.Col
								xs={6}
								sm={6}
								md={6}
								lg={4}
								xl={4}
								key={club.address}
							>
								<div
									key={club.address}
									className={clubsTheme.gridItem}
									onClick={() => {
										navigateToClub(club.slug ?? '')
									}}
								>
									<div className={clubsTheme.row}>
										<Image
											className={clubsTheme.imageClubLogo}
											src={club.image ?? ''}
											width={40}
											height={40}
											radius={8}
											fit={'cover'}
										/>
										<Space w="xs" />

										<div className={clubsTheme.tEllipsis}>
											<Text
												className={clubsTheme.tEllipsis}
											>
												{club.name}
											</Text>
											<Space h={8} />
											<div className={clubsTheme.row}>
												<Badge
													variant="gradient"
													gradient={{
														from: '#DCDCDC',
														to: '#DCDCDC',
														deg: 35
													}}
													classNames={{
														inner: clubsTheme.tExtraSmallBoldBlack,
														root: clubsTheme.badge
													}}
													leftSection={
														<>
															<Group
																color="#000"
																style={{
																	marginTop: 5
																}}
															/>
														</>
													}
												>
													{club.memberCount}
												</Badge>
											</div>
										</div>
									</div>
								</div>
							</Grid.Col>
						))}
					</Grid>

					<Space h={60} />
				</>
			)}
		</>
	)
}
