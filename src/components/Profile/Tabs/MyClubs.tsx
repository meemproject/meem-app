/* eslint-disable @typescript-eslint/naming-convention */
import { useSubscription } from '@apollo/client'
import {
	createStyles,
	Text,
	Image,
	Space,
	Loader,
	Grid,
	Badge
} from '@mantine/core'
import { useWallet } from '@meemproject/react'
import { Group } from 'iconoir-react'
import { useRouter } from 'next/router'
import React from 'react'
import {
	MeemContracts,
	MyClubsSubscriptionSubscription
} from '../../../../generated/graphql'
import { SUB_MY_CLUBS } from '../../../graphql/clubs'
import { Club, clubSummaryFromMeemContract } from '../../../model/club/club'

const useStyles = createStyles(theme => ({
	row: {
		display: 'flex'
	},
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
		marginBottom: 24,
		fontSize: 16,
		fontWeight: 600,
		cursor: 'pointer',
		border: '1px solid rgba(0, 0, 0, 0.1)',
		backgroundColor: '#FAFAFA',
		borderRadius: 16,
		padding: 16
	},
	clubItemRow: {
		display: 'flex',
		alignItems: 'center'
	},
	clubLogoImage: {
		imageRendering: 'pixelated'
	},
	clubNameEllipsis: {
		textOverflow: 'ellipsis',
		msTextOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		overflow: 'hidden'
	},

	myClubsPrompt: { fontSize: 18, marginBottom: 16 },
	badgeText: {
		color: '#000'
	},
	badge: {
		paddingLeft: 8,
		paddingRight: 8
	},
	profileHeaderText: {
		fontWeight: 600,
		fontSize: 20,
		marginBottom: 32
	}
}))

export const MyClubsComponent: React.FC = () => {
	const { classes } = useStyles()
	const router = useRouter()
	const wallet = useWallet()

	const { loading, data: clubData } =
		useSubscription<MyClubsSubscriptionSubscription>(SUB_MY_CLUBS, {
			variables: {
				chainId: wallet.chainId,
				walletAddress:
					wallet.accounts &&
					wallet.accounts[0] &&
					wallet.accounts[0].toLowerCase()
			}
		})

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
					<Space h={12} />
					<Loader variant="oval" color="red" />
				</>
			)}
			{clubs.length === 0 && !loading && (
				<>
					<Space h={12} />
					<Text className={classes.profileHeaderText}>My Clubs</Text>

					<Text className={classes.myClubsPrompt}>
						{`You haven't joined any clubs!`}
					</Text>
					<Text className={classes.createClubLink}>
						<a onClick={navigateToCreate}>Start a new one?</a>
					</Text>
				</>
			)}
			{clubs.length > 0 && !loading && (
				<>
					<Space h={12} />
					<Text className={classes.profileHeaderText}>My Clubs</Text>
					<Grid>
						{clubs.map(club => (
							<Grid.Col
								xs={6}
								sm={4}
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
									<div className={classes.clubItemRow}>
										<Image
											className={classes.clubLogoImage}
											src={club.image ?? ''}
											width={40}
											height={40}
											radius={8}
											fit={'cover'}
										/>
										<Space w="xs" />

										<div
											className={classes.clubNameEllipsis}
										>
											<Text
												className={
													classes.clubNameEllipsis
												}
											>
												{club.name}
											</Text>
											<Space h={4} />
											<div className={classes.row}>
												<Badge
													variant="gradient"
													gradient={{
														from: '#DCDCDC',
														to: '#DCDCDC',
														deg: 35
													}}
													classNames={{
														inner: classes.badgeText,
														root: classes.badge
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
												{/* <Space w={4} />
												<Badge
													variant="gradient"
													gradient={{
														from: '#DCDCDC',
														to: '#DCDCDC',
														deg: 35
													}}
													classNames={{
														inner: classes.badgeText,
														root: classes.badge
													}}
												>
													<Text>{'3 Roles'}</Text>
												</Badge> */}
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
