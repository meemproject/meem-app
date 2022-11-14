import log from '@kengoldfarb/log'
import { Text, Button, Textarea, Space, TextInput } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import React, { useEffect, useState } from 'react'
import { Club } from '../../../model/club/club'
import { useClubsTheme } from '../../Styles/ClubsTheme'
import { ClubAdminChangesModal } from '../ClubAdminChangesModal'
interface IProps {
	club: Club
}

export const CAClubDetails: React.FC<IProps> = ({ club }) => {
	const { classes: clubsTheme } = useClubsTheme()

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
		<div className={clubsTheme.fullWidth}>
			<Space h={12} />

			<Text className={clubsTheme.tLargeBold}>Club Profile</Text>
			<Space h={32} />

			<Text
				className={clubsTheme.tMediumBold}
			>{`What's your club called?`}</Text>
			<Space h={12} />
			<TextInput
				radius="lg"
				size="md"
				value={clubName}
				style={{ maxWidth: 800 }}
				onChange={event => setClubName(event.currentTarget.value)}
			/>
			<Space h={'xl'} />
			<Text className={clubsTheme.tMediumBold}>
				In a sentence, describe what your members do together.
			</Text>
			<Space h={12} />
			<Textarea
				radius="lg"
				size="md"
				minRows={2}
				maxRows={4}
				maxLength={140}
				style={{ maxWidth: 800 }}
				value={clubDescription}
				onChange={event =>
					setClubDescription(event.currentTarget.value)
				}
			/>

			<Space h={40} />
			<Button
				className={clubsTheme.buttonBlack}
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
