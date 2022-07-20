/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import log from '@kengoldfarb/log'
import {
	createStyles,
	Container,
	Text,
	Image,
	Loader,
	Button,
	Textarea,
	Space,
	TextInput,
	Modal
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { base64StringToBlob } from 'blob-util'
import html2canvas from 'html2canvas'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import Resizer from 'react-image-file-resizer'
import { ArrowLeft, Upload } from 'tabler-icons-react'
import { useFilePicker } from 'use-file-picker'
import { Zeen } from '../../../../model/apps/zeen/zeen'
import { ZeenAdminChangesModal } from './ZeenAdminChangesModal'

const EmojiPicker = dynamic(() => import('emoji-picker-react'), {
	ssr: false
})

const useStyles = createStyles(theme => ({
	header: {
		marginBottom: 60,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
		paddingTop: 32,
		borderBottomColor: 'rgba(0, 0, 0, 0.08)',
		borderBottomWidth: '1px',
		borderBottomStyle: 'solid',
		paddingBottom: 32,
		paddingLeft: 32,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			marginBottom: 32,
			paddingBottom: 16,
			paddingLeft: 8,
			paddingTop: 16
		}
	},
	headerArrow: {
		marginRight: 24,
		cursor: 'pointer',
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			display: 'none'
		}
	},
	headerTitle: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row'
	},
	headerPrompt: {
		fontSize: 16,
		marginBottom: 8,
		fontWeight: 500,
		color: 'rgba(0, 0, 0, 0.6)'
	},
	headerClubName: {
		fontWeight: 600,
		fontSize: 24,
		marginLeft: 32,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 16,
			marginLeft: 16
		}
	},
	clubLogoImage: {
		imageRendering: 'pixelated',
		width: 80,
		height: 80,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			width: 40,
			height: 40,
			minHeight: 40,
			minWidth: 40,
			marginLeft: 16
		}
	},
	clubNamePrompt: {
		fontSize: 18,
		marginBottom: 16,
		fontWeight: 600,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 16,
			marginBottom: 8
		}
	},

	clubDescriptionPrompt: {
		fontSize: 18,
		marginBottom: 16,
		fontWeight: 600,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 16,
			marginBottom: 8
		}
	},
	clubLogoPrompt: {
		marginTop: 32,
		fontSize: 18,
		marginBottom: 8,
		fontWeight: 600,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 16,
			marginBottom: 8
		}
	},
	clubLogoInfo: {
		fontWeight: 500,
		fontSize: 14,
		maxWidth: 650,
		color: 'rgba(45, 28, 28, 0.6)',
		marginBottom: 16,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 13
		}
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
	buttonSaveChangesInHeader: {
		backgroundColor: 'black',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 24,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			display: 'none'
		}
	},
	buttonSaveChanges: {
		backgroundColor: 'black',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 24
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

interface IProps {
	zeen: Zeen
}

export const ZeenAdminProfileSettings: React.FC<IProps> = ({ zeen }) => {
	const router = useRouter()
	const { classes } = useStyles()

	const [zeenName, setZeenName] = useState('')
	const [zeenDescription, setZeenDescription] = useState('')
	const [hasLoadedZeenData, setHasLoadedZeenData] = useState(false)
	const [isSavingChanges, setIsSavingChanges] = useState(false)

	const [chosenEmoji, setChosenEmoji] = useState<any>(null)

	// Zeen logo
	const [smallZeenLogo, setSmallZeenLogo] = useState('')
	const [
		openFileSelector,
		{ filesContent: zeenLogo, loading: isLoadingImage }
	] = useFilePicker({
		readAs: 'DataURL',
		accept: 'image/*',
		limitFilesConfig: { max: 1 },
		multiple: false,
		maxFileSize: 10
	})

	useEffect(() => {
		if (!hasLoadedZeenData) {
			setHasLoadedZeenData(true)
			setZeenName(zeen.name!)
			setZeenDescription(zeen.description!)
			setSmallZeenLogo(zeen.image!)
		}
	}, [zeen, hasLoadedZeenData])

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

	useEffect(() => {
		const createResizedFile = async () => {
			const zeenLogoBlob = base64StringToBlob(
				zeenLogo[0].content.split(',')[1],
				'image/png'
			)
			const file = await resizeFile(zeenLogoBlob)
			setSmallZeenLogo(file as string)
		}
		if (zeenLogo.length > 0) {
			log.debug('Found an image...')
			log.debug(zeenLogo[0].content)

			createResizedFile()
		} else {
			log.debug('no current zeen image')
		}
	}, [zeenLogo])

	const deleteImage = () => {
		setSmallZeenLogo('')
	}

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
		const element = document.querySelector('#emojiCanvas')
		if (element) {
			log.debug('found emojiCanvas')

			const canvas = await html2canvas(element as HTMLElement)
			const image = canvas.toDataURL('image/png', 1.0)
			const zeenLogoBlob = base64StringToBlob(
				image.split(',')[1],
				'image/png'
			)
			const file = await resizeFile(zeenLogoBlob)
			setSmallZeenLogo(file as string)
		} else {
			log.debug('no emojiCanvas found')
		}
	}

	const [newZeenData, setNewZeenData] = useState<Zeen>()
	const [isSaveChangesModalOpened, setSaveChangesModalOpened] =
		useState(false)
	const openSaveChangesModal = () => {
		// Some basic validation
		if (zeenName.length < 3 || zeenName.length > 50) {
			// Zeen name invalid
			showNotification({
				title: 'Oops!',
				message:
					'You entered an invalid zeen name. Please choose a longer or shorter name.'
			})
			return
		}

		if (zeenDescription.length < 3 || zeenDescription.length > 140) {
			// Zeen description invalid
			showNotification({
				title: 'Oops!',
				message:
					'You entered an invalid zeen description. Please choose a longer or shorter description.'
			})
			return
		}

		if (smallZeenLogo.length === 0) {
			showNotification({
				title: 'Oops!',
				message: 'Please provide a zeen logo.'
			})
		}

		// 'save changes' modal for executing zeen settings updates
		// convert current settings and update for the modal
		const newZeen = zeen!
		newZeen.name = zeenName
		newZeen.description = zeenDescription
		newZeen.image = smallZeenLogo
		setNewZeenData(newZeen)
		setSaveChangesModalOpened(true)
	}

	const saveChanges = async () => {
		setIsSavingChanges(true)
		openSaveChangesModal()
	}

	return (
		<>
			<Space h={'lg'} />
			<Text
				className={classes.clubNamePrompt}
			>{`What's your zeen called?`}</Text>
			<TextInput
				radius="lg"
				size="md"
				value={zeenName}
				onChange={event => setZeenName(event.currentTarget.value)}
			/>
			<Space h={'xl'} />
			<Text className={classes.clubDescriptionPrompt}>
				In a sentence or two, how would you describe your zeen to your
				community?
			</Text>
			<Textarea
				radius="lg"
				size="md"
				minRows={2}
				maxRows={4}
				maxLength={140}
				value={zeenDescription}
				onChange={event =>
					setZeenDescription(event.currentTarget.value)
				}
			/>
			<Text className={classes.clubLogoPrompt}>
				Upload an icon for your zeen.
			</Text>
			<Text className={classes.clubLogoInfo}>
				Icons should be square and either JPG or PNG files. Note that
				all uploads will be rendered at 24x24 px.
			</Text>
			{smallZeenLogo.length === 0 && !isLoadingImage && (
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
			{!isLoadingImage && smallZeenLogo.length > 0 && (
				<div className={classes.clubLogoImageContainer}>
					<Image
						className={classes.clubLogoImage}
						src={smallZeenLogo}
						width={200}
						height={200}
						fit={'contain'}
					/>
					<a onClick={deleteImage}>
						<Image
							className={classes.clubLogoDeleteButton}
							src="/delete.png"
							width={24}
							height={24}
						/>
					</a>
				</div>
			)}
			<Space h={smallZeenLogo.length > 0 ? 148 : 32} />
			<Button
				className={classes.buttonSaveChanges}
				loading={isSavingChanges}
				onClick={saveChanges}
			>
				Save Changes
			</Button>
			<Space h={64} />
			<ZeenAdminChangesModal
				zeen={zeen}
				isOpened={isSaveChangesModalOpened}
				onModalClosed={() => {
					setIsSavingChanges(false)
					setSaveChangesModalOpened(false)
				}}
			/>
			<div id="emojiCanvas" className={classes.emojiCanvas}>
				{chosenEmoji && <>{chosenEmoji.emoji}</>}
			</div>
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
