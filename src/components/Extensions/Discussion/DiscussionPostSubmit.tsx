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
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import { useMeemTheme } from '../../Styles/AgreementsTheme'

interface IProps {
	agreementSlug?: string
}

export const DiscussionPostSubmit: React.FC<IProps> = ({ agreementSlug }) => {
	// General properties / tab management
	const { classes: meemTheme } = useMeemTheme()
	const router = useRouter()
	const wallet = useWallet()
	const { agreement } = useAgreement()
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

	useEffect(() => {
		const createResizedFile = async () => {
			setPostAttachment(rawPostAttachment[0].content)
		}
		if (rawPostAttachment.length > 0) {
			log.debug('Found an image...')
			log.debug(rawPostAttachment[0].content)

			createResizedFile()
		} else {
			// log.debug('no current agreement image')
		}
	}, [rawPostAttachment])

	const deleteImage = () => {
		setPostAttachment('')
	}

	const createPost = async () => {
		try {
			if (
				!wallet.web3Provider ||
				!wallet.isConnected ||
				!wallet.chainId
			) {
				await wallet.connectWallet()
				return
			}

			if (!agreement?.address) {
				router.push('/')
				return
			}

			// Some basic validation
			if (!postTitle || postTitle.length < 3 || postTitle.length > 140) {
				// Agreement name invalid
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
				// Agreement name invalid
				showNotification({
					title: 'Oops!',
					message:
						'You entered an invalid post body. Please type a longer or shorter post body.'
				})
				return
			}

			setIsLoading(true)

			const authSig = await sdk.id.getLitAuthSig()

			const agreementExtension =
				agreement?.rawAgreement?.AgreementExtensions.find(
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
				data: {
					title: postTitle,
					body: editor?.getHTML(),
					tags: postTags.split(' ').map(tag => tag.trim()),
					walletAddress: wallet.accounts[0],
					userId: me?.user.id,
					displayName: me?.user.displayName,
					profilePicUrl: me?.user.profilePicUrl,
					ens: me?.user.DefaultWallet.ens,
					agreementSlug: agreement?.slug,
					attachment:
						postAttachment && postAttachment.length > 0
							? postAttachment
							: null
				},
				chainId: wallet.chainId,
				accessControlConditions: [
					{
						contractAddress: agreement.address
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
			<div className={meemTheme.pageHeader}>
				<div className={meemTheme.row}>
					<a
						style={{ marginTop: 34 }}
						onClick={() => {
							router.push({
								pathname: `/${agreementSlug}/e/discussion`
							})
						}}
					>
						<ArrowLeft className={meemTheme.backArrow} size={32} />
					</a>
					<Space w={16} />
					<div>
						<Text className={meemTheme.tSmallBoldFaded}>
							{agreementSlug}
						</Text>
						<Space h={16} />
						<Text className={meemTheme.tLargeBold}>
							New discussion
						</Text>
					</div>
				</div>
				<Button
					style={{ marginRight: 32 }}
					className={meemTheme.buttonBlack}
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

				<Text className={meemTheme.tMediumBold}>
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

				<Text className={meemTheme.tMediumBold}>
					Compose and edit your post here
				</Text>
				<Space h={16} />

				{editor && (
					<div className={meemTheme.fRichTextEditorContainer}>
						<RichTextEditor
							editor={editor}
							classNames={{
								toolbar: meemTheme.fRichTextEditorToolbar,
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
									<RichTextEditor.Highlight />
									<RichTextEditor.Code />
								</RichTextEditor.ControlsGroup>
							</RichTextEditor.Toolbar>
							<Divider />
							<RichTextEditor.Content />
						</RichTextEditor>
					</div>
				)}
				<Space h={32} />

				<Text className={meemTheme.tMediumBold}>
					{`Set a featured image for your post. (Optional)`}
				</Text>
				<Space h={4} />
				<Text className={meemTheme.tSmallFaded}>
					Recommended size is 1000px x 1000px. Please upload either
					JPG or PNG files.
				</Text>
				<Space h={16} />

				{postAttachment.length === 0 && !isLoadingImage && (
					<div className={meemTheme.row}>
						<Button
							leftIcon={<Upload size={14} />}
							className={meemTheme.buttonBlack}
							onClick={() => openFileSelector()}
						>
							Upload
						</Button>
					</div>
				)}
				{isLoadingImage && <Loader />}
				{!isLoadingImage && postAttachment.length > 0 && (
					<div
						className={meemTheme.boxBorderedRounded}
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

				<Text className={meemTheme.tMediumBold}>
					{`Add tags (Optional)`}
				</Text>
				<Space h={4} />

				<Text className={meemTheme.tSmallFaded}>
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
					className={meemTheme.buttonBlack}
				>
					Post
				</Button>
			</Container>
		</>
	)
}
