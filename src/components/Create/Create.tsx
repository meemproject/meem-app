import log from '@kengoldfarb/log'
import {
	Container,
	Text,
	Image,
	Loader,
	Button,
	Textarea,
	Space,
	Modal
} from '@mantine/core'
import { useWallet } from '@meemproject/react'
import { base64StringToBlob } from 'blob-util'
import html2canvas from 'html2canvas'
import Cookies from 'js-cookie'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Resizer from 'react-image-file-resizer'
import { ArrowLeft, Upload } from 'tabler-icons-react'
import { useFilePicker } from 'use-file-picker'
import { CookieKeys } from '../../utils/cookies'
import { showErrorNotification } from '../../utils/notifications'
import { useMeemTheme } from '../Styles/MeemTheme'

const EmojiPicker = dynamic(() => import('emoji-picker-react'), {
	ssr: false
})

export const CreateComponent: React.FC = () => {
	const router = useRouter()
	const { classes: meemTheme } = useMeemTheme()

	const [agreementName, setAgreementName] = useState(
		router.query.agreementname?.toString() ?? ''
	)
	const [defaultNamespace, setDefaultNamespace] = useState('')
	const [agreementNamespace, setAgreementNamespace] = useState('')

	const [agreementDescription, setAgreementDescription] = useState('')

	const [chosenEmoji, setChosenEmoji] = useState<any>(null)
	const { web3Provider, accounts, isConnected, connectWallet } = useWallet()

	useEffect(() => {
		if (agreementName === undefined || agreementName.length === 0) {
			const cookieName = Cookies.get(CookieKeys.agreementName)

			if (cookieName === undefined) {
				showErrorNotification(
					'Unable to create this community.',
					`Some data is missing. Try again!`
				)
				router.push({ pathname: '/' })
			} else {
				setAgreementName(cookieName)
				const name = cookieName.replaceAll(' ', '-').toLowerCase()
				setDefaultNamespace(name)
				setAgreementNamespace(name)
				Cookies.remove(CookieKeys.agreementName)
			}
		}
	}, [accounts.length, agreementName, router])

	useEffect(() => {
		if (
			agreementNamespace.length === 0 &&
			defaultNamespace.length === 0 &&
			agreementName !== undefined
		) {
			const name = agreementName
				.toString()
				.replaceAll(' ', '-')
				.toLowerCase()
			setDefaultNamespace(name)
			setAgreementNamespace(name)
		}
	}, [agreementName, agreementNamespace.length, defaultNamespace.length])

	// Agreement logo
	const [smallAgreementLogo, setSmallAgreementLogo] = useState('')
	const [
		openFileSelector,
		{ filesContent: agreementLogo, loading: isLoadingImage }
	] = useFilePicker({
		readAs: 'DataURL',
		accept: 'image/*',
		limitFilesConfig: { max: 1 },
		multiple: false,
		maxFileSize: 10
	})

	const resizeFile = (file: any) =>
		new Promise(resolve => {
			Resizer.imageFileResizer(
				file,
				24,
				24,
				'PNG',
				100,
				0,
				uri => {
					resolve(uri)
				},
				'base64'
			)
		})

	const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
	const openEmojiPicker = () => {
		setIsEmojiPickerOpen(true)
	}

	function timeout(delay: number) {
		return new Promise(res => setTimeout(res, delay))
	}

	const onEmojiClick = async (event: any, emojiObject: any) => {
		setChosenEmoji(emojiObject)
		setIsEmojiPickerOpen(false)
		await timeout(100)
		// emojiCanvas is a hidden div element containing the chosen emoji
		const element = document.querySelector('#emojiCanvas')
		if (element) {
			log.debug('found emojiCanvas')

			const canvas = await html2canvas(element as HTMLElement)
			const image = canvas.toDataURL('image/png', 1.0)
			const agreementLogoBlob = base64StringToBlob(
				image.split(',')[1],
				'image/png'
			)
			const file = await resizeFile(agreementLogoBlob)
			setSmallAgreementLogo(file as string)
		} else {
			log.debug('no emojiCanvas found')
		}
	}

	const navigateHome = () => {
		router.push({ pathname: '/' })
	}

	useEffect(() => {
		const createResizedFile = async () => {
			const agreementLogoBlob = base64StringToBlob(
				agreementLogo[0].content.split(',')[1],
				'image/png'
			)
			const file = await resizeFile(agreementLogoBlob)
			setSmallAgreementLogo(file as string)
		}
		if (agreementLogo.length > 0) {
			log.debug('Found an image...')
			log.debug(agreementLogo[0].content)

			createResizedFile()
		} else {
			// log.debug('no current agreement image')
		}
	}, [agreementLogo, router])

	const deleteImage = () => {
		setSmallAgreementLogo('')
	}

	const createAgreement = async () => {
		if (!web3Provider || !isConnected) {
			await connectWallet()
			return
		}

		// Some basic validation
		if (
			!agreementName ||
			agreementName.length < 3 ||
			agreementName.length > 30
		) {
			// Agreement name invalid
			showErrorNotification(
				'Oops!',
				'You entered an invalid community name. Please choose a longer or shorter name.'
			)
			return
		}

		if (
			agreementDescription.length < 3 ||
			agreementDescription.length > 140
		) {
			// Agreement name invalid
			showErrorNotification(
				'Oops!',
				'You entered an invalid community description. Please choose a longer or shorter description.'
			)
			return
		}

		if (smallAgreementLogo.length === 0) {
			showErrorNotification('Oops!', 'Please provide a community logo.')
		}

		Cookies.set(CookieKeys.agreementName, agreementName ?? '')
		Cookies.set(CookieKeys.agreementImage, smallAgreementLogo)
		Cookies.set(CookieKeys.agreementDescription, agreementDescription)
		Cookies.set(CookieKeys.agreementSlug, agreementNamespace)
		router.push({ pathname: `/create/permissions` })
	}

	return (
		<>
			<div className={meemTheme.pageHeader}>
				<div className={meemTheme.centeredRow}>
					<a onClick={navigateHome}>
						<ArrowLeft
							className={meemTheme.pageHeaderExitButton}
							size={32}
						/>
					</a>
					<div>
						<Text className={meemTheme.tSmallBoldFaded}>
							Create a community
						</Text>
						<Text className={meemTheme.tLargeBold}>
							{agreementName}
						</Text>
					</div>
				</div>
			</div>

			<Container>
				{/* <Text className={meemTheme.tMediumBold}>
					{`Set your agreement's URL.`}
				</Text>
				<Text size="sm" className={classes.agreementNamespaceHint}>
					{'Lowercase letters, numbers and dashes are allowed.'}
				</Text>
				<div className={classes.namespaceTextInputContainer}>
					<TextInput
						classNames={{ input: classes.namespaceTextInput }}
						radius="lg"
						size="md"
						value={agreementNamespace ?? ''}
						onChange={event => {
							setAgreementNamespace(
								event.target.value.replaceAll(' ', '').toLowerCase()
							)
						}}
					/>
					<Text
						className={classes.namespaceTextInputUrlPrefix}
					>{`https://app.meem.wtf/`}</Text>
				</div>

				<Space h={'md'} /> */}
				<Space h={32} />
				<Text className={meemTheme.tMediumBold}>
					In a sentence, describe what your members do together.
				</Text>
				<Space h={16} />

				<Textarea
					radius="lg"
					size="md"
					autosize
					minRows={2}
					maxRows={4}
					maxLength={140}
					onChange={event =>
						setAgreementDescription(event.currentTarget.value)
					}
				/>

				<Space h={40} />
				<Text className={meemTheme.tMediumBold}>
					Upload an icon to represent your community.
				</Text>
				<Space h={8} />
				<Text
					className={meemTheme.tExtraSmallFaded}
					style={{ maxWidth: 650 }}
				>
					This will be your community’s membership token. You can
					change it anytime. Icons should be square and either JPG or
					PNG files. Note that all uploads will be rendered at 24x24
					px.
				</Text>
				<Space h={16} />
				{smallAgreementLogo.length === 0 && !isLoadingImage && (
					<div className={meemTheme.row}>
						<Button
							leftIcon={<Upload size={14} />}
							className={meemTheme.buttonWhite}
							onClick={() => openFileSelector()}
						>
							Upload
						</Button>
						<Space w={'xs'} />
						<Button
							leftIcon={<Text>😈</Text>}
							className={meemTheme.buttonWhite}
							onClick={() => openEmojiPicker()}
						>
							Choose emoji
						</Button>
					</div>
				)}
				{isLoadingImage && <Loader color="blue" variant="oval" />}
				{!isLoadingImage && smallAgreementLogo.length > 0 && (
					<div className={meemTheme.imageAgreementLogoContainer}>
						<Image
							className={meemTheme.imageAgreementLogo}
							src={smallAgreementLogo}
							width={200}
							height={200}
							fit={'cover'}
						/>
						<a onClick={deleteImage}>
							<Image
								className={
									meemTheme.imageAgreementLogoDeleteButton
								}
								src="delete.png"
								width={24}
								height={24}
							/>
						</a>
					</div>
				)}
				<Space h={smallAgreementLogo.length > 0 ? 148 : 40} />
				<Button
					onClick={() => {
						createAgreement()
					}}
					disabled={
						agreementDescription.length === 0 ||
						smallAgreementLogo.length === 0
					}
					className={meemTheme.buttonBlack}
				>
					Continue
				</Button>
				<Space h={64} />
			</Container>
			<div id="emojiCanvas" className={meemTheme.emojiCanvas}>
				{chosenEmoji && <>{chosenEmoji.emoji}</>}
			</div>

			<Modal
				withCloseButton={false}
				padding={8}
				overlayBlur={8}
				size={296}
				opened={isEmojiPickerOpen}
				onClose={() => {
					setIsEmojiPickerOpen(false)
				}}
			>
				<EmojiPicker onEmojiClick={onEmojiClick} />
			</Modal>
		</>
	)
}
