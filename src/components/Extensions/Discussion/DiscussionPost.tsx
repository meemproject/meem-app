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
	Loader,
	Tooltip
} from '@mantine/core'
import { RichTextEditor } from '@mantine/tiptap'
import { useAuth, useSDK } from '@meemproject/react'
import { normalizeImageUrl } from '@meemproject/sdk'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Message, NavArrowDown, NavArrowUp, ShareIos } from 'iconoir-react'
import { DateTime } from 'luxon'
import React, { useCallback, useEffect, useState } from 'react'
import { extensionFromSlug } from '../../../model/agreement/agreements'
import { DiscussionComment } from '../../../model/agreement/extensions/discussion/discussionComment'
import { DiscussionPost } from '../../../model/agreement/extensions/discussion/discussionPost'
import { showSuccessNotification } from '../../../utils/notifications'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import {
	colorBlack,
	colorDarkerGrey,
	colorLightestGrey,
	useMeemTheme
} from '../../Styles/MeemTheme'
import { ExtensionBlankSlate, extensionIsReady } from '../ExtensionBlankSlate'
import { ExtensionPageHeader } from '../ExtensionPageHeader'
import { DiscussionCommentComponent } from './DiscussionComment'
import { calculateVotes, rowToDiscussionPost } from './DiscussionHome'
import { useDiscussions } from './DiscussionProvider'

export interface IProps {
	postId: string
}

