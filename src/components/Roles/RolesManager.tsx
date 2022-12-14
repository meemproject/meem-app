/* eslint-disable @typescript-eslint/naming-convention */
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
import { useWallet } from '@meemproject/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { ArrowLeft, Check, Plus } from 'tabler-icons-react'
import { Club, ClubRole, emptyRole } from '../../model/club/club'
import { useClub } from '../ClubHome/ClubProvider'
import { useClubsTheme } from '../Styles/ClubsTheme'
import { RolesManagerContent } from './Role/RolesManagerContent'
interface Tab {
	name: string
	associatedRole?: ClubRole
}

export const RolesManager: React.FC = () => {
	// General properties / tab management
	const { classes: clubsTheme } = useClubsTheme()
	const router = useRouter()
	const wallet = useWallet()

	const { club, isLoadingClub, error } = useClub()

	const [tabs, setTabs] = useState<Tab[]>([])
	const [currentTab, setCurrentTab] = useState<Tab>()
	const [isAddingNewRole, setIsAddingNewRole] = useState(false)
	const [mobileNavBarVisible, setMobileNavBarVisible] = useState(false)

	const navigateToClubAdmin = () => {
		router.push({
			pathname: `/${club?.slug}/admin`,
			query: { tab: 'roles' }
		})
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

		if (!isLoadingClub && !error && club) {
			setupTabs(club)
		}
	}, [
		club,
		error,
		isLoadingClub,
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
					<div className={clubsTheme.pageHeader}>
						<div className={clubsTheme.spacedRowCentered}>
							<Image
								width={56}
								height={56}
								className={clubsTheme.imageClubLogo}
								src={club.image}
							/>
							<div
								className={clubsTheme.pageHeaderTitleContainer}
							>
								<Text className={clubsTheme.tLargeBold}>
									{club.name}
								</Text>
								<div
									className={clubsTheme.row}
									style={{
										marginTop: 8
									}}
								>
									<Text
										className={clubsTheme.tExtraSmallFaded}
										style={{
											maxWidth: 220,
											textOverflow: 'ellipsis',
											msTextOverflow: 'ellipsis',
											whiteSpace: 'nowrap',
											overflow: 'hidden'
										}}
									>{`${window.location.origin}/${club.slug}`}</Text>
									<Image
										className={clubsTheme.copyIcon}
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
							className={clubsTheme.pageHeaderExitButton}
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
						<div className={clubsTheme.pagePanelLayoutContainer}>
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
								className={clubsTheme.pagePanelLayoutNavBar}
								width={{ base: 288 }}
								height={400}
								hidden={!mobileNavBarVisible}
								hiddenBreakpoint={'sm'}
								withBorder={false}
								p="xs"
							>
								<div
									className={clubsTheme.centeredRow}
									style={{ marginLeft: 18, marginBottom: 24 }}
								>
									<ArrowLeft
										className={clubsTheme.clickable}
										onClick={() => {
											navigateToClubAdmin()
										}}
									/>
									<Space w={8} />
									<Text className={clubsTheme.tLargeBold}>
										Manage Roles
									</Text>
								</div>
								<div
									className={clubsTheme.spacedRowCentered}
									style={{ marginLeft: 20 }}
								>
									<Text
										className={clubsTheme.tExtraSmallLabel}
										style={{
											marginLeft: 10
										}}
									>
										ROLES
									</Text>
									<Plus
										className={clubsTheme.clickable}
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
										className={
											clubsTheme.pagePanelLayoutNavItem
										}
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
								<div
									className={
										clubsTheme.pagePanelLayoutContent
									}
								>
									{tabs.map(tab => (
										<div key={tab.name}>
											<div
												className={
													currentTab &&
													currentTab.name === tab.name
														? clubsTheme.visibleContainer
														: clubsTheme.invisibleContainer
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
