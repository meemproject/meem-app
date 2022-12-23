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
import { useWallet } from '@meemproject/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Check } from 'tabler-icons-react'
import {
	userHasPermissionEditProfile,
	userHasPermissionManageApps,
	userHasPermissionManageMembershipSettings,
	userHasPermissionManageRoles
} from '../../model/identity/permissions'
import { useAgreement } from '../AgreementHome/AgreementProvider'
import { colorGreen, useMeemTheme } from '../Styles/MeemTheme'
import { AdminAgreementDetails } from './Tabs/AdminAgreementDetails'
import { AdminAgreementExtensions } from './Tabs/AdminAgreementExtensions'
import { AdminAgreementIcon } from './Tabs/AdminAgreementIcon'
import { AdminBulkMint } from './Tabs/AdminBulkMint'
import { AdminContractManagement } from './Tabs/AdminContractManagement'
import { AdminMembershipRequirements } from './Tabs/AdminMembershipRequirements'
import { AdminMembershipSettings } from './Tabs/AdminMembershipSettings'
import { AdminRoles } from './Tabs/AdminRoles'

enum Tab {
	ContractManagement,
	MembershipSettings,
	MembershipRequirements,
	Roles,
	AgreementDetails,
	AgreementIcon,
	Extensions,
	Airdrops,
	DeleteAgreement
}

