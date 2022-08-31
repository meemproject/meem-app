/* eslint-disable @typescript-eslint/naming-convention */
import {
	createStyles,
	Container,
	Text,
	Image,
	Space,
	Center,
	Loader,
	MediaQuery,
	Burger,
	Navbar,
	NavLink
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { LoginState, useWallet } from '@meemproject/react'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { Check } from 'tabler-icons-react'
import { quickTruncate } from '../../utils/truncated_wallet'
import IdentityContext from './IdentityProvider'
import { ManageIdentityComponent } from './Tabs/Identity/ManageIdentity'
import { MyClubsComponent } from './Tabs/MyClubs'

const useStyles = createStyles(theme => ({
	header: {
		marginBottom: 32,
		display: 'flex',
		backgroundColor: '#FAFAFA',
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
	headerProfileNameContainer: {
		marginLeft: 24,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			marginLeft: 16
		}
	},
	headerProfileName: {
		fontWeight: 600,
		fontSize: 24,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 16
		}
	},
	profileUrlContainer: {
		marginTop: 8,
		display: 'flex',
		flexDirection: 'row'
	},
	profileUrl: {
		fontSize: 14,
		opacity: 0.6,
		fontWeight: 500
	},

	profileLogoImage: {
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
	profileSettingsIcon: {
		width: 16,
		height: 16,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			width: 24,
			height: 24
		}
	},
	profileContainer: {
		display: 'flex',
		[`@media (max-width: ${theme.breakpoints.sm}px)`]: {
			flexDirection: 'column'
		}
	},
	profileNavHeader: {
		fontWeight: 600,
		opacity: 0.5,
		marginLeft: 20,
		marginBottom: 4
	},
	profileNavItem: {
		borderRadius: 8
	},
	profileMobileBurger: {
		marginLeft: 24
	},
	profileNavBar: {
		minWidth: 288,
		[`@media (min-width: ${theme.breakpoints.md}px)`]: {
			paddingLeft: 32
		},
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			paddingTop: 24
		}
	},
	profileContent: {
		marginLeft: 32,
		marginRight: 32,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			paddingTop: 8
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
	},
	profileIntegrationsSectionTitle: {
		fontSize: 20,
		marginBottom: 16,
		fontWeight: 600
	},
	profileContractAddress: {
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
	}
}))

enum Tab {
	Profile,
	MyClubs
}

export const ProfileComponent: React.FC = () => {
	// General properties / tab management
	const { classes } = useStyles()
	const router = useRouter()
	const wallet = useWallet()
	const id = useContext(IdentityContext)

	const [currentTab, setCurrentTab] = useState<Tab>(Tab.Profile)
	const [mobileNavBarVisible, setMobileNavBarVisible] = useState(false)

	useEffect(() => {
		if (wallet.loginState === LoginState.NotLoggedIn) {
			router.push({
				pathname: '/authenticate',
				query: {
					return: `/profile`
				}
			})
		}
	}, [router, wallet.loginState])

	useEffect(() => {
		if (router.query.tab === 'myClubs') {
			setCurrentTab(Tab.MyClubs)
		} else if (router.query.tab === 'identity') {
			setCurrentTab(Tab.Profile)
		}
	}, [router.query.tab])

	return (
		<>
			{!wallet.isConnected && !id.isLoadingIdentity && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>Connect your wallet to access your profile.</Text>
					</Center>
				</Container>
			)}
			{wallet.isConnected && id.isLoadingIdentity && (
				<Container>
					<Space h={120} />
					<Center>
						<Loader variant="oval" color="red" />
					</Center>
				</Container>
			)}
			{wallet.isConnected && !id.isLoadingIdentity && !id.identity && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>
							Unable to load your profile. Please try again later.
						</Text>
					</Center>
				</Container>
			)}
			{wallet.isConnected && !id.isLoadingIdentity && id.identity && (
				<>
					<div className={classes.header}>
						<div className={classes.headerTitle}>
							{id.identity.profilePic && (
								<>
									<Image
										radius={32}
										height={64}
										width={64}
										fit={'cover'}
										className={classes.profileLogoImage}
										src={id.identity.profilePic ?? ''}
									/>
								</>
							)}

							{/* <Text className={classes.headerProfileName}>{profileName}</Text> */}
							<div className={classes.headerProfileNameContainer}>
								<Text className={classes.headerProfileName}>
									{id.identity.displayName ?? 'My Profile'}
								</Text>
								<div className={classes.profileUrlContainer}>
									<Text className={classes.profileUrl}>
										{id.identity.ensAddress
											? id.identity.ensAddress
											: id.identity.walletAddress
											? quickTruncate(
													id.identity.walletAddress
											  )
											: 'No wallet address found'}
									</Text>
									{id.identity.id && (
										<>
											<Image
												className={classes.copy}
												src="/copy.png"
												height={20}
												onClick={() => {
													navigator.clipboard.writeText(
														`${
															id.identity
																.ensAddress ??
															id.identity
																.walletAddress
														}`
													)
													showNotification({
														title: 'Wallet info copied',
														autoClose: 2000,
														color: 'green',
														icon: <Check />,

														message: `Wallet info was copied to your clipboard.`
													})
												}}
												width={20}
											/>
										</>
									)}
								</div>
							</div>
						</div>
					</div>

					<div className={classes.profileContainer}>
						<MediaQuery
							largerThan="sm"
							styles={{ display: 'none' }}
						>
							<Burger
								className={classes.profileMobileBurger}
								opened={mobileNavBarVisible}
								onClick={() => setMobileNavBarVisible(o => !o)}
								size="sm"
								mr="xl"
							/>
						</MediaQuery>
						<Navbar
							className={classes.profileNavBar}
							width={{ base: 288 }}
							height={400}
							hidden={!mobileNavBarVisible}
							hiddenBreakpoint={'sm'}
							withBorder={false}
							p="xs"
						>
							<Text className={classes.profileNavHeader}>
								SETTINGS
							</Text>
							<NavLink
								className={classes.profileNavItem}
								active={currentTab === Tab.Profile}
								label={'Manage Identity'}
								onClick={() => {
									setCurrentTab(Tab.Profile)
									setMobileNavBarVisible(false)
								}}
							/>
							<NavLink
								className={classes.profileNavItem}
								active={currentTab === Tab.MyClubs}
								label={'My Clubs'}
								onClick={() => {
									setCurrentTab(Tab.MyClubs)
									setMobileNavBarVisible(false)
								}}
							/>
						</Navbar>
						{!mobileNavBarVisible && (
							<div className={classes.profileContent}>
								{currentTab === Tab.Profile && (
									<ManageIdentityComponent />
								)}
								{currentTab === Tab.MyClubs && (
									<MyClubsComponent />
								)}
							</div>
						)}
					</div>
				</>
			)}
		</>
	)
}
