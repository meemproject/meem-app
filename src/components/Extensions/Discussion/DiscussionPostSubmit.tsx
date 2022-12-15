/* eslint-disable import/no-named-as-default */
import log from '@kengoldfarb/log'
import {
	Container,
	Text,
	Image,
	Space,
	Loader,
	TextInput,
	Button,
	Divider
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { RichTextEditor } from '@mantine/tiptap'
import { useAuth, useSDK, useWallet } from '@meemproject/react'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { ArrowLeft, Upload } from 'tabler-icons-react'
import { useFilePicker } from 'use-file-picker'
import { useClub } from '../../ClubHome/ClubProvider'
import { useClubsTheme } from '../../Styles/ClubsTheme'

interface IProps {
	clubSlug?: string
}

export const DiscussionPostSubmit: React.FC<IProps> = ({ clubSlug }) => {
	// General properties / tab management
	const { classes: clubsTheme } = useClubsTheme()
	const router = useRouter()
	const wallet = useWallet()
	const { club } = useClub()
	const { me } = useAuth()

	const { sdk } = useSDK()

	const [postTitle, setPostTitle] = useState('')

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

	const [postTags, setPostTags] = useState('')

	const [isLoading, setIsLoading] = useState(false)

	const [postAttachment, setPostAttachment] = useState('')
	const [
		openFileSelector,
		{ filesContent: rawPostAttachment, loading: isLoadingImage }
	] = useFilePicker({
		readAs: 'DataURL',
		accept: 'image/*',
		limitFilesConfig: { max: 1 },
		multiple: false,
		maxFileSize: 10
	})

	const chainId = +(process.env.NEXT_PUBLIC_CHAIN_ID ?? '')

	useEffect(() => {
		const createResizedFile = async () => {
			setPostAttachment(rawPostAttachment[0].content)
		}
		if (rawPostAttachment.length > 0) {
			log.debug('Found an image...')
			log.debug(rawPostAttachment[0].content)

			createResizedFile()
		} else {
			// log.debug('no current club image')
		}
	}, [rawPostAttachment])

	const deleteImage = () => {
		setPostAttachment('')
	}

	const createPost = async () => {
		try {
			if (!wallet.web3Provider || !wallet.isConnected) {
				await wallet.connectWallet()
				return
			}

			if (!club?.address) {
				router.push('/')
				return
			}

			// Some basic validation
			if (!postTitle || postTitle.length < 3 || postTitle.length > 140) {
				// Club name invalid
				showNotification({
					title: 'Oops!',
					message:
						'You entered an invalid post title. Please choose a longer or shorter post title.'
				})
				return
			}

			if (
				(editor && editor?.getHTML().length < 10) ||
				(editor && editor?.getHTML().length > 3000)
			) {
				// Club name invalid
				showNotification({
					title: 'Oops!',
					message:
						'You entered an invalid post body. Please type a longer or shorter post body.'
				})
				return
			}

			setIsLoading(true)

			const authSig = await sdk.id.getLitAuthSig()

			const agreementExtension = club?.rawClub?.AgreementExtensions.find(
				ae => ae.Extension?.slug === 'discussion'
			)

			if (!agreementExtension) {
				showNotification({
					title: 'Something went wrong!',
					message: 'Please reload and try again'
				})
				return
			}

			const postTable =
				agreementExtension.metadata.storage?.tableland?.posts

			if (!postTable) {
				showNotification({
					title: 'Something went wrong!',
					message: 'Please reload and try again'
				})
				return
			}

			await sdk.storage.encryptAndWrite({
				authSig,
				tableName: postTable.tablelandTableName,
				writeColumns: {
					title: postTitle,
					body: editor?.getHTML(),
					tags: postTags.split(' ').map(tag => tag.trim()),
					walletAddress: wallet.accounts[0],
					userId: me?.user.id,
					displayName: me?.user.displayName,
					profilePicUrl: me?.user.profilePicUrl,
					ens: me?.user.DefaultWallet.ens,
					clubSlug: club?.slug,
					attachment:
						postAttachment && postAttachment.length > 0
							? postAttachment
							: null
				},
				chainId,
				accessControlConditions: [
					{
						contractAddress: club.address
					}
				]
			})

			// TODO: Redirect?
		} catch (e) {
			log.crit(e)
		}
		setIsLoading(false)
	}

	return (
		<>
			<div className={clubsTheme.pageHeader}>
				<div className={clubsTheme.row}>
					<a
						style={{ marginTop: 34 }}
						onClick={() => {
							router.push({
								pathname: `/${clubSlug}/e/discussion`
							})
						}}
					>
						<ArrowLeft className={clubsTheme.backArrow} size={32} />
					</a>
					<Space w={16} />
					<div>
						<Text className={clubsTheme.tSmallBoldFaded}>
							{clubSlug}
						</Text>
						<Space h={16} />
						<Text className={clubsTheme.tLargeBold}>
							New discussion
						</Text>
					</div>
				</div>
				<Button
					style={{ marginRight: 32 }}
					className={clubsTheme.buttonBlack}
					loading={isLoading}
					disabled={
						postTitle.length === 0 ||
						editor?.getHTML().length === 0 ||
						// postAttachment.length === 0 ||
						isLoading
					}
					onClick={(e: any) => {
						e.preventDefault()
						createPost()
					}}
				>
					Post
				</Button>
			</div>

			<Container>
				<Space h={24} />

				<Text className={clubsTheme.tMediumBold}>
					{`What’s your post called?`}
				</Text>
				<Space h={16} />

				<TextInput
					radius="lg"
					size="md"
					value={postTitle}
					maxLength={30}
					onChange={event => setPostTitle(event.currentTarget.value)}
				/>

				<Space h={32} />

				<Text className={clubsTheme.tMediumBold}>
					Compose and edit your post here
				</Text>
				<Space h={16} />

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
									<RichTextEditor.Highlight />
									<RichTextEditor.Code />
								</RichTextEditor.ControlsGroup>
							</RichTextEditor.Toolbar>
							<Divider />
							<RichTextEditor.Content />
						</RichTextEditor>
						{/* <Space h={16} />
						<div className={clubsTheme.rowEndAlign}>
							<Button
								className={clubsTheme.buttonBlack}
								style={{ marginBottom: 16, marginRight: 16 }}
								onClick={async () => {
									const tl =
										await sdk.storage.getTablelandInstance({
											chainId: +(
												process.env
													.NEXT_PUBLIC_CHAIN_ID ?? ''
											)
										})
									await tl.siwe()

									console.log(tl)

									const now = (
										new Date().getTime() / 1000
									).toFixed(0)

									console.log({ now })

									await tl.write(
										`insert into _420_192 ("data", "accessControlConditions", "createdAt", "updatedAt") values ('test data', '${JSON.stringify(
											{
												some: 'condition'
											}
										)}', '${now}', '${now}')`,
										{
											rpcRelay: false
										}
									)
								}}
							>
								Comment
							</Button>
						</div> */}
					</div>
				)}
				<Space h={32} />

				<Text className={clubsTheme.tMediumBold}>
					{`Set a featured image for your post. (Optional)`}
				</Text>
				<Space h={4} />
				<Text className={clubsTheme.tSmallFaded}>
					Recommended size is 1000px x 1000px. Please upload either
					JPG or PNG files.
				</Text>
				<Space h={16} />

				{postAttachment.length === 0 && !isLoadingImage && (
					<div className={clubsTheme.row}>
						<Button
							leftIcon={<Upload size={14} />}
							className={clubsTheme.buttonBlack}
							onClick={() => openFileSelector()}
						>
							Upload
						</Button>
					</div>
				)}
				{isLoadingImage && <Loader />}
				{!isLoadingImage && postAttachment.length > 0 && (
					<div
						className={clubsTheme.boxBorderedRounded}
						style={{ position: 'relative', maxWidth: 400 }}
					>
						<Image src={postAttachment} fit={'cover'} />
						<a onClick={deleteImage}>
							<Image
								style={{
									top: 8,
									right: 8,
									position: 'absolute',
									cursor: 'pointer'
								}}
								src="/delete.png"
								width={24}
								height={24}
							/>
						</a>
					</div>
				)}

				<Space h={postAttachment ? 32 : 32} />

				<Text className={clubsTheme.tMediumBold}>
					{`Add tags (Optional)`}
				</Text>
				<Space h={4} />

				<Text className={clubsTheme.tSmallFaded}>
					{`Leave a space between tags.`}
				</Text>
				<Space h={16} />

				<TextInput
					radius="lg"
					size="md"
					value={postTags}
					maxLength={30}
					onChange={event => setPostTags(event.currentTarget.value)}
				/>

				<Space h={40} />

				<Button
					onClick={() => {
						createPost()
					}}
					loading={isLoading}
					disabled={
						postTitle.length === 0 ||
						editor?.getHTML().length === 0 ||
						// postAttachment.length === 0 ||
						isLoading
					}
					className={clubsTheme.buttonBlack}
				>
					Post
				</Button>
			</Container>
		</>
	)
}