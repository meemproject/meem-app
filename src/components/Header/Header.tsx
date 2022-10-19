import {
	createStyles,
	Header,
	Text,
	Menu,
	UnstyledButton,
	Group,
	Avatar,
	Divider,
	Space,
	Loader
} from '@mantine/core'
import { useWallet } from '@meemproject/react'
import { QuestionMarkCircle } from 'iconoir-react'
import { useRouter } from 'next/router'
import React, { useContext, useState } from 'react'
import {
	Logout,
	ChevronDown,
	Dots,
	BrandDiscord,
	BrandTwitter,
	MessageCircle,
	Mail
} from 'tabler-icons-react'
import { quickTruncate } from '../../utils/truncated_wallet'
import { JoinClubsModal } from '../Authenticate/JoinClubsModal'
import ClubClubContext from '../Detail/ClubClubProvider'
import IdentityContext from '../Profile/IdentityProvider'
import { ClubsFAQModal } from './ClubsFAQModal'

const useStyles = createStyles(theme => ({
	header: {
		marginTop: 0,
		paddingTop: 8,
		paddingBottom: '-8px'
	},
	headerLeftItems: {
		marginLeft: 4,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},

	headerRightItems: {
		marginBottom: 4,
		marginRight: 0,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			marginRight: 20
		}
	},

	mainLogo: {
		fontSize: 32,
		marginLeft: 16,
		marginRight: 8,
		paddingBottom: 6,
		cursor: 'pointer'
	},

	inner: {
		height: 56,
		marginTop: '-4px',
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
		[theme.fn.smallerThan('md')]: {
			marginLeft: 0,
			marginRight: 0
		},
		marginRight: 24,
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
		marginBottom: 6
	},

	user: {
		marginBottom: '5px',
		color:
			theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
		padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
		borderRadius: theme.radius.sm,
		transition: 'background-color 100ms ease'
	},

	userActive: {
		backgroundColor:
			theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white
	},

	menuItem: {
		fontWeight: 600
	},
	menuItemWithIcon: {
		fontWeight: 600,
		marginBottom: '-2px',
		marginTop: '-2px'
	},

	redMenuItem: {
		fontWeight: 600,
		color: 'rgba(255, 102, 81, 1)',
		marginBottom: '-2px',
		marginTop: '-2px'
	}
}))

