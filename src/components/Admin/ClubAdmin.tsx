/* eslint-disable @typescript-eslint/naming-convention */
import { useSubscription } from '@apollo/client'
import {
	createStyles,
	Container,
	Text,
	Image,
	Space,
	Center,
	Loader,
	Navbar,
	NavLink,
	MediaQuery,
	Burger
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { LoginState, useWallet } from '@meemproject/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Check } from 'tabler-icons-react'
import {
	GetClubSubscriptionSubscription,
	MeemContracts
} from '../../../generated/graphql'
import { SUB_CLUB } from '../../graphql/clubs'
import clubFromMeemContract, { Club } from '../../model/club/club'
import { CAClubAdmins } from './Tabs/CAClubAdmins'
import { CAClubApps } from './Tabs/CAClubApps'
import { CAClubDetails } from './Tabs/CAClubDetails'
import { CAClubIcon } from './Tabs/CAClubIcon'
import { CAContractAddress } from './Tabs/CAContractAddress'
import { CAMembershipSettings } from './Tabs/CAMembershipSettings'

const useStyles = createStyles(theme => ({
	header: {
		marginBottom: 32,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
		paddingTop: 32,
		backgroundColor: '#FAFAFA',
		borderBottomColor: 'rgba(0, 0, 0, 0.08)',
		borderBottomWidth: '1px',
		borderBottomStyle: 'solid',
		paddingBottom: 32,
		paddingLeft: 48,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			marginBottom: 16,
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
	headerClubNameContainer: {
		marginLeft: 32,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			marginLeft: 16
		}
	},
	headerClubName: {
		fontWeight: 600,
		fontSize: 24,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 16
		}
	},
	clubUrlContainer: {
		marginTop: 8,
		display: 'flex',
		flexDirection: 'row'
	},
	clubUrl: {
		fontSize: 14,
		opacity: 0.6,
		fontWeight: 500
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
			marginLeft: 16,
			marginRight: 16
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
	buttonCreate: {
		backgroundColor: 'black',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 24
	},
	tabs: {
		display: 'flex',
		flexDirection: 'row'
	},
	visibleTab: {
		display: 'block'
	},
	invisibleTab: {
		display: 'none'
	},
	clubIntegrationsSectionTitle: {
		fontSize: 20,
		marginBottom: 16,
		fontWeight: 600
	},
	clubContractAddress: {
		wordBreak: 'break-all',
		color: 'rgba(0, 0, 0, 0.5)'
	},
	contractAddressContainer: {
		display: 'flex',
		flexDirection: 'row'
	},
	copy: {
		marginLeft: 4,
		padding: 2,
		cursor: 'pointer'
	},
	adminContainer: {
		display: 'flex',
		width: '100%',
		[`@media (max-width: ${theme.breakpoints.sm}px)`]: {
			flexDirection: 'column'
		}
	},
	adminNavHeader: {
		fontWeight: 600,
		opacity: 0.5,
		marginLeft: 20,
		marginBottom: 4
	},
	adminNavItem: {
		borderRadius: 8
	},
	adminMobileBurger: {
		marginLeft: 24
	},
	adminNavBar: {
		minWidth: 288,
		[`@media (min-width: ${theme.breakpoints.md}px)`]: {
			paddingLeft: 32
		},
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			paddingTop: 24
		}
	},
	adminContent: {
		marginLeft: 32,
		marginRight: 32,
		width: '100%',
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			paddingTop: 8
		}
	},
	exitButton: {
		marginRight: 48,
		marginLeft: 'auto',
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			display: 'none'
		}
	}
}))

enum Tab {
	ContractAddress,
	MembershipSettings,
	Admins,
	ClubDetails,
	ClubIcon,
	Apps
}

interface IProps {
	slug: string
}

