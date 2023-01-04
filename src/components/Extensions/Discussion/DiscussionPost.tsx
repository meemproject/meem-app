/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-named-as-default */
import log from '@kengoldfarb/log'
import {
	Center,
	Space,
	Text,
	Image,
	Badge,
	useMantineColorScheme,
	Container,
	Divider,
	Button,
	Loader
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { RichTextEditor } from '@mantine/tiptap'
import { LoginState, useAuth, useSDK } from '@meemproject/react'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { DateTime } from 'luxon'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import {
	Check,
	ChevronDown,
	ChevronUp,
	Message,
	Share
} from 'tabler-icons-react'
import { extensionFromSlug } from '../../../model/agreement/agreements'
import { DiscussionComment } from '../../../model/agreement/extensions/discussion/discussionComment'
import { DiscussionPost } from '../../../model/agreement/extensions/discussion/discussionPost'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import {
	colorBlack,
	colorDarkerGrey,
	colorGreen,
	colorLightestGrey,
	useMeemTheme
} from '../../Styles/MeemTheme'
import { ExtensionBlankSlate, extensionIsReady } from '../ExtensionBlankSlate'
import { ExtensionPageHeader } from '../ExtensionPageHeader'
import { DiscussionCommentComponent } from './DiscussionComment'
import { rowToDiscussionComment, rowToDiscussionPost } from './DiscussionHome'
import { useDiscussions } from './DiscussionProvider'
interface IProps {
	postId: string
}

export interface IReactions {
	posts: {
		[postId: string]: {
			counts: { [reaction: string]: number }
			walletAddresses: {
				[walletAddress: string]: boolean
			}
		}
	}
	comments: {
		[commentId: string]: {
			counts: {
				[reaction: string]: number
			}
			walletAddresses: {
				[walletAddress: string]: boolean
			}
		}
	}

	[tableName: string]: {
		[refId: string]: {
			counts: {
				[reaction: string]: number
			}
			walletAddresses: {
				[walletAddress: string]: boolean
			}
		}
	}
}

export const DiscussionPostComponent: React.FC<IProps> = ({ postId }) => {
	const { classes: meemTheme } = useMeemTheme()
	const [hasFetchedPost, setHasFetchedPost] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [isSubmittingReaction, setIsSubmittingReaction] = useState(false)
	const [post, setPost] = useState<DiscussionPost>()
	const [comments, setComments] = useState<DiscussionComment[]>()
	const [reactions, setReactions] = useState<IReactions>({
		posts: {},
		comments: {}
	})
	const [commentCount, setCommentCount] = useState(0)
	const { accounts, chainId, me, loginState } = useAuth()
	const { sdk } = useSDK()
	const { agreement, error, isLoadingAgreement } = useAgreement()
	const router = useRouter()
	const { publicKey, privateKey } = useDiscussions()

	const { colorScheme } = useMantineColorScheme()
	const isDarkTheme = colorScheme === 'dark'

	const content = ''

	const editor = useEditor({
		extensions: [
			StarterKit,
			Underline,
			Link,
			Superscript,
			Subscript,
			Highlight,
			TextAlign.configure({ types: ['heading', 'paragraph'] })
		],
		content
	})

	const agreementExtension = extensionFromSlug('discussions', agreement)

	const handleReactionSubmit = useCallback(
		async (options: {
			e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
			reaction: string
		}) => {
			const { e, reaction } = options
			e.preventDefault()
			try {
				if (!postId) {
					log.crit('No postId found')
					return
				}
				if (!chainId) {
					log.crit('No chainId found')
					return
				}
				if (!agreement) {
					log.crit('No agreement found')
					return
				}
				if (!publicKey) {
					log.crit('No publicKey found')
					return
				}
				setIsLoading(true)

				const createdAt = Math.floor(new Date().getTime() / 1000)
				const gun = sdk.storage.getGunInstance()

				const { item } = await sdk.storage.encryptAndWrite({
					chainId,
					path: `meem/${agreement.id}/extensions/discussion/posts/${postId}/reactions`,
					publicKey,
					writeColumns: {
						createdAt
					},
					data: {
						reaction,
						userId: me?.user.id,
						walletAddress: me?.address
					},
					accessControlConditions: [
						{
							contractAddress: agreement.address
						}
					]
				})

				gun.get(
					`meem/${agreement.id}/extensions/discussion/posts/${postId}`
				)
					.get('reactions')
					.set(item)
			} catch (err) {
				log.crit(err)
			}
			setIsLoading(false)
		},
		[agreement, sdk, chainId, me, postId, publicKey]
	)

	const handleCommentSubmit = useCallback(async () => {
		try {
			if (!postId) {
				log.crit('No postId found')
				return
			}
			if (!chainId) {
				log.crit('No chainId found')
				return
			}
			if (!agreement) {
				log.crit('No agreement found')
				return
			}
			if (!publicKey) {
				log.crit('No publicKey found')
				return
			}
			setIsLoading(true)

			const createdAt = Math.floor(new Date().getTime() / 1000)
			const gun = sdk.storage.getGunInstance()

			const { item } = await sdk.storage.encryptAndWrite({
				chainId,
				path: `meem/${agreement.id}/extensions/discussion/posts/${postId}/comments`,
				writeColumns: {
					createdAt
				},
				publicKey,
				data: {
					body: editor?.getHTML(),
					walletAddress: accounts[0],
					userId: me?.user.id,
					displayName: me?.user.displayName,
					profilePicUrl: me?.user.profilePicUrl,
					ens: me?.user.DefaultWallet.ens,
					agreementSlug: agreement?.slug
				},
				accessControlConditions: [
					{
						contractAddress: agreement.address
					}
				]
			})

			console.log('encrypt item', item)

			gun.get(
				`meem/${agreement.id}/extensions/discussion/posts/${postId}`
			)
				.get('comments')
				.set(item)

			editor?.commands.clearContent()

			showNotification({
				radius: 'lg',
				title: 'Comment Submitted!',
				autoClose: 5000,
				color: colorGreen,
				icon: <Check color="green" />,
				message:
					'Your comment has been submitted. Reloading comments...'
			})
		} catch (e) {
			log.crit(e)
		}
		setIsLoading(false)
	}, [chainId, editor, agreement, sdk, accounts, me, postId, publicKey])

	useEffect(() => {
		if (!sdk.id.hasInitialized || !chainId || !privateKey) {
			return
		}

		const path = `meem/${agreement?.id}/extensions/discussion/posts/${postId}`

		const handlePostData = (items: any) => {
			let builtItem: Record<string, any> = {}
			Object.keys(items).forEach(k => {
				console.log('items', { items })
				const item = items[k]
				if (/^#/.test(k)) {
					// setPost(rowToDiscussionPost({ row: item, agreement }))
					builtItem = { ...builtItem, ...item }
				} else {
					builtItem = {
						[k]: item,
						...builtItem
					}
				}
			})
			console.log('builtItem', { builtItem })
			setPost(rowToDiscussionPost({ row: builtItem, agreement }))
			setHasFetchedPost(true)
		}

		sdk.storage.on({
			chainId,
			privateKey,
			path,
			cb: handlePostData
		})

		// const handleCommentsData = (items: any) => {
		// 	console.log('handleCommentsData')
		// 	const newComments: DiscussionComment[] = []
		// 	Object.keys(items).forEach(k => {
		// 		const item = items[k]
		// 		newComments.push(
		// 			rowToDiscussionComment({ row: item, agreement })
		// 		)
		// 	})

		// 	newComments.sort((a, b) => {
		// 		return b.createdAt - a.createdAt
		// 	})

		// 	setComments(newComments)
		// }

		// const commentsPath = `meem/${agreement?.id}/extensions/discussion/posts/${postId}/comments`
		// sdk.storage.on({
		// 	chainId,
		// 	privateKey,
		// 	path: commentsPath,
		// 	cb: handleCommentsData
		// })

		// const handleReactionsData = (items: any) => {
		// 	console.log('REACTIONS', items)
		// 	// setReactions
		// }

		// const reactionsPath = `meem/${agreement?.id}/extensions/discussion/posts/${postId}/reactions`
		// sdk.storage.on({
		// 	chainId,
		// 	privateKey,
		// 	path: reactionsPath,
		// 	cb: handleReactionsData
		// })

		// return () => {
		// 	sdk.storage.off(path, handlePostData)
		// 	sdk.storage.off(commentsPath, handleCommentsData)
		// 	sdk.storage.off(reactionsPath, handleReactionsData)
		// }
	}, [
		hasFetchedPost,
		agreement,
		chainId,
		sdk,
		postId,
		loginState,
		agreementExtension,
		privateKey
	])

	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		if (
	// 			hasFetchedPost ||
	// 			!chainId ||
	// 			loginState !== LoginState.LoggedIn ||
	// 			!sdk.id.hasInitialized
	// 		) {
	// 			return
	// 		}
	// 		const authSig = await sdk.id.getLitAuthSig()

	// 		const newPost: DiscussionPost = rowToDiscussionPost({
	// 			row: rows[0],
	// 			agreement
	// 		})

	// 		setPost(newPost)
	// 		setHasFetchedPost(true)
	// 	}

	// 	fetchData()
	// }, [
	// 	hasFetchedPost,
	// 	agreement,
	// 	chainId,
	// 	sdk,
	// 	postId,
	// 	loginState,
	// 	agreementExtension
	// ])

	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		if (
	// 			hasFetchedComments ||
	// 			!post ||
	// 			!chainId ||
	// 			loginState !== LoginState.LoggedIn ||
	// 			!sdk.id.hasInitialized
	// 		) {
	// 			return
	// 		}

	// 		const authSig = await sdk.id.getLitAuthSig()

	// 		// Fetch Comments
	// 		if (
	// 			agreementExtension &&
	// 			agreementExtension.metadata?.storage?.tableland?.comments
	// 		) {
	// 			const commentsTableName =
	// 				agreementExtension.metadata?.storage?.tableland?.comments
	// 					.tablelandTableName

	// 			const [count, rows] = await Promise.all([
	// 				sdk.storage.count({
	// 					chainId,
	// 					tableName: commentsTableName,
	// 					where: {
	// 						refId: post.id
	// 					}
	// 				}),
	// 				sdk.storage.read({
	// 					chainId,
	// 					tableName: commentsTableName,
	// 					authSig,
	// 					where: {
	// 						refId: post.id
	// 					}
	// 				})
	// 			])

	// 			const newComments: DiscussionComment[] = rows.map(row =>
	// 				rowToDiscussionComment({
	// 					row,
	// 					agreement
	// 				})
	// 			)

	// 			setComments(newComments ?? [])

	// 			setCommentCount(count)
	// 		}

	// 		setHasFetchedComments(true)
	// 	}

	// 	fetchData()
	// }, [
	// 	hasFetchedComments,
	// 	agreement,
	// 	chainId,
	// 	sdk,
	// 	post,
	// 	loginState,
	// 	agreementExtension
	// ])

	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		if (
	// 			hasFetchedReactions ||
	// 			!post ||
	// 			!comments ||
	// 			!chainId ||
	// 			loginState !== LoginState.LoggedIn ||
	// 			!sdk.id.hasInitialized
	// 		) {
	// 			return
	// 		}

	// 		const authSig = await sdk.id.getLitAuthSig()

	// 		const refIds = [post.id, ...comments.map(c => c.id)]

	// 		// Fetch Reactions
	// 		if (
	// 			agreementExtension &&
	// 			agreementExtension.metadata?.storage?.tableland?.reactions
	// 		) {
	// 			const reactionsTableName =
	// 				agreementExtension.metadata?.storage?.tableland?.reactions
	// 					.tablelandTableName

	// 			const rows = await sdk.storage.read({
	// 				chainId,
	// 				tableName: reactionsTableName,
	// 				authSig,
	// 				where: {
	// 					refId: refIds
	// 				}
	// 			})

	// 			const newReactions: IReactions = { posts: {}, comments: {} }
	// 			rows.forEach(row => {
	// 				if (row.data?.reaction) {
	// 					const table = row.refTable as string
	// 					if (newReactions[table]) {
	// 						if (!newReactions[table][row.refId]) {
	// 							newReactions[table][row.refId] = {
	// 								counts: {},
	// 								walletAddresses: {}
	// 							}
	// 						}

	// 						// Ignore additional reactions from a wallet
	// 						if (
	// 							newReactions[table][row.refId].walletAddresses[
	// 								row.data.walletAddress
	// 							]
	// 						) {
	// 							return
	// 						}

	// 						if (
	// 							!newReactions[table][row.refId].counts[
	// 								row.data.reaction
	// 							]
	// 						) {
	// 							newReactions[table][row.refId].counts[
	// 								row.data.reaction
	// 							] = 1
	// 						} else {
	// 							newReactions[table][row.refId].counts[
	// 								row.data.reaction
	// 							]++
	// 						}

	// 						newReactions[table][row.refId].walletAddresses[
	// 							row.data.walletAddress
	// 						] = true
	// 					}
	// 				}
	// 			})

	// 			setReactions(newReactions)
	// 		}

	// 		setHasFetchedReactions(true)
	// 	}

	// 	fetchData()
	// }, [
	// 	hasFetchedReactions,
	// 	agreement,
	// 	chainId,
	// 	sdk,
	// 	post,
	// 	comments,
	// 	loginState,
	// 	agreementExtension
	// ])

	const upVotes =
		(post &&
			reactions.posts[post.id] &&
			reactions.posts[post.id].counts.upvote) ??
		0
	const downVotes =
		(post &&
			reactions.posts[post.id] &&
			reactions.posts[post.id].counts.downvote) ??
		0
	const votes = upVotes - downVotes

	console.log({ post, comments: post?.comments })

	return (
		<div>
			<ExtensionBlankSlate extensionSlug={'discussions'} />
			{extensionIsReady(
				isLoadingAgreement,
				agreement,
				agreementExtension
			) && (
				<div>
					{!hasFetchedPost && (
						<>
							<Space h={48} />
							<Center>
								<Loader color="blue" variant="oval" />
							</Center>
						</>
					)}
					{hasFetchedPost && post && (
						<>
							<ExtensionPageHeader
								extensionSlug={'discussions'}
								isSubPage={true}
							/>
							<Container>
								<Space h={8} />
								<div className={meemTheme.row}>
									<div>
										<Center>
											<a
												style={{ cursor: 'pointer' }}
												onClick={e =>
													handleReactionSubmit({
														e,
														reaction: 'upvote'
													})
												}
											>
												<ChevronUp />
											</a>
										</Center>

										<Space h={16} />
										<Center>{votes ?? 0}</Center>
										<Space h={16} />
										<Center>
											<a
												style={{ cursor: 'pointer' }}
												onClick={e =>
													handleReactionSubmit({
														e,
														reaction: 'downvote'
													})
												}
											>
												<ChevronDown />
											</a>
										</Center>
									</div>
									<Space w={16} />
									<div style={{ width: '100%' }}>
										<div className={meemTheme.row}>
											<Space w={16} />
											{post?.attachment && (
												<>
													<Image
														src={post?.attachment}
														height={80}
														width={80}
														radius={4}
													/>
													<Space w={16} />
												</>
											)}
											<div>
												<div
													className={
														meemTheme.centeredRow
													}
												>
													<Image
														src={
															post?.profilePicUrl ??
															`/meem-icon.png`
														}
														height={32}
														width={32}
														radius={16}
													/>
													<Space w={8} />
													<div>
														<Text
															className={
																meemTheme.tExtraSmallBold
															}
														>
															{post?.displayName ??
																post?.walletAddress}
														</Text>
														<Text
															className={
																meemTheme.tExtraExtraSmall
															}
														>
															{post?.createdAt
																? DateTime.fromSeconds(
																		post.createdAt
																  ).toRelative()
																: ''}
														</Text>
													</div>
												</div>
												<Space h={24} />

												<Text
													className={
														meemTheme.tMediumBold
													}
												>
													{post?.title}
												</Text>
												{post.tags && (
													<>
														{post.tags.map(tag => (
															<>
																{tag.length >
																	0 && (
																	<Badge
																		style={{
																			marginRight: 4
																		}}
																		key={
																			tag
																		}
																		size={
																			'xs'
																		}
																		gradient={{
																			from: isDarkTheme
																				? colorDarkerGrey
																				: '#DCDCDC',
																			to: isDarkTheme
																				? colorDarkerGrey
																				: '#DCDCDC',
																			deg: 35
																		}}
																		classNames={{
																			inner: meemTheme.tBadgeTextSmall
																		}}
																		variant={
																			'gradient'
																		}
																	>
																		{tag}
																	</Badge>
																)}
															</>
														))}
													</>
												)}
												<Space h={16} />
												<Text
													className={meemTheme.tSmall}
													dangerouslySetInnerHTML={{
														// TODO: Sanitize html. Possible XSS vulnerability
														__html: post?.body ?? ''
													}}
												/>

												<div
													className={
														meemTheme.centeredRow
													}
												>
													<div
														className={
															meemTheme.row
														}
														style={{
															marginTop: 16
														}}
													>
														<div
															className={
																meemTheme.centeredRow
															}
														>
															<Message
																width={20}
																height={20}
															/>
															<Space w={4} />
															<Text
																className={
																	meemTheme.tExtraSmall
																}
															>
																{`${commentCount} ${
																	commentCount ===
																	1
																		? 'Comment'
																		: 'Comments'
																}
												`}
															</Text>
														</div>
														<Space w={16} />
														<div
															className={
																meemTheme.centeredRow
															}
															style={{
																cursor: 'pointer'
															}}
														>
															<Share
																width={20}
																height={20}
															/>
															<Space w={4} />
															<Text
																className={
																	meemTheme.tExtraSmall
																}
															>
																Share
															</Text>
														</div>
														<Space w={16} />
													</div>
												</div>
											</div>
										</div>

										<Space h={20} />
									</div>
								</div>
							</Container>
						</>
					)}
					<Space h={24} />
					<Divider
						size={8}
						color={isDarkTheme ? colorBlack : colorLightestGrey}
					/>
					<Space h={48} />

					<Container>
						{editor && (
							<div className={meemTheme.fRichTextEditorContainer}>
								<RichTextEditor
									editor={editor}
									classNames={{
										toolbar:
											meemTheme.fRichTextEditorToolbar,
										root: meemTheme.fRichTextEditorToolbar
									}}
								>
									<RichTextEditor.Toolbar>
										<RichTextEditor.ControlsGroup>
											<RichTextEditor.Bold />
											<RichTextEditor.Italic />
											<RichTextEditor.Underline />
											<RichTextEditor.Strikethrough />
											<RichTextEditor.ClearFormatting />
											<RichTextEditor.BulletList />
											<RichTextEditor.OrderedList />
										</RichTextEditor.ControlsGroup>
									</RichTextEditor.Toolbar>
									<Divider />
									<RichTextEditor.Content />
								</RichTextEditor>
								<Space h={16} />
								<div className={meemTheme.rowEndAlign}>
									<Button
										className={meemTheme.buttonBlack}
										style={{
											marginBottom: 16,
											marginRight: 16
										}}
										loading={isLoading}
										disabled={isLoading}
										onClick={handleCommentSubmit}
									>
										Comment
									</Button>
								</div>
							</div>
						)}
						<Space h={24} />
						{post?.comments &&
							Object.values(post.comments).map(comment => (
								<DiscussionCommentComponent
									key={comment.id}
									// comment={comment}
									comment={rowToDiscussionComment({
										row: comment,
										agreement
									})}
									reactions={reactions}
									agreementExtension={agreementExtension}
								/>
							))}
					</Container>
				</div>
			)}
		</div>
	)
}
