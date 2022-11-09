/* eslint-disable @typescript-eslint/naming-convention */
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
import { cleanNotifications, showNotification } from '@mantine/notifications'
import { MeemAPI, makeRequest, makeFetcher } from '@meemproject/api'
import { LoginState, useWallet } from '@meemproject/react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { AlertCircle, Check } from 'tabler-icons-react'
import { quickTruncate } from '../../utils/truncated_wallet'
import { useGlobalStyles } from '../Styles/GlobalStyles'
import IdentityContext from './IdentityProvider'
import { DiscordRoleRedirectModal } from './Tabs/Identity/DiscordRoleRedirectModal'
import { ManageIdentityComponent } from './Tabs/Identity/ManageIdentity'
import { MyClubsComponent } from './Tabs/MyClubs'

enum Tab {
	Profile,
	MyClubs
}

export const ProfileComponent: React.FC = () => {
	// General properties / tab management
	const { classes: styles } = useGlobalStyles()
	const router = useRouter()
	const wallet = useWallet()
	const id = useContext(IdentityContext)

	const [currentTab, setCurrentTab] = useState<Tab>(Tab.Profile)
	const [mobileNavBarVisible, setMobileNavBarVisible] = useState(false)

	const [isSigningIn, setIsSigningIn] = useState(false)

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

	//
	const login = useCallback(
		async (options: { walletSig?: string; accessToken?: string }) => {
			setIsSigningIn(true)
			const address = wallet.accounts[0]
			const { walletSig, accessToken } = options
			log.info('Logging in to Meem...')
			log.debug(`address = ${wallet.accounts[0]}`)
			log.debug(`sig = ${walletSig}`)

			if (accessToken || (address && walletSig)) {
				log.debug('HERE', accessToken, address)
				try {
					// 1. Log in
					const loginRequest =
						await makeRequest<MeemAPI.v1.Login.IDefinition>(
							MeemAPI.v1.Login.path(),
							{
								method: MeemAPI.v1.Login.method,
								body: {
									...(address && { address }),
									...(walletSig && { signature: walletSig }),
									...(accessToken && { accessToken })
								}
							}
						)

					log.debug(`logged in successfully.`)

					wallet.setJwt(loginRequest.jwt)
					Cookies.remove('redirectPath')
					setIsSigningIn(false)
				} catch (e) {
					setIsSigningIn(false)
					log.error(e)
					cleanNotifications()
					Cookies.remove('redirectPath')
					showNotification({
						radius: 'lg',
						title: 'Login Failed',
						message: 'Please refresh the page and try again.'
					})
				}
			}
		},
		[wallet]
	)

	useEffect(() => {
		async function finishDiscordAuth(code: string) {
			// Fetch cookies
			const clubSlug = Cookies.get('clubSlug')
			const roleId = Cookies.get('roleId')

			if (clubSlug && roleId) {
				// Send request
				try {
					const finishDiscordAuthFetcher = makeFetcher<
						MeemAPI.v1.AuthenticateWithDiscord.IQueryParams,
						MeemAPI.v1.AuthenticateWithDiscord.IRequestBody,
						MeemAPI.v1.AuthenticateWithDiscord.IResponseBody
					>({
						method: MeemAPI.v1.AuthenticateWithDiscord.method
					})

					const authResult = await finishDiscordAuthFetcher(
						MeemAPI.v1.AuthenticateWithDiscord.path({}),
						{},
						{
							authCode: code,
							redirectUri: `${window.location.origin}/profile`
						}
					)

					// Set the cookie
					Cookies.set('discordAccessToken', authResult.accessToken)

					// Redirect / cleanup
					Cookies.remove('authForDiscordRole')
					Cookies.remove('clubSlug')
					Cookies.remove('roleId')
					router.push({
						pathname: `/${clubSlug}/roles`,
						query: {
							role: `/${roleId}`
						}
					})
				} catch (e) {
					log.debug(e)
					showNotification({
						title: 'Error',
						autoClose: 5000,
						color: 'red',
						icon: <AlertCircle />,
						message: `Unable to authenticate with Discord. Please try again later.`
					})
					setIsDiscordRoleRedirectModalOpened(false)
					return
				}
			} else {
				setIsDiscordRoleRedirectModalOpened(false)
				log.error('Failed to redirect due to missing cookies')
				showNotification({
					title: 'Error',
					autoClose: 5000,
					color: 'red',
					icon: <AlertCircle />,
					message: `Unable to authenticate with Discord. Please try again later.`
				})
			}
		}

		if (router.query.code && Cookies.get('authForDiscordRole')) {
			// We have a discord auth code -> turn into access token

			setIsDiscordRoleRedirectModalOpened(true)

			finishDiscordAuth(router.query.code.toString())
		}
	}, [router])

	useEffect(() => {
		const hashQueryParams: { [key: string]: string } = {}
		const possiblePath = Cookies.get('redirectPath')
		if (possiblePath && possiblePath.includes('access_token')) {
			const hashPath = possiblePath.split('#')

			if (hashPath.length > 1) {
				hashPath[1].split('&').forEach(value => {
					const keyVal = value.split('=')
					hashQueryParams[keyVal[0]] = keyVal[1]
				})
			}
			log.debug('ACCESS TOKEN', hashQueryParams)
			if (hashQueryParams.access_token) {
				login({
					accessToken: hashQueryParams.access_token
				})
			}
		}
	}, [login])

	return (
		<>
			{!wallet.isConnected && !id.isLoadingIdentity && !isSigningIn && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>Connect your wallet to access your profile.</Text>
					</Center>
				</Container>
			)}
			{wallet.isConnected && (id.isLoadingIdentity || isSigningIn) && (
				<Container>
					<Space h={120} />
					<Center>
						<Loader variant="oval" color="red" />
					</Center>
				</Container>
			)}
			{wallet.isConnected &&
				!id.isLoadingIdentity &&
				!isSigningIn &&
				!id.identity && (
					<Container>
						<Space h={120} />
						<Center>
							<Text>
								Unable to load your profile. Please try again
								later.
							</Text>
						</Center>
					</Container>
				)}
			{wallet.isConnected &&
				!id.isLoadingIdentity &&
				!isSigningIn &&
				id.identity && (
					<>
						<div className={styles.pageHeader}>
							<div className={styles.tHeaderTitleText}>
								{id.identity.profilePic && (
									<>
										<Image
											radius={32}
											height={64}
											width={64}
											fit={'cover'}
											className={styles.imageClubLogo}
											src={id.identity.profilePic ?? ''}
										/>
									</>
								)}

								{/* <Text className={classes.headerProfileName}>{profileName}</Text> */}
								<div
									className={styles.pageHeaderTitleContainer}
								>
									<Text className={styles.spacedRowCentered}>
										{id.identity.displayName ??
											'My Profile'}
									</Text>
									<Space h={8} />
									<div className={styles.row}>
										<Text
											className={
												styles.tExtraSmallBoldFaded
											}
										>
											{id.identity.ensAddress
												? id.identity.ensAddress
												: id.identity.walletAddress
												? quickTruncate(
														id.identity
															.walletAddress
												  )
												: 'No wallet address found'}
										</Text>
										{id.identity.id && (
											<>
												<Image
													className={styles.copyIcon}
													src="/copy.png"
													height={20}
													onClick={() => {
														navigator.clipboard.writeText(
															`${
																id.identity
																	.ensAddress ??
																id.identity
																	.walletAddress
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
						<Space h={8} />
						<div className={styles.tExtraSmallBold}>
							<MediaQuery
								largerThan="sm"
								styles={{ display: 'none' }}
							>
								<Burger
									style={{ marginLeft: 24 }}
									opened={mobileNavBarVisible}
									onClick={() =>
										setMobileNavBarVisible(o => !o)
									}
									size="sm"
									mr="xl"
								/>
							</MediaQuery>
							<Navbar
								className={styles.pagePanelLayoutNavBar}
								width={{ base: 288 }}
								height={400}
								hidden={!mobileNavBarVisible}
								hiddenBreakpoint={'sm'}
								withBorder={false}
								p="xs"
							>
								<Text className={styles.tBoldFaded}>
									SETTINGS
								</Text>
								<NavLink
									className={styles.pagePanelLayoutNavItem}
									active={currentTab === Tab.Profile}
									label={'Manage Identity'}
									onClick={() => {
										setCurrentTab(Tab.Profile)
										setMobileNavBarVisible(false)
									}}
								/>
								<NavLink
									className={styles.pagePanelLayoutNavItem}
									active={currentTab === Tab.MyClubs}
									label={'My Clubs'}
									onClick={() => {
										setCurrentTab(Tab.MyClubs)
										setMobileNavBarVisible(false)
									}}
								/>
							</Navbar>
							{!mobileNavBarVisible && (
								<div className={styles.pagePanelLayoutContent}>
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
