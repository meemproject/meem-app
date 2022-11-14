import { useAuth0 } from '@auth0/auth0-react'
import {
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
import ClubClubContext from '../Detail/ClubClubProvider'
import IdentityContext from '../Profile/IdentityProvider'
import { JoinClubsModal } from '../Profile/JoinClubsModal'
import { colorPink, useClubsTheme } from '../Styles/ClubsTheme'
import { ClubsFAQModal } from './ClubsFAQModal'

export function HeaderMenu() {
	const [isUserMenuOpened, setUserMenuOpened] = useState(false)
	const [isJoinClubsModalOpen, setIsJoinClubsModalOpen] = useState(false)
	const { classes: clubsTheme, cx } = useClubsTheme()
	const router = useRouter()
	const { loginWithRedirect, isAuthenticated } = useAuth0()

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

	console.log({ isAuthenticated })

	return (
		<Header className={clubsTheme.siteHeader} height={56}>
			<div className={clubsTheme.siteHeaderInner}>
				<div className={clubsTheme.siteHeaderLeftItems}>
					<a onClick={navigateHome}>
						<Text className={clubsTheme.siteHeaderMainLogo}>♣</Text>
					</a>
				</div>

				<div className={clubsTheme.siteHeaderRightItems}>
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
									className={cx(clubsTheme.siteHeaderUser, {
										[clubsTheme.siteHeaderUserActive]:
											isUserMenuOpened
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
									className={clubsTheme.tExtraSmallBold}
								>
									My Account
								</Menu.Item>
								{clubclub.isMember && (
									<Menu.Item
										onClick={navigateToMyClubs}
										className={clubsTheme.tExtraSmallBold}
									>
										My Clubs
									</Menu.Item>
								)}
								<Menu.Item
									className={clubsTheme.tExtraSmallBold}
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
						<Text
							className={clubsTheme.tExtraSmallBold}
							style={{
								marginBottom: 4,
								marginRight: 16,
								color: colorPink,
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
							{wallet.isConnected && !clubclub.isMember && (
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
									color: colorPink,
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
			<JoinClubsModal
				isOpened={isJoinClubsModalOpen}
				onModalClosed={() => setIsJoinClubsModalOpen(false)}
			/>
		</Header>
	)
}
