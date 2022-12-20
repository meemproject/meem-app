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
import {
	Agreement,
	AgreementRole,
	emptyRole
} from '../../model/agreement/agreements'
import { useAgreement } from '../AgreementHome/AgreementProvider'
import { useMeemTheme } from '../Styles/AgreementsTheme'
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

	const navigateToAgreementAdmin = () => {
		router.push({
			pathname: `/${agreement?.slug}/admin`,
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
						<Loader color="blue" variant="oval" />
					</Center>
				</Container>
			)}
			{!isLoadingAgreement && !agreement?.name && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>Sorry, that agreement does not exist!</Text>
					</Center>
				</Container>
			)}

			{!isLoadingAgreement && agreement?.name && (
				<>
					<div className={meemTheme.pageHeader}>
						<div className={meemTheme.spacedRowCentered}>
							<Image
								width={56}
								height={56}
								className={meemTheme.imageAgreementLogo}
								src={agreement.image}
							/>
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
												title: 'Agreement URL copied',
												autoClose: 2000,
												color: 'green',
												icon: <Check />,

												message: `This agreement's URL was copied to your clipboard.`
											})
										}}
										width={20}
									/>
								</div>
							</div>
						</div>
						<a
							className={meemTheme.pageHeaderExitButton}
							onClick={navigateToAgreementAdmin}
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
									this page. Contact the agreement owner for
									help.
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
								<div
									className={meemTheme.centeredRow}
									style={{ marginLeft: 18, marginBottom: 24 }}
								>
									<ArrowLeft
										className={meemTheme.clickable}
										onClick={() => {
											navigateToAgreementAdmin()
										}}
									/>
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
										className={meemTheme.tExtraSmallLabel}
										style={{
											marginLeft: 10
										}}
									>
										ROLES
									</Text>
									<Plus
										className={meemTheme.clickable}
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
											meemTheme.pagePanelLayoutNavItem
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
									className={meemTheme.pagePanelLayoutContent}
								>
									{tabs.map(tab => (
										<div key={tab.name}>
											<div
												className={
													currentTab &&
													currentTab.name === tab.name
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
