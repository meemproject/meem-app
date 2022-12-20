import {
	Header,
	Text,
	Menu,
	Image,
	UnstyledButton,
	Group,
	Avatar,
	Divider,
	Space,
	Loader,
	useMantineColorScheme,
	ActionIcon
} from '@mantine/core'
import {
	LoginModal,
	LoginState,
	useAuth,
	useMeemUser
} from '@meemproject/react'
import { QuestionMarkCircle } from 'iconoir-react'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import {
	Logout,
	ChevronDown,
	Dots,
	BrandDiscord,
	BrandTwitter,
	MessageCircle,
	Mail,
	Sun,
	MoonStars
} from 'tabler-icons-react'
import { quickTruncate } from '../../utils/truncated_wallet'
import ClubClubContext from '../ClubHome/ClubClubProvider'
import { colorBlue, useClubsTheme } from '../Styles/ClubsTheme'
import { ClubsFAQModal } from './ClubsFAQModal'

export function HeaderMenu() {
	const [isUserMenuOpened, setUserMenuOpened] = useState(false)
	const [isJoinClubsModalOpen, setIsJoinClubsModalOpen] = useState(false)
	const { classes: clubsTheme, cx } = useClubsTheme()
	const router = useRouter()

	const clubclub = useContext(ClubClubContext)
	const { loginState, disconnectWallet, isConnected, isMeLoading, accounts } =
		useAuth()

	const { user } = useMeemUser()

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

	let displayName = user?.displayName ?? '0x...'

	if (!user?.displayName || user?.displayName.length === 0) {
		displayName =
			user?.DefaultWallet?.ens ??
			quickTruncate(user?.DefaultWallet?.address ?? accounts[0]) ??
			'0x...'
	}
	const { colorScheme, toggleColorScheme } = useMantineColorScheme()
	const isDarkTheme = colorScheme === 'dark'

	useEffect(() => {
		if (
			isConnected &&
			loginState === LoginState.NotLoggedIn &&
			router.pathname !== '/authenticate'
		) {
			router.push({
				pathname: '/authenticate',
				query: {
					return: window.location.pathname
				}
			})
		}
	}, [isConnected, loginState, router])

	return (
		<Header className={clubsTheme.siteHeader} height={56}>
			<div className={clubsTheme.siteHeaderInner}>
				<div className={clubsTheme.siteHeaderLeftItems}>
					<a onClick={navigateHome}>
						<Image src="/meem-logo.svg" />
					</a>
				</div>

				<div className={clubsTheme.siteHeaderRightItems}>
					{(loginState === LoginState.LoggedIn || isConnected) && (
						<Menu
							radius={8}
							offset={4}
							shadow={'lg'}
							onClose={() => setUserMenuOpened(false)}
							onOpen={() => setUserMenuOpened(true)}
						>
							<Menu.Target>
								<UnstyledButton
									className={cx(clubsTheme.siteHeaderUser, {
										[clubsTheme.siteHeaderUserActive]:
											isUserMenuOpened
									})}
								>
									{!user && isMeLoading && (
										<Loader
											style={{ marginTop: 4 }}
											variant="oval"
											color="red"
											size={20}
										/>
									)}
									{(user || !isMeLoading) && (
										<Group spacing={7}>
											<Avatar
												src={user?.profilePicUrl ?? ''}
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
												{displayName}
											</Text>
											<ChevronDown size={12} />
										</Group>
									)}
								</UnstyledButton>
							</Menu.Target>
							<Menu.Dropdown>
								{loginState === LoginState.LoggedIn && (
									<>
										<Menu.Item
											onClick={navigateToMyAccount}
											className={
												clubsTheme.tExtraSmallBold
											}
										>
											My Account
										</Menu.Item>
										{clubclub.isMember && (
											<Menu.Item
												onClick={navigateToMyClubs}
												className={
													clubsTheme.tExtraSmallBold
												}
											>
												My Clubs
											</Menu.Item>
										)}
									</>
								)}
								<Menu.Item
									className={clubsTheme.tExtraSmallBold}
									onClick={async () => {
										await disconnectWallet()
									}}
									color="red"
									icon={<Logout size={14} />}
								>
									{isConnected ? 'Disconnect' : 'Sign Out'}
								</Menu.Item>
							</Menu.Dropdown>
						</Menu>
					)}
					{loginState === LoginState.NotLoggedIn && !isConnected && (
						<Text
							className={clubsTheme.tExtraSmallBold}
							style={{
								marginBottom: 4,
								marginRight: 16,
								color: colorBlue,
								cursor: 'pointer'
							}}
						>
							<a
								onClick={() => {
									// id.login(false)
									// loginWithRedirect()
									setIsJoinClubsModalOpen(true)
								}}
							>
								Join Clubs
							</a>
						</Text>
					)}

					<ActionIcon
						className={clubsTheme.iconDarkThemeToggle}
						radius={16}
						variant="outline"
						color={'black'}
						onClick={() => toggleColorScheme()}
						title="Toggle color scheme"
					>
						{isDarkTheme ? (
							<Sun size={18} />
						) : (
							<MoonStars size={18} />
						)}
					</ActionIcon>

					<Menu offset={15} radius={8} shadow={'lg'}>
						<Menu.Target>
							<UnstyledButton>
								<Dots
									className={clubsTheme.siteHeaderMenuEllipse}
								/>
							</UnstyledButton>
						</Menu.Target>
						<Menu.Dropdown>
							<Menu.Item
								onClick={handlePoweredByMeem}
								className={clubsTheme.tExtraSmallBold}
							>
								Powered by{' '}
								<span style={{ textDecoration: 'underline' }}>
									Meem
								</span>
							</Menu.Item>
							{loginState === LoginState.LoggedIn &&
								!clubclub.isMember && (
									<Menu.Item
										onClick={handleJoinClubClub}
										className={clubsTheme.tExtraSmallBold}
									>
										Join Club Club
									</Menu.Item>
								)}

							<Menu.Item
								onClick={() => {
									setIsClubsFAQModalOpen(true)
								}}
								style={{
									marginBottom: '-2px',
									marginTop: '-2px'
								}}
								className={clubsTheme.tExtraSmallBold}
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
								style={{
									marginBottom: '-2px',
									marginTop: '-2px'
								}}
								className={clubsTheme.tExtraSmallBold}
								icon={<BrandTwitter size={20} />}
							>
								Twitter
							</Menu.Item>
							<Menu.Item
								onClick={handleDiscord}
								style={{
									marginBottom: '-2px',
									marginTop: '-2px'
								}}
								className={clubsTheme.tExtraSmallBold}
								icon={<BrandDiscord size={20} />}
							>
								Discord
							</Menu.Item>
							<Menu.Item
								onClick={handleContactUs}
								style={{
									marginBottom: '-2px',
									marginTop: '-2px'
								}}
								className={clubsTheme.tExtraSmallBold}
								icon={<Mail size={20} />}
							>
								Contact Us
							</Menu.Item>
							<Menu.Item
								onClick={handleShareFeedback}
								className={clubsTheme.tExtraSmallBold}
								style={{
									color: colorBlue,
									marginBottom: '-2px',
									marginTop: '-2px'
								}}
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
			<LoginModal
				isOpen={isJoinClubsModalOpen}
				onRequestClose={() => setIsJoinClubsModalOpen(false)}
			/>
		</Header>
	)
}
