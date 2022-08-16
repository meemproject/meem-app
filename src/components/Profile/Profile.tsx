import {
	createStyles,
	Container,
	Text,
	Image,
	Space,
	Center,
	Loader
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useWallet } from '@meemproject/react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { Check } from 'tabler-icons-react'
import IdentityContext from './IdentityProvider'
import { ManageIdentityComponent } from './Tabs/Identity/ManageIdentity'
import { MyClubsComponent } from './Tabs/MyClubs'

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
	headerProfileNameContainer: {
		marginLeft: 32,
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

	const switchToProfile = () => {
		setCurrentTab(Tab.Profile)
	}

	const switchToMyClubs = () => {
		setCurrentTab(Tab.MyClubs)
	}

	useEffect(() => {
		if (
			// Note: walletContext thinks logged in = LoginState.unknown, using cookies here
			Cookies.get('meemJwtToken') === undefined ||
			Cookies.get('walletAddress') === undefined
		) {
			router.push({
				pathname: '/authenticate',
				query: {
					return: `/profile`
				}
			})
		}
	}, [router])

	useEffect(() => {
		if (router.query.tab === 'myClubs') {
			switchToMyClubs()
		} else if (router.query.tab === 'identity') {
			switchToProfile()
		}
	}, [router.query.tab])

	return (
		<>
			{!wallet.isConnected && (
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
						<Loader variant="bars" color="red" />
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
							<Image
								radius={16}
								fit={'cover'}
								className={classes.profileLogoImage}
								src={id.identity.profilePic}
							/>
							{/* <Text className={classes.headerProfileName}>{profileName}</Text> */}
							<div className={classes.headerProfileNameContainer}>
								<Text className={classes.headerProfileName}>
									{id.identity.displayName}
								</Text>
								<div className={classes.profileUrlContainer}>
									<Text className={classes.profileUrl}>
										{id.identity.ensAddress ??
											id.identity.walletAddress}
									</Text>
									<Image
										className={classes.copy}
										src="/copy.png"
										height={20}
										onClick={() => {
											navigator.clipboard.writeText(
												`${id.identity.walletAddress}`
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
								</div>
							</div>
						</div>
					</div>
					<Container>
						<div className={classes.tabs}>
							<a onClick={switchToProfile}>
								<Text
									className={
										currentTab == Tab.Profile
											? classes.activeTab
											: classes.inactiveTab
									}
								>
									Manage Identity
								</Text>
							</a>
							<a onClick={switchToMyClubs}>
								<Text
									className={
										currentTab == Tab.MyClubs
											? classes.activeTab
											: classes.inactiveTab
									}
								>
									My Clubs
								</Text>
							</a>
						</div>

						<div
							className={
								currentTab === Tab.Profile
									? classes.visibleTab
									: classes.invisibleTab
							}
						>
							<ManageIdentityComponent />
						</div>

						<div
							className={
								currentTab === Tab.MyClubs
									? classes.visibleTab
									: classes.invisibleTab
							}
						>
							<MyClubsComponent />
						</div>
					</Container>
				</>
			)}
		</>
	)
}
