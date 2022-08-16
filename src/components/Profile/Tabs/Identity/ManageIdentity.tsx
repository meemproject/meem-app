import log from '@kengoldfarb/log'
import {
	createStyles,
	Text,
	Button,
	Space,
	Divider,
	Image,
	Modal,
	Loader,
	TextInput
} from '@mantine/core'
import { useWallet } from '@meemproject/react'
import { base64StringToBlob } from 'blob-util'
import html2canvas from 'html2canvas'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Resizer from 'react-image-file-resizer'
import { Upload } from 'tabler-icons-react'
import { useFilePicker } from 'use-file-picker'
import { Identity } from '../../../../model/identity/identity'
import { ProfileLinkDiscordModal } from './ProfileLinkDiscordModal'
import { ProfileLinkEmailModal } from './ProfileLinkEmailModal'
import { ProfileLinkTwitterModal } from './ProfileLinkTwitterModal'

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
	headerLeftItems: {
		display: 'flex',
		alignItems: 'center'
	},
	headerArrow: {
		marginRight: 32,
		marginTop: 6,
		cursor: 'pointer',
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			marginRight: 16,
			marginLeft: 16
		}
	},
	headerClubName: {
		fontWeight: 600,
		fontSize: 24,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 20
		}
	},
	buttonSaveChanges: {
		backgroundColor: 'black',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 24,
		marginRight: 32
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
	createClubLink: {
		marginTop: 24,
		a: {
			color: 'rgba(255, 102, 81, 1)',
			textDecoration: 'underline',
			fontWeight: 'bold'
		}
	},
	clubItem: {
		display: 'flex',
		alignItems: 'center',
		marginBottom: 24,
		fontSize: 16,
		fontWeight: 600,
		cursor: 'pointer',
		border: '1px solid rgba(0, 0, 0, 0.1)',
		backgroundColor: '#FAFAFA',
		borderRadius: 16,
		padding: 16
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
	},
	clubNameEllipsis: {
		textOverflow: 'ellipsis',
		msTextOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		overflow: 'hidden'
	},
	identitySectionTitle: {
		fontSize: 18,
		marginBottom: 16,
		fontWeight: 600,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 16,
			marginBottom: 8
		}
	},
	myClubsPrompt: { fontSize: 18, marginBottom: 16 }
}))

const EmojiPicker = dynamic(() => import('emoji-picker-react'), {
	ssr: false
})

interface IProps {
	identity: Identity
}

export const ManageIdentityComponent: React.FC<IProps> = ({ identity }) => {
	const { classes } = useStyles()
	const router = useRouter()
	const wallet = useWallet()

	// Mutable identity data
	const [displayName, setDisplayName] = useState(identity.displayName ?? '')
	const [profilePicture, setProfilePicture] = useState(
		identity.profilePic ?? ''
	)

	const [chosenEmoji, setChosenEmoji] = useState<any>(null)

	// Club logo
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
				256,
				256,
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
			const clubLogoBlob = base64StringToBlob(
				clubLogo[0].content.split(',')[1],
				'image/png'
			)
			const file = await resizeFile(clubLogoBlob)
			setProfilePicture(file as string)
		}
		if (clubLogo.length > 0) {
			log.debug('Found an image...')
			log.debug(clubLogo[0].content)

			createResizedFile()
		} else {
			// log.debug('no current club image')
		}
	}, [clubLogo])

	const deleteImage = () => {
		setProfilePicture('')
	}

	// Modal visibility
	const [isLinkedAccountModalOpen, setIsLinkedAccountModalOped] =
		useState(false)

	const [isDiscordModalOpen, setIsDiscordModalOpen] = useState(false)
	const [isTwitterModalOpen, setIsTwitterModalOpen] = useState(false)
	const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)

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
			const clubLogoBlob = base64StringToBlob(
				image.split(',')[1],
				'image/png'
			)
			const file = await resizeFile(clubLogoBlob)
			setProfilePicture(file as string)
		} else {
			log.debug('no emojiCanvas found')
		}
	}

	const [isSavingChanges, setIsSavingChanges] = useState(false)

	const saveChanges = async () => {
		setIsSavingChanges(true)
	}

	return (
		<>
			<Space h={30} />
			<Text className={classes.identitySectionTitle}>
				Profile Picture
			</Text>

			{profilePicture.length === 0 && !isLoadingImage && (
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
			{isLoadingImage && <Loader color="red" variant="bars" />}
			{!isLoadingImage && profilePicture.length > 0 && (
				<div className={classes.clubLogoImageContainer}>
					<Image
						className={classes.clubLogoImage}
						src={profilePicture}
						width={200}
						height={200}
						fit={'cover'}
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
			<Space h={profilePicture.length > 0 ? 148 : 32} />

			<Text className={classes.identitySectionTitle}>Display Name</Text>
			<TextInput
				radius="lg"
				size="md"
				value={displayName}
				onChange={event => setDisplayName(event.currentTarget.value)}
			/>
			<Space h={'xl'} />
			<Divider />
			<Text className={classes.identitySectionTitle}>
				Verify Accounts
			</Text>
			<Button
				className={classes.buttonSaveChanges}
				loading={isSavingChanges}
				onClick={saveChanges}
			>
				Save Changes
			</Button>
			<ProfileLinkTwitterModal
				identity={identity}
				isOpened={isTwitterModalOpen}
				onSuccessfulVerification={() => {
					// TODO: Add to list of verified accounts locally
				}}
				onModalClosed={() => {
					setIsTwitterModalOpen(false)
				}}
			/>
			<ProfileLinkEmailModal
				identity={identity}
				isOpened={isEmailModalOpen}
				onSuccessfulVerification={() => {
					// TODO: Add to list of verified accounts locally
				}}
				onModalClosed={() => {
					setIsEmailModalOpen(false)
				}}
			/>
			<ProfileLinkDiscordModal
				identity={identity}
				isOpened={isDiscordModalOpen}
				onSuccessfulVerification={() => {
					// TODO: Add to list of verified accounts locally
				}}
				onModalClosed={() => {
					setIsDiscordModalOpen(false)
				}}
			/>
			<div id="emojiCanvas" className={classes.emojiCanvas}>
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
