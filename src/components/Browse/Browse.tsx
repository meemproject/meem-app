/* eslint-disable @typescript-eslint/naming-convention */
import { useQuery } from '@apollo/client'
import {
	createStyles,
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

const useStyles = createStyles(theme => ({
	header: {
		marginBottom: 60,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
		paddingTop: 32,
		borderBottomColor: 'rgba(0, 0, 0, 0.08)',
		borderBottomWidth: '1px',
		borderBottomStyle: 'solid',
		paddingBottom: 32,
		paddingLeft: 32,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			marginBottom: 32,
			paddingBottom: 16,
			paddingLeft: 8,
			paddingTop: 16
		}
	},
	headerLeftItems: {
		display: 'flex',
		alignItems: 'center'
	},
	headerArrow: {
		marginRight: 32,
		marginTop: 6,
		cursor: 'pointer',
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			marginRight: 16,
			marginLeft: 16
		}
	},
	headerClubName: {
		fontWeight: 600,
		fontSize: 24,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 20
		}
	},
	buttonCreate: {
		backgroundColor: 'black',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 24,
		marginRight: 32
	},
	createClubLink: {
		marginTop: 24,
		a: {
			color: 'rgba(255, 102, 81, 1)',
			textDecoration: 'underline',
			fontWeight: 'bold'
		}
	},
	clubItem: {
		display: 'flex',
		alignItems: 'start',
		marginBottom: 24,
		fontSize: 16,
		cursor: 'pointer',
		border: '1px solid rgba(0, 0, 0, 0.1)',
		backgroundColor: '#FAFAFA',
		borderRadius: 16,
		padding: 16
	},
	clubInfo: {
		textOverflow: 'ellipsis',
		msTextOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		overflow: 'hidden'
	},
	clubDescription: {
		fontSize: 14,
		marginRight: 8,
		lineHeight: 1.3,
		textOverflow: 'ellipsis',
		msTextOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		overflow: 'hidden'
	},
	clubLogoImage: {
		marginTop: 4,
		imageRendering: 'pixelated'
	},
	clubNameEllipsis: {
		fontWeight: 600,
		textOverflow: 'ellipsis',
		msTextOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		overflow: 'hidden'
	},
	myClubsPrompt: { fontSize: 18, marginBottom: 16 }
}))

export const BrowseComponent: React.FC = () => {
	const { classes } = useStyles()
	const router = useRouter()
	const { chainId } = useWallet()
	const limit = 20
	const [page, setPage] = useState(0)

	const [clubs] = useState<Club[]>([])

	const {
		loading,
		error,
		data: clubData
	} = useQuery<AllClubsQuery>(GET_ALL_CLUBS, {
		variables: {
			chainId,
			limit,
			offset: limit * page
		}
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
			<div className={classes.header}>
				<div className={classes.headerLeftItems}>
					<a onClick={navigateHome}>
						<ArrowLeft className={classes.headerArrow} size={32} />
					</a>
					<Text className={classes.headerClubName}>
						Browse all clubs
					</Text>
				</div>
				<Button
					onClick={navigateToCreate}
					className={classes.buttonCreate}
				>
					Create a Club
				</Button>
			</div>

			<Container>
				{isLoadingClubs && (
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
							<Text>
								An error occurred loading clubs. Try again
								later.
							</Text>
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
										className={classes.clubItem}
										onClick={() => {
											navigateToClub(club.slug ?? '')
										}}
									>
										<Image
											className={classes.clubLogoImage}
											src={club.image ?? ''}
											width={40}
											radius={8}
											height={40}
											fit={'cover'}
										/>
										<Space w="xs" />
										<div className={classes.clubInfo}>
											<Text
												className={
													classes.clubNameEllipsis
												}
											>
												{club.name}
											</Text>
											<Space h={4} />
											<Text
												className={
													classes.clubDescription
												}
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
							className={classes.buttonCreate}
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
