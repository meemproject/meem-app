import { useAuth0 } from '@auth0/auth0-react'
import log from '@kengoldfarb/log'
import {
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
import {
	LoginState,
	useAuth,
	useMeemSDK,
	useMeemUser
} from '@meemproject/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Check, X } from 'tabler-icons-react'
import { quickTruncate } from '../../utils/truncated_wallet'
import { useClubsTheme } from '../Styles/ClubsTheme'
import { DiscordRoleRedirectModal } from './Tabs/Identity/DiscordRoleRedirectModal'
import { ManageIdentityComponent } from './Tabs/Identity/ManageIdentity'
import { MyClubsComponent } from './Tabs/MyClubs'

enum Tab {
	Profile,
	MyClubs
}

export const ProfileComponent: React.FC = () => {
	// General properties / tab management
	const { classes: clubsTheme } = useClubsTheme()
	const router = useRouter()
	const wallet = useAuth()
	const { isMeLoading, isGetMeError } = useAuth()
	const { user } = useMeemUser()
	const { sdk } = useMeemSDK()

	const { isAuthenticated, getAccessTokenSilently } = useAuth0()

	const [currentTab, setCurrentTab] = useState<Tab>(Tab.Profile)
	const [isMobileNavBarVisible, setIsMobileNavBarVisible] = useState(false)
	const [hasConnectedExtension, setHasConnectedExtension] = useState(false)

	const [
		isDiscordRoleRedirectModalOpened,
		setIsDiscordRoleRedirectModalOpened
	] = useState(false)

	useEffect(() => {
		if (wallet.loginState === LoginState.NotLoggedIn) {
			router.push({
				pathname: '/authenticate',
				query: {
					return: `/profile`
				}
			})
		}
	}, [router, wallet])

	useEffect(() => {
		if (router.query.tab === 'myClubs') {
			setCurrentTab(Tab.MyClubs)
		} else if (router.query.tab === 'identity') {
			setCurrentTab(Tab.Profile)
		}
	}, [router.query.tab])

	useEffect(() => {
		const doLogin = async () => {
			try {
				const accessToken = await getAccessTokenSilently()
				sdk.id.login({
					accessToken,
					shouldConnectUser: true
				})
			} catch (e) {
				log.crit(e)

				showNotification({
					title: 'Error connecting account',
					autoClose: 2000,
					color: 'red',
					icon: <X />,

					message: `Please try again.`
				})
			}
		}

		if (isAuthenticated && !hasConnectedExtension) {
			setHasConnectedExtension(true)
			doLogin()
		}
	}, [
		isAuthenticated,
		hasConnectedExtension,
		setHasConnectedExtension,
		getAccessTokenSilently,
		sdk.id
	])

	const isLoggedIn = wallet.loginState === LoginState.LoggedIn

	return (
		<>
			{!isLoggedIn && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>Connect your wallet to access your profile.</Text>
					</Center>
				</Container>
			)}
			{isMeLoading && (
				<Container>
					<Space h={120} />
					<Center>
						<Loader variant="oval" color="red" />
					</Center>
				</Container>
			)}
			{isGetMeError && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>
							Unable to load your profile. Please try again later.
						</Text>
					</Center>
				</Container>
			)}
			{isLoggedIn && user && (
				<>
					<div className={clubsTheme.pageHeader}>
						<div className={clubsTheme.spacedRowCentered}>
							{user.profilePicUrl && (
								<>
									<Image
										radius={32}
										height={64}
										width={64}
										fit={'cover'}
										className={clubsTheme.imageClubLogo}
										src={user.profilePicUrl}
									/>
								</>
							)}

							{/* <Text className={classes.headerProfileName}>{profileName}</Text> */}
							<div
								className={clubsTheme.pageHeaderTitleContainer}
							>
								<Text className={clubsTheme.tLargeBold}>
									{user.displayName ?? 'My Profile'}
								</Text>
								<Space h={8} />
								<div className={clubsTheme.row}>
									<Text
										className={clubsTheme.tExtraSmallFaded}
									>
										{user.DefaultWallet?.ens
											? user.DefaultWallet?.ens
											: user.DefaultWallet?.address
											? quickTruncate(
													user.DefaultWallet?.address
											  )
											: 'No wallet address found'}
									</Text>
									{user.id && (
										<>
											<Image
												className={clubsTheme.copyIcon}
												src="/copy.png"
												height={20}
												onClick={() => {
													navigator.clipboard.writeText(
														`${
															user.DefaultWallet
																?.ens ??
															user.DefaultWallet
																?.address
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
					<div className={clubsTheme.pagePanelLayoutContainer}>
						<MediaQuery
							largerThan="sm"
							styles={{ display: 'none' }}
						>
							<Burger
								style={{ marginLeft: 24 }}
								opened={isMobileNavBarVisible}
								onClick={() =>
									setIsMobileNavBarVisible(o => !o)
								}
								size="sm"
								mr="xl"
							/>
						</MediaQuery>
						<Navbar
							className={clubsTheme.pagePanelLayoutNavBar}
							width={{ base: 288 }}
							height={400}
							hidden={!isMobileNavBarVisible}
							hiddenBreakpoint={'sm'}
							withBorder={false}
							p="xs"
						>
							<Text
								className={clubsTheme.tExtraSmallLabel}
								style={{ marginLeft: 20, marginBottom: 8 }}
							>
								SETTINGS
							</Text>
							<NavLink
								className={clubsTheme.pagePanelLayoutNavItem}
								active={currentTab === Tab.Profile}
								label={'Manage Identity'}
								onClick={() => {
									setCurrentTab(Tab.Profile)
									setIsMobileNavBarVisible(false)
								}}
							/>
							<NavLink
								className={clubsTheme.pagePanelLayoutNavItem}
								active={currentTab === Tab.MyClubs}
								label={'My Clubs'}
								onClick={() => {
									setCurrentTab(Tab.MyClubs)
									setIsMobileNavBarVisible(false)
								}}
							/>
						</Navbar>
						{!isMobileNavBarVisible && (
							<div className={clubsTheme.pagePanelLayoutContent}>
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
			<DiscordRoleRedirectModal
				isOpened={isDiscordRoleRedirectModalOpened}
				onModalClosed={() => {
					setIsDiscordRoleRedirectModalOpened(false)
				}}
			/>
		</>
	)
}
