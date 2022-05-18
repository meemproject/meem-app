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
	Textarea,
	TextInput,
	Space
} from '@mantine/core'
import { useWallet } from '@meemproject/react'
import { base64StringToBlob } from 'blob-util'
// eslint-disable-next-line import/no-extraneous-dependencies
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import Resizer from 'react-image-file-resizer'
import { ArrowLeft, Upload } from 'tabler-icons-react'
import { useFilePicker } from 'use-file-picker'
import { CookieKeys } from '../../utils/cookies'
import { ClubAdminMembershipSettingsComponent } from '../Admin/ClubAdminMembershipSettings'

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
		paddingLeft: 192
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
	}
}))

export const CreatePermissionsComponent: React.FC = () => {
	const router = useRouter()
	const { classes } = useStyles()

	const [isLoading, setIsLoading] = useState(true)

	const navigateHome = () => {
		router.push({ pathname: '/' })
	}

	return (
		<>
			<div className={classes.header}>
				{/* <a onClick={navigateHome}>
					<ArrowLeft className={classes.headerArrow} size={32} />
				</a> */}
				<div>
					<Text className={classes.headerPrompt}>Create a club</Text>
					<Text className={classes.headerClubName}>
						{Cookies.get(CookieKeys.clubName)}
					</Text>
				</div>
			</div>

			<Container>
				<ClubAdminMembershipSettingsComponent isCreatingClub />
			</Container>
		</>
	)
}
