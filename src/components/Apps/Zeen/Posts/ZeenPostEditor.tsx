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
	Divider,
	TextInput,
	Textarea,
	Button
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useWallet } from '@meemproject/react'
import Cookies from 'js-cookie'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { ArrowLeft, Check, Upload } from 'tabler-icons-react'
import { useFilePicker } from 'use-file-picker'
import { GetClubQuery } from '../../../../../generated/graphql'
import { GET_CLUB } from '../../../../graphql/clubs'
import postFromApi, {
	emptyPost,
	Post
} from '../../../../model/apps/zeen/post/post'
import zeenFromApi, { Zeen } from '../../../../model/apps/zeen/zeen'
import { getClubSlug, getZeenSlug } from '../../../../utils/slugs'
import RichTextEditor from './RichTextEditor'

/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

const useStyles = createStyles(theme => ({
	header: {
		backgroundColor: 'rgba(160, 160, 160, 0.05)',
		marginBottom: 60,
		display: 'flex',
		alignItems: 'end',
		flexDirection: 'row',
		paddingTop: 24,
		paddingBottom: 24,
		paddingLeft: 32,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			paddingTop: 12,
			paddingBottom: 12,
			paddingLeft: 16
		}
	},
	headerArrow: {
		marginRight: 32,
		cursor: 'pointer',
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			marginRight: 16
		}
	},
	headerPrompt: {
		fontSize: 16,
		fontWeight: 500,
		color: 'rgba(0, 0, 0, 0.6)',
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			marginBottom: 0
		}
	},
	headerClubName: {
		fontWeight: 600,
		fontSize: 24,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 20
		}
	},
	namespaceTextInputContainer: {
		position: 'relative'
	},
	namespaceTextInput: {
		paddingLeft: 154,
		paddingBottom: 3
	},
	namespaceTextInputUrlPrefix: {
		position: 'absolute',
		top: 8,
		left: 24,
		color: 'rgba(0, 0, 0, 0.5)'
	},
	clubNamespaceHint: {
		paddingLeft: 0,
		paddingBottom: 16,
		color: 'rgba(0, 0, 0, 0.5)'
	},
	formPrompt: { fontSize: 18, marginBottom: 0, fontWeight: 600 },
	clubLogoPrompt: {
		marginTop: 32,
		fontSize: 18,
		marginBottom: 8,
		fontWeight: 600
	},
	clubLogoInfo: {
		fontWeight: 500,
		fontSize: 14,
		maxWidth: 650,
		color: 'rgba(45, 28, 28, 0.6)',
		marginBottom: 16
	},
	buttonUpload: {
		borderRadius: 24,
		color: 'black',
		borderColor: 'black',
		backgroundColor: 'white',
		'&:hover': {
			backgroundColor: theme.colors.gray[0]
		}
	},
	buttonCreate: {
		marginTop: 48,
		marginBottom: 48,

		backgroundColor: 'black',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 24
	},
	postCoverPhotoImage: {
		imageRendering: 'pixelated'
	},
	postCoverPhotoImageContainer: {
		marginTop: 24,
		width: 108,
		height: 100,
		position: 'relative'
	},
	postCoverPhotoDeleteButton: {
		position: 'absolute',
		top: '-12px',
		right: '-105px',
		cursor: 'pointer'
	},
	uploadOptions: { display: 'flex' },
	emojiCanvas: {
		position: 'absolute',
		top: 40,
		left: 0,
		marginTop: -12,
		marginBottom: -12,
		lineHeight: 1,
		fontSize: 24,
		zIndex: -1000
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

	const navigateToZeenAdmin = () => {
		router.push({
			pathname: `/${getClubSlug()}/zeen/${getZeenSlug()}/admin`
		})
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

	const [zeenName, setZeenName] = useState('')
	const [postTitle, setPostTitle] = useState('')
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
			{!isLoadingPost && !post && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>Sorry, that post does not exist!</Text>
					</Center>
				</Container>
			)}

			{!isLoadingPost && post && (
				<>
					{post.isContributor && (
						<>
							<div className={classes.header}>
								<a onClick={navigateToZeenAdmin}>
									<ArrowLeft
										className={classes.headerArrow}
										size={32}
									/>
								</a>
								<div>
									<>
										<Text className={classes.headerPrompt}>
											Create new post
										</Text>
										{postTitle.length === 0 && (
											<Text
												className={
													classes.headerClubName
												}
											>
												{'Untitled'}
											</Text>
										)}
									</>
									<Text className={classes.headerClubName}>
										{postTitle}
									</Text>
								</div>
							</div>

							<Container>
								<Text className={classes.formPrompt}>
									{`What’s your post called?`}
								</Text>
								<Space h={8} />

								<TextInput
									radius="lg"
									size="md"
									value={postTitle}
									maxLength={30}
									onChange={event =>
										setPostTitle(event.currentTarget.value)
									}
								/>
								<Space h={32} />

								<Text className={classes.formPrompt}>
									Give a one-sentence recap of what your post
									is about.
								</Text>
								<Space h={8} />

								<Textarea
									radius="lg"
									size="md"
									autosize
									minRows={2}
									maxRows={4}
									maxLength={140}
									onChange={event =>
										setPostBody(event.currentTarget.value)
									}
								/>

								<Space h={32} />

								<Text className={classes.formPrompt}>
									Give a one-sentence recap of what your post
									is about.
								</Text>
								<Space h={8} />

								<RichTextEditor
									value={postBody}
									onChange={event => setPostBody(event)}
								/>

								<Text className={classes.clubLogoPrompt}>
									{`Set a cover image for your post. (Optional)`}
								</Text>
								<Text className={classes.clubLogoInfo}>
									Recommended size is 500px x 1500px. Please
									upload either JPG or PNG files.
								</Text>
								{postCoverPhoto.length === 0 &&
									!isLoadingImage && (
										<div className={classes.uploadOptions}>
											<Button
												leftIcon={<Upload size={14} />}
												className={classes.buttonUpload}
												onClick={() =>
													openFileSelector()
												}
											>
												Upload
											</Button>
										</div>
									)}
								{isLoadingImage && <Loader />}
								{!isLoadingImage && postCoverPhoto.length > 0 && (
									<div
										className={
											classes.postCoverPhotoImageContainer
										}
									>
										<Image
											className={
												classes.postCoverPhotoImage
											}
											src={postCoverPhoto}
											width={400}
											height={200}
											fit={'contain'}
										/>
										<a onClick={deleteImage}>
											<Image
												className={
													classes.postCoverPhotoDeleteButton
												}
												src="/delete.png"
												width={24}
												height={24}
											/>
										</a>
									</div>
								)}
							</Container>

							<Button
								onClick={() => {
									createPost()
								}}
								loading={isLoading}
								disabled={
									postTitle.length === 0 ||
									postRecap.length === 0 ||
									postBody.length === 0 ||
									postCoverPhoto.length === 0 ||
									isLoading
								}
								className={classes.buttonCreate}
							>
								Launch zeen
							</Button>
						</>
					)}

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
