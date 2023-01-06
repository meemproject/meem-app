/* eslint-disable import/no-named-as-default */
import log from '@kengoldfarb/log'
import {
	Space,
	Text,
	Image,
	useMantineColorScheme,
	Divider,
	Button,
	Tooltip
} from '@mantine/core'
import { RichTextEditor } from '@mantine/tiptap'
import { useAuth, useSDK, useWallet } from '@meemproject/react'
import { normalizeImageUrl } from '@meemproject/sdk'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { DateTime } from 'luxon'
import React, { useCallback, useEffect, useState } from 'react'
import { ChevronUp } from 'tabler-icons-react'
import { DiscussionComment } from '../../../model/agreement/extensions/discussion/discussionComment'
import { showSuccessNotification } from '../../../utils/notifications'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import {
	colorBlue,
	colorDarkGrey,
	colorLightGrey,
	useMeemTheme
} from '../../Styles/MeemTheme'
import { calculateVotes } from './DiscussionHome'
import { useDiscussions } from './DiscussionProvider'
interface IProps {
	comment?: DiscussionComment
	onReaction?: () => void
	path: string
}

export const DiscussionCommentComponent: React.FC<IProps> = ({
	comment,
	onReaction,
	path
}) => {
	const { classes: meemTheme } = useMeemTheme()
	const { sdk } = useSDK()
	const { me } = useAuth()
	const { agreement } = useAgreement()
	const { privateKey } = useDiscussions()
	const [votes, setVotes] = useState(0)
	const [canReact, setCanReact] = useState(false)
	const { accounts } = useWallet()

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

	const [isLoading, setIsLoading] = useState(false)
	const [isReplying, setIsReplying] = useState(false)
	const [isCommentRepliesHidden, setIsCommentRepliesHidden] = useState(false)

	const handleReactionSubmit = useCallback(
		async (options: { reaction: string }) => {
			const { reaction } = options
			try {
				if (!agreement) {
					log.crit('No agreement found')
					return
				}
				if (!comment) {
					log.crit('No comment found')
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
					path: `${path}/comments/${comment.id}/reactions`,
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

				gun.get(`${path}/comments/${comment.id}`)
					// @ts-ignore
					.get('reactions')
					// @ts-ignore
					.set(item)

				if (onReaction) {
					onReaction()
				}
			} catch (err) {
				log.crit(err)
			}
			setIsLoading(false)
		},
		[sdk, me, agreement, onReaction, privateKey, path, comment]
	)

	const handleCommentSubmit = useCallback(async () => {
		try {
			if (!path) {
				log.crit('No path found')
				return
			}
			if (!agreement) {
				log.crit('No agreement found')
				return
			}
			if (!comment) {
				log.crit('No comment found')
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
				path: `${path}/comments/${comment.id}/comments`,
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

			// @ts-ignore
			gun.get(`${path}/comments/${comment.id}`).get('comments').set(item)

			editor?.commands.clearContent()

			showSuccessNotification(
				'Comment Submitted!',
				'Your comment has been submitted.'
			)
		} catch (e) {
			log.crit(e)
		}
		setIsLoading(false)
	}, [editor, agreement, sdk, accounts, me, path, privateKey, comment])

	useEffect(() => {
		const { votes: v, userVotes } = calculateVotes(comment)
		setVotes(v)

		if (me && userVotes[me.user.id]) {
			setCanReact(false)
		} else {
			setCanReact(true)
		}
	}, [comment, me])

	if (!comment) {
		return null
	}

	return (
		<div>
			<div className={meemTheme.centeredRow}>
				<Image
					src={
						comment.profilePicUrl
							? normalizeImageUrl(comment.profilePicUrl)
							: `/meem-icon.png`
					}
					height={32}
					width={32}
					radius={16}
				/>
				<Space w={8} />
				<div>
					<Text className={meemTheme.tExtraSmallBold}>
						{comment.displayName ?? comment.walletAddress}
					</Text>
					<Text className={meemTheme.tExtraExtraSmall}>
						{comment.createdAt &&
							DateTime.fromSeconds(
								comment.createdAt
							).toRelative()}
					</Text>
				</div>
			</div>
			<div className={meemTheme.row}>
				<div
					onClick={() => {
						setIsCommentRepliesHidden(!isCommentRepliesHidden)
					}}
					style={{
						cursor: 'pointer',
						marginLeft: 14,
						marginTop: 4,
						width: '4px',
						backgroundColor: isDarkTheme
							? colorDarkGrey
							: colorLightGrey
					}}
				/>
				<Space w={16} />
				<div style={{ width: '100%' }}>
					<Space h={16} />

					<Text
						className={meemTheme.tExtraSmall}
						dangerouslySetInnerHTML={{
							__html: comment.body
						}}
					/>
					<Space h={16} />
					<div className={meemTheme.centeredRow}>
						<Tooltip
							label="You have already reacted to this post."
							disabled={canReact}
						>
							<span>
								<Button
									variant="subtle"
									style={{ cursor: 'pointer' }}
									disabled={isLoading || !canReact}
									loading={isLoading}
									onClick={() =>
										handleReactionSubmit({
											reaction: 'upvote'
										})
									}
								>
									<ChevronUp />
								</Button>
							</span>
						</Tooltip>
						<Space w={4} />

						<Text
							className={meemTheme.tExtraExtraSmall}
							style={{ fontWeight: '700' }}
						>
							{votes}
						</Text>
						<Space w={20} />
						<Image
							src={
								isDarkTheme ? '/reply-white.png' : '/reply.png'
							}
							width={16}
							height={16}
						/>
						<Space w={8} />

						<Text
							className={meemTheme.tExtraExtraSmall}
							style={{ cursor: 'pointer' }}
							onClick={() => {
								setIsReplying(!isReplying)
							}}
						>
							Reply
						</Text>
					</div>
					{isReplying && editor && (
						<>
							<Space h={16} />
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
										onClick={handleCommentSubmit}
										loading={isLoading}
										disabled={isLoading}
									>
										Reply
									</Button>
								</div>
							</div>
						</>
					)}
					<Space h={16} />

					{comment.comments && !isCommentRepliesHidden && (
						<>
							{comment.comments?.map(reply => (
								<>
									<DiscussionCommentComponent
										key={reply.id}
										comment={reply}
										path={`${path}/comments/${comment.id}`}
									/>
									<Space h={16} />
								</>
							))}
						</>
					)}
					{comment.comments && isCommentRepliesHidden && (
						<Text
							onClick={() => {
								setIsCommentRepliesHidden(
									!isCommentRepliesHidden
								)
							}}
							className={meemTheme.tExtraSmall}
							style={{ color: colorBlue, cursor: 'pointer' }}
						>{`${comment.comments?.length} replies hidden`}</Text>
					)}
				</div>
			</div>
		</div>
	)
}
