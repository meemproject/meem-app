/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { Text, Space, Radio, Button } from '@mantine/core'
import React, { useState } from 'react'
import { Club } from '../../../model/club/club'
import { useClubsTheme } from '../../Styles/ClubsTheme'
import { DeleteClubModal } from '../Modals/DeleteClubModal'

interface IProps {
	club: Club
}

export const CADeleteClub: React.FC<IProps> = ({ club }) => {
	const { classes: clubsTheme } = useClubsTheme()

	const [isDeleteClubModalOpened, setIsDeleteClubModalOpened] =
		useState(false)

	return (
		<div className={clubsTheme.fullWidth}>
			<Space h={16} />

			<Text className={clubsTheme.tLargeBold}>Delete Club</Text>
			<Space h={24} />

			<Text
				className={clubsTheme.tSmallBold}
			>{`Once deleted, your club will be removed from the Clubs database and will no longer be discoverable for new or existing members. This action cannot be undone.`}</Text>
			<Space h={16} />

			<Text>{`Contract admins will still be able to manage the club’s contract either manually or with EPM.`}</Text>
			<Space h={24} />

			<Button
				className={clubsTheme.buttonRed}
				onClick={() => {
					setIsDeleteClubModalOpened(true)
				}}
			/>
			<DeleteClubModal
				isOpened={isDeleteClubModalOpened}
				onModalClosed={() => {
					setIsDeleteClubModalOpened(false)
				}}
				club={club}
			/>
		</div>
	)
}
