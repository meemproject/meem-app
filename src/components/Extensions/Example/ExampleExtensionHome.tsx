import { Container, Loader, Space, Text } from '@mantine/core'
import React, { useContext } from 'react'
import ClubContext from '../../ClubHome/ClubProvider'
import { useClubsTheme } from '../../Styles/ClubsTheme'

export const ExampleExtensionHome: React.FC = () => {
	const { classes: clubsTheme } = useClubsTheme()
	const { club, isLoadingClub, error } = useContext(ClubContext)

	return (
		<Container>
			<Space h={64} />
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
