/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import log from '@kengoldfarb/log'
import {
	createStyles,
	Container,
	Text,
	Center,
	Image,
	Loader,
	Button,
	Textarea,
	TextInput,
	Space,
	Modal
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import * as meemContracts from '@meemproject/meem-contracts'
import { useWallet } from '@meemproject/react'
import { base64StringToBlob } from 'blob-util'
import html2canvas from 'html2canvas'
// eslint-disable-next-line import/no-extraneous-dependencies
import Cookies from 'js-cookie'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useRef, useState } from 'react'
import Resizer from 'react-image-file-resizer'
import { ArrowLeft, Upload } from 'tabler-icons-react'
import { useFilePicker } from 'use-file-picker'
import { CookieKeys } from '../../utils/cookies'
import ClubClubContext from '../Detail/ClubClubProvider'

const EmojiPicker = dynamic(() => import('emoji-picker-react'), {
	ssr: false
})

const useStyles = createStyles(theme => ({
	header: {
		backgroundColor: 'rgba(160, 160, 160, 0.05)',
		marginBottom: 60,
		display: 'flex',
		alignItems: 'end',
		flexDirection: 'row',
		paddingTop: 24,
		paddingBottom: 24,
		paddingLeft: 32,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			paddingTop: 12,
			paddingBottom: 12,
			paddingLeft: 16
		}
	},
	headerArrow: {
		marginRight: 32,
		cursor: 'pointer',
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			marginRight: 16
		}
	},
	headerPrompt: {
		fontSize: 16,
		fontWeight: 500,
		color: 'rgba(0, 0, 0, 0.6)',
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			marginBottom: 0
		}
	},
	headerClubName: {
		fontWeight: 600,
		fontSize: 24,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 20
		}
	},
	namespaceTextInputContainer: {
		position: 'relative'
	},
	namespaceTextInput: {
		paddingLeft: 154,
		paddingBottom: 3
	},
	namespaceTextInputUrlPrefix: {
		position: 'absolute',
		top: 8,
		left: 24,
		color: 'rgba(0, 0, 0, 0.5)'
	},
	clubNamespaceHint: {
		paddingLeft: 0,
		paddingBottom: 16,
		color: 'rgba(0, 0, 0, 0.5)'
	},
	clubDescriptionPrompt: { fontSize: 18, marginBottom: 0, fontWeight: 600 },
	clubLogoPrompt: {
		marginTop: 32,
		fontSize: 18,
		marginBottom: 8,
		fontWeight: 600
	},
	clubLogoInfo: {
		fontWeight: 500,
		fontSize: 14,
		maxWidth: 650,
		color: 'rgba(45, 28, 28, 0.6)',
		marginBottom: 16
	},
	buttonUpload: {
		borderRadius: 24,
		color: 'black',
		borderColor: 'black',
		backgroundColor: 'white',
		'&:hover': {
			backgroundColor: theme.colors.gray[0]
		}
	},
	buttonCreate: {
		marginTop: 48,
		marginBottom: 48,

		backgroundColor: 'black',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 24
	},
	clubLogoImage: {
		imageRendering: 'pixelated'
	},
	clubLogoImageContainer: {
		marginTop: 24,
		width: 108,
		height: 100,
		position: 'relative'
	},
	clubLogoDeleteButton: {
		position: 'absolute',
		top: '-12px',
		right: '-105px',
		cursor: 'pointer'
	},
	uploadOptions: { display: 'flex' },
	emojiCanvas: {
		position: 'absolute',
		top: 40,
		left: 0,
		marginTop: -12,
		marginBottom: -12,
		lineHeight: 1,
		fontSize: 24,
		zIndex: -1000
	}
}))

