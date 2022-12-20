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
import { DiscussionComment } from '../../../model/club/extensions/discussion/discussionComment'
import { DiscussionPost } from '../../../model/club/extensions/discussion/discussionPost'
import { useClub } from '../../ClubHome/ClubProvider'
import {
	colorBlack,
	colorDarkerGrey,
	colorGreen,
	colorLightestGrey,
	useClubsTheme
} from '../../Styles/ClubsTheme'
import { DiscussionCommentComponent } from './DiscussionComment'
import { rowToDiscussionComment, rowToDiscussionPost } from './DiscussionHome'
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
	const { classes: clubsTheme } = useClubsTheme()
	const [hasFetchedPost, setHasFetchedPost] = useState(false)
	const [hasFetchedComments, setHasFetchedComments] = useState(false)
	const [hasFetchedReactions, setHasFetchedReactions] = useState(false)
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
	const { club } = useClub()
	const router = useRouter()

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

	const agreementExtension = club?.rawClub?.AgreementExtensions.find(
		ae => ae.Extension?.slug === 'discussion'
	)

	const handleReactionSubmit = useCallback(
		async (options: {
			e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
			reaction: string
		}) => {
			const { e, reaction } = options
			e.preventDefault()
			try {
				if (!router.query.postId) {
					log.crit('No postId found')
					return
				}
				if (!chainId) {
					log.crit('No chainId found')
					return
				}
				if (!club) {
					log.crit('No club found')
					return
				}
				setIsLoading(true)

				const authSig = await sdk.id.getLitAuthSig()

				const tableName =
					agreementExtension?.metadata?.storage?.tableland?.reactions
						.tablelandTableName

				await sdk.storage.encryptAndWrite({
					chainId,
					tableName,
					authSig,
					writeColumns: {
						refId: post?.id,
						refTable: 'posts'
					},
					data: {
						reaction,
						userId: me?.user.id,
						walletAddress: me?.address
					},
					accessControlConditions: [
						{
							contractAddress: club.address
						}
					]
				})

				// Re-fetch
				setHasFetchedReactions(false)
			} catch (err) {
				log.crit(err)
			}
			setIsLoading(false)
		},
		[club, sdk, router, chainId, me, agreementExtension, post]
	)

	const handleCommentSubmit = useCallback(async () => {
		try {
			if (!router.query.postId) {
				log.crit('No postId found')
				return
			}
			if (!chainId) {
				log.crit('No chainId found')
				return
			}
			if (!club) {
				log.crit('No club found')
				return
			}
			setIsLoading(true)

			const authSig = await sdk.id.getLitAuthSig()

			const tableName =
				agreementExtension?.metadata?.storage?.tableland?.comments
					.tablelandTableName

			await sdk.storage.encryptAndWrite({
				chainId,
				tableName,
				authSig,
				writeColumns: {
					refId: router.query.postId
				},
				data: {
					body: editor?.getHTML(),
					walletAddress: accounts[0],
					userId: me?.user.id,
					displayName: me?.user.displayName,
					profilePicUrl: me?.user.profilePicUrl,
					ens: me?.user.DefaultWallet.ens,
					clubSlug: club?.slug
				},
				accessControlConditions: [
					{
						contractAddress: club.address
					}
				]
			})

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

			// Re-fetch
			setHasFetchedComments(false)
		} catch (e) {
			log.crit(e)
		}
		setIsLoading(false)
	}, [chainId, router, editor, club, sdk, accounts, me, agreementExtension])

	useEffect(() => {
		const fetchData = async () => {
			if (
				hasFetchedPost ||
				!chainId ||
				loginState !== LoginState.LoggedIn ||
				!sdk.id.hasInitialized
			) {
				return
			}
			const authSig = await sdk.id.getLitAuthSig()

			// Fetch Post
			if (
				agreementExtension &&
				agreementExtension.metadata?.storage?.tableland?.posts
			) {
				const tableName =
					agreementExtension.metadata?.storage?.tableland?.posts
						.tablelandTableName

				const rows = await sdk.storage.read({
					chainId,
					tableName,
					authSig,
					where: {
						id: router.query.postId
					}
				})

				const newPost: DiscussionPost = rowToDiscussionPost({
					row: rows[0],
					club
				})

				setPost(newPost)
			}
			setHasFetchedPost(true)
		}

		fetchData()
	}, [
		hasFetchedPost,
		club,
		chainId,
		sdk,
		router.query.postId,
		loginState,
		agreementExtension
	])

	useEffect(() => {
		const fetchData = async () => {
			if (
				hasFetchedComments ||
				!post ||
				!chainId ||
				loginState !== LoginState.LoggedIn ||
				!sdk.id.hasInitialized
			) {
				return
			}

			const authSig = await sdk.id.getLitAuthSig()

			// Fetch Comments
			if (
				agreementExtension &&
				agreementExtension.metadata?.storage?.tableland?.comments
			) {
				const commentsTableName =
					agreementExtension.metadata?.storage?.tableland?.comments
						.tablelandTableName

				const [count, rows] = await Promise.all([
					sdk.storage.count({
						chainId,
						tableName: commentsTableName,
						where: {
							refId: post.id
						}
					}),
					sdk.storage.read({
						chainId,
						tableName: commentsTableName,
						authSig,
						where: {
							refId: post.id
						}
					})
				])

				const newComments: DiscussionComment[] = rows.map(row =>
					rowToDiscussionComment({
						row,
						club
					})
				)

				setComments(newComments ?? [])

				setCommentCount(count)
			}

			setHasFetchedComments(true)
		}

		fetchData()
	}, [
		hasFetchedComments,
		club,
		chainId,
		sdk,
		post,
		loginState,
		agreementExtension
	])

	useEffect(() => {
		const fetchData = async () => {
			if (
				hasFetchedReactions ||
				!post ||
				!comments ||
				!chainId ||
				loginState !== LoginState.LoggedIn ||
				!sdk.id.hasInitialized
			) {
				return
			}

			const authSig = await sdk.id.getLitAuthSig()

			const refIds = [post.id, ...comments.map(c => c.id)]

			// Fetch Reactions
			if (
				agreementExtension &&
				agreementExtension.metadata?.storage?.tableland?.reactions
			) {
				const reactionsTableName =
					agreementExtension.metadata?.storage?.tableland?.reactions
						.tablelandTableName

				const rows = await sdk.storage.read({
					chainId,
					tableName: reactionsTableName,
					authSig,
					where: {
						refId: refIds
					}
				})

				const newReactions: IReactions = { posts: {}, comments: {} }
				rows.forEach(row => {
					if (row.data?.reaction) {
						const table = row.refTable as string
						if (newReactions[table]) {
							if (!newReactions[table][row.refId]) {
								newReactions[table][row.refId] = {
									counts: {},
									walletAddresses: {}
								}
							}

							// Ignore additional reactions from a wallet
							if (
								newReactions[table][row.refId].walletAddresses[
									row.data.walletAddress
								]
							) {
								return
							}

							if (
								!newReactions[table][row.refId].counts[
									row.data.reaction
								]
							) {
								newReactions[table][row.refId].counts[
									row.data.reaction
								] = 1
							} else {
								newReactions[table][row.refId].counts[
									row.data.reaction
								]++
							}

							newReactions[table][row.refId].walletAddresses[
								row.data.walletAddress
							] = true
						}
					}
				})

				setReactions(newReactions)
			}

			setHasFetchedComments(true)
		}

		fetchData()
	}, [
		hasFetchedReactions,
		club,
		chainId,
		sdk,
		post,
		comments,
		loginState,
		agreementExtension
	])

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

	return (
		<div>
			<Space h={48} />
			{!hasFetchedPost && (
				<Center>
					<Loader color="red" variant="oval" />
				</Center>
			)}
			{hasFetchedPost && post && (
				<Container>
					<div className={clubsTheme.row}>
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
							<div className={clubsTheme.row}>
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
									<div className={clubsTheme.centeredRow}>
										<Image
											src={
												post?.profilePicUrl ??
												`/exampleclub.png`
											}
											height={32}
											width={32}
											radius={16}
										/>
										<Space w={8} />
										<div>
											<Text
												className={
													clubsTheme.tExtraSmallBold
												}
											>
												{post?.displayName ??
													post?.walletAddress}
											</Text>
											<Text
												className={
													clubsTheme.tExtraExtraSmall
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

									<Text className={clubsTheme.tMediumBold}>
										{post?.title}
									</Text>
									{post?.tags && (
										<>
											<Space h={12} />

											{post?.tags.map(tag => (
												<Badge
													style={{ marginRight: 4 }}
													key={tag}
													size={'xs'}
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
														inner: clubsTheme.tBadgeTextSmall
													}}
													variant={'gradient'}
												>
													{tag}
												</Badge>
											))}
										</>
									)}
									<Space h={24} />
									<Text
										className={clubsTheme.tSmall}
										dangerouslySetInnerHTML={{
											// TODO: Sanitize html. Possible XSS vulnerability
											__html: post?.body ?? ''
										}}
									/>
									<Space h={16} />

									<div className={clubsTheme.centeredRow}>
										<div
											className={clubsTheme.row}
											style={{ marginTop: 16 }}
										>
											<div
												className={
													clubsTheme.centeredRow
												}
											>
												<Message
													width={20}
													height={20}
												/>
												<Space w={4} />
												<Text
													className={
														clubsTheme.tExtraSmall
													}
												>
													{`${commentCount} ${
														commentCount === 1
															? 'Comment'
															: 'Comments'
													}
												`}
												</Text>
											</div>
											<Space w={16} />
											<div
												className={
													clubsTheme.centeredRow
												}
												style={{ cursor: 'pointer' }}
											>
												<Share width={20} height={20} />
												<Space w={4} />
												<Text
													className={
														clubsTheme.tExtraSmall
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
			)}
			<Space h={24} />
			<Divider
				size={8}
				color={isDarkTheme ? colorBlack : colorLightestGrey}
			/>
			<Space h={48} />

			<Container>
				{editor && (
					<div className={clubsTheme.fRichTextEditorContainer}>
						<RichTextEditor
							editor={editor}
							classNames={{
								toolbar: clubsTheme.fRichTextEditorToolbar,
								root: clubsTheme.fRichTextEditorToolbar
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
						<div className={clubsTheme.rowEndAlign}>
							<Button
								className={clubsTheme.buttonBlack}
								style={{ marginBottom: 16, marginRight: 16 }}
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
				{comments &&
					comments.map(comment => (
						<DiscussionCommentComponent
							key={comment.id}
							comment={comment}
							reactions={reactions}
							agreementExtension={agreementExtension}
							onReaction={() => setHasFetchedReactions(false)}
						/>
					))}
			</Container>
		</div>
	)
}
