/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/naming-convention */
import { useQuery } from '@apollo/client'
import log from '@kengoldfarb/log'
import {
	createStyles,
	Container,
	Text,
	Image,
	Space,
	Center,
	Loader,
	Divider
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useWallet } from '@meemproject/react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { ArrowLeft, Check } from 'tabler-icons-react'
import { GetClubQuery } from '../../../../../generated/graphql'
import { GET_CLUB } from '../../../../graphql/clubs'
import zeenFromApi, { Zeen } from '../../../../model/apps/zeen/zeen'
import { ZeenAdminAudienceSettings } from './ZeenAdminAudienceSettings'
import { ZeenAdminPostsSettings } from './ZeenAdminPostsSettings'
import { ZeenAdminProfileSettings } from './ZeenAdminProfileSettings'

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
	Posts,
	AudienceAndEditors,
	Settings
}

interface IProps {
	slug: string
}

export const ZeenAdminComponent: React.FC<IProps> = ({ slug }) => {
	// General properties / tab management
	const { classes } = useStyles()
	const router = useRouter()
	const wallet = useWallet()

	const [hasGotMockZeen, setHasGotMockZeen] = useState(false)
	const [currentTab, setCurrentTab] = useState<Tab>(Tab.Posts)

	const getClubSlug = (): string => {
		const fullUrl = window.location.href
		const split = fullUrl.split('/')
		return split[3]
	}
	const navigateToZeenDetail = () => {
		router.push({ pathname: `/${getClubSlug()}/zeen/${slug}` })
	}

	const switchToPosts = () => {
		setCurrentTab(Tab.Posts)
	}

	const switchToAudienceAndEditors = () => {
		setCurrentTab(Tab.AudienceAndEditors)
	}

	const switchToSettings = () => {
		setCurrentTab(Tab.Settings)
	}

	const {
		loading,
		error,
		data: zeenData
	} = useQuery<GetClubQuery>(GET_CLUB, {
		variables: { slug }
	})
	const [isLoadingZeen, setIsLoadingZeen] = useState(true)
	const [zeen, setZeen] = useState<Zeen>()

	useEffect(() => {
		getClubSlug()
		if (
			// Note: walletContext thinks logged in = LoginState.unknown, using cookies here
			Cookies.get('meemJwtToken') === undefined ||
			Cookies.get('walletAddress') === undefined
		) {
			router.push({
				pathname: '/authenticate',
				query: {
					return: `/${slug}/admin`
				}
			})
		}
	}, [router, slug])

	useEffect(() => {
		async function getMockZeen() {
			const possibleZeen = await zeenFromApi(wallet, getClubSlug())

			if (possibleZeen && possibleZeen.name) {
				setZeen(possibleZeen)
			}
			setIsLoadingZeen(false)
		}

		async function getZeen(data: GetClubQuery) {
			const possibleZeen = await zeenFromApi(wallet, getClubSlug())

			if (possibleZeen && possibleZeen.name) {
				setZeen(possibleZeen)
			}
			setIsLoadingZeen(false)
		}
		if (!loading && !error && !zeen && zeenData) {
			getZeen(zeenData)
		}

		// TODO: Remove mockzeen when we have data
		if (!hasGotMockZeen) {
			setHasGotMockZeen(true)
			getMockZeen()
		}
	}, [
		zeen,
		zeenData,
		error,
		loading,
		wallet,
		wallet.accounts,
		wallet.isConnected,
		hasGotMockZeen
	])

	return (
		<>
			{isLoadingZeen && (
				<Container>
					<Space h={120} />
					<Center>
						<Loader />
					</Center>
				</Container>
			)}
			{!isLoadingZeen && !zeen?.name && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>Sorry, that zeen does not exist!</Text>
					</Center>
				</Container>
			)}

			{!isLoadingZeen && zeen?.name && (
				<>
					<div className={classes.header}>
						<div className={classes.headerTitle}>
							<a onClick={navigateToZeenDetail}>
								<ArrowLeft
									className={classes.headerArrow}
									size={32}
								/>
							</a>
							<Image
								className={classes.clubLogoImage}
								src={zeen.image!}
							/>
							{/* <Text className={classes.headerClubName}>{clubName}</Text> */}
							<div className={classes.headerClubNameContainer}>
								<Text className={classes.headerClubName}>
									{zeen.name!}
								</Text>
								<div className={classes.clubUrlContainer}>
									<Text
										className={classes.clubUrl}
									>{`${window.location.origin}/${zeen.slug}`}</Text>
									<Image
										className={classes.copy}
										src="/copy.png"
										height={20}
										onClick={() => {
											navigator.clipboard.writeText(
												`${
													window.location.origin
												}/${getClubSlug()}/zeen/${
													zeen.slug
												}`
											)
											showNotification({
												title: 'Zeen URL copied',
												autoClose: 2000,
												color: 'green',
												icon: <Check />,

												message: `This zeen's URL was copied to your clipboard.`
											})
										}}
										width={20}
									/>
								</div>
							</div>
						</div>
					</div>

					{!zeen?.isZeenEditor && (
						<Container>
							<Space h={120} />
							<Center>
								<Text>
									Sorry, you do not have permission to view
									this page. Contact a zeen editor for help.
								</Text>
							</Center>
						</Container>
					)}
					{zeen?.isZeenEditor && (
						<Container>
							<div className={classes.tabs}>
								<a onClick={switchToPosts}>
									<Text
										className={
											currentTab == Tab.Posts
												? classes.activeTab
												: classes.inactiveTab
										}
									>
										Posts
									</Text>
								</a>
								<a onClick={switchToAudienceAndEditors}>
									<Text
										className={
											currentTab == Tab.AudienceAndEditors
												? classes.activeTab
												: classes.inactiveTab
										}
									>
										Audience & Editors
									</Text>
								</a>
								<a onClick={switchToSettings}>
									<Text
										className={
											currentTab == Tab.Settings
												? classes.activeTab
												: classes.inactiveTab
										}
									>
										Settings
									</Text>
								</a>
							</div>
							<div
								className={
									currentTab === Tab.Posts
										? classes.visibleTab
										: classes.invisibleTab
								}
							>
								<ZeenAdminPostsSettings zeen={zeen} />
							</div>

							<div
								className={
									currentTab === Tab.AudienceAndEditors
										? classes.visibleTab
										: classes.invisibleTab
								}
							>
								<ZeenAdminAudienceSettings zeen={zeen} />
							</div>

							<div
								className={
									currentTab === Tab.Settings
										? classes.visibleTab
										: classes.invisibleTab
								}
							>
								{' '}
								<ZeenAdminProfileSettings zeen={zeen} />
							</div>
						</Container>
					)}
				</>
			)}
		</>
	)
}
