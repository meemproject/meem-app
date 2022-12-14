/* eslint-disable @typescript-eslint/naming-convention */
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
import { Check } from 'tabler-icons-react'
import {
	userHasPermissionEditProfile,
	userHasPermissionManageApps,
	userHasPermissionManageMembershipSettings,
	userHasPermissionManageRoles
} from '../../model/identity/permissions'
import { useClub } from '../ClubHome/ClubProvider'
import { colorGreen, useClubsTheme } from '../Styles/ClubsTheme'
import { CABulkMint } from './Tabs/CABulkMint'
import { CAClubApps } from './Tabs/CAClubApps'
import { CAClubDetails } from './Tabs/CAClubDetails'
import { CAClubIcon } from './Tabs/CAClubIcon'
import { CAContractAddress as CAContractManagement } from './Tabs/CAContractManagement'
import { CAMembershipRequirements } from './Tabs/CAMembershipRequirements'
import { CAMembershipSettings } from './Tabs/CAMembershipSettings'
import { CARoles } from './Tabs/CARoles'

enum Tab {
	ContractManagement,
	MembershipSettings,
	MembershipRequirements,
	Roles,
	ClubDetails,
	ClubIcon,
	Apps,
	Airdrops,
	DeleteClub
}

export const ClubAdminComponent: React.FC = () => {
	// General properties / tab management
	const { classes: clubsTheme } = useClubsTheme()
	const router = useRouter()
	const wallet = useWallet()

	const { club, isLoadingClub, error } = useClub()

	const [currentTab, setCurrentTab] = useState<Tab>(Tab.ContractManagement)
	const [mobileNavBarVisible, setMobileNavBarVisible] = useState(false)

	const navigateToClubDetail = () => {
		router.push({ pathname: `/${club?.slug}` })
	}

	useEffect(() => {
		if (wallet.loginState === LoginState.NotLoggedIn) {
			router.push({
				pathname: '/authenticate',
				query: {
					return: `/${club?.slug}/admin`
				}
			})
		}

		if (
			error &&
			error.graphQLErrors.length > 0 &&
			error.graphQLErrors[0].extensions.code === 'invalid-jwt'
		) {
			router.push({
				pathname: '/authenticate',
				query: {
					return: `/${club?.slug}/admin`
				}
			})
		}
	}, [club?.slug, error, router, wallet])

	useEffect(() => {
		switch (router.query.tab) {
			case 'airdrops':
				setCurrentTab(Tab.Airdrops)
				break
			case 'apps':
				setCurrentTab(Tab.Apps)
				break
			case 'clubdetails':
				setCurrentTab(Tab.ClubDetails)
				break
			case 'clubicon':
				setCurrentTab(Tab.ClubIcon)
				break
			case 'contractmanagement':
				setCurrentTab(Tab.ContractManagement)
				break
			case 'membershiprequirements':
				setCurrentTab(Tab.MembershipRequirements)
				break
			case 'membershipsettings':
				setCurrentTab(Tab.MembershipSettings)
				break
			case 'roles':
				setCurrentTab(Tab.Roles)
				break
			// case 'deleteClub':
			// 	setCurrentTab(Tab.DeleteClub)
			// 	break
		}
	}, [router.query.tab])

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
								radius={8}
								className={clubsTheme.imageClubLogo}
								src={club.image}
							/>
							{/* <Text className={classes.headerClubName}>{clubName}</Text> */}
							<div
								className={clubsTheme.pageHeaderTitleContainer}
							>
								<Text className={clubsTheme.tLargeBold}>
									{club.name}
								</Text>
								<Space h={8} />
								<div className={clubsTheme.row}>
									<Text
										className={clubsTheme.tExtraSmallFaded}
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
												color: colorGreen,
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
							onClick={navigateToClubDetail}
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
								<Text
									className={clubsTheme.tExtraSmallLabel}
									style={{ marginLeft: 20, marginBottom: 8 }}
								>
									MANAGE CLUB
								</Text>
								<NavLink
									className={
										clubsTheme.pagePanelLayoutNavItem
									}
									active={
										currentTab === Tab.ContractManagement
									}
									label={'Contract Management'}
									onClick={() => {
										setCurrentTab(Tab.ContractManagement)
										setMobileNavBarVisible(false)
									}}
								/>
								{userHasPermissionManageMembershipSettings(
									club
								) && (
									<div>
										<NavLink
											className={
												clubsTheme.pagePanelLayoutNavItem
											}
											active={
												currentTab ===
												Tab.MembershipSettings
											}
											label={'Membership Settings'}
											onClick={() => {
												setCurrentTab(
													Tab.MembershipSettings
												)
												setMobileNavBarVisible(false)
											}}
										/>
										<NavLink
											className={
												clubsTheme.pagePanelLayoutNavItem
											}
											active={
												currentTab ===
												Tab.MembershipRequirements
											}
											label={'Membership Requirements'}
											onClick={() => {
												setCurrentTab(
													Tab.MembershipRequirements
												)
												setMobileNavBarVisible(false)
											}}
										/>
									</div>
								)}

								{userHasPermissionManageRoles(club) && (
									<>
										<NavLink
											className={
												clubsTheme.pagePanelLayoutNavItem
											}
											active={currentTab === Tab.Roles}
											label={'Roles'}
											onClick={() => {
												setCurrentTab(Tab.Roles)
												setMobileNavBarVisible(false)
											}}
										/>
									</>
								)}

								{/* {club.isCurrentUserClubOwner && (
									<NavLink
										className={clubsTheme.pagePanelLayoutNavItem}
										active={currentTab === Tab.DeleteClub}
										label={'Delete Club'}
										onClick={() => {
											setCurrentTab(Tab.DeleteClub)
											setMobileNavBarVisible(false)
										}}
									/>
								)} */}

								{userHasPermissionManageApps(club) && (
									<>
										<NavLink
											className={
												clubsTheme.pagePanelLayoutNavItem
											}
											active={currentTab === Tab.Apps}
											label={'Club Apps'}
											onClick={() => {
												setCurrentTab(Tab.Apps)
												setMobileNavBarVisible(false)
											}}
										/>
									</>
								)}

								<NavLink
									className={
										clubsTheme.pagePanelLayoutNavItem
									}
									active={currentTab === Tab.Airdrops}
									label={'Airdrops'}
									onClick={() => {
										setCurrentTab(Tab.Airdrops)
										setMobileNavBarVisible(false)
									}}
								/>

								{userHasPermissionEditProfile(club) && (
									<div>
										<Space h={32} />
										<Text
											style={{
												marginLeft: 20,
												marginBottom: 8
											}}
											className={
												clubsTheme.tExtraSmallLabel
											}
										>
											EDIT PROFILE
										</Text>
										<NavLink
											className={
												clubsTheme.pagePanelLayoutNavItem
											}
											active={
												currentTab === Tab.ClubDetails
											}
											label={'Club Details'}
											onClick={() => {
												setCurrentTab(Tab.ClubDetails)
												setMobileNavBarVisible(false)
											}}
										/>
										<NavLink
											className={
												clubsTheme.pagePanelLayoutNavItem
											}
											active={currentTab === Tab.ClubIcon}
											label={'Club Icon'}
											onClick={() => {
												setCurrentTab(Tab.ClubIcon)
												setMobileNavBarVisible(false)
											}}
										/>
									</div>
								)}
							</Navbar>
							{!mobileNavBarVisible && (
								<div
									className={
										clubsTheme.pagePanelLayoutContent
									}
								>
									{currentTab === Tab.ContractManagement && (
										<CAContractManagement club={club} />
									)}
									{currentTab === Tab.MembershipSettings &&
										userHasPermissionManageMembershipSettings(
											club
										) && (
											<CAMembershipSettings club={club} />
										)}
									{currentTab ===
										Tab.MembershipRequirements &&
										userHasPermissionManageMembershipSettings(
											club
										) && (
											<CAMembershipRequirements
												club={club}
											/>
										)}
									{currentTab === Tab.ClubDetails &&
										userHasPermissionEditProfile(club) && (
											<CAClubDetails club={club} />
										)}
									{currentTab === Tab.ClubIcon &&
										userHasPermissionEditProfile(club) && (
											<CAClubIcon club={club} />
										)}
									{currentTab === Tab.Apps &&
										userHasPermissionManageApps(club) && (
											<CAClubApps club={club} />
										)}
									{currentTab === Tab.Airdrops && (
										<CABulkMint club={club} />
									)}
									{currentTab === Tab.Roles &&
										userHasPermissionManageRoles(club) && (
											<CARoles club={club} />
										)}
									{/* {currentTab === Tab.DeleteClub &&
										club.isCurrentUserClubAdmin && (
											<CADeleteClub club={club} />
										)} */}
								</div>
							)}
						</div>
					)}
				</>
			)}
		</>
	)
}
