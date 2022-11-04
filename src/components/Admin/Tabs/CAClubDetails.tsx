import log from '@kengoldfarb/log'
import {
	createStyles,
	Text,
	Button,
	Textarea,
	Space,
	TextInput
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import React, { useEffect, useState } from 'react'
import { Club } from '../../../model/club/club'
import { ClubAdminChangesModal } from '../ClubAdminChangesModal'

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
	container: {
		width: '100%'
	},
	manageClubHeader: {
		fontWeight: 600,
		fontSize: 20,
		marginBottom: 32
	},
	textField: {
		maxWidth: 800
	}
}))

interface IProps {
	club: Club
}

export const CAClubDetails: React.FC<IProps> = ({ club }) => {
	const { classes } = useStyles()

	const [clubName, setClubName] = useState('')
	const [clubDescription, setClubDescription] = useState('')
	const [hasLoadedClubData, setHasLoadedClubData] = useState(false)
	const [isSavingChanges, setIsSavingChanges] = useState(false)

	useEffect(() => {
		if (!hasLoadedClubData) {
			setHasLoadedClubData(true)
			setClubName(club.name ?? '')
			setClubDescription(club.description ?? '')
		}
	}, [club, hasLoadedClubData])

	const [newClubData, setNewClubData] = useState<Club>()
	const [isSaveChangesModalOpened, setSaveChangesModalOpened] =
		useState(false)
	const openSaveChangesModal = () => {
		// Some basic validation
		if (clubName.length < 3 || clubName.length > 50) {
			// Club name invalid
			showNotification({
				radius: 'lg',
				title: 'Oops!',
				message:
					'You entered an invalid club name. Please choose a longer or shorter name.'
			})
			return
		}

		if (clubDescription.length < 3 || clubDescription.length > 140) {
			// Club name invalid
			showNotification({
				radius: 'lg',
				title: 'Oops!',
				message:
					'You entered an invalid club description. Please choose a longer or shorter description.'
			})
			return
		}

		// 'save changes' modal for execution club settings updates
		// convert current settings and update for the modal
		const oldClub = JSON.stringify(club)
		const newClub = JSON.parse(oldClub)
		newClub.name = clubName
		newClub.description = clubDescription
		newClub.image = club.image

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
		<div className={classes.container}>
			<Space h={12} />

			<Text className={classes.manageClubHeader}>Club Profile</Text>

			<Text
				className={classes.clubNamePrompt}
			>{`What's your club called?`}</Text>
			<TextInput
				radius="lg"
				size="md"
				value={clubName}
				className={classes.textField}
				onChange={event => setClubName(event.currentTarget.value)}
			/>
			<Space h={'xl'} />
			<Text className={classes.clubDescriptionPrompt}>
				In a sentence, describe what your members do together.
			</Text>
			<Textarea
				radius="lg"
				size="md"
				minRows={2}
				maxRows={4}
				maxLength={140}
				className={classes.textField}
				value={clubDescription}
				onChange={event =>
					setClubDescription(event.currentTarget.value)
				}
			/>

			<Space h={32} />
			<Button
				className={classes.buttonSaveChanges}
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
		</div>
	)
}