export const AgreementAdminComponent: React.FC = () => {
	// General properties / tab management
	const { classes: meemTheme } = useMeemTheme()
	const router = useRouter()
	const wallet = useWallet()

	const { agreement, isLoadingAgreement, error } = useAgreement()

	const [currentTab, setCurrentTab] = useState<Tab>(Tab.ContractManagement)
	const [mobileNavBarVisible, setMobileNavBarVisible] = useState(false)

	const navigateToAgreementDetail = () => {
		router.push({ pathname: `/${agreement?.slug}` })
	}

	useEffect(() => {
		if (
			error &&
			error.graphQLErrors.length > 0 &&
			error.graphQLErrors[0].extensions.code === 'invalid-jwt'
		) {
			router.push({
				pathname: '/authenticate',
				query: {
					return: `/${agreement?.slug}/admin`
				}
			})
		}
	}, [agreement?.slug, error, router, wallet])

	useEffect(() => {
		switch (router.query.tab) {
			case 'airdrops':
				setCurrentTab(Tab.Airdrops)
				break

			case 'agreementdetails':
				setCurrentTab(Tab.AgreementDetails)
				break
			case 'agreementicon':
				setCurrentTab(Tab.AgreementIcon)
				break
			case 'contractmanagement':
				setCurrentTab(Tab.ContractManagement)
				break
			case 'extensions':
				setCurrentTab(Tab.Extensions)
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
			// case 'deleteAgreement':
			// 	setCurrentTab(Tab.DeleteAgreement)
			// 	break
		}
	}, [router.query.tab])

	return (
		<>
			{isLoadingAgreement && (
				<Container>
					<Space h={120} />
					<Center>
						<Loader color="blue" variant="oval" />
					</Center>
				</Container>
			)}
			{!isLoadingAgreement && !agreement?.name && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>Sorry, that community does not exist!</Text>
					</Center>
				</Container>
			)}

			{!isLoadingAgreement && agreement?.name && (
				<>
					<div className={meemTheme.pageHeader}>
						<div className={meemTheme.spacedRowCentered}>
							<Image
								width={80}
								height={80}
								radius={8}
								className={meemTheme.imageAgreementLogo}
								src={agreement.image}
							/>
							{/* <Text className={classes.headerAgreementName}>{agreementName}</Text> */}
							<div className={meemTheme.pageHeaderTitleContainer}>
								<Text className={meemTheme.tLargeBold}>
									{agreement.name}
								</Text>
								<Space h={8} />
								<div className={meemTheme.row}>
									<Text
										className={meemTheme.tExtraSmallFaded}
									>{`${window.location.origin}/${agreement.slug}`}</Text>
									<Image
										className={meemTheme.copyIcon}
										src="/copy.png"
										height={20}
										onClick={() => {
											navigator.clipboard.writeText(
												`${window.location.origin}/${agreement.slug}`
											)
											showNotification({
												radius: 'lg',
												title: 'Community URL copied',
												autoClose: 2000,
												color: colorGreen,
												icon: <Check />,

												message: `This community's URL was copied to your clipboard.`
											})
										}}
										width={20}
									/>
								</div>
							</div>
						</div>
						<a
							className={meemTheme.pageHeaderExitButton}
							onClick={navigateToAgreementDetail}
						>
							<Image src="/delete.png" width={24} height={24} />
						</a>
					</div>

					{!agreement?.isCurrentUserAgreementAdmin && (
						<Container>
							<Space h={120} />
							<Center>
								<Text>
									Sorry, you do not have permission to view
									this page. Contact the community owner or
									administrators for help.
								</Text>
							</Center>
						</Container>
					)}
					{agreement?.isCurrentUserAgreementAdmin && (
						<div className={meemTheme.pagePanelLayoutContainer}>
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
								className={meemTheme.pagePanelLayoutNavBar}
								width={{ base: 288 }}
								height={400}
								hidden={!mobileNavBarVisible}
								hiddenBreakpoint={'sm'}
								withBorder={false}
								p="xs"
							>
								<Text
									className={meemTheme.tExtraSmallLabel}
									style={{ marginLeft: 20, marginBottom: 8 }}
								>
									MANAGE AGREEMENT
								</Text>
								<NavLink
									className={meemTheme.pagePanelLayoutNavItem}
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
									agreement
								) && (
									<div>
										<NavLink
											className={
												meemTheme.pagePanelLayoutNavItem
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
												meemTheme.pagePanelLayoutNavItem
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

								{userHasPermissionManageRoles(agreement) && (
									<>
										<NavLink
											className={
												meemTheme.pagePanelLayoutNavItem
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

								{/* {agreement.isCurrentUserAgreementOwner && (
									<NavLink
										className={meemTheme.pagePanelLayoutNavItem}
										active={currentTab === Tab.DeleteAgreement}
										label={'Delete Agreement'}
										onClick={() => {
											setCurrentTab(Tab.DeleteAgreement)
											setMobileNavBarVisible(false)
										}}
									/>
								)} */}

								{userHasPermissionManageApps(agreement) && (
									<>
										<NavLink
											className={
												meemTheme.pagePanelLayoutNavItem
											}
											active={
												currentTab === Tab.Extensions
											}
											label={'Extensions'}
											onClick={() => {
												setCurrentTab(Tab.Extensions)
												setMobileNavBarVisible(false)
											}}
										/>
									</>
								)}

								<NavLink
									className={meemTheme.pagePanelLayoutNavItem}
									active={currentTab === Tab.Airdrops}
									label={'Airdrops'}
									onClick={() => {
										setCurrentTab(Tab.Airdrops)
										setMobileNavBarVisible(false)
									}}
								/>

								{userHasPermissionEditProfile(agreement) && (
									<div>
										<Space h={32} />
										<Text
											style={{
												marginLeft: 20,
												marginBottom: 8
											}}
											className={
												meemTheme.tExtraSmallLabel
											}
										>
											EDIT PROFILE
										</Text>
										<NavLink
											className={
												meemTheme.pagePanelLayoutNavItem
											}
											active={
												currentTab ===
												Tab.AgreementDetails
											}
											label={'Community Details'}
											onClick={() => {
												setCurrentTab(
													Tab.AgreementDetails
												)
												setMobileNavBarVisible(false)
											}}
										/>
										<NavLink
											className={
												meemTheme.pagePanelLayoutNavItem
											}
											active={
												currentTab === Tab.AgreementIcon
											}
											label={'Community Icon'}
											onClick={() => {
												setCurrentTab(Tab.AgreementIcon)
												setMobileNavBarVisible(false)
											}}
										/>
									</div>
								)}
							</Navbar>
							{!mobileNavBarVisible && (
								<div
									className={meemTheme.pagePanelLayoutContent}
								>
									{currentTab === Tab.ContractManagement && (
										<AdminContractManagement
											agreement={agreement}
										/>
									)}
									{currentTab === Tab.MembershipSettings &&
										userHasPermissionManageMembershipSettings(
											agreement
										) && (
											<AdminMembershipSettings
												agreement={agreement}
											/>
										)}
									{currentTab ===
										Tab.MembershipRequirements &&
										userHasPermissionManageMembershipSettings(
											agreement
										) && (
											<AdminMembershipRequirements
												agreement={agreement}
											/>
										)}
									{currentTab === Tab.AgreementDetails &&
										userHasPermissionEditProfile(
											agreement
										) && (
											<AdminAgreementDetails
												agreement={agreement}
											/>
										)}
									{currentTab === Tab.AgreementIcon &&
										userHasPermissionEditProfile(
											agreement
										) && (
											<AdminAgreementIcon
												agreement={agreement}
											/>
										)}
									{currentTab === Tab.Extensions &&
										userHasPermissionManageApps(
											agreement
										) && (
											<AdminAgreementExtensions
												agreement={agreement}
											/>
										)}

									{currentTab === Tab.Airdrops && (
										<AdminBulkMint agreement={agreement} />
									)}
									{currentTab === Tab.Roles &&
										userHasPermissionManageRoles(
											agreement
										) && (
											<AdminRoles agreement={agreement} />
										)}
									{/* {currentTab === Tab.DeleteAgreement &&
										agreement.isCurrentUserAgreementAdmin && (
											<CADeleteAgreement agreement={agreement} />
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
