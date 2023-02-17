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
import { useWallet } from '@meemproject/react'
import { ArrowLeft, Copy, DeleteCircle, Plus } from 'iconoir-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import {
	Agreement,
	AgreementRole,
	emptyRole
} from '../../model/agreement/agreements'
import { showSuccessNotification } from '../../utils/notifications'
import { useAgreement } from '../AgreementHome/AgreementProvider'
import { colorBlue, useMeemTheme } from '../Styles/MeemTheme'
import { RolesManagerContent } from './Role/RolesManagerContent'
interface Tab {
	name: string
	associatedRole?: AgreementRole
}

export const RolesManager: React.FC = () => {
	// General properties / tab management
	const { classes: meemTheme } = useMeemTheme()
	const router = useRouter()
	const wallet = useWallet()

	const { agreement, isLoadingAgreement, error } = useAgreement()

	const [tabs, setTabs] = useState<Tab[]>([])
	const [currentTab, setCurrentTab] = useState<Tab>()
	const [isAddingNewRole, setIsAddingNewRole] = useState(false)
	const [mobileNavBarVisible, setMobileNavBarVisible] = useState(false)

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
		function setupTabs(theAgreement: Agreement) {
			const newTabs: Tab[] = []
			if (theAgreement && theAgreement.roles) {
				theAgreement.roles.forEach(role => {
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
				setIsAddingNewRole(true)
			}

			setCurrentTab(displayedTab)

			setTabs(newTabs)
		}

		if (!isLoadingAgreement && !error && agreement) {
			setupTabs(agreement)
		}
	}, [
		agreement,
		error,
		isLoadingAgreement,
		router.query.createRole,
		router.query.role,
		wallet
	])

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
								<div
									className={meemTheme.pageHeaderImage}
									style={{ cursor: 'pointer' }}
								>
									<Link
										href={`/${agreement.slug}`}
										legacyBehavior
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
									</Link>
								</div>
							)}
							<div className={meemTheme.pageHeaderTitleContainer}>
								<Text className={meemTheme.tLargeBold}>
									{agreement.name}
								</Text>
								<div
									className={meemTheme.row}
									style={{
										marginTop: 8
									}}
								>
									<Text
										className={meemTheme.tExtraSmallFaded}
										style={{
											maxWidth: 220,
											textOverflow: 'ellipsis',
											msTextOverflow: 'ellipsis',
											whiteSpace: 'nowrap',
											overflow: 'hidden'
										}}
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
						<Link href={`/${agreement?.slug}/`} legacyBehavior>
							<DeleteCircle
								className={meemTheme.pageHeaderExitButton}
								width={24}
								height={24}
							/>
						</Link>
					</div>

					{!isLoadingAgreement &&
						!agreement?.isCurrentUserAgreementAdmin && (
							<Container>
								<Space h={120} />
								<Center>
									<Text>
										Sorry, you do not have permission to
										view this page. Contact the community
										owner for help.
									</Text>
								</Center>
							</Container>
						)}
					{!isLoadingAgreement &&
						agreement?.isCurrentUserAgreementAdmin && (
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
									style={{ zIndex: 0 }}
									hidden={!mobileNavBarVisible}
									hiddenBreakpoint={'sm'}
									withBorder={false}
									p="xs"
								>
									<div
										className={meemTheme.centeredRow}
										style={{
											marginLeft: 18,
											marginBottom: 24
										}}
									>
										<Link
											href={`/${agreement?.slug}/admin?tab=roles`}
											legacyBehavior
										>
											<div>
												<ArrowLeft
													className={
														meemTheme.clickable
													}
												/>
											</div>
										</Link>

										<Space w={8} />
										<Text className={meemTheme.tLargeBold}>
											Manage Roles
										</Text>
									</div>
									<div
										className={meemTheme.spacedRowCentered}
										style={{ marginLeft: 20 }}
									>
										<Text
											className={
												meemTheme.tExtraSmallLabel
											}
											style={{
												marginLeft: 10
											}}
										>
											ROLES
										</Text>
										<Plus
											className={meemTheme.clickable}
											onClick={() => {
												if (!isAddingNewRole) addRole()
											}}
										/>
									</div>
									<Space h={8} />

									{tabs.map(tab => (
										<NavLink
											key={tab.associatedRole?.id}
											style={{ marginLeft: 8 }}
											className={
												meemTheme.pagePanelLayoutNavItem
											}
											active={
												currentTab &&
												currentTab.associatedRole
													?.id ===
													tab.associatedRole?.id
											}
											label={tab.name}
											onClick={() => {
												setCurrentTab(tab)
												if (tab.associatedRole) {
													router.push(
														`/${
															agreement.slug
														}/roles?role=${
															tab.associatedRole
																?.id ?? ''
														}`,
														undefined,
														{ shallow: true }
													)
												}
												setMobileNavBarVisible(false)
											}}
										/>
									))}
								</Navbar>
								{!mobileNavBarVisible && (
									<div
										className={
											meemTheme.pagePanelLayoutContent
										}
									>
										{tabs.map(tab => (
											<div key={tab.associatedRole?.id}>
												<div
													className={
														currentTab &&
														currentTab
															.associatedRole
															?.id ===
															tab.associatedRole
																?.id
															? meemTheme.visibleContainer
															: meemTheme.invisibleContainer
													}
												>
													<RolesManagerContent
														agreement={agreement}
														initialRole={
															tab.associatedRole
														}
														onRoleUpdated={newRole => {
															tabs.forEach(
																theTab => {
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
																}
															)
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