export function HeaderMenu() {
	const [isUserMenuOpened, setUserMenuOpened] = useState(false)
	const { classes, cx } = useStyles()
	const router = useRouter()

	const id = useContext(IdentityContext)

	const clubclub = useContext(ClubClubContext)
	const wallet = useWallet()

	const navigateHome = () => {
		router.push({ pathname: '/' })
	}

	const navigateToMyAccount = () => {
		router.push({ pathname: '/profile', query: { tab: 'identity' } })
	}

	const navigateToMyClubs = () => {
		router.push({ pathname: '/profile', query: { tab: 'myClubs' } })
	}

	const handleJoinClubClub = () => {
		window.open('/club-club')
	}

	const handlePoweredByMeem = () => {
		window.open('https://meem.wtf')
	}

	const handleTwitter = () => {
		window.open('https://twitter.com/0xmeem')
	}

	const handleDiscord = () => {
		window.open('https://discord.gg/jgxuK6662v')
	}

	const handleContactUs = () => {
		window.open('mailto:hello@weareprosocial.com')
	}

	const handleShareFeedback = () => {
		window.open('https://airtable.com/shrM296vRoDWmK8Rm')
	}

	const [isClubsFAQModalOpen, setIsClubsFAQModalOpen] = useState(false)

	const [isJoinClubsModalOpen, setIsJoinClubsModalOpen] = useState(false)

	return (
		<Header className={classes.header} height={56}>
			<div className={classes.inner}>
				<div className={classes.headerLeftItems}>
					<a onClick={navigateHome}>
						<Text className={classes.mainLogo}>♣</Text>
					</a>
				</div>

				<div className={classes.headerRightItems}>
					{wallet.isConnected && (
						<Menu
							radius={8}
							offset={4}
							shadow={'lg'}
							onClose={() => setUserMenuOpened(false)}
							onOpen={() => setUserMenuOpened(true)}
						>
							<Menu.Target>
								<UnstyledButton
									className={cx(classes.user, {
										[classes.userActive]: isUserMenuOpened
									})}
								>
									{id.isLoadingIdentity && (
										<Loader
											style={{ marginTop: 4 }}
											variant="oval"
											color="red"
											size={20}
										/>
									)}
									{!id.isLoadingIdentity && (
										<Group spacing={7}>
											<Avatar
												src={
													id.identity.profilePic ?? ''
												}
												alt={'Profile photo'}
												radius="xl"
												size={24}
											/>
											<Text
												weight={500}
												size="sm"
												sx={{ lineHeight: 1 }}
												mr={3}
											>
												{id.identity.displayName &&
												id.identity.displayName
													?.length > 0
													? id.identity.displayName
													: id.identity.ensAddress &&
													  id.identity.ensAddress
															?.length > 0
													? id.identity.ensAddress
													: quickTruncate(
															id.identity
																.walletAddress ??
																''
													  )}
											</Text>
											<ChevronDown size={12} />
										</Group>
									)}
								</UnstyledButton>
							</Menu.Target>
							<Menu.Dropdown>
								<Menu.Item
									onClick={navigateToMyAccount}
									className={classes.menuItem}
								>
									My Account
								</Menu.Item>
								{clubclub.isMember && (
									<Menu.Item
										onClick={navigateToMyClubs}
										className={classes.menuItem}
									>
										My Clubs
									</Menu.Item>
								)}
								<Menu.Item
									className={classes.menuItem}
									onClick={async () => {
										await wallet.disconnectWallet()
									}}
									color="red"
									icon={<Logout size={14} />}
								>
									{wallet.isConnected
										? 'Disconnect'
										: 'Sign Out'}
								</Menu.Item>
							</Menu.Dropdown>
						</Menu>
					)}
					{!wallet.isConnected && (
						<Text className={classes.connectWallet}>
							<a
								onClick={() => {
									setIsJoinClubsModalOpen(true)
								}}
							>
								Join Clubs
							</a>
						</Text>
					)}

					<Menu offset={15} radius={8} shadow={'lg'}>
						<Menu.Target>
							<UnstyledButton>
								<Dots className={classes.ellipse} />
							</UnstyledButton>
						</Menu.Target>
						<Menu.Dropdown>
							<Menu.Item
								onClick={handlePoweredByMeem}
								className={classes.menuItem}
							>
								Powered by{' '}
								<span style={{ textDecoration: 'underline' }}>
									Meem
								</span>
							</Menu.Item>
							{wallet.isConnected && !clubclub.isMember && (
								<Menu.Item
									onClick={handleJoinClubClub}
									className={classes.menuItem}
								>
									Join Club Club
								</Menu.Item>
							)}

							<Menu.Item
								onClick={() => {
									setIsClubsFAQModalOpen(true)
								}}
								className={classes.menuItemWithIcon}
								icon={
									<QuestionMarkCircle
										height={20}
										width={20}
									/>
								}
							>
								{`What's a club?`}
							</Menu.Item>
							<Space h={4} />
							<Divider />
							<Space h={4} />

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
						</Menu.Dropdown>
					</Menu>
				</div>
			</div>
			<ClubsFAQModal
				onModalClosed={() => {
					setIsClubsFAQModalOpen(false)
				}}
				isOpened={isClubsFAQModalOpen}
			/>
			<JoinClubsModal
				onModalClosed={() => {
					setIsJoinClubsModalOpen(false)
				}}
				isOpened={isJoinClubsModalOpen}
			/>
		</Header>
	)
}
