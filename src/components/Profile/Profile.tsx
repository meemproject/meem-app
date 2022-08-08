import {
	createStyles,
	Container,
	Text,
	Image,
	Space,
	Center
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useWallet } from '@meemproject/react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Check } from 'tabler-icons-react'
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
	}
}))

enum Tab {
	Identity,
	MyClubs
}

interface IProps {
	slug: string
}

export const ProfileComponent: React.FC<IProps> = ({ slug }) => {
	// General properties / tab management
	const { classes } = useStyles()
	const router = useRouter()
	const wallet = useWallet()

	const [currentTab, setCurrentTab] = useState<Tab>(Tab.Identity)

	const switchToIdentity = () => {
		setCurrentTab(Tab.Identity)
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
					return: `/${slug}/admin`
				}
			})
		}
	}, [router, slug])

	// TODO: fetch profile info
	// const {
	// 	loading,
	// 	error,
	// 	data: clubData
	// } = useQuery<GetClubQuery>(GET_CLUB, {
	// 	variables: { slug }
	// })
	// const [isLoadingClub, setIsLoadingClub] = useState(true)
	// const [club, setClub] = useState<Club>()

	return (
		<>
			<div className={classes.header}>
				<div className={classes.headerTitle}>
					<Image
						className={classes.clubLogoImage}
						src={'/exampleclub.png'}
					/>
					{/* <Text className={classes.headerClubName}>{clubName}</Text> */}
					<div className={classes.headerClubNameContainer}>
						<Text className={classes.headerClubName}>
							{'James'}
						</Text>
						<div className={classes.clubUrlContainer}>
							<Text className={classes.clubUrl}>
								{wallet.accounts[0]}
							</Text>
							<Image
								className={classes.copy}
								src="/copy.png"
								height={20}
								onClick={() => {
									navigator.clipboard.writeText(
										`${wallet.accounts[0]}`
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

			{!wallet.isConnected && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>Connect your wallet to access your profile.</Text>
					</Center>
				</Container>
			)}
			{wallet.isConnected && (
				<Container>
					<div className={classes.tabs}>
						<a onClick={switchToIdentity}>
							<Text
								className={
									currentTab == Tab.Identity
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
							currentTab === Tab.Identity
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
			)}
		</>
	)
}