export const ClubAdminComponent: React.FC<IProps> = ({ slug }) => {
	// General properties / tab management
	const { classes } = useStyles()
	const router = useRouter()
	const wallet = useWallet()

	const [currentTab, setCurrentTab] = useState<Tab>(Tab.ContractAddress)
	const [mobileNavBarVisible, setMobileNavBarVisible] = useState(false)

	const navigateToClubDetail = () => {
		router.push({ pathname: `/${slug}` })
	}

	const {
		loading,
		error,
		data: clubData
	} = useSubscription<GetClubSubscriptionSubscription>(SUB_CLUB, {
		variables: { slug, visibilityLevel: ['mutual-club-members', 'anyone'] }
	})

	const [isLoadingClub, setIsLoadingClub] = useState(true)
	const [club, setClub] = useState<Club>()

	useEffect(() => {
		if (wallet.loginState === LoginState.NotLoggedIn) {
			router.push({
				pathname: '/authenticate',
				query: {
					return: `/${slug}/admin`
				}
			})
		}
	}, [router, slug, wallet.loginState])

	useEffect(() => {
		async function getClub(data: GetClubSubscriptionSubscription) {
			const possibleClub = await clubFromMeemContract(
				wallet,
				wallet.isConnected ? wallet.accounts[0] : '',
				data.MeemContracts[0] as MeemContracts
			)

			if (possibleClub && possibleClub.name) {
				setClub(possibleClub)
			}
			setIsLoadingClub(false)
		}
		if (!loading && !error && !club && clubData) {
			getClub(clubData)
		}
	}, [
		club,
		clubData,
		error,
		loading,
		wallet,
		wallet.accounts,
		wallet.isConnected
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
			{!isLoadingClub && !club?.name && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>Sorry, that club does not exist!</Text>
					</Center>
				</Container>
			)}

			{!isLoadingClub && club?.name && (
				<>
					<div className={classes.header}>
						<div className={classes.headerTitle}>
							<Image
								width={56}
								height={56}
								className={classes.clubLogoImage}
								src={club.image}
							/>
							{/* <Text className={classes.headerClubName}>{clubName}</Text> */}
							<div className={classes.headerClubNameContainer}>
								<Text className={classes.headerClubName}>
									{club.name}
								</Text>
								<div className={classes.clubUrlContainer}>
									<Text
										className={classes.clubUrl}
									>{`${window.location.origin}/${club.slug}`}</Text>
									<Image
										className={classes.copy}
										src="/copy.png"
										height={20}
										onClick={() => {
											navigator.clipboard.writeText(
												`${window.location.origin}/${club.slug}`
											)
											showNotification({
												radius: 'lg',
												title: 'Club URL copied',
												autoClose: 2000,
												color: 'green',
												icon: <Check />,

												message: `This club's URL was copied to your clipboard.`
											})
										}}
										width={20}
									/>
								</div>
							</div>
						</div>
						<a
							className={classes.exitButton}
							onClick={navigateToClubDetail}
						>
							<Image src="/delete.png" width={24} height={24} />
						</a>
					</div>

					{!club?.isClubAdmin && (
						<Container>
							<Space h={120} />
							<Center>
								<Text>
									Sorry, you do not have permission to view
									this page. Contact the club owner for help.
								</Text>
							</Center>
						</Container>
					)}
					{club?.isClubAdmin && (
						<div className={classes.adminContainer}>
							<MediaQuery
								largerThan="sm"
								styles={{ display: 'none' }}
							>
								<Burger
									className={classes.adminMobileBurger}
									opened={mobileNavBarVisible}
									onClick={() =>
										setMobileNavBarVisible(o => !o)
									}
									size="sm"
									mr="xl"
								/>
							</MediaQuery>
							<Navbar
								className={classes.adminNavBar}
								width={{ base: 288 }}
								height={400}
								hidden={!mobileNavBarVisible}
								hiddenBreakpoint={'sm'}
								withBorder={false}
								p="xs"
							>
								<Text className={classes.adminNavHeader}>
									MANAGE CLUB
								</Text>
								<NavLink
									className={classes.adminNavItem}
									active={currentTab === Tab.ContractAddress}
									label={'Contract Address'}
									onClick={() => {
										setCurrentTab(Tab.ContractAddress)
										setMobileNavBarVisible(false)
									}}
								/>
								<NavLink
									className={classes.adminNavItem}
									active={
										currentTab === Tab.MembershipSettings
									}
									label={'Membership Settings'}
									onClick={() => {
										setCurrentTab(Tab.MembershipSettings)
										setMobileNavBarVisible(false)
									}}
								/>

								<NavLink
									className={classes.adminNavItem}
									active={currentTab === Tab.Admins}
									label={'Club Admins'}
									onClick={() => {
										setCurrentTab(Tab.Admins)
										setMobileNavBarVisible(false)
									}}
								/>
								<NavLink
									className={classes.adminNavItem}
									active={currentTab === Tab.Apps}
									label={'Club Apps'}
									onClick={() => {
										setCurrentTab(Tab.Apps)
										setMobileNavBarVisible(false)
									}}
								/>
								<Space h={32} />
								<Text className={classes.adminNavHeader}>
									EDIT PROFILE
								</Text>
								<NavLink
									className={classes.adminNavItem}
									active={currentTab === Tab.ClubDetails}
									label={'Club Details'}
									onClick={() => {
										setCurrentTab(Tab.ClubDetails)
										setMobileNavBarVisible(false)
									}}
								/>
								<NavLink
									className={classes.adminNavItem}
									active={currentTab === Tab.ClubIcon}
									label={'Club Icon'}
									onClick={() => {
										setCurrentTab(Tab.ClubIcon)
										setMobileNavBarVisible(false)
									}}
								/>
							</Navbar>
							{!mobileNavBarVisible && (
								<div className={classes.adminContent}>
									{currentTab === Tab.ContractAddress && (
										<CAContractAddress club={club} />
									)}
									{currentTab === Tab.MembershipSettings && (
										<CAMembershipSettings club={club} />
									)}
									{currentTab === Tab.Admins && (
										<CAClubAdmins club={club} />
									)}
									{currentTab === Tab.ClubDetails && (
										<CAClubDetails club={club} />
									)}
									{currentTab === Tab.ClubIcon && (
										<CAClubIcon club={club} />
									)}
									{currentTab === Tab.Apps && (
										<CAClubApps club={club} />
									)}
								</div>
							)}
						</div>
					)}
				</>
			)}
		</>
	)
}
