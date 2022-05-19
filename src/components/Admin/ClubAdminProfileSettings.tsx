/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	createStyles,
	Container,
	Text,
	Image,
	Loader,
	Button,
	Textarea,
	Space,
	TextInput
} from '@mantine/core'
import { base64StringToBlob } from 'blob-util'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import Resizer from 'react-image-file-resizer'
import { ArrowLeft, Upload } from 'tabler-icons-react'
import { useFilePicker } from 'use-file-picker'

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
	}
}))

export const ClubAdminProfileSettings: React.FC = () => {
	const router = useRouter()
	const { classes } = useStyles()

	const [clubName, setClubName] = useState('')
	const [clubDescription, setClubDescription] = useState('')
	const descriptionRef = useRef<HTMLTextAreaElement>()

	const [isLoading, setIsLoading] = useState(true)

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

	const navigateToClubDetail = () => {
		router.push({ pathname: '/clubname' })
	}

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
			console.log(file)
			setSmallClubLogo(file as string)
		}
		if (clubLogo.length > 0) {
			console.log('Found an image...')
			console.log(clubLogo[0].content)

			createResizedFile()
		} else {
			console.log('no current club image')
		}
	}, [clubLogo])

	const deleteImage = () => {
		setSmallClubLogo('')
	}

	return (
		<>
			<Space h={'lg'} />
			<Text
				className={classes.clubNamePrompt}
			>{`What's your club called?`}</Text>
			<TextInput
				radius="lg"
				size="md"
				value={clubName}
				onChange={event => setClubName(event.currentTarget.value)}
			/>
			<Space h={'xl'} />
			<Text className={classes.clubDescriptionPrompt}>
				In a sentence, describe what your members do together.
			</Text>
			<Textarea
				radius="lg"
				size="md"
				value={clubDescription}
				onChange={event => setClubDescription(event.currentTarget.value)}
			/>
			<Text className={classes.clubLogoPrompt}>
				Upload an icon for your club.
			</Text>
			<Text className={classes.clubLogoInfo}>
				This will be your club’s membership token. You can change it anytime.
				Icons should be square and either JPG or PNG files. Note that all
				uploads will be rendered at 24x24 px.
			</Text>
			{smallClubLogo.length === 0 && !isLoadingImage && (
				<Button
					leftIcon={<Upload size={14} />}
					className={classes.buttonUpload}
					onClick={() => openFileSelector()}
				>
					Upload
				</Button>
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
							src="/delete.png"
							width={24}
							height={24}
						/>
					</a>
				</div>
			)}
			<Space h={smallClubLogo.length > 0 ? 148 : 32} />
			<Button className={classes.buttonSaveChanges}>Save Changes</Button>
			<Space h={64} />
		</>
	)
}
