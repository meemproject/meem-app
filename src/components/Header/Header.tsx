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
	ActionIcon,
	Button
} from '@mantine/core'
import {
	LoginModal,
	LoginState,
	useAuth,
	useMeemUser
} from '@meemproject/react'
import { normalizeImageUrl } from '@meemproject/sdk'
import { QuestionMarkCircle } from 'iconoir-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import {
	Logout,
	ChevronDown,
	Dots,
	BrandDiscord,
	MessageCircle,
	Mail,
	Sun,
	MoonStars
} from 'tabler-icons-react'
import { quickTruncate } from '../../utils/truncated_wallet'
import { colorDarkBlue, useMeemTheme } from '../Styles/MeemTheme'
import { MeemFAQModal } from './MeemFAQModal'

export function HeaderMenu() {
	const [isUserMenuOpened, setUserMenuOpened] = useState(false)
	const [isJoinAgreementsModalOpen, setIsJoinAgreementsModalOpen] =
		useState(false)
	const { classes: meemTheme, cx } = useMeemTheme()
	const router = useRouter()

	const {
		loginState,
		disconnectWallet,
		isConnected,
		isMeLoading,
		accounts,
		walletType,
		magic
	} = useAuth()

	const { user } = useMeemUser()

	const handleDiscord = () => {
		window.open('https://discord.gg/jgxuK6662v')
	}

	const handleContactUs = () => {
		window.open('mailto:hello@weareprosocial.com')
	}

	const handleShareFeedback = () => {
		window.open('https://airtable.com/shrM296vRoDWmK8Rm')
	}

	const [isAgreementsFAQModalOpen, setIsAgreementsFAQModalOpen] =
		useState(false)

	let displayName = user?.displayName ?? '0x...'

	if (!user?.displayName || user?.displayName.length === 0) {
		displayName =
			user?.DefaultWallet?.ens ??
			quickTruncate(
				user?.DefaultWallet?.address ?? (accounts && accounts[0])
			) ??
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
					return:
						window.location.pathname.length > 5
							? window.location.pathname
							: '/'
				}
			})
		}
	}, [isConnected, loginState, router])

	return (
		<Header className={meemTheme.siteHeader} height={56}>
			<div className={meemTheme.siteHeaderInner}>
				<div className={meemTheme.siteHeaderLeftItems}>
					<Space w={8} />
					<Link href={`/`}>
						<Image
							className={meemTheme.clickable}
							src={
								isDarkTheme
									? '/meem-logo-white.svg'
									: '/meem-logo.svg'
							}
							fit={'contain'}
							height={20}
							width={80}
						/>
					</Link>
					<div className={meemTheme.visibleDesktopOnly}>
						<div style={{ display: 'flex' }}>
							<Space w={24} />
							<a
								style={{
									textDecoration: 'none',
									color: isDarkTheme ? 'white' : 'black'
								}}
								href="https://docs.meem.wtf/meem-protocol/"
								target="_blank"
								rel="noreferrer"
							>
								<Text className={meemTheme.tExtraSmallBold}>
									Dev Docs
								</Text>
							</a>
							<Space w={24} />
							<a
								style={{
									textDecoration: 'none',
									color: isDarkTheme ? 'white' : 'black'
								}}
								href="https://form.typeform.com/to/mICIQBrE"
								target="_blank"
								rel="noreferrer"
							>
								<Text className={meemTheme.tExtraSmallBold}>
									Partner with Us
								</Text>
							</a>
						</div>
					</div>
				</div>

				<div className={meemTheme.siteHeaderRightItems}>
					{walletType === 'magic' && isConnected && (
						<Button
							className={meemTheme.buttonAsh}
							onClick={() => {
								magic?.connect.showWallet()
							}}
						>
							Show Wallet
						</Button>
					)}
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
									className={cx(meemTheme.siteHeaderUser, {
										[meemTheme.siteHeaderUserActive]:
											isUserMenuOpened
									})}
								>
									{!user && isMeLoading && (
										<Loader
											style={{ marginTop: 4 }}
											variant="oval"
											color="blue"
											size={20}
										/>
									)}
									{(user || !isMeLoading) && (
										<Group spacing={7}>
											<Avatar
												src={
													user?.profilePicUrl
														? normalizeImageUrl(
																user.profilePicUrl
														  )
														: ''
												}
												alt={'Profile photo'}
												radius="xl"
												size={24}
											/>
											<Text
												className={
													meemTheme.tExtraSmallBold
												}
												style={{ color: colorDarkBlue }}
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
											className={
												meemTheme.tExtraSmallBold
											}
										>
											<Link
												href={`/profile?tab=identity`}
											>
												<Text>My Account</Text>
											</Link>
										</Menu.Item>
										<Menu.Item
											className={
												meemTheme.tExtraSmallBold
											}
										>
											<Link
												href={`/profile?tab=myCommunities`}
											>
												<Text>My Communities</Text>
											</Link>
										</Menu.Item>
									</>
								)}
								<Menu.Item
									className={meemTheme.tExtraSmallBold}
									onClick={async () => {
										await disconnectWallet()
									}}
									style={{ color: colorDarkBlue }}
									icon={<Logout size={14} />}
								>
									<Text>
										{isConnected
											? 'Disconnect'
											: 'Sign Out'}
									</Text>
								</Menu.Item>
							</Menu.Dropdown>
						</Menu>
					)}
					{loginState === LoginState.NotLoggedIn && !isConnected && (
						<Text
							className={meemTheme.tExtraSmallBold}
							style={{
								marginBottom: 4,
								marginRight: 24,
								color: colorDarkBlue,
								cursor: 'pointer'
							}}
						>
							<a
								onClick={() => {
									router.push({
										pathname: '/authenticate',
										query: {
											return: `/${window.location.pathname}`
										}
									})
								}}
							>
								Join Meem
							</a>
						</Text>
					)}

					<ActionIcon
						className={meemTheme.iconDarkThemeToggle}
						radius={16}
						variant="light"
						color={colorDarkBlue}
						onClick={() => toggleColorScheme()}
						title="Toggle color scheme"
					>
						{isDarkTheme ? (
							<Sun size={18} color={colorDarkBlue} />
						) : (
							<MoonStars size={18} color={colorDarkBlue} />
						)}
					</ActionIcon>

					<Menu offset={10} radius={8} shadow={'lg'}>
						<Menu.Target>
							<UnstyledButton>
								<Dots
									className={meemTheme.siteHeaderMenuEllipse}
								/>
							</UnstyledButton>
						</Menu.Target>
						<Menu.Dropdown>
							<Menu.Item
								onClick={() => {
									setIsAgreementsFAQModalOpen(true)
								}}
								style={{
									marginBottom: '-2px',
									marginTop: '-2px'
								}}
								className={meemTheme.tExtraSmallBold}
								icon={
									<QuestionMarkCircle
										height={20}
										width={20}
									/>
								}
							>
								{`What can I do here?`}
							</Menu.Item>
							<Space h={4} />
							<Divider />
							<Space h={4} />

							<Menu.Item
								onClick={handleDiscord}
								style={{
									marginBottom: '-2px',
									marginTop: '-2px'
								}}
								className={meemTheme.tExtraSmallBold}
								icon={<BrandDiscord size={20} />}
							>
								Our community
							</Menu.Item>
							<Menu.Item
								onClick={handleContactUs}
								style={{
									marginBottom: '-2px',
									marginTop: '-2px'
								}}
								className={meemTheme.tExtraSmallBold}
								icon={<Mail size={20} />}
							>
								Contact Us
							</Menu.Item>
							<Menu.Item
								onClick={handleShareFeedback}
								className={meemTheme.tExtraSmallBold}
								style={{
									color: colorDarkBlue,
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
			<MeemFAQModal
				onModalClosed={() => {
					setIsAgreementsFAQModalOpen(false)
				}}
				isOpened={isAgreementsFAQModalOpen}
			/>
			<LoginModal
				isOpen={isJoinAgreementsModalOpen}
				onRequestClose={() => setIsJoinAgreementsModalOpen(false)}
			/>
		</Header>
	)
}
