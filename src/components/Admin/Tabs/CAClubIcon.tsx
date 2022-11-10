import log from '@kengoldfarb/log'
import { Text, Image, Loader, Button, Space, Modal } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { base64StringToBlob } from 'blob-util'
import html2canvas from 'html2canvas'
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import Resizer from 'react-image-file-resizer'
import { Upload } from 'tabler-icons-react'
import { useFilePicker } from 'use-file-picker'
import { Club } from '../../../model/club/club'
import { useGlobalStyles } from '../../Styles/GlobalStyles'
import { ClubAdminChangesModal } from '../ClubAdminChangesModal'

const EmojiPicker = dynamic(() => import('emoji-picker-react'), {
	ssr: false
})

interface IProps {
	club: Club
}

export const CAClubIcon: React.FC<IProps> = ({ club }) => {
	const { classes: design } = useGlobalStyles()

	const [hasLoadedClubData, setHasLoadedClubData] = useState(false)
	const [isSavingChanges, setIsSavingChanges] = useState(false)

	const [chosenEmoji, setChosenEmoji] = useState<any>(null)

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

	useEffect(() => {
		if (!hasLoadedClubData) {
			setHasLoadedClubData(true)
			setSmallClubLogo(club.image ?? '')
		}
	}, [club, hasLoadedClubData])

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
	}, [clubLogo])

	const deleteImage = () => {
		setSmallClubLogo('')
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

	const [newClubData, setNewClubData] = useState<Club>()
	const [isSaveChangesModalOpened, setSaveChangesModalOpened] =
		useState(false)
	const openSaveChangesModal = () => {
		// Some basic validation

		if (smallClubLogo.length === 0) {
			showNotification({
				radius: 'lg',
				title: 'Oops!',
				message: 'Please provide a club logo.'
			})
		}

		// 'save changes' modal for execution club settings updates
		// convert current settings and update for the modal
		const oldClub = JSON.stringify(club)
		const newClub = JSON.parse(oldClub)
		newClub.name = club.name
		newClub.description = club.description
		newClub.image = smallClubLogo

		if (oldClub === JSON.stringify(newClub)) {
			log.debug('no changes, nothing to save. Tell user.')
			setIsSavingChanges(false)
			showNotification({
				radius: 'lg',
				title: 'Oops!',
				message: 'There are no changes to save.'
			})
			return
		} else {
			setNewClubData(newClub)
			setSaveChangesModalOpened(true)
		}
	}

	const saveChanges = async () => {
		setIsSavingChanges(true)
		openSaveChangesModal()
	}

	return (
		<>
			<Space h={12} />
			<Text className={design.tMediumBold}>Club Icon</Text>
			<Space h={32} />
			<Text className={design.tMediumBold}>
				Upload an icon for your club.
			</Text>
			<Text
				className={design.tExtraSmall}
				style={{
					maxWidth: 650,
					color: 'rgba(45, 28, 28, 0.6)'
				}}
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
							src="/delete.png"
							width={24}
							height={24}
						/>
					</a>
				</div>
			)}
			<Space h={smallClubLogo.length > 0 ? 148 : 32} />
			<Button
				className={design.buttonBlack}
				loading={isSavingChanges}
				onClick={saveChanges}
			>
				Save Changes
			</Button>
			<Space h={64} />
			<ClubAdminChangesModal
				club={newClubData}
				isOpened={isSaveChangesModalOpened}
				onModalClosed={() => {
					setIsSavingChanges(false)
					setSaveChangesModalOpened(false)
				}}
			/>
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
