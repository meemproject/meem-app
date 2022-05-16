import { createStyles, Container, Text, Image, Button } from '@mantine/core'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Settings, ArrowLeft } from 'tabler-icons-react'
import { ClubAdminAdminsSettingsComponent } from './ClubAdminAdminsSettings'
import { ClubAdminDappSettingsComponent } from './ClubAdminDappsSettings'
import { ClubAdminMembershipSettingsComponent } from './ClubAdminMembershipSettings'
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

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
	headerClubName: {
		fontWeight: '600',
		fontSize: 24,
		marginLeft: 32,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 16,
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
	tabs: {
		display: 'flex',
		flexDirection: 'row'
	},

	activeTab: {
		fontSize: 18,
		marginBottom: 16,
		marginRight: 24,
		fontWeight: '600',
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

		fontWeight: '600',
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
	}
}))

enum Tab {
	Membership,
	Admins,
	Integrations
}

export const ClubAdminComponent: React.FC = () => {
	// General properties / tab management
	const { classes } = useStyles()
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(true)
	const [currentTab, setCurrentTab] = useState<Tab>(Tab.Membership)

	const navigateToClubDetail = () => {
		router.push({ pathname: '/club/clubname' })
	}

	const navigateToClubProfile = () => {
		router.push({ pathname: `/club/clubname/profile` })
	}

	const switchToMembership = () => {
		setCurrentTab(Tab.Membership)
	}

	const switchToClubAdmins = () => {
		setCurrentTab(Tab.Admins)
	}

	const switchToIntegrations = () => {
		setCurrentTab(Tab.Integrations)
	}

	return (
		<>
			<div className={classes.header}>
				<div className={classes.headerTitle}>
					<a onClick={navigateToClubDetail}>
						<ArrowLeft className={classes.headerArrow} size={32} />
					</a>
					<Image className={classes.clubLogoImage} src="/exampleclub.png" />
					{/* <Text className={classes.headerClubName}>{clubName}</Text> */}
					<Text className={classes.headerClubName}>
						Worst Club Ever That You Can Imagine
					</Text>
				</div>
				<Button
					onClick={navigateToClubProfile}
					leftIcon={<Settings className={classes.clubSettingsIcon} />}
					className={classes.buttonEditProfile}
				>
					Edit profile
				</Button>
			</div>

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
							Membership Settings
						</Text>
					</a>
					<a onClick={switchToClubAdmins}>
						<Text
							className={
								currentTab == Tab.Admins
									? classes.activeTab
									: classes.inactiveTab
							}
						>
							Club Admins
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
							dApps
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
					<ClubAdminMembershipSettingsComponent />
				</div>

				<div
					className={
						currentTab === Tab.Admins
							? classes.visibleTab
							: classes.invisibleTab
					}
				>
					<ClubAdminAdminsSettingsComponent />
				</div>

				<div
					className={
						currentTab === Tab.Integrations
							? classes.visibleTab
							: classes.invisibleTab
					}
				>
					{' '}
					<ClubAdminDappSettingsComponent />
				</div>
			</Container>
		</>
	)
}
