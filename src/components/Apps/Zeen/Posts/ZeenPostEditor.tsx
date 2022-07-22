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
import { useFilePicker } from 'use-file-picker'
import { GetClubQuery } from '../../../../../generated/graphql'
import { GET_CLUB } from '../../../../graphql/clubs'
import postFromApi, {
	emptyPost,
	Post
} from '../../../../model/apps/zeen/post/post'
import zeenFromApi, { Zeen } from '../../../../model/apps/zeen/zeen'
import { getClubSlug, getZeenSlug } from '../../../../utils/slugs'

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

interface IProps {
	postSlug?: string
}

export const ZeenPostEditor: React.FC<IProps> = ({ postSlug }) => {
	// General properties / tab management
	const { classes } = useStyles()
	const router = useRouter()
	const wallet = useWallet()

	const [hasGotMockPost, setHasGotMockPost] = useState(false)

	const navigateToZeenDetail = () => {
		router.push({ pathname: `/${getClubSlug()}/zeen/${getZeenSlug()}` })
	}

	const {
		loading,
		error,
		data: postData
	} = useQuery<GetClubQuery>(GET_CLUB, {
		variables: { postSlug }
	})

	const [isLoadingPost, setIsLoadingPost] = useState(true)
	const [post, setPost] = useState<Post>()

	const [postTitle, setPostTitle] = useState(``)
	const [postRecap, setPostRecap] = useState('')
	const [postBody, setPostBody] = useState('')
	const [postCoverPhoto, setPostCoverPhoto] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		if (
			// Note: walletContext thinks logged in = LoginState.unknown, using cookies here
			Cookies.get('meemJwtToken') === undefined ||
			Cookies.get('walletAddress') === undefined
		) {
			router.push({
				pathname: '/authenticate',
				query: {
					return: `/${getClubSlug()}/zeen/${getZeenSlug()}/admin`
				}
			})
		}
	}, [router])

	useEffect(() => {
		async function getMockPost() {
			const possiblePost = await postFromApi(wallet)

			if (possiblePost && possiblePost.title) {
				setPost(possiblePost)
			}
			setIsLoadingPost(false)
		}

		async function getPost(data: GetClubQuery) {
			const possiblePost = await postFromApi(wallet)

			if (possiblePost && possiblePost.title) {
				setPost(possiblePost)
			}
			setIsLoadingPost(false)
		}

		if (postSlug) {
			// If we have a post slug, there's existing data to populate.
			if (!loading && !error && !post && postData) {
				getPost(postData)
			}
		} else {
			// No post slug, set an empty post and finish loading instantly.
			if (!post) {
				setPost(emptyPost())
				setIsLoadingPost(false)
			}
		}

		// TODO: Remove mockzeen when we have data
		// if (!hasGotMockPost) {
		// 	setHasGotMockPost(true)
		// 	getMockPost()
		// }
	}, [
		post,
		postData,
		error,
		loading,
		wallet,
		wallet.accounts,
		wallet.isConnected,
		hasGotMockPost,
		postSlug
	])

	// Post cover photo picker
	const [
		openFileSelector,
		{ filesContent: zeenLogo, loading: isLoadingImage }
	] = useFilePicker({
		readAs: 'DataURL',
		accept: 'image/*',
		limitFilesConfig: { max: 1 },
		multiple: false,
		maxFileSize: 10
	})

	const deleteImage = () => {
		setPostCoverPhoto('')
	}

	const createPost = async () => {
		if (!wallet.web3Provider || !wallet.isConnected) {
			await wallet.connectWallet()
			router.reload()
			return
		}

		// Some basic validation
		if (!postTitle || postTitle.length < 3 || postTitle.length > 50) {
			// Club name invalid
			showNotification({
				title: 'Oops!',
				message:
					'You entered an invalid club name. Please choose a longer or shorter name.'
			})
			return
		}

		if (postRecap.length < 3 || postRecap.length > 140) {
			// Club name invalid
			showNotification({
				title: 'Oops!',
				message:
					'You entered an invalid club description. Please choose a longer or shorter description.'
			})
			return
		}

		// TODO: create or edit post
		// TODO: We will need post slug (from api?)
		setIsLoading(true)
		router.push({
			pathname: `/${getClubSlug()}/zeen/${getZeenSlug()}/hello-world`
		})
	}

	return (
		<>
			{isLoadingPost && (
				<Container>
					<Space h={120} />
					<Center>
						<Loader />
					</Center>
				</Container>
			)}
			{!isLoadingPost && !post?.title && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>Sorry, that post does not exist!</Text>
					</Center>
				</Container>
			)}

			{!isLoadingPost && post?.title && (
				<>
					<div className={classes.header}>
						<div className={classes.headerTitle}>
							<a onClick={navigateToZeenDetail}>
								<ArrowLeft
									className={classes.headerArrow}
									size={32}
								/>
							</a>

							{/* <Text className={classes.headerClubName}>{clubName}</Text> */}
							<div className={classes.headerClubNameContainer}>
								<Text className={classes.headerClubName}>
									{post.title!}
								</Text>
								<div className={classes.clubUrlContainer}>
									<Text
										className={classes.clubUrl}
									>{`${window.location.origin}/${post.slug}`}</Text>
									<Image
										className={classes.copy}
										src="/copy.png"
										height={20}
										onClick={() => {
											navigator.clipboard.writeText(
												`${
													window.location.origin
												}/${getClubSlug()}/zeen/${
													post.slug
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

					{!post?.isContributor && (
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
				</>
			)}
		</>
	)
}
