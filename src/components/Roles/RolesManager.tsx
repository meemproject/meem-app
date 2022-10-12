/* eslint-disable @typescript-eslint/naming-convention */
import { useSubscription } from '@apollo/client'
import log from '@kengoldfarb/log'
import {
	Container,
	Text,
	Image,
	Space,
	Center,
	Loader,
	Navbar,
	NavLink,
	MediaQuery,
	Burger
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { LoginState, useWallet } from '@meemproject/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { ArrowLeft, Check, Plus } from 'tabler-icons-react'
import {
	GetClubSubscriptionSubscription,
	MeemContracts
} from '../../../generated/graphql'
import { SUB_CLUB_AS_MEMBER } from '../../graphql/clubs'
import clubFromMeemContract, {
	Club,
	ClubRole,
	emptyRole
} from '../../model/club/club'
import { useCustomApollo } from '../../providers/ApolloProvider'
import { hostnameToChainId } from '../App'
import { useGlobalStyles } from '../Styles/GlobalStyles'
import { RolesManagerContent } from './Role/RolesManagerContent'
interface IProps {
	slug: string
}

interface Tab {
	name: string
	associatedRole?: ClubRole
}

export const RolesManager: React.FC<IProps> = ({ slug }) => {
	// General properties / tab management
	const { classes: styles } = useGlobalStyles()
	const router = useRouter()
	const wallet = useWallet()

	const { mutualMembersClient } = useCustomApollo()

	const [tabs, setTabs] = useState<Tab[]>([])
	const [currentTab, setCurrentTab] = useState<Tab>()
	const [isAddingNewRole, setIsAddingNewRole] = useState(false)
	const [mobileNavBarVisible, setMobileNavBarVisible] = useState(false)

	const navigateToClubAdmin = () => {
		router.push({ pathname: `/${slug}/admin`, query: { tab: 'roles' } })
	}

	const addRole = () => {
		if (!isAddingNewRole) {
			setIsAddingNewRole(true)
			const newTabs = [...tabs]
			newTabs.push({ name: 'Add Role', associatedRole: emptyRole() })
			setTabs(newTabs)
			setCurrentTab(newTabs[newTabs.length - 1])
		}
	}

	const {
		loading,
		error,
		data: clubData
	} = useSubscription<GetClubSubscriptionSubscription>(SUB_CLUB_AS_MEMBER, {
		variables: {
			slug,
			chainId:
				wallet.chainId ??
				hostnameToChainId(
					global.window ? global.window.location.host : ''
				)
		},
		client: mutualMembersClient
	})

	const [isLoadingClub, setIsLoadingClub] = useState(true)
	const [club, setClub] = useState<Club>()

	useEffect(() => {
		if (wallet.loginState === LoginState.NotLoggedIn) {
			router.push({
				pathname: '/authenticate',
				query: {
					return: `/${slug}/admin`
				}
			})
		}
	}, [router, slug, wallet.loginState])

	useEffect(() => {
		function setupTabs(theClub: Club) {
			const newTabs: Tab[] = []
			if (theClub && theClub.roles) {
				theClub.roles.forEach(role => {
					newTabs.push({ name: role.name, associatedRole: role })
				})
			}

			let displayedTab = newTabs[newTabs.length - 1]
			if (router.query.role) {
				const roleId = router.query.role.toString().replaceAll('/', '')
				log.debug(`roleid = ${roleId}`)

				newTabs.forEach(tab => {
					if (
						tab.associatedRole &&
						tab.associatedRole.id === roleId
					) {
						log.debug(`tab should be ${tab.associatedRole.id}`)
						displayedTab = tab
					}
				})
			} else if (router.query.createRole) {
				newTabs.push({ name: 'Add Role', associatedRole: emptyRole() })
				displayedTab = newTabs[newTabs.length - 1]
			}

			setCurrentTab(displayedTab)

			setTabs(newTabs)
		}

		async function getClub(data: GetClubSubscriptionSubscription) {
			const possibleClub = await clubFromMeemContract(
				wallet,
				wallet.isConnected ? wallet.accounts[0] : '',
				data.MeemContracts[0] as MeemContracts
			)

			if (possibleClub && possibleClub.name) {
				setClub(possibleClub)
				setupTabs(possibleClub)
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
		router.query.createRole,
		router.query.role,
		wallet
	])

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
					<div className={styles.header}>
						<div className={styles.spacedRowCentered}>
							<Image
								width={56}
								height={56}
								className={styles.imageClubLogo}
								src={club.image}
							/>
							<div className={styles.headerTitleContainer}>
								<Text className={styles.tHeaderTitleText}>
									{club.name}
								</Text>
								<div
									className={styles.row}
									style={{ marginTop: 8 }}
								>
									<Text
										className={styles.tSmallSubtitle}
									>{`${window.location.origin}/${club.slug}`}</Text>
									<Image
										className={styles.copyIcon}
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
						<a
							className={styles.headerExitButton}
							onClick={navigateToClubAdmin}
						>
							<Image src="/delete.png" width={24} height={24} />
						</a>
					</div>

					{!club?.isCurrentUserClubAdmin && (
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
					{club?.isCurrentUserClubAdmin && (
						<div className={styles.panelLayoutContainer}>
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
								className={styles.panelLayoutNavBar}
								width={{ base: 288 }}
								height={400}
								hidden={!mobileNavBarVisible}
								hiddenBreakpoint={'sm'}
								withBorder={false}
								p="xs"
							>
								<div
									className={styles.centeredRow}
									style={{ marginLeft: 18, marginBottom: 24 }}
								>
									<ArrowLeft
										className={styles.clickable}
										onClick={() => {
											navigateToClubAdmin()
										}}
									/>
									<Space w={8} />
									<Text className={styles.tSectionTitle}>
										Manage Roles
									</Text>
								</div>
								<div
									className={styles.spacedRowCentered}
									style={{ marginLeft: 20 }}
								>
									<Text
										className={styles.tPanelLayoutNavHeader}
									>
										ROLES
									</Text>
									<Plus
										className={styles.clickable}
										onClick={() => {
											addRole()
										}}
									/>
								</div>
								<Space h={8} />

								{tabs.map(tab => (
									<NavLink
										key={tab.name}
										style={{ marginLeft: 8 }}
										className={styles.panelLayoutNavItem}
										active={
											currentTab &&
											currentTab.name === tab.name
										}
										label={tab.name}
										onClick={() => {
											setCurrentTab(tab)
											setMobileNavBarVisible(false)
										}}
									/>
								))}
							</Navbar>
							{!mobileNavBarVisible && (
								<div className={styles.panelLayoutContent}>
									{tabs.map(tab => (
										<div key={tab.name}>
											<div
												className={
													currentTab &&
													currentTab.name === tab.name
														? styles.visibleContainer
														: styles.invisibleContainer
												}
											>
												<RolesManagerContent
													club={club}
													initialRole={
														tab.associatedRole
													}
													onRoleUpdated={newRole => {
														tabs.forEach(theTab => {
															if (
																theTab.associatedRole &&
																theTab
																	.associatedRole
																	.id ===
																	newRole.id
															) {
																theTab.associatedRole =
																	newRole
															}
														})
														setTabs(tabs)
													}}
												/>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					)}
				</>
			)}
		</>
	)
}
