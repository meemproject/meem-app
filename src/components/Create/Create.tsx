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
import { showNotification } from '@mantine/notifications'
import { useWallet } from '@meemproject/react'
import { base64StringToBlob } from 'blob-util'
import html2canvas from 'html2canvas'
import Cookies from 'js-cookie'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import Resizer from 'react-image-file-resizer'
import { ArrowLeft, Upload } from 'tabler-icons-react'
import { useFilePicker } from 'use-file-picker'
import { CookieKeys } from '../../utils/cookies'
import ClubClubContext from '../Detail/ClubClubProvider'
import { useGlobalStyles } from '../Styles/GlobalStyles'

const EmojiPicker = dynamic(() => import('emoji-picker-react'), {
	ssr: false
})

export const CreateComponent: React.FC = () => {
	const router = useRouter()
	const { classes: design } = useGlobalStyles()

	const clubclub = useContext(ClubClubContext)

	const [clubName, setClubName] = useState(
		router.query.clubname?.toString() ?? ''
	)
	const [defaultNamespace, setDefaultNamespace] = useState('')
	const [clubNamespace, setClubNamespace] = useState('')

	const [clubDescription, setClubDescription] = useState('')

	const [chosenEmoji, setChosenEmoji] = useState<any>(null)
	const { web3Provider, accounts, isConnected, connectWallet } = useWallet()

	useEffect(() => {
		if (clubName === undefined || clubName.length === 0) {
			const cookieName = Cookies.get(CookieKeys.clubName)

			if (cookieName === undefined) {
				showNotification({
					radius: 'lg',
					title: 'Unable to create this club.',
					message: `Some data is missing. Try again!`,
					autoClose: 5000
				})
				router.push({ pathname: '/' })
			} else {
				setClubName(cookieName)
				const name = cookieName.replaceAll(' ', '-').toLowerCase()
				setDefaultNamespace(name)
				setClubNamespace(name)
				Cookies.remove(CookieKeys.clubName)
			}
		}
	}, [accounts.length, clubName, router])

	useEffect(() => {
		if (
			clubNamespace.length === 0 &&
			defaultNamespace.length === 0 &&
			clubName !== undefined
		) {
			const name = clubName.toString().replaceAll(' ', '-').toLowerCase()
			setDefaultNamespace(name)
			setClubNamespace(name)
		}
	}, [clubName, clubNamespace.length, defaultNamespace.length])

	// Club logo
	const [smallClubLogo, setSmallClubLogo] = useState('')
	const [
		openFileSelector,
		{ filesContent: clubLogo, loading: isLoadingImage }
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
			const clubLogoBlob = base64StringToBlob(
				image.split(',')[1],
				'image/png'
			)
			const file = await resizeFile(clubLogoBlob)
			setSmallClubLogo(file as string)
		} else {
			log.debug('no emojiCanvas found')
		}
	}

	const navigateHome = () => {
		router.push({ pathname: '/' })
	}

	useEffect(() => {
		const createResizedFile = async () => {
			const clubLogoBlob = base64StringToBlob(
				clubLogo[0].content.split(',')[1],
				'image/png'
			)
			const file = await resizeFile(clubLogoBlob)
			setSmallClubLogo(file as string)
		}
		if (clubLogo.length > 0) {
			log.debug('Found an image...')
			log.debug(clubLogo[0].content)

			createResizedFile()
		} else {
			// log.debug('no current club image')
		}
	}, [clubLogo, clubclub.isMember, router])

	const deleteImage = () => {
		setSmallClubLogo('')
	}

	const createClub = async () => {
		if (!web3Provider || !isConnected) {
			await connectWallet()
			return
		}

		// Some basic validation
		if (!clubName || clubName.length < 3 || clubName.length > 30) {
			// Club name invalid
			showNotification({
				radius: 'lg',
				title: 'Oops!',
				message:
					'You entered an invalid club name. Please choose a longer or shorter name.'
			})
			return
		}

		if (clubDescription.length < 3 || clubDescription.length > 140) {
			// Club name invalid
			showNotification({
				radius: 'lg',
				title: 'Oops!',
				message:
					'You entered an invalid club description. Please choose a longer or shorter description.'
			})
			return
		}

		if (smallClubLogo.length === 0) {
			showNotification({
				radius: 'lg',
				title: 'Oops!',
				message: 'Please provide a club logo.'
			})
		}

		if (!clubclub.isMember) {
			showNotification({
				radius: 'lg',
				title: 'No Club Club membership found.',
				message: `Join Club Club to continue.`
			})
			router.push({ pathname: '/' })
			return
		}
		Cookies.set(CookieKeys.clubName, clubName ?? '')
		Cookies.set(CookieKeys.clubImage, smallClubLogo)
		Cookies.set(CookieKeys.clubDescription, clubDescription)
		Cookies.set(CookieKeys.clubSlug, clubNamespace)
		router.push({ pathname: `/create/permissions` })
	}

	return (
		<>
			<div className={design.pageHeader}>
				<a onClick={navigateHome}>
					<ArrowLeft
						className={design.pageHeaderExitButton}
						size={32}
					/>
				</a>
				<div>
					<Text className={design.tSmallBoldFaded}>
						Create a club
					</Text>
					<Text className={design.tLargeBold}>{clubName}</Text>
				</div>
			</div>

			<Container>
				{/* <Text className={design.tMediumBold}>
					{`Set your club's URL.`}
				</Text>
				<Text size="sm" className={classes.clubNamespaceHint}>
					{'Lowercase letters, numbers and dashes are allowed.'}
				</Text>
				<div className={classes.namespaceTextInputContainer}>
					<TextInput
						classNames={{ input: classes.namespaceTextInput }}
						radius="lg"
						size="md"
						value={clubNamespace ?? ''}
						onChange={event => {
							setClubNamespace(
								event.target.value.replaceAll(' ', '').toLowerCase()
							)
						}}
					/>
					<Text
						className={classes.namespaceTextInputUrlPrefix}
					>{`https://clubs.link/`}</Text>
				</div>

				<Space h={'md'} /> */}
				<Text className={design.tMediumBold}>
					In a sentence, describe what your members do together.
				</Text>
				<Space h={24} />

				<Textarea
					radius="lg"
					size="md"
					autosize
					minRows={2}
					maxRows={4}
					maxLength={140}
					onChange={event =>
						setClubDescription(event.currentTarget.value)
					}
				/>

				<Space h={16} />
				<Text className={design.tMediumBold}>
					Upload an icon for your club.
				</Text>
				<Space h={8} />
				<Text
					className={design.tExtraSmallFaded}
					style={{ maxWidth: 650 }}
				>
					This will be your club’s membership token. You can change it
					anytime. Icons should be square and either JPG or PNG files.
					Note that all uploads will be rendered at 24x24 px.
				</Text>
				<Space h={16} />
				{smallClubLogo.length === 0 && !isLoadingImage && (
					<div className={design.row}>
						<Button
							leftIcon={<Upload size={14} />}
							className={design.buttonWhite}
							onClick={() => openFileSelector()}
						>
							Upload
						</Button>
						<Space w={'xs'} />
						<Button
							leftIcon={<Text>😈</Text>}
							className={design.buttonWhite}
							onClick={() => openEmojiPicker()}
						>
							Choose emoji
						</Button>
					</div>
				)}
				{isLoadingImage && <Loader color="red" variant="oval" />}
				{!isLoadingImage && smallClubLogo.length > 0 && (
					<div className={design.imageClubLogoContainer}>
						<Image
							className={design.imageClubLogo}
							src={smallClubLogo}
							width={200}
							height={200}
							fit={'cover'}
						/>
						<a onClick={deleteImage}>
							<Image
								className={design.imageClubLogoDeleteButton}
								src="delete.png"
								width={24}
								height={24}
							/>
						</a>
					</div>
				)}
				<Button
					onClick={() => {
						createClub()
					}}
					disabled={
						clubDescription.length === 0 ||
						smallClubLogo.length === 0
					}
					className={design.buttonBlack}
				>
					Continue
				</Button>
			</Container>
			<div id="emojiCanvas" className={design.emojiCanvas}>
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
