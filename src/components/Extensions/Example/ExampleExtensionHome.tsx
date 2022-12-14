import { Container, Loader, Text } from '@mantine/core'
import React from 'react'
import { useClub } from '../../ClubHome/ClubProvider'
import { useClubsTheme } from '../../Styles/ClubsTheme'

export const ExampleExtensionHome: React.FC = () => {
	const { classes: clubsTheme } = useClubsTheme()
	const { club, isLoadingClub, error } = useClub()

	return (
		<Container>
			{club && (
				<Text className={clubsTheme.tSmall}>
					{`${club.name} - This is the homepage for the example club extension`}
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
