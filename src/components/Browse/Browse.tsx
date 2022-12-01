/* eslint-disable @typescript-eslint/naming-convention */
import { useQuery } from '@apollo/client'
import {
	Container,
	Text,
	Image,
	Button,
	Space,
	Center,
	Loader,
	Grid,
	Badge,
	useMantineColorScheme
} from '@mantine/core'
import { useWallet, useMeemApollo } from '@meemproject/react'
import { Group } from 'iconoir-react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { ArrowLeft } from 'tabler-icons-react'
import { AllClubsQuery, Agreements } from '../../../generated/graphql'
import { GET_ALL_CLUBS } from '../../graphql/clubs'
import { Club, clubSummaryFromAgreement } from '../../model/club/club'
import { hostnameToChainId } from '../App'
import {
	colorBlack,
	colorDarkerGrey,
	colorWhite,
	useClubsTheme
} from '../Styles/ClubsTheme'

export const BrowseComponent: React.FC = () => {
	const { classes: clubsTheme } = useClubsTheme()
	const router = useRouter()
	const { chainId } = useWallet()
	const limit = 20
	const [page, setPage] = useState(0)

	const [clubs] = useState<Club[]>([])

	const { anonClient } = useMeemApollo()

	const {
		loading,
		error,
		data: clubData
	} = useQuery<AllClubsQuery>(GET_ALL_CLUBS, {
		variables: {
			chainId:
				chainId ??
				hostnameToChainId(
					global.window ? global.window.location.host : ''
				),
			limit,
			offset: limit * page
		},
		client: anonClient
	})

	const navigateHome = () => {
		router.push({ pathname: '/' })
	}

	const navigateToCreate = () => {
		router.push({ pathname: '/' })
	}

	const navigateToClub = (club: string) => {
		router.push({ pathname: `/${club}` })
	}

	clubData?.Agreements.forEach(meem => {
		const possibleClub = clubSummaryFromAgreement(meem as Agreements)

		if (possibleClub.name) {
			let doesClubExist = false
			clubs.forEach(club => {
				if (possibleClub.slug === club.slug) {
					doesClubExist = true
				}
			})
			if (!doesClubExist) {
				clubs.push(possibleClub)
			}
		}
	})

	const isLoadingClubs = clubs.length === 0

	const { colorScheme } = useMantineColorScheme()
	const isDarkTheme = colorScheme === 'dark'

	return (
		<>
			<div className={clubsTheme.pageHeader}>
				<div className={clubsTheme.centeredRow}>
					<a onClick={navigateHome}>
						<ArrowLeft className={clubsTheme.backArrow} size={32} />
					</a>
					<Space w={16} />
					<Text className={clubsTheme.tLargeBold}>
						Browse all clubs
					</Text>
				</div>
				<Button
					style={{ marginRight: 32 }}
					onClick={navigateToCreate}
					className={clubsTheme.buttonBlack}
				>
					Create a Club
				</Button>
			</div>

			<Container>
				{!error && isLoadingClubs && (
					<Container>
						<Space h={60} />
						<Center>
							<Loader color="red" variant="oval" />
						</Center>
					</Container>
				)}

				{error && (
					<Container>
						<Space h={60} />
						<Center>
							<div>
								<Text>
									An error occurred loading clubs. Try again
									later.
								</Text>
								<Space h={8} />
								<Text>{JSON.stringify(error)}</Text>
							</div>
						</Center>
					</Container>
				)}

				<Space h={32} />

				{!isLoadingClubs && (
					<>
						<Grid>
							{clubs.map(club => (
								<Grid.Col
									xs={8}
									sm={6}
									md={4}
									lg={4}
									xl={4}
									key={club.address}
								>
									<div
										key={club.address}
										className={clubsTheme.gridItem}
										style={{
											display: 'flex'
										}}
										onClick={() => {
											navigateToClub(club.slug ?? '')
										}}
									>
										<Image
											className={clubsTheme.imageClubLogo}
											src={club.image ?? ''}
											width={40}
											radius={8}
											height={40}
											fit={'cover'}
										/>
										<Space w="xs" />
										<div className={clubsTheme.tEllipsis}>
											<Text
												className={
													clubsTheme.tSmallBold
												}
												style={{
													textOverflow: 'ellipsis',
													msTextOverflow: 'ellipsis',
													whiteSpace: 'nowrap',
													overflow: 'hidden'
												}}
											>
												{club.name}
											</Text>
											<Space h={4} />
											<Text
												className={
													clubsTheme.tExtraSmall
												}
												style={{
													marginRight: 8,
													lineHeight: 1.4,
													textOverflow: 'ellipsis',
													msTextOverflow: 'ellipsis',
													whiteSpace: 'nowrap',
													overflow: 'hidden'
												}}
											>
												{club.description}{' '}
											</Text>
											<Space h={8} />
											<Badge
												gradient={{
													from: isDarkTheme
														? colorDarkerGrey
														: '#DCDCDC',
													to: isDarkTheme
														? colorDarkerGrey
														: '#DCDCDC',
													deg: 35
												}}
												classNames={{
													inner: clubsTheme.tBadgeText
												}}
												variant={'gradient'}
												leftSection={
													<>
														<Group
															style={{
																color: isDarkTheme
																	? colorWhite
																	: colorBlack,
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
								</Grid.Col>
							))}
						</Grid>
						<Space h={24} />

						<Button
							className={clubsTheme.buttonBlack}
							loading={loading}
							onClick={() => {
								setPage(page + 1)
							}}
						>
							Load more
						</Button>
					</>
				)}
			</Container>
		</>
	)
}
