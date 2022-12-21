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
import { LoginState, useAuth, useSDK, useMeemUser } from '@meemproject/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Check, X } from 'tabler-icons-react'
import { quickTruncate } from '../../utils/truncated_wallet'
import { useMeemTheme } from '../Styles/MeemTheme'
import { DiscordRoleRedirectModal } from './Tabs/Identity/DiscordRoleRedirectModal'
import { ManageIdentityComponent } from './Tabs/Identity/ManageIdentity'
import { MyAgreementsComponent } from './Tabs/MyAgreements'

enum Tab {
	Profile,
	MyAgreements
}

export const ProfileComponent: React.FC = () => {
	// General properties / tab management
	const { classes: meemTheme } = useMeemTheme()
	const router = useRouter()
	const wallet = useAuth()
	const { isMeLoading, isGetMeError } = useAuth()
	const { user } = useMeemUser()
	const { sdk } = useSDK()

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
		if (router.query.tab === 'myCommunities') {
			setCurrentTab(Tab.MyAgreements)
		} else if (router.query.tab === 'identity') {
			setCurrentTab(Tab.Profile)
		}
	}, [router.query.tab])

	useEffect(() => {
		const doLogin = async () => {
			try {
				const accessToken = await getAccessTokenSilently()
				sdk.id.loginWithAPI({
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
						<Loader variant="oval" color="blue" />
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
					<div className={meemTheme.pageHeader}>
						<div className={meemTheme.spacedRowCentered}>
							{user.profilePicUrl && (
								<>
									<Image
										radius={32}
										height={64}
										width={64}
										fit={'cover'}
										className={meemTheme.imageAgreementLogo}
										src={user.profilePicUrl}
									/>
								</>
							)}

							{/* <Text className={classes.headerProfileName}>{profileName}</Text> */}
							<div className={meemTheme.pageHeaderTitleContainer}>
								<Text className={meemTheme.tLargeBold}>
									{user.displayName ?? 'My Profile'}
								</Text>
								<Space h={8} />
								<div className={meemTheme.row}>
									<Text
										className={meemTheme.tExtraSmallFaded}
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
												className={meemTheme.copyIcon}
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
					<div className={meemTheme.pagePanelLayoutContainer}>
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
							className={meemTheme.pagePanelLayoutNavBar}
							width={{ base: 288 }}
							height={400}
							hidden={!isMobileNavBarVisible}
							hiddenBreakpoint={'sm'}
							withBorder={false}
							p="xs"
						>
							<Text
								className={meemTheme.tExtraSmallLabel}
								style={{ marginLeft: 20, marginBottom: 8 }}
							>
								SETTINGS
							</Text>
							<NavLink
								className={meemTheme.pagePanelLayoutNavItem}
								active={currentTab === Tab.Profile}
								label={'Manage Identity'}
								onClick={() => {
									setCurrentTab(Tab.Profile)
									setIsMobileNavBarVisible(false)
								}}
							/>
							<NavLink
								className={meemTheme.pagePanelLayoutNavItem}
								active={currentTab === Tab.MyAgreements}
								label={'My Communities'}
								onClick={() => {
									setCurrentTab(Tab.MyAgreements)
									setIsMobileNavBarVisible(false)
								}}
							/>
						</Navbar>
						{!isMobileNavBarVisible && (
							<div className={meemTheme.pagePanelLayoutContent}>
								{currentTab === Tab.Profile && (
									<ManageIdentityComponent />
								)}
								{currentTab === Tab.MyAgreements && (
									<MyAgreementsComponent />
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
