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
		marginBottom: 60,
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'row',
		paddingTop: 32,
		borderBottomColor: 'rgba(0, 0, 0, 0.08)',
		borderBottomWidth: '1px',
		borderBottomStyle: 'solid',
		paddingBottom: 32,
		paddingLeft: 32
	},
	headerClubName: {
		fontWeight: '600',
		fontSize: 24,
		marginLeft: 32
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

export const ClubDetailComponent: React.FC = () => {
	const { classes } = useStyles()
	const [isLoading, setIsLoading] = useState(true)

	return (
		<>
			<div className={classes.header}>
				<Image
					className={classes.clubLogoImage}
					src="/exampleclub.png"
					width={80}
					height={80}
					fit={'contain'}
				/>
				{/* <Text className={classes.headerClubName}>{clubName}</Text> */}
				<Text className={classes.headerClubName}>Harry Potter Fan Club</Text>
			</div>

			<Container>
				<Text className={classes.clubDescriptionPrompt}>Club detail</Text>
			</Container>
		</>
	)
}
