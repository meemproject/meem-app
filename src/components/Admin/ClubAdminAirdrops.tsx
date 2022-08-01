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
import { Club, Integration } from '../../model/club/club'
import { ClubAdminChangesModal } from './ClubAdminChangesModal'

const EmojiPicker = dynamic(() => import('emoji-picker-react'), {
	ssr: false
})

const useStyles = createStyles(theme => ({
	manageClubHeader: {
		fontWeight: 600,
		fontSize: 20,
		marginBottom: 32
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
	clubAdminsPrompt: {
		fontSize: 18,
		marginBottom: 16,
		fontWeight: 600,
		marginTop: 36
	},
	clubAdminsInstructions: {
		fontSize: 18,
		marginBottom: 16,
		color: 'rgba(0, 0, 0, 0.6)'
	}
}))

interface IProps {
	club: Club
}

export const ClubAdminAirdrops: React.FC<IProps> = ({ club }) => {
	const { classes } = useStyles()

	const [isSavingChanges, setIsSavingChanges] = useState(false)
	const [airdropAddressesString, setAirdropAddressesString] = useState('')
	const [airdropAddresses, setAirdropAddresses] = useState<string[]>([])

	const parseAirdropAddresses = (rawString: string) => {
		setAirdropAddressesString(rawString)
		const adminsList = rawString.split('\n')
		const finalList: string[] = []
		adminsList.forEach(potentialAdmin => {
			if (potentialAdmin.length > 0) {
				finalList.push(potentialAdmin)
			}
		})
		log.debug(`admins count = ${finalList.length + 1}`)
		setAirdropAddresses(finalList)
	}

	const sendAirdrops = async () => {
		setIsSavingChanges(true)
		// TODO: Airdrop - make sure to convert ENS if necessary

		// TODO: clear contents of TextArea if transactions were successful
	}

	return (
		<>
			<div>
				<Text className={classes.clubAdminsPrompt}>
					Invite others to your club by airdropping them a club token.
					They will automatically become a club member.
				</Text>
				<Text className={classes.clubAdminsInstructions}>
					Add a line break between each address or ENS name.
				</Text>
				<Textarea
					radius="lg"
					size="sm"
					value={airdropAddressesString}
					minRows={10}
					onChange={event =>
						parseAirdropAddresses(event.currentTarget.value)
					}
				/>
			</div>
			<Space h={32} />
			<Button
				className={classes.buttonSaveChanges}
				loading={isSavingChanges}
				onClick={sendAirdrops}
			>
				Airdrop
			</Button>
			<Space h={64} />
		</>
	)
}