export const CreateComponent: React.FC = () => {
	const router = useRouter()
	const { classes } = useStyles()

	const clubclub = useContext(ClubClubContext)

	const [clubName, setClubName] = useState(
		router.query.clubname?.toString() ?? ''
	)
	const [defaultNamespace, setDefaultNamespace] = useState('')
	const [clubNamespace, setClubNamespace] = useState('')

	const [clubDescription, setClubDescription] = useState('')
	const [clubTwitterUrl, setClubTwitterUrl] = useState('')
	const [clubDiscordUrl, setClubDiscordUrl] = useState('')
	const descriptionRef = useRef<HTMLTextAreaElement>()

	const [chosenEmoji, setChosenEmoji] = useState<any>(null)

	const [isLoading, setIsLoading] = useState(false)
	const { web3Provider, accounts, signer, isConnected, connectWallet } =
		useWallet()

	useEffect(() => {
		if (clubName === undefined || clubName.length === 0) {
			const cookieName = Cookies.get(CookieKeys.clubName)

			if (cookieName === undefined) {
				showNotification({
					title: 'Unable to create this club.',
					message: `Some data is missing. Try again!`,
					autoClose: 5000
				})
				router.push({ pathname: '/' })
			} else {
				setClubName(cookieName)
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const name = clubName!.toString().replaceAll(' ', '-').toLowerCase()
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
			log.debug('no current club image')
		}
	}, [clubLogo, clubclub.isMember, router])

	const deleteImage = () => {
		setSmallClubLogo('')
	}

	const createClub = async () => {
		if (!web3Provider || !isConnected) {
			await connectWallet()
			router.reload()
			return
		}

		// Some basic validation
		if (!clubName || clubName.length < 3 || clubName.length > 30) {
			// Club name invalid
			showNotification({
				title: 'Oops!',
				message:
					'You entered an invalid club name. Please choose a longer or shorter name.'
			})
			return
		}

		if (clubDescription.length < 3 || clubDescription.length > 140) {
			// Club name invalid
			showNotification({
				title: 'Oops!',
				message:
					'You entered an invalid club description. Please choose a longer or shorter description.'
			})
			return
		}

		if (smallClubLogo.length === 0) {
			showNotification({
				title: 'Oops!',
				message: 'Please provide a club logo.'
			})
		}

		if (!clubclub.isMember) {
			showNotification({
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
			<div className={classes.header}>
				<a onClick={navigateHome}>
					<ArrowLeft className={classes.headerArrow} size={32} />
				</a>
				<div>
					<Text className={classes.headerPrompt}>Create a club</Text>
					<Text className={classes.headerClubName}>{clubName}</Text>
				</div>
			</div>

			<Container>
				{/* <Text className={classes.clubDescriptionPrompt}>
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
				<Text className={classes.clubDescriptionPrompt}>
					In a sentence, describe what your members do together.
				</Text>
				<Space h={8} />

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

				<Text className={classes.clubLogoPrompt}>
					Upload an icon for your club.
				</Text>
				<Text className={classes.clubLogoInfo}>
					This will be your club’s membership token. You can change it
					anytime. Icons should be square and either JPG or PNG files.
					Note that all uploads will be rendered at 24x24 px.
				</Text>
				{smallClubLogo.length === 0 && !isLoadingImage && (
					<div className={classes.uploadOptions}>
						<Button
							leftIcon={<Upload size={14} />}
							className={classes.buttonUpload}
							onClick={() => openFileSelector()}
						>
							Upload
						</Button>
						<Space w={'xs'} />
						<Button
							leftIcon={<Text>😈</Text>}
							className={classes.buttonUpload}
							onClick={() => openEmojiPicker()}
						>
							Choose emoji
						</Button>
					</div>
				)}
				{isLoadingImage && <Loader />}
				{!isLoadingImage && smallClubLogo.length > 0 && (
					<div className={classes.clubLogoImageContainer}>
						<Image
							className={classes.clubLogoImage}
							src={smallClubLogo}
							width={200}
							height={200}
							fit={'contain'}
						/>
						<a onClick={deleteImage}>
							<Image
								className={classes.clubLogoDeleteButton}
								src="delete.png"
								width={24}
								height={24}
							/>
						</a>
					</div>
				)}
			</Container>
			<div id="emojiCanvas" className={classes.emojiCanvas}>
				{chosenEmoji && <>{chosenEmoji.emoji}</>}
			</div>

			<Center>
				<Button
					onClick={() => {
						createClub()
					}}
					loading={isLoading}
					disabled={
						clubDescription.length === 0 ||
						smallClubLogo.length === 0 ||
						isLoading
					}
					className={classes.buttonCreate}
				>
					Continue
				</Button>
			</Center>
			<Modal
				withCloseButton={false}
				padding={8}
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
