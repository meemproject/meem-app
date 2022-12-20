/* eslint-disable import/no-named-as-default */
import log from '@kengoldfarb/log'
import {
	Space,
	Text,
	Image,
	useMantineColorScheme,
	Divider,
	Button
} from '@mantine/core'
import { RichTextEditor } from '@mantine/tiptap'
import { useAuth, useSDK } from '@meemproject/react'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { DateTime } from 'luxon'
import React, { useCallback, useState } from 'react'
import { ChevronUp } from 'tabler-icons-react'
import { AgreementExtensions } from '../../../../generated/graphql'
import { DiscussionComment } from '../../../model/club/extensions/discussion/discussionComment'
import { useClub } from '../../ClubHome/ClubProvider'
import {
	colorDarkGrey,
	colorLightGrey,
	// colorPink,
	useClubsTheme
} from '../../Styles/ClubsTheme'
import { IReactions } from './DiscussionPost'
interface IProps {
	comment: DiscussionComment
	reactions: IReactions
	onReaction: () => void
	agreementExtension: AgreementExtensions | undefined
}

export const DiscussionCommentComponent: React.FC<IProps> = ({
	comment,
	reactions,
	agreementExtension,
	onReaction
}) => {
	const { classes: clubsTheme } = useClubsTheme()
	const { sdk } = useSDK()
	const { chainId, me } = useAuth()
	const { club } = useClub()

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
		async (options: {
			e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
			reaction: string
		}) => {
			const { e, reaction } = options
			e.preventDefault()
			try {
				if (!chainId) {
					log.crit('No chainId found')
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
						refId: comment.id,
						refTable: 'comments'
					},
					data: {
						reaction,
						userId: me?.user.id,
						walletAddress: me?.address
					},
					accessControlConditions: [
						{
							contractAddress: club?.address
						}
					]
				})

				// Re-fetch
				onReaction()
			} catch (err) {
				log.crit(err)
			}
			setIsLoading(false)
		},
		[sdk, chainId, me, agreementExtension, club, onReaction, comment]
	)

	return (
		<div>
			<div className={clubsTheme.centeredRow}>
				<Image
					src={comment.profilePicUrl ?? `/exampleclub.png`}
					height={32}
					width={32}
					radius={16}
				/>
				<Space w={8} />
				<div>
					<Text className={clubsTheme.tExtraSmallBold}>
						{comment.displayName ?? comment.walletAddress}
					</Text>
					<Text className={clubsTheme.tExtraExtraSmall}>
						{DateTime.fromSeconds(comment.createdAt).toRelative()}
					</Text>
				</div>
			</div>
			<div className={clubsTheme.row}>
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
						className={clubsTheme.tExtraSmall}
						dangerouslySetInnerHTML={{
							__html: comment.body
						}}
					/>
					<Space h={16} />
					<div className={clubsTheme.centeredRow}>
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
						<Space w={4} />

						<Text
							className={clubsTheme.tExtraExtraSmall}
							style={{ fontWeight: '700' }}
						>
							{(reactions.comments[comment.id] &&
								reactions.comments[comment.id].counts.upvote) ??
								0}
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

						{/* <Text
							className={clubsTheme.tExtraExtraSmall}
							style={{ cursor: 'pointer' }}
							onClick={() => {
								setIsReplying(!isReplying)
							}}
						>
							Reply
						</Text> */}
					</div>
					{isReplying && editor && (
						<>
							<Space h={16} />
							<div
								className={clubsTheme.fRichTextEditorContainer}
							>
								<RichTextEditor
									editor={editor}
									classNames={{
										toolbar:
											clubsTheme.fRichTextEditorToolbar,
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
										style={{
											marginBottom: 16,
											marginRight: 16
										}}
									>
										Reply
									</Button>
								</div>
							</div>
						</>
					)}
					{/* <Space h={16} />

					{comment.replies && !isCommentRepliesHidden && (
						<>
							{comment.replies?.map(reply => (
								<>
									<DiscussionCommentComponent
										key={reply.id}
										comment={reply}
									/>
									<Space h={16} />
								</>
							))}
						</>
					)}
					{comment.replies && isCommentRepliesHidden && (
						<Text
							onClick={() => {
								setIsCommentRepliesHidden(
									!isCommentRepliesHidden
								)
							}}
							className={clubsTheme.tExtraSmall}
							style={{ color: colorPink, cursor: 'pointer' }}
						>{`${comment.replies?.length} replies hidden`}</Text>
					)} */}
				</div>
			</div>
		</div>
	)
}
