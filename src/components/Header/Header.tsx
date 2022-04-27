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
import React, { useState } from 'react'
import {
	Logout,
	Heart,
	Star,
	Message,
	Settings,
	PlayerPause,
	Trash,
	SwitchHorizontal,
	ChevronDown,
	Dots
} from 'tabler-icons-react'

const useStyles = createStyles(theme => ({
	headerLeftItems: {
		marginLeft: 0,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},

	headerRightItems: {
		marginRight: 0,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},

	mainLogo: {
		fontSize: 32,
		marginRight: 8
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
	}
}))

interface HeaderProps {
	links?: {
		link: string
		label: string
		links: { link: string; label: string }[]
	}[]
}

export function HeaderMenu({ links }: HeaderProps) {
	// eslint-disable-next-line no-unused-vars
	const [isMoreMenuOpened, setMoreMenuOpened] = useState(false)
	const [isUserMenuOpened, setUserMenuOpened] = useState(false)

	const { classes, theme, cx } = useStyles()
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

	return (
		<Header height={56} mb={120}>
			<Container>
				<div className={classes.inner}>
					<Container className={classes.headerLeftItems}>
						<Text className={classes.mainLogo}>♣</Text>
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
											<Avatar
												src={''}
												alt={'user.name'}
												radius="xl"
												size={20}
											/>
											<Text
												weight={500}
												size="sm"
												sx={{ lineHeight: 1 }}
												mr={3}
											>
												{truncatedWalletAddress()}
											</Text>
											<ChevronDown size={12} />
										</Group>
									</UnstyledButton>
								}
							>
								<Menu.Item
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
							<Menu.Item icon={<Heart size={14} color={theme.colors.red[6]} />}>
								Liked posts
							</Menu.Item>
							<Menu.Item
								icon={<Star size={14} color={theme.colors.yellow[6]} />}
							>
								Saved posts
							</Menu.Item>
							<Menu.Item
								icon={<Message size={14} color={theme.colors.blue[6]} />}
							>
								Your comments
							</Menu.Item>

							<Menu.Label>Settings</Menu.Label>
							<Menu.Item icon={<Settings size={14} />}>
								Account settings
							</Menu.Item>
							<Menu.Item icon={<SwitchHorizontal size={14} />}>
								Change account
							</Menu.Item>
							<Menu.Item icon={<Logout size={14} />}>Logout</Menu.Item>

							<Divider />

							<Menu.Label>Danger zone</Menu.Label>
							<Menu.Item icon={<PlayerPause size={14} />}>
								Pause subscription
							</Menu.Item>
							<Menu.Item color="red" icon={<Trash size={14} />}>
								Delete account
							</Menu.Item>
						</Menu>
					</Container>
				</div>
			</Container>
		</Header>
	)
}
