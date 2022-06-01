/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/naming-convention */
import { useQuery } from '@apollo/client'
import {
	createStyles,
	Container,
	Text,
	Image,
	Space,
	Center,
	Loader
} from '@mantine/core'
import { useWallet } from '@meemproject/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { ArrowLeft } from 'tabler-icons-react'
import { GetClubQuery, MeemContracts } from '../../../generated/graphql'
import { GET_CLUB } from '../../graphql/clubs'
import clubFromMeemContract, { Club } from '../../model/club/club'
import { ClubAdminDappSettingsComponent } from './ClubAdminDappsSettings'
import { ClubAdminMembershipSettingsComponent } from './ClubAdminMembershipSettings'
import { ClubAdminProfileSettings } from './ClubAdminProfileSettings'
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

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
	headerArrow: {
		marginRight: 24,
		cursor: 'pointer',
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			display: 'none'
		}
	},
	headerTitle: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row'
	},
	headerClubName: {
		fontWeight: 600,
		fontSize: 24,
		marginLeft: 32,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 16,
			marginLeft: 16
		}
	},
	clubLogoImage: {
		imageRendering: 'pixelated',
		width: 80,
		height: 80,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			width: 40,
			height: 40,
			minHeight: 40,
			minWidth: 40,
			marginLeft: 16
		}
	},
	clubSettingsIcon: {
		width: 16,
		height: 16,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			width: 24,
			height: 24
		}
	},
	buttonEditProfile: {
		borderRadius: 24,
		marginRight: 24,
		color: 'black',
		borderColor: 'black',
		backgroundColor: 'white',
		'&:hover': {
			backgroundColor: theme.colors.gray[0]
		},
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 0,
			marginLeft: 16,
			marginRight: 0,
			borderColor: 'transparent'
		}
	},
	tabs: {
		display: 'flex',
		flexDirection: 'row'
	},

	activeTab: {
		fontSize: 18,
		marginBottom: 16,
		marginRight: 24,
		fontWeight: 600,
		color: 'black',
		textDecoration: 'underline',
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 16,
			marginRight: 16
		}
	},
	inactiveTab: {
		fontSize: 18,
		marginBottom: 16,
		marginRight: 24,

		fontWeight: 600,
		color: 'rgba(45, 28, 28, 0.3)',
		cursor: 'pointer',
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 16,
			marginRight: 16
		}
	},
	visibleTab: {
		display: 'block'
	},
	invisibleTab: {
		display: 'none'
	}
}))

enum Tab {
	Membership,
	Profile,
	Integrations
}

interface IProps {
	slug: string
}

export const ClubAdminComponent: React.FC<IProps> = ({ slug }) => {
	// General properties / tab management
	const { classes } = useStyles()
	const router = useRouter()
	const wallet = useWallet()

	const [currentTab, setCurrentTab] = useState<Tab>(Tab.Membership)

	const navigateToClubDetail = () => {
		router.push({ pathname: `/${slug}` })
	}

	const switchToMembership = () => {
		setCurrentTab(Tab.Membership)
	}

	const switchToClubProfile = () => {
		setCurrentTab(Tab.Profile)
	}

	const switchToIntegrations = () => {
		setCurrentTab(Tab.Integrations)
	}

	const {
		loading,
		error,
		data: clubData
	} = useQuery<GetClubQuery>(GET_CLUB, {
		variables: { slug }
	})

	const [club, setClub] = useState<Club>()

	useEffect(() => {
		async function getClub(data: GetClubQuery) {
			const possibleClub = await clubFromMeemContract(
				wallet.isConnected ? wallet.accounts[0] : undefined,
				data.MeemContracts[0] as MeemContracts
			)

			if (possibleClub && possibleClub.name) {
				setClub(possibleClub)
			}
		}
		if (!loading && !error && !club && clubData) {
			getClub(clubData)
		}
	}, [club, clubData, error, loading, wallet.accounts, wallet.isConnected])

	return (
		<>
			{loading && (
				<Container>
					<Space h={120} />
					<Center>
						<Loader />
					</Center>
				</Container>
			)}
			{!loading && !club?.name && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>Sorry, that club does not exist!</Text>
					</Center>
				</Container>
			)}

			{!loading && club?.name && (
				<>
					<div className={classes.header}>
						<div className={classes.headerTitle}>
							<a onClick={navigateToClubDetail}>
								<ArrowLeft className={classes.headerArrow} size={32} />
							</a>
							<Image className={classes.clubLogoImage} src={club.image!} />
							{/* <Text className={classes.headerClubName}>{clubName}</Text> */}
							<Text className={classes.headerClubName}>{club.name!}</Text>
						</div>
					</div>

					{!club?.isClubAdmin && (
						<Container>
							<Space h={120} />
							<Center>
								<Text>
									Sorry, you do not have permission to view this page. Contact
									the club owner for help.
								</Text>
							</Center>
						</Container>
					)}
					{club?.isClubAdmin && (
						<Container>
							<div className={classes.tabs}>
								<a onClick={switchToMembership}>
									<Text
										className={
											currentTab == Tab.Membership
												? classes.activeTab
												: classes.inactiveTab
										}
									>
										Manage Club
									</Text>
								</a>
								<a onClick={switchToClubProfile}>
									<Text
										className={
											currentTab == Tab.Profile
												? classes.activeTab
												: classes.inactiveTab
										}
									>
										Edit Profile
									</Text>
								</a>
								<a onClick={switchToIntegrations}>
									<Text
										className={
											currentTab == Tab.Integrations
												? classes.activeTab
												: classes.inactiveTab
										}
									>
										dApps
									</Text>
								</a>
							</div>
							<div
								className={
									currentTab === Tab.Membership
										? classes.visibleTab
										: classes.invisibleTab
								}
							>
								<ClubAdminMembershipSettingsComponent
									isCreatingClub={false}
									club={club}
								/>
							</div>

							<div
								className={
									currentTab === Tab.Profile
										? classes.visibleTab
										: classes.invisibleTab
								}
							>
								<ClubAdminProfileSettings club={club} />
							</div>

							<div
								className={
									currentTab === Tab.Integrations
										? classes.visibleTab
										: classes.invisibleTab
								}
							>
								{' '}
								<ClubAdminDappSettingsComponent club={club} />
							</div>
						</Container>
					)}
				</>
			)}
		</>
	)
}
