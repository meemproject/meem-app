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
import { ArrowLeft, Check, Plus } from 'tabler-icons-react'
import {
	GetClubSubscriptionSubscription,
	MeemContracts
} from '../../../generated/graphql'
import { SUB_CLUB } from '../../graphql/clubs'
import clubFromMeemContract, { Club, ClubRole } from '../../model/club/club'
import { RolesManagerContent } from './Role/RolesManagerContent'

const useStyles = createStyles(theme => ({
	manageRolesRow: {
		display: 'flex',
		alignItems: 'center',
		marginLeft: 18,
		marginBottom: 24
	},
	rolesHeaderRow: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
		marginLeft: 20
	},
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
		opacity: 0.5
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
			paddingTop: 8,
			width: 'auto'
		}
	},
	exitButton: {
		marginRight: 48,
		marginLeft: 'auto',
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			display: 'none'
		},
		cursor: 'pointer'
	},
	manageRolesHeader: {
		fontWeight: 600,
		fontSize: 20
	},
	link: { cursor: 'pointer' }
}))

interface IProps {
	slug: string
}

interface Tab {
	name: string
	associatedRole?: ClubRole
}

export const RolesManager: React.FC<IProps> = ({ slug }) => {
	// General properties / tab management
	const { classes } = useStyles()
	const router = useRouter()
	const wallet = useWallet()

	const [tabs, setTabs] = useState<Tab[]>([])
	const [currentTab, setCurrentTab] = useState<Tab>()
	const [mobileNavBarVisible, setMobileNavBarVisible] = useState(false)

	const navigateToClubAdmin = () => {
		router.push({ pathname: `/${slug}/admin` })
	}

	const addRole = () => {
		const newTabs = [...tabs]
		newTabs.push({ name: 'Add Role' })
		setTabs(newTabs)
	}

	const {
		loading,
		error,
		data: clubData
	} = useSubscription<GetClubSubscriptionSubscription>(SUB_CLUB, {
		variables: {
			slug,
			visibilityLevel: ['mutual-club-members', 'anyone'],
			showPublicApps: [true, false]
		}
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
		function setupTabs(theClub: Club) {
			const newTabs: Tab[] = []
			if (theClub && theClub.roles) {
				theClub.roles.forEach(role => {
					newTabs.push({ name: role.name, associatedRole: role })
				})
			}

			if (router.query.tab === 'newRole') {
				newTabs.push({ name: 'Add Role' })
			}

			setCurrentTab(newTabs[newTabs.length - 1])

			setTabs(newTabs)
		}

		async function getClub(data: GetClubSubscriptionSubscription) {
			const possibleClub = await clubFromMeemContract(
				wallet,
				wallet.isConnected ? wallet.accounts[0] : '',
				data.MeemContracts[0] as MeemContracts
			)

			if (possibleClub && possibleClub.name) {
				setClub(possibleClub)
				setupTabs(possibleClub)
			}
			setIsLoadingClub(false)
		}
		if (!loading && !error && !club && clubData) {
			getClub(clubData)
		}
	}, [club, clubData, error, loading, router.query.tab, wallet])

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
							onClick={navigateToClubAdmin}
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
								<div className={classes.manageRolesRow}>
									<ArrowLeft
										className={classes.link}
										onClick={() => {
											navigateToClubAdmin()
										}}
									/>
									<Space w={8} />
									<Text className={classes.manageRolesHeader}>
										Manage Roles
									</Text>
								</div>
								<div className={classes.rolesHeaderRow}>
									<Text className={classes.adminNavHeader}>
										ROLES
									</Text>
									<Plus
										className={classes.link}
										onClick={() => {
											addRole()
										}}
									/>
								</div>
								<Space h={8} />

								{tabs.map(tab => (
									<NavLink
										key={tab.name}
										className={classes.adminNavItem}
										active={
											currentTab &&
											currentTab.name === tab.name
										}
										label={tab.name}
										onClick={() => {
											setCurrentTab(tab)
											setMobileNavBarVisible(false)
										}}
									/>
								))}
							</Navbar>
							{!mobileNavBarVisible && (
								<div className={classes.adminContent}>
									{tabs.map(tab => (
										<>
											{currentTab &&
												currentTab.name ===
													tab.name && (
													<RolesManagerContent
														role={
															tab.associatedRole
														}
													/>
												)}
										</>
									))}
								</div>
							)}
						</div>
					)}
				</>
			)}
		</>
	)
}
