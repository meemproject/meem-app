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

export const DiscussionPostComponent: React.FC<IProps> = ({ postId }) => {
	const { classes: clubsTheme } = useClubsTheme()
	const [hasFetchdData, setHasFetchedData] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [post, setPost] = useState<DiscussionPost>()
	const [comments, setComments] = useState<DiscussionComment[]>()
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

			const agreementExtension = club?.rawClub?.AgreementExtensions.find(
				ae => ae.Extension?.slug === 'discussion'
			)

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
			setHasFetchedData(false)
		} catch (e) {
			log.crit(e)
		}
		setIsLoading(false)
	}, [chainId, router, editor, club, sdk, accounts, me])

	useEffect(() => {
		const fetchData = async () => {
			if (
				hasFetchdData ||
				!chainId ||
				loginState !== LoginState.LoggedIn ||
				!sdk.id.hasInitialized
			) {
				return
			}

			const agreementExtension = club?.rawClub?.AgreementExtensions.find(
				ae => ae.Extension?.slug === 'discussion'
			)

			const authSig = await sdk.id.getLitAuthSig()

			// Fetch Post
			if (
				agreementExtension &&
				agreementExtension.metadata?.storage?.tableland?.posts &&
				agreementExtension.metadata?.storage?.tableland?.comments
			) {
				const tableName =
					agreementExtension.metadata?.storage?.tableland?.posts
						.tablelandTableName
				const commentsTableName =
					agreementExtension.metadata?.storage?.tableland?.comments
						.tablelandTableName

				const [rows, count] = await Promise.all([
					sdk.storage.read({
						chainId,
						tableName,
						authSig,
						where: {
							id: router.query.postId
						}
					}),
					sdk.storage.count({
						chainId,
						tableName: commentsTableName,
						where: {
							refId: router.query.postId
						}
					})
				])

				setCommentCount(count)

				const newPost: DiscussionPost = rowToDiscussionPost({
					row: rows[0],
					club
				})

				setPost(newPost)
			}

			if (
				agreementExtension &&
				agreementExtension.metadata?.storage?.tableland?.comments
			) {
				const tableName =
					agreementExtension.metadata?.storage?.tableland?.comments
						.tablelandTableName

				const rows = await sdk.storage.read({
					chainId,
					tableName,
					authSig,
					where: {
						refId: router.query.postId
					}
				})

				const newComments: DiscussionComment[] = rows.map(row =>
					rowToDiscussionComment({
						row,
						club
					})
				)

				setComments(newComments)
			}

			setHasFetchedData(true)
		}

		fetchData()
	}, [hasFetchdData, club, chainId, sdk, router.query.postId, loginState])

	return (
		<div>
			<Space h={48} />
			{!hasFetchdData && (
				<Center>
					<Loader color="red" variant="oval" />
				</Center>
			)}
			{hasFetchdData && (
				<Container>
					<div className={clubsTheme.row}>
						<div>
							<Center>
								<ChevronUp />
							</Center>

							<Space h={16} />
							<Center>{post?.votes ?? 0}</Center>
							<Space h={16} />
							<Center>
								<ChevronDown />
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
						/>
					))}
			</Container>
		</div>
	)
}
