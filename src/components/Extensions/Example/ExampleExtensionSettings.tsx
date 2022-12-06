import { Container, Loader, Text } from '@mantine/core'
import React, { useContext } from 'react'
import ClubContext from '../../ClubHome/ClubProvider'
import { useClubsTheme } from '../../Styles/ClubsTheme'

export const ExampleExtensionSettings: React.FC = () => {
	const { classes: clubsTheme } = useClubsTheme()

	const { club, isLoadingClub, error } = useContext(ClubContext)

	return (
		<Container>
			{club && (
				<Text className={clubsTheme.tSmall}>
					{`${club.name} - This is the settings page for the example club extension`}
				</Text>
			)}
			{isLoadingClub && <Loader variant="oval" color="red" />}
			{!isLoadingClub && error && (
				<Text className={clubsTheme.tSmall}>
					Error loading this club!
				</Text>
			)}
		</Container>
	)
}
