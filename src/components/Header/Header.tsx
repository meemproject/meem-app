/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	createStyles,
	Header,
	Container,
	Text,
	Menu,
	UnstyledButton,
	Group,
	Avatar,
	Divider
} from '@mantine/core'
import { useWallet } from '@meemproject/react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import {
	Logout,
	ChevronDown,
	Dots,
	BrandDiscord,
	BrandTwitter,
	MessageCircle,
	Mail
} from 'tabler-icons-react'

const useStyles = createStyles(theme => ({
	headerLeftItems: {
		marginLeft: 4,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},

	headerRightItems: {
		marginRight: 0,
		marginBottom: 4,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},

	mainLogo: {
		fontSize: 32,
		marginRight: 8,
		paddingBottom: 4,
		cursor: 'pointer'
	},

	inner: {
		height: 56,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center'
	},

	links: {
		[theme.fn.smallerThan('sm')]: {
			display: 'none'
		}
	},

	burger: {
		[theme.fn.largerThan('sm')]: {
			display: 'none'
		}
	},

	link: {
		display: 'block',
		lineHeight: 1,
		padding: '8px 12px',
		borderRadius: theme.radius.sm,
		textDecoration: 'none',
		color:
			theme.colorScheme === 'dark'
				? theme.colors.dark[0]
				: theme.colors.gray[7],
		fontSize: theme.fontSizes.sm,
		fontWeight: 500,

		'&:hover': {
			backgroundColor:
				theme.colorScheme === 'dark'
					? theme.colors.dark[6]
					: theme.colors.gray[0]
		}
	},

	linkLabel: {
		marginRight: 5
	},

	ellipse: {
		[theme.fn.smallerThan('xs')]: {
			marginLeft: 0
		},
		marginLeft: 24
	},

	connectWallet: {
		marginBottom: 4,
		marginRight: 16,
		fontWeight: 'bold',
		color: 'rgba(255, 102, 81, 1)',
		cursor: 'pointer'
	},

	userMenu: {
		marginBottom: 2
	},

	user: {
		color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
		padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
		borderRadius: theme.radius.sm,
		transition: 'background-color 100ms ease',

		'&:hover': {
			backgroundColor:
				theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white
		}
	},

	userActive: {
		backgroundColor:
			theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white
	},

	menuItem: {
		fontWeight: '600'
	},
	menuItemWithIcon: {
		fontWeight: '600',
		marginBottom: '-2px',
		marginTop: '-2px'
	},

	redMenuItem: {
		fontWeight: '600',
		color: 'rgba(255, 102, 81, 1)',
		marginBottom: '-2px',
		marginTop: '-2px'
	}
}))

export function HeaderMenu() {
	// eslint-disable-next-line no-unused-vars
	const [isMoreMenuOpened, setMoreMenuOpened] = useState(false)
	const [isUserMenuOpened, setUserMenuOpened] = useState(false)
	const { classes, cx } = useStyles()
	const router = useRouter()

	const wallet = useWallet()

	function truncatedWalletAddress(): string {
		if (!wallet.isConnected || wallet.accounts.length === 0) {
			return ''
		}

		const walletAddress = wallet.accounts[0]
		const walletAddressLength = wallet.accounts[0].length
		const truncatedWallet =
			walletAddress !== undefined
				? `${walletAddress.substring(0, 5)}...${walletAddress.substring(
						walletAddressLength - 5,
						walletAddressLength
				  )}`
				: ''

		return truncatedWallet.toLowerCase()
	}

	const navigateHome = () => {
		router.push({ pathname: '/' })
	}

	const navigateToMyClubs = () => {
		router.push({ pathname: '/myclubs' })
	}

	const handleJoinClubClub = () => {
		window.open('/club/clubclub')
	}

	const handlePoweredByMeem = () => {
		window.open('https://meem.wtf')
	}

	const handleTwitter = () => {
		window.open('https://twitter.com')
	}

	const handleDiscord = () => {
		window.open('https://discord.gg/jgxuK6662v')
	}

	const handleContactUs = () => {
		window.open('https://meem.wtf')
	}

	const handleShareFeedback = () => {
		window.open('https://meem.wtf')
	}

	return (
		<Header height={56}>
			<div className={classes.inner}>
				<Container className={classes.headerLeftItems}>
					<a onClick={navigateHome}>
						<Text className={classes.mainLogo}>♣</Text>
					</a>
				</Container>

				<Container className={classes.headerRightItems}>
					{wallet.isConnected && (
						<Menu
							size={150}
							placement="end"
							transition="pop-top-right"
							className={classes.userMenu}
							onClose={() => setUserMenuOpened(false)}
							onOpen={() => setUserMenuOpened(true)}
							control={
								<UnstyledButton
									className={cx(classes.user, {
										[classes.userActive]: isUserMenuOpened
									})}
								>
									<Group spacing={7}>
										<Avatar src={''} alt={'user.name'} radius="xl" size={20} />
										<Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
											{truncatedWalletAddress()}
										</Text>
										<ChevronDown size={12} />
									</Group>
								</UnstyledButton>
							}
						>
							<Menu.Item
								className={classes.menuItem}
								onClick={wallet.disconnectWallet}
								color="red"
								icon={<Logout size={14} />}
							>
								Disconnect
							</Menu.Item>
						</Menu>
					)}
					{!wallet.isConnected && (
						<Text className={classes.connectWallet}>
							<a onClick={wallet.connectWallet}>Connect wallet</a>
						</Text>
					)}

					<Menu
						size={260}
						placement="end"
						transition="pop-top-right"
						onClose={() => setMoreMenuOpened(false)}
						onOpen={() => setMoreMenuOpened(true)}
						control={
							<UnstyledButton>
								<Dots className={classes.ellipse} />
							</UnstyledButton>
						}
					>
						<Menu.Item
							onClick={handlePoweredByMeem}
							className={classes.menuItem}
						>
							Powered by{' '}
							<span style={{ textDecoration: 'underline' }}>Meem</span>
						</Menu.Item>
						<Menu.Item
							onClick={handleJoinClubClub}
							className={classes.menuItem}
						>
							Join Club Club
						</Menu.Item>
						<Menu.Item onClick={navigateToMyClubs} className={classes.menuItem}>
							My Clubs
						</Menu.Item>

						<Divider />

						<Menu.Item
							onClick={handleTwitter}
							className={classes.menuItemWithIcon}
							icon={<BrandTwitter size={20} />}
						>
							Twitter
						</Menu.Item>
						<Menu.Item
							onClick={handleDiscord}
							className={classes.menuItemWithIcon}
							icon={<BrandDiscord size={20} />}
						>
							Discord
						</Menu.Item>
						<Menu.Item
							onClick={handleContactUs}
							className={classes.menuItemWithIcon}
							icon={<Mail size={20} />}
						>
							Contact Us
						</Menu.Item>
						<Menu.Item
							onClick={handleShareFeedback}
							className={classes.redMenuItem}
							icon={<MessageCircle size={20} />}
						>
							Share Feedback
						</Menu.Item>
					</Menu>
				</Container>
			</div>
		</Header>
	)
}
