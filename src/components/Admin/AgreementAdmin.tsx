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
import { useWallet } from '@meemproject/react'
import { Copy, DeleteCircle } from 'iconoir-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { isJwtError } from '../../model/agreement/agreements'
import {
	userHasPermissionEditProfile,
	userHasPermissionManageApps,
	userHasPermissionManageMembershipSettings,
	userHasPermissionManageRoles
} from '../../model/identity/permissions'
import { showSuccessNotification } from '../../utils/notifications'
import { useAgreement } from '../AgreementHome/AgreementProvider'
import { colorBlue, useMeemTheme } from '../Styles/MeemTheme'
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
	Details,
	Icon,
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

	const [currentTab, setCurrentTab] = useState<Tab>(Tab.Extensions)
	const [mobileNavBarVisible, setMobileNavBarVisible] = useState(false)

	useEffect(() => {
		if (isJwtError(error)) {
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

			case 'details':
				setCurrentTab(Tab.Details)
				break
			case 'icon':
				setCurrentTab(Tab.Icon)
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
						<Loader color="cyan" variant="oval" />
					</Center>
				</Container>
			)}
			{!isLoadingAgreement && !agreement?.name && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>
							Sorry, either this community does not exist or you
							do not have permission to view this page.
						</Text>
					</Center>
				</Container>
			)}

			{!isLoadingAgreement && agreement?.name && (
				<>
					<div className={meemTheme.pageHeader}>
						<div className={meemTheme.spacedRowCentered}>
							{agreement.image && (
								<Link href={`/${agreement.slug}`}>
									<div
										className={meemTheme.pageHeaderImage}
										style={{ cursor: 'pointer' }}
									>
										<Image
											width={80}
											height={80}
											radius={8}
											className={
												meemTheme.imageAgreementLogo
											}
											src={agreement.image}
										/>
									</div>
								</Link>
							)}

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
									<Copy
										className={meemTheme.copyIcon}
										height={20}
										width={20}
										color={colorBlue}
										onClick={() => {
											navigator.clipboard.writeText(
												`${window.location.origin}/${agreement.slug}`
											)
											showSuccessNotification(
												'Community URL copied',
												`This community's URL was copied to your clipboard.`
											)
										}}
									/>
								</div>
							</div>
						</div>
						<Link href={`/${agreement.slug}`}>
							<DeleteCircle
								className={meemTheme.pageHeaderExitButton}
								width={24}
								height={24}
							/>
						</Link>
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
										router.push(
											`/${agreement.slug}/admin?tab=contractmanagement`,
											undefined,
											{ shallow: true }
										)
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
												router.push(
													`/${agreement.slug}/admin?tab=membershipsettings`,
													undefined,
													{ shallow: true }
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
												router.push(
													`/${agreement.slug}/admin?tab=membershiprequirements`,
													undefined,
													{ shallow: true }
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
												router.push(
													`/${agreement.slug}/admin?tab=roles`,
													undefined,
													{ shallow: true }
												)
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
												router.push(
													`/${agreement.slug}/admin?tab=extensions`,
													undefined,
													{ shallow: true }
												)
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
										router.push(
											`/${agreement.slug}/admin?tab=airdrops`,
											undefined,
											{ shallow: true }
										)
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
											active={currentTab === Tab.Details}
											label={'Community Details'}
											onClick={() => {
												setCurrentTab(Tab.Details)
												router.push(
													`/${agreement.slug}/admin?tab=details`,
													undefined,
													{ shallow: true }
												)
												setMobileNavBarVisible(false)
											}}
										/>
										<NavLink
											className={
												meemTheme.pagePanelLayoutNavItem
											}
											active={currentTab === Tab.Icon}
											label={'Community Icon'}
											onClick={() => {
												setCurrentTab(Tab.Icon)
												router.push(
													`/${agreement.slug}/admin?tab=icon`,
													undefined,
													{ shallow: true }
												)
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
									{currentTab === Tab.Details &&
										userHasPermissionEditProfile(
											agreement
										) && (
											<AdminAgreementDetails
												agreement={agreement}
											/>
										)}
									{currentTab === Tab.Icon &&
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
