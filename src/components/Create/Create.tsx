/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	createStyles,
	Container,
	Text,
	Center,
	Image,
	Loader,
	Button,
	Textarea
} from '@mantine/core'
import { base64StringToBlob } from 'blob-util'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import Resizer from 'react-image-file-resizer'
import { ArrowLeft, Upload } from 'tabler-icons-react'
import { useFilePicker } from 'use-file-picker'

const useStyles = createStyles(theme => ({
	header: {
		backgroundColor: 'rgba(160, 160, 160, 0.05)',
		marginBottom: 60,
		display: 'flex',
		alignItems: 'end',
		flexDirection: 'row',
		paddingTop: 24,
		paddingBottom: 24,
		paddingLeft: 32
	},
	headerArrow: {
		marginRight: 32,
		cursor: 'pointer'
	},
	headerPrompt: {
		fontSize: 16,
		marginBottom: 8,
		fontWeight: '500',
		color: 'rgba(0, 0, 0, 0.6)'
	},
	headerClubName: {
		fontWeight: '600',
		fontSize: 24
	},
	clubDescriptionPrompt: { fontSize: 18, marginBottom: 16, fontWeight: '600' },
	clubLogoPrompt: {
		marginTop: 32,
		fontSize: 18,
		marginBottom: 8,
		fontWeight: '600'
	},
	clubLogoInfo: {
		fontWeight: '500',
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
	}
}))

export const CreateComponent: React.FC = () => {
	const router = useRouter()
	const { classes } = useStyles()

	const clubName = router.query.clubname
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

	const navigateHome = () => {
		router.push({ pathname: '/' })
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
				<Text className={classes.clubDescriptionPrompt}>
					In a sentence, describe what your members do together.
				</Text>
				<Textarea
					radius="lg"
					size="md"
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
								src="delete.png"
								width={24}
								height={24}
							/>
						</a>
					</div>
				)}
			</Container>
			<Center>
				<Button
					disabled={clubDescription.length === 0 || smallClubLogo.length === 0}
					className={classes.buttonCreate}
				>
					Create Club
				</Button>
			</Center>
		</>
	)
}
