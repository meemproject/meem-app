/* eslint-disable import/no-named-as-default */
import {
	Center,
	Space,
	Text,
	Image,
	Badge,
	useMantineColorScheme,
	Container,
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
import React from 'react'
import { ChevronDown, ChevronUp, Message, Share } from 'tabler-icons-react'
import { ForumPost } from '../../../model/club/forum/forumPost'
import {
	colorBlack,
	colorDarkerGrey,
	colorLightestGrey,
	useClubsTheme
} from '../../Styles/ClubsTheme'
interface IProps {
	postId: string
}

export const ForumPostComponent: React.FC<IProps> = ({ postId }) => {
	const { classes: clubsTheme } = useClubsTheme()

	const { colorScheme } = useMantineColorScheme()
	const isDarkTheme = colorScheme === 'dark'

	const post: ForumPost = {
		id: '1',
		title: 'Test post one',
		tags: ['funny', 'crazy'],
		content: 'This is just a small test post.',
		clubSlug: '',
		votes: 16,
		user: {
			displayName: 'James',
			profilePicture: '/exampleclub.png',
			wallet: ''
		}
	}

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

	return (
		<div>
			<Space h={48} />
			<Container>
				<div className={clubsTheme.row}>
					<div>
						<Center>
							<ChevronUp />
						</Center>

						<Space h={16} />
						<Center>{post.votes ?? 0}</Center>
						<Space h={16} />
						<Center>
							<ChevronDown />
						</Center>
					</div>
					<Space w={16} />
					<div style={{ width: '100%' }}>
						<div className={clubsTheme.row}>
							<Space w={16} />
							{post.attachment && (
								<>
									<Image
										src={post.attachment}
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
										src={`/exampleclub.png`}
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
											Kate
										</Text>
										<Text
											className={
												clubsTheme.tExtraExtraSmall
											}
										>
											1h ago
										</Text>
									</div>
								</div>
								<Space h={24} />

								<Text className={clubsTheme.tMediumBold}>
									{post.title}
								</Text>
								{post.tags && (
									<>
										<Space h={12} />

										{post.tags.map(tag => (
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
								<Text className={clubsTheme.tSmall}>
									{post.content}
								</Text>
								<Space h={16} />

								<div className={clubsTheme.centeredRow}>
									<div
										className={clubsTheme.row}
										style={{ marginTop: 16 }}
									>
										<div className={clubsTheme.centeredRow}>
											<Message width={20} height={20} />
											<Space w={4} />
											<Text
												className={
													clubsTheme.tExtraSmall
												}
											>
												14 Comments
											</Text>
										</div>
										<Space w={16} />
										<div
											className={clubsTheme.centeredRow}
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
							<RichTextEditor.Toolbar sticky stickyOffset={60}>
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
							>
								Comment
							</Button>
						</div>
					</div>
				)}
			</Container>
		</div>
	)
}
