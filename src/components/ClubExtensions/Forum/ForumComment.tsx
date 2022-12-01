/* eslint-disable import/no-named-as-default */
import {
	Space,
	Text,
	Image,
	useMantineColorScheme,
	Divider,
	Button
} from '@mantine/core'
import { RichTextEditor } from '@mantine/tiptap'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useState } from 'react'
import { ChevronUp } from 'tabler-icons-react'
import { ForumComment } from '../../../model/club/forum/forumComment'
import {
	colorDarkGrey,
	colorLightGrey,
	colorPink,
	useClubsTheme
} from '../../Styles/ClubsTheme'
interface IProps {
	comment: ForumComment
}

export const ForumCommentComponent: React.FC<IProps> = ({ comment }) => {
	const { classes: clubsTheme } = useClubsTheme()

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

	const [isReplying, setIsReplying] = useState(false)
	const [isCommentRepliesHidden, setIsCommentRepliesHidden] = useState(false)

	return (
		<div>
			<div className={clubsTheme.centeredRow}>
				<Image
					src={`/exampleclub.png`}
					height={32}
					width={32}
					radius={16}
				/>
				<Space w={8} />
				<div>
					<Text className={clubsTheme.tExtraSmallBold}>Kate</Text>
					<Text className={clubsTheme.tExtraExtraSmall}>1h ago</Text>
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

					<Text className={clubsTheme.tExtraSmall}>
						{comment.content}
					</Text>
					<Space h={16} />
					<div className={clubsTheme.centeredRow}>
						<ChevronUp />
						<Space w={4} />

						<Text
							className={clubsTheme.tExtraExtraSmall}
							style={{ fontWeight: '700' }}
						>
							{comment.votes}
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
							className={clubsTheme.tExtraExtraSmall}
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
					<Space h={16} />

					{comment.replies && !isCommentRepliesHidden && (
						<>
							{comment.replies?.map(reply => (
								<>
									<ForumCommentComponent
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
					)}
				</div>
			</div>
		</div>
	)
}
