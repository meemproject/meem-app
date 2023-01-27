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
import { RichTextEditor } from '@mantine/tiptap'
import { useAuth, useSDK, useWallet } from '@meemproject/react'
import Highlight from '@tiptap/extension-highlight'
import { Link as TipTapLink } from '@tiptap/extension-link'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { base64StringToBlob } from 'blob-util'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import Resizer from 'react-image-file-resizer'
import { ArrowLeft, Upload } from 'tabler-icons-react'
import { useFilePicker } from 'use-file-picker'
import { extensionFromSlug } from '../../../model/agreement/agreements'
import { showErrorNotification } from '../../../utils/notifications'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import { useMeemTheme } from '../../Styles/MeemTheme'
import { ExtensionBlankSlate, extensionIsReady } from '../ExtensionBlankSlate'
import { useDiscussions } from './DiscussionProvider'

interface IProps {
	agreementSlug?: string
}

export const DiscussionPostSubmit: React.FC<IProps> = ({ agreementSlug }) => {
	// General properties / tab management
	const { classes: meemTheme } = useMeemTheme()
	const router = useRouter()
	const wallet = useWallet()
	const { privateKey } = useDiscussions()
	const { agreement, isLoadingAgreement } = useAgreement()

	const agreementExtension = extensionFromSlug('discussions', agreement)

	const { me } = useAuth()

	const { sdk } = useSDK()

	const [postTitle, setPostTitle] = useState('')

	const content = ''

	const editor = useEditor({
		extensions: [
			StarterKit,
			Underline,
			TipTapLink,
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
		const resizeFile = (file: any) =>
			new Promise(resolve => {
				Resizer.imageFileResizer(
					file,
					512,
					512,
					'JPEG',
					95,
					0,
					uri => {
						resolve(uri)
					},
					'base64'
				)
			})
		const createResizedFile = async () => {
			const agreementLogoBlob = base64StringToBlob(
				rawPostAttachment[0].content.split(',')[1],
				'image/png'
			)
			const file = await resizeFile(agreementLogoBlob)
			setPostAttachment(file as string)
		}
		if (rawPostAttachment.length > 0) {
			log.debug('Found an image...')

			createResizedFile()
		} else {
			// log.debug('no current agreement image')
		}
	}, [rawPostAttachment])

	const deleteImage = () => {
		setPostAttachment('')
	}

	const createPost = useCallback(async () => {
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
				showErrorNotification(
					'Oops!',
					'You entered an invalid post title. Please choose a longer or shorter post title.'
				)
				return
			}

			if (
				(editor && editor?.getHTML().length < 10) ||
				(editor && editor?.getHTML().length > 3000)
			) {
				// Agreement name invalid
				showErrorNotification(
					'Oops!',
					'You entered an invalid post body. Please type a longer or shorter post body.'
				)
				return
			}

			setIsLoading(true)

			if (!privateKey) {
				showErrorNotification(
					'Something went wrong!',
					'Unable to encrypt data'
				)
				setIsLoading(false)
				return
			}

			const now = Math.floor(new Date().getTime() / 1000)

			const { id } = await sdk.storage.encryptAndWrite({
				path: `meem/${agreement.id}/extensions/discussion/posts`,
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
				writeColumns: {
					createdAt: now
				},
				key: privateKey
			})

			router.push({
				pathname: `/${agreement.slug}/e/discussions/${id}`
			})
		} catch (e) {
			log.crit(e)
			setIsLoading(false)
		}
	}, [
		agreement,
		me,
		editor,
		postAttachment,
		postTags,
		postTitle,
		privateKey,
		router,
		sdk.storage,
		wallet
	])

	return (
		<>
			<ExtensionBlankSlate extensionSlug={'discussions'} />
			{extensionIsReady(
				isLoadingAgreement,
				agreement,
				agreementExtension
			) && (
				<>
					<div className={meemTheme.pageHeader}>
						<div className={meemTheme.row}>
							<Link href={`/${agreementSlug}/e/discussions`}>
								<div>
									<ArrowLeft
										style={{ marginTop: 35 }}
										className={meemTheme.backArrow}
										size={32}
									/>
								</div>
							</Link>
							<Space w={16} />
							<div>
								<Text className={meemTheme.tSmallBoldFaded}>
									{agreement?.name}
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
							maxLength={140}
							onChange={event =>
								setPostTitle(event.currentTarget.value)
							}
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
							Recommended size is 1000px x 1000px. Please upload
							either JPG or PNG files.
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
							onChange={event =>
								setPostTags(event.currentTarget.value)
							}
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
								isLoading
							}
							className={meemTheme.buttonBlack}
						>
							Post
						</Button>
					</Container>
				</>
			)}
		</>
	)
}
