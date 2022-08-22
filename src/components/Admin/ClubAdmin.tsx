import { useQuery, useSubscription } from '@apollo/client'
import log from '@kengoldfarb/log'
import {
	createStyles,
	Container,
	Text,
	Image,
	Space,
	Center,
	Loader,
	Divider,
	Button
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { makeFetcher, MeemAPI } from '@meemproject/api'
import { diamondABI } from '@meemproject/meem-contracts'
import { LoginState, useWallet } from '@meemproject/react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { ArrowLeft, Check } from 'tabler-icons-react'
import {
	GetBundleByIdQuery,
	GetClubSubscriptionSubscription,
	MeemContracts
} from '../../../generated/graphql'
import { GET_BUNDLE_BY_ID, SUB_CLUB } from '../../graphql/clubs'
import clubFromMeemContract, { Club } from '../../model/club/club'
import { ClubAdminDappSettingsComponent } from './ClubAdminDappsSettings'
import { ClubAdminMembershipSettingsComponent } from './ClubAdminMembershipSettings'
import { ClubAdminProfileSettings } from './ClubAdminProfileSettings'

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
	buttonCreate: {
		backgroundColor: 'black',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 24
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
	Membership,
	Profile,
	Integrations
}

interface IProps {
	slug: string
}

export const ClubAdminComponent: React.FC<IProps> = ({ slug }) => {
	// General properties / tab management
	const { classes } = useStyles()
	const router = useRouter()
	const wallet = useWallet()

	const [currentTab, setCurrentTab] = useState<Tab>(Tab.Membership)
	const [isCreatingSafe, setIsCreatingSafe] = useState(false)
	const [bundleFunctionSelectors, setBundleFunctionSelectors] = useState<
		string[]
	>([])
	const [clubFunctionSelectors, setClubFunctionSelectors] = useState<
		string[]
	>([])
	const [bundleABI, setBundleABI] = useState<string>()
	const [shouldShowUpgrade, setShouldShowUpgrade] = useState(false)
	const [isUpgradingClub, setIsUpgradingClub] = useState(false)

	const navigateToClubDetail = () => {
		router.push({ pathname: `/${slug}` })
	}

	const switchToMembership = () => {
		setCurrentTab(Tab.Membership)
	}

	const switchToClubProfile = () => {
		setCurrentTab(Tab.Profile)
	}

	const switchToIntegrations = () => {
		setCurrentTab(Tab.Integrations)
	}

	const {
		loading,
		error,
		data: clubData
	} = useSubscription<GetClubSubscriptionSubscription>(SUB_CLUB, {
		variables: { slug }
	})

	const { data: bundleData } = useQuery<GetBundleByIdQuery>(
		GET_BUNDLE_BY_ID,
		{
			variables: {
				id: process.env.NEXT_PUBLIC_MEEM_BUNDLE_ID
			}
		}
	)

	const [isLoadingClub, setIsLoadingClub] = useState(true)
	const [club, setClub] = useState<Club>()

	useEffect(() => {
		if (
			// Note: walletContext thinks logged in = LoginState.unknown, using cookies here
			wallet.loginState === LoginState.NotLoggedIn
		) {
			router.push({
				pathname: '/authenticate',
				query: {
					return: `/${slug}/admin`
				}
			})
		}
	}, [router, slug, wallet.loginState])

	useEffect(() => {
		async function getClub(data: GetClubSubscriptionSubscription) {
			const possibleClub = await clubFromMeemContract(
				wallet,
				wallet.isConnected ? wallet.accounts[0] : '',
				data.MeemContracts[0] as MeemContracts
			)

			if (possibleClub && possibleClub.name) {
				setClub(possibleClub)
			}
			setIsLoadingClub(false)
		}
		if (!loading && !error && !club && clubData) {
			getClub(clubData)
		}
	}, [
		club,
		clubData,
		error,
		loading,
		wallet,
		wallet.accounts,
		wallet.isConnected
	])

	useEffect(() => {
		if (bundleData?.Bundles[0]) {
			let allFunctionSelectors: string[] = []
			bundleData.Bundles[0].BundleContracts.forEach(bc => {
				allFunctionSelectors = [
					...allFunctionSelectors,
					...bc.functionSelectors
				]
			})

			setBundleFunctionSelectors(allFunctionSelectors)
			setBundleABI(bundleData.Bundles[0].abi)
		}
	}, [bundleData])

	useEffect(() => {
		const fetchFacets = async () => {
			if (bundleABI && club?.address) {
				try {
					const diamond = new ethers.Contract(
						club.address,
						diamondABI,
						wallet.signer
					)

					const facets = await diamond.facets()
					let currentSelectors: string[] = []
					facets.forEach(
						(facet: { target: string; selectors: string[] }) => {
							currentSelectors = [
								...currentSelectors,
								...facet.selectors
							]
						}
					)
					setClubFunctionSelectors(currentSelectors)
				} catch (e) {
					log.crit(e)
				}
			}
		}
		fetchFacets()
	}, [bundleABI, club, wallet])

	useEffect(() => {
		if (
			bundleFunctionSelectors.length > 0 &&
			clubFunctionSelectors.length > 0
		) {
			for (let i = 0; i < bundleFunctionSelectors.length; i += 1) {
				const clubFS = clubFunctionSelectors.find(
					fs => fs === bundleFunctionSelectors[i]
				)
				if (!clubFS) {
					setShouldShowUpgrade(true)
					return
				}
			}

			// If we made it this far, all selectors are accounted for and the upgrade was successful
			if (shouldShowUpgrade) {
				showNotification({
					title: 'Club Upgraded!',
					color: 'green',
					icon: <Check />,
					message: `The club has been upgraded to the latest version.`
				})
				setShouldShowUpgrade(false)
				setIsUpgradingClub(false)
			}
		}
	}, [bundleFunctionSelectors, clubFunctionSelectors, shouldShowUpgrade])

	return (
		<>
			{isLoadingClub && (
				<Container>
					<Space h={120} />
					<Center>
						<Loader color="red" variant="oval" />
					</Center>
				</Container>
			)}
			{!isLoadingClub && !club?.name && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>Sorry, that club does not exist!</Text>
					</Center>
				</Container>
			)}

			{!isLoadingClub && club?.name && (
				<>
					<div className={classes.header}>
						<div className={classes.headerTitle}>
							<a onClick={navigateToClubDetail}>
								<ArrowLeft
									className={classes.headerArrow}
									size={32}
								/>
							</a>
							<Image
								width={80}
								height={80}
								className={classes.clubLogoImage}
								src={club.image}
							/>
							{/* <Text className={classes.headerClubName}>{clubName}</Text> */}
							<div className={classes.headerClubNameContainer}>
								<Text className={classes.headerClubName}>
									{club.name}
								</Text>
								<div className={classes.clubUrlContainer}>
									<Text
										className={classes.clubUrl}
									>{`${window.location.origin}/${club.slug}`}</Text>
									<Image
										className={classes.copy}
										src="/copy.png"
										height={20}
										onClick={() => {
											navigator.clipboard.writeText(
												`${window.location.origin}/${club.slug}`
											)
											showNotification({
												radius: 'lg',
												title: 'Club URL copied',
												autoClose: 2000,
												color: 'green',
												icon: <Check />,

												message: `This club's URL was copied to your clipboard.`
											})
										}}
										width={20}
									/>
								</div>
							</div>
						</div>
					</div>

					{!club?.isClubAdmin && (
						<Container>
							<Space h={120} />
							<Center>
								<Text>
									Sorry, you do not have permission to view
									this page. Contact the club owner for help.
								</Text>
							</Center>
						</Container>
					)}
					{club?.isClubAdmin && (
						<Container>
							<div className={classes.tabs}>
								<a onClick={switchToMembership}>
									<Text
										className={
											currentTab == Tab.Membership
												? classes.activeTab
												: classes.inactiveTab
										}
									>
										Manage Club
									</Text>
								</a>
								<a onClick={switchToClubProfile}>
									<Text
										className={
											currentTab == Tab.Profile
												? classes.activeTab
												: classes.inactiveTab
										}
									>
										Edit Profile
									</Text>
								</a>
								<a onClick={switchToIntegrations}>
									<Text
										className={
											currentTab == Tab.Integrations
												? classes.activeTab
												: classes.inactiveTab
										}
									>
										Apps
									</Text>
								</a>
							</div>
							<div
								className={
									currentTab === Tab.Membership
										? classes.visibleTab
										: classes.invisibleTab
								}
							>
								<Space h={30} />
								<Text
									className={
										classes.clubIntegrationsSectionTitle
									}
								>
									Club Contract Address
								</Text>
								<div
									className={classes.contractAddressContainer}
								>
									<Text
										className={classes.clubContractAddress}
									>
										{club.address}
									</Text>
									<Image
										className={classes.copy}
										src="/copy.png"
										height={20}
										onClick={() => {
											navigator.clipboard.writeText(
												club.address ?? ''
											)
											showNotification({
												radius: 'lg',
												title: 'Address copied',
												autoClose: 2000,
												color: 'green',
												icon: <Check />,

												message: `This club's contract address was copied to your clipboard.`
											})
										}}
										width={20}
									/>
								</div>

								<Space h={8} />

								<Text>{`You can use this address to token-gate third-party apps and tools, such as creating an exclusive Discord community with Collab.Land. Every club member holds this club's token.`}</Text>

								{shouldShowUpgrade && (
									<>
										<Space h={'xl'} />
										<Divider />
										<Space h={'xl'} />
										<Text
											className={
												classes.clubIntegrationsSectionTitle
											}
										>
											Upgrade Club Contract
										</Text>
										<div
											className={
												classes.contractAddressContainer
											}
										>
											<div>
												<Text>
													A new version of Clubs is
													available! Upgrade to take
													advantage of all the new
													features.
												</Text>
											</div>
										</div>
										<Space h={'xs'} />
										<Button
											loading={isUpgradingClub}
											disabled={isUpgradingClub}
											className={classes.buttonCreate}
											onClick={async () => {
												try {
													if (!club?.id) {
														return
													}
													setIsUpgradingClub(true)
													const upgradeClubFetcher =
														makeFetcher<
															MeemAPI.v1.UpgradeClub.IQueryParams,
															MeemAPI.v1.UpgradeClub.IRequestBody,
															MeemAPI.v1.UpgradeClub.IResponseBody
														>({
															method: MeemAPI.v1
																.UpgradeClub
																.method
														})

													await upgradeClubFetcher(
														MeemAPI.v1.UpgradeClub.path(
															{
																meemContractId:
																	club.id
															}
														)
													)
												} catch (e) {
													log.crit(e)
													showNotification({
														title: 'Error Upgrading Club',
														color: 'red',
														message: `Something went wrong during the upgrade.`
													})
													setIsUpgradingClub(false)
												}
											}}
										>
											Upgrade Contract
										</Button>
									</>
								)}

								<Space h={'xl'} />
								<Divider />
								<Space h={'xl'} />
								<Text
									className={
										classes.clubIntegrationsSectionTitle
									}
								>
									Club Treasury Address
								</Text>
								{club.gnosisSafeAddress && (
									<>
										<div
											className={
												classes.contractAddressContainer
											}
										>
											<Text
												className={
													classes.clubContractAddress
												}
											>
												{club.gnosisSafeAddress}
											</Text>
											<Image
												className={classes.copy}
												src="/copy.png"
												height={20}
												onClick={() => {
													navigator.clipboard.writeText(
														club.gnosisSafeAddress ??
															''
													)
													showNotification({
														radius: 'lg',
														title: 'Address copied',
														autoClose: 2000,
														color: 'green',
														icon: <Check />,

														message: `This club's treasury address was copied to your clipboard.`
													})
												}}
												width={20}
											/>
										</div>
										<Space h={8} />

										<Text>{`Your club's treasury was set up when the club was created. You can manage your treasury (including signing transactions and adding members) using the button below.`}</Text>
										<Space h={'xs'} />

										<Button
											className={classes.buttonCreate}
											onClick={() => {
												window.open(
													`https://gnosis-safe.io/app/${
														process.env
															.NEXT_PUBLIC_CHAIN_ID ===
														'4'
															? 'rin'
															: 'matic'
													}:${
														club.gnosisSafeAddress
													}/home`
												)
											}}
										>
											View Treasury
										</Button>
									</>
								)}

								{!club.gnosisSafeAddress && (
									<Button
										className={classes.buttonCreate}
										disabled={isCreatingSafe}
										loading={isCreatingSafe}
										onClick={async () => {
											if (!club.id || !club.admins) {
												return
											}
											try {
												setIsCreatingSafe(true)
												const createSafeFetcher =
													makeFetcher<
														MeemAPI.v1.CreateClubSafe.IQueryParams,
														MeemAPI.v1.CreateClubSafe.IRequestBody,
														MeemAPI.v1.CreateClubSafe.IResponseBody
													>({
														method: MeemAPI.v1
															.CreateClubSafe
															.method
													})

												await createSafeFetcher(
													MeemAPI.v1.CreateClubSafe.path(
														{
															meemContractId:
																club.id
														}
													),
													undefined,
													{
														safeOwners: club.admins
													}
												)
												await new Promise(f =>
													setTimeout(f, 10000)
												)

												// refetchClub()

												setIsCreatingSafe(false)
											} catch (e) {
												log.crit(e)
												setIsCreatingSafe(false)
												showNotification({
													radius: 'lg',
													title: 'Wallet creation failed.',
													message:
														'We were unable to create treasury for your club. Please refresh the page and try again.',
													color: 'red'
												})
											}
										}}
									>
										Create Treasury
									</Button>
								)}

								<Space h={'xl'} />
								<Divider />
								<Space h={'xs'} />

								<ClubAdminMembershipSettingsComponent
									isCreatingClub={false}
									club={club}
								/>
							</div>

							<div
								className={
									currentTab === Tab.Profile
										? classes.visibleTab
										: classes.invisibleTab
								}
							>
								<ClubAdminProfileSettings club={club} />
							</div>

							<div
								className={
									currentTab === Tab.Integrations
										? classes.visibleTab
										: classes.invisibleTab
								}
							>
								{' '}
								<ClubAdminDappSettingsComponent club={club} />
							</div>
						</Container>
					)}
				</>
			)}
		</>
	)
}
