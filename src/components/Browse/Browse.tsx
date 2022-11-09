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
	Badge
} from '@mantine/core'
import { useWallet } from '@meemproject/react'
import { Group } from 'iconoir-react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { ArrowLeft } from 'tabler-icons-react'
import { AllClubsQuery, MeemContracts } from '../../../generated/graphql'
import { GET_ALL_CLUBS } from '../../graphql/clubs'
import { Club, clubSummaryFromMeemContract } from '../../model/club/club'
import { useCustomApollo } from '../../providers/ApolloProvider'
import { hostnameToChainId } from '../App'
import { useGlobalStyles } from '../Styles/GlobalStyles'

export const BrowseComponent: React.FC = () => {
	const { classes: design } = useGlobalStyles()
	const router = useRouter()
	const { chainId } = useWallet()
	const limit = 20
	const [page, setPage] = useState(0)

	const [clubs] = useState<Club[]>([])

	const { anonClient } = useCustomApollo()

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

	clubData?.MeemContracts.forEach(meem => {
		const possibleClub = clubSummaryFromMeemContract(meem as MeemContracts)

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

	return (
		<>
			<div className={design.pageHeader}>
				<div className={design.centeredRow}>
					<a onClick={navigateHome}>
						<ArrowLeft className={design.backArrow} size={32} />
					</a>
					<Text className={design.tHeaderTitleText}>
						Browse all clubs
					</Text>
				</div>
				<Button
					onClick={navigateToCreate}
					className={design.buttonBlack}
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
										className={design.gridItem}
										style={{ marginBottom: 24 }}
										onClick={() => {
											navigateToClub(club.slug ?? '')
										}}
									>
										<Image
											className={design.imageClubLogo}
											src={club.image ?? ''}
											width={40}
											radius={8}
											height={40}
											fit={'cover'}
										/>
										<Space w="xs" />
										<div
											style={{
												textOverflow: 'ellipsis',
												msTextOverflow: 'ellipsis',
												whiteSpace: 'nowrap',
												overflow: 'hidden'
											}}
										>
											<Text
												className={design.tBold}
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
												className={design.tExtraSmall}
												style={{
													marginRight: 8,
													lineHeight: 1.3,
													textOverflow: 'ellipsis',
													msTextOverflow: 'ellipsis',
													whiteSpace: 'nowrap',
													overflow: 'hidden'
												}}
											>
												{club.description}{' '}
											</Text>
											<Space h={6} />
											<Badge
												color="gray"
												variant={'filled'}
												leftSection={
													<>
														<Group
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
								</Grid.Col>
							))}
						</Grid>
						<Space h={24} />

						<Button
							className={design.buttonBlack}
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
