import log from '@kengoldfarb/log'
import { Text, Image, Loader, Button, Space, Modal } from '@mantine/core'
import { base64StringToBlob } from 'blob-util'
import type { EmojiClickData } from 'emoji-picker-react'
import html2canvas from 'html2canvas'
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import Resizer from 'react-image-file-resizer'
import { Upload } from 'tabler-icons-react'
import { useFilePicker } from 'use-file-picker'
import { Agreement } from '../../../model/agreement/agreements'
import { showErrorNotification } from '../../../utils/notifications'
import { useMeemTheme } from '../../Styles/MeemTheme'
import { AgreementAdminChangesModal } from '../AgreementAdminChangesModal'

const EmojiPicker = dynamic(() => import('emoji-picker-react'), {
	ssr: false
})

interface IProps {
	agreement: Agreement
}

export const AdminAgreementIcon: React.FC<IProps> = ({ agreement }) => {
	const { classes: meemTheme } = useMeemTheme()

	const [hasLoadedAgreementData, setHasLoadedAgreementData] = useState(false)
	const [isSavingChanges, setIsSavingChanges] = useState(false)

	const [chosenEmoji, setChosenEmoji] = useState<EmojiClickData>()

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

	useEffect(() => {
		if (!hasLoadedAgreementData) {
			setHasLoadedAgreementData(true)
			setSmallAgreementLogo(agreement.image ?? '')
		}
	}, [agreement, hasLoadedAgreementData])

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

			createResizedFile()
		} else {
			// log.debug('no current agreement image')
		}
	}, [agreementLogo])

	const deleteImage = () => {
		setSmallAgreementLogo('')
	}

	const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
	const openEmojiPicker = () => {
		setIsEmojiPickerOpen(true)
	}

	function timeout(delay: number) {
		return new Promise(res => setTimeout(res, delay))
	}

	const onEmojiClick = async (emojiObject: EmojiClickData) => {
		setChosenEmoji(emojiObject)
		setIsEmojiPickerOpen(false)
		await timeout(100)
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

	const [newAgreementData, setNewAgreementData] = useState<Agreement>()
	const [isSaveChangesModalOpened, setSaveChangesModalOpened] =
		useState(false)
	const openSaveChangesModal = () => {
		// Some basic validation

		if (smallAgreementLogo.length === 0) {
			showErrorNotification(
				'Oops!',
				'Please provide an image for your community.'
			)
		}

		// 'save changes' modal for execution agreement settings updates
		// convert current settings and update for the modal
		const oldAgreement = JSON.stringify(agreement)
		const newAgreement = JSON.parse(oldAgreement)
		newAgreement.name = agreement.name
		newAgreement.description = agreement.description
		newAgreement.image = smallAgreementLogo

		if (oldAgreement === JSON.stringify(newAgreement)) {
			log.debug('no changes, nothing to save. Tell user.')
			setIsSavingChanges(false)
			showErrorNotification('Oops!', 'There are no changes to save.')
			return
		} else {
			setNewAgreementData(newAgreement)
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
			<Text className={meemTheme.tLargeBold}>Community Icon</Text>
			<Space h={24} />
			<Text className={meemTheme.tMediumBold}>
				Upload an icon to represent your community.
			</Text>
			<Space h={8} />
			<Text
				className={meemTheme.tExtraSmall}
				style={{
					maxWidth: 650
				}}
			>
				This will be your community’s membership token. You can change
				it anytime. Icons should be square and either JPG or PNG files.
				Note that the image may take a moment to update.
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
							className={meemTheme.imageAgreementLogoDeleteButton}
							src="/delete.png"
							width={24}
							height={24}
						/>
					</a>
				</div>
			)}
			<Space h={smallAgreementLogo.length > 0 ? 148 : 40} />
			<Button
				className={meemTheme.buttonBlack}
				loading={isSavingChanges}
				onClick={saveChanges}
			>
				Save Changes
			</Button>
			<Space h={64} />
			<AgreementAdminChangesModal
				agreement={newAgreementData}
				isOpened={isSaveChangesModalOpened}
				onModalClosed={() => {
					setIsSavingChanges(false)
					setSaveChangesModalOpened(false)
				}}
			/>
			<div id="emojiCanvas" className={meemTheme.emojiCanvas}>
				{chosenEmoji && <>{chosenEmoji.emoji}</>}
			</div>
			<Modal
				withCloseButton={false}
				padding={8}
				overlayBlur={8}
				size={366}
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