export const DiscussionPostComponent: React.FC<IProps> = ({ postId }) => {
	const { classes: meemTheme } = useMeemTheme()
	const [hasFetchedPost, setHasFetchedPost] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [canReact, setCanReact] = useState(false)
	const [post, setPost] = useState<DiscussionPost>()
	const [votes, setVotes] = useState(0)
	const [commentCount, setCommentCount] = useState(0)
	const { accounts, chainId, me, loginState } = useAuth()
	const { sdk } = useSDK()
	const { agreement, isLoadingAgreement } = useAgreement()
	const { privateKey } = useDiscussions()

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
		async (options: { reaction: string }) => {
			const { reaction } = options

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
				if (!privateKey) {
					log.crit('No privateKey found')
					return
				}
				setIsLoading(true)

				const createdAt = Math.floor(new Date().getTime() / 1000)
				const gun = sdk.storage.getGunInstance()

				const { item } = await sdk.storage.encryptAndWrite({
					path: `meem/${agreement.id}/extensions/discussion/posts/${postId}/reactions`,
					key: privateKey,
					writeColumns: {
						createdAt
					},
					data: {
						reaction,
						userId: me?.user.id,
						walletAddress: me?.address
					}
				})

				gun?.get(
					`meem/${agreement.id}/extensions/discussion/posts/${postId}`
				)
					// @ts-ignore
					.get('reactions')
					// @ts-ignore
					.set(item)
			} catch (err) {
				log.crit(err)
			}
			setIsLoading(false)
		},
		[agreement, sdk, chainId, me, postId, privateKey]
	)

	const handleCommentSubmit = useCallback(async () => {
		try {
			if (!postId) {
				log.crit('No postId found')
				return
			}
			if (!agreement) {
				log.crit('No agreement found')
				return
			}
			if (!privateKey) {
				log.crit('No privateKey found')
				return
			}
			setIsLoading(true)

			const createdAt = Math.floor(new Date().getTime() / 1000)
			const gun = sdk.storage.getGunInstance()

			const { item } = await sdk.storage.encryptAndWrite({
				path: `meem/${agreement.id}/extensions/discussion/posts/${postId}/comments`,
				writeColumns: {
					createdAt
				},
				key: privateKey,
				data: {
					body: editor?.getHTML(),
					walletAddress: accounts[0],
					userId: me?.user.id,
					displayName: me?.user.displayName,
					profilePicUrl: me?.user.profilePicUrl,
					ens: me?.user.DefaultWallet.ens,
					agreementSlug: agreement?.slug
				}
			})

			gun?.get(
				`meem/${agreement.id}/extensions/discussion/posts/${postId}`
			)
				// @ts-ignore
				.get('comments')
				// @ts-ignore
				.set(item)

			editor?.commands.clearContent()

			showSuccessNotification(
				'Comment Submitted!',
				'Your comment has been submitted.'
			)
		} catch (e) {
			log.crit(e)
		}
		setIsLoading(false)
	}, [editor, agreement, sdk, accounts, me, postId, privateKey])

	useEffect(() => {
		if (!sdk.id.hasInitialized || !chainId || !privateKey) {
			return
		}

		const path = `meem/${agreement?.id}/extensions/discussion/posts/${postId}`

		const handlePostData = (items: any) => {
			let builtItem: Record<string, any> = {}
			Object.keys(items).forEach(k => {
				const item = items[k]
				if (/^#/.test(k)) {
					builtItem = { ...builtItem, ...item }
				} else {
					builtItem = {
						[k]: item,
						...builtItem
					}
				}
			})

			setPost(rowToDiscussionPost({ row: builtItem, agreement }))
			setHasFetchedPost(true)
		}

		sdk.storage.on({
			chainId,
			privateKey,
			path,
			cb: handlePostData
		})
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

	useEffect(() => {
		function countComments(comments: DiscussionComment[]): number {
			let count = 0

			comments.forEach(comment => {
				count = count + 1
				if (comment.comments && comment.comments.length > 0) {
					const childComments = countComments(comment.comments)
					count = count + childComments
				}
			})

			return count
		}
		const { votes: v, userVotes } = calculateVotes(post)
		setVotes(v)

		if (me && userVotes[me.user.id]) {
			setCanReact(false)
		} else {
			setCanReact(true)
		}

		if (post && post.comments) {
			setCommentCount(countComments(post.comments ?? []))
		}
	}, [post, me])

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
								<Loader color="cyan" variant="oval" />
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
											<Tooltip
												label="You have already reacted to this post."
												disabled={canReact}
											>
												<span>
													<NavArrowUp
														style={{
															cursor: 'pointer'
														}}
														onClick={() => {
															if (
																canReact &&
																!isLoading
															) {
																handleReactionSubmit(
																	{
																		reaction:
																			'upvote'
																	}
																)
															}
														}}
													></NavArrowUp>
												</span>
											</Tooltip>
										</Center>

										<Space h={16} />
										<Center>{votes ?? 0}</Center>
										<Space h={16} />
										<Center>
											<Tooltip
												label="You have already reacted to this post."
												disabled={canReact}
											>
												<span>
													<NavArrowDown
														style={{
															cursor: 'pointer'
														}}
														onClick={() => {
															if (
																canReact &&
																!isLoading
															) {
																handleReactionSubmit(
																	{
																		reaction:
																			'downvote'
																	}
																)
															}
														}}
													/>
												</span>
											</Tooltip>
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
															post?.profilePicUrl
																? normalizeImageUrl(
																		post.profilePicUrl
																  )
																: `/meem-icon.png`
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
												<Space h={16} />

												<Text
													className={
														meemTheme.tMediumBold
													}
												>
													{post?.title}
												</Text>
												<Space h={4} />
												{post.tags &&
													post.tags.map(tag => {
														return (
															<Badge
																style={{
																	marginRight: 4
																}}
																key={`post-tag-${post.id}-${tag}`}
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
																	inner: meemTheme.tBadgeTextSmall
																}}
																variant={
																	'gradient'
																}
															>
																{tag.length > 0
																	? tag
																	: 'UNTAGGED'}
															</Badge>
														)
														return null
													})}
												<Space h={8} />
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
															marginTop: 4
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
															<ShareIos
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
										root: meemTheme.fRichTextEditorToolbar,
										content:
											meemTheme.fRichTextEditorContent
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
									key={`comment-${comment.id}`}
									comment={comment}
									path={`meem/${agreement?.id}/extensions/discussion/posts/${postId}`}
								/>
							))}
					</Container>
				</div>
			)}
		</div>
	)
}
