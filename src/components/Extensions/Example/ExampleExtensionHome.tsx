import { Center, Container, Loader, Space, Text } from '@mantine/core'
import React from 'react'
import { useClub } from '../../ClubHome/ClubProvider'
import { useClubsTheme } from '../../Styles/ClubsTheme'

export const ExampleExtensionHome: React.FC = () => {
	/*
	Use the clubsTheme object to access clubs styles
	such as colors, fonts and layouts
	*/
	const { classes: clubsTheme } = useClubsTheme()

	/*
	Access the club, loading and error states using ClubContext.
	Look inside /pages/e/example/index.tsx for an example of how
	the ClubProvider and ClubContext is used to fetch a club
	where required.
	*/
	const { club, isLoadingClub, error } = useClub()

	return (
		<Container>
			<Space h={64} />

			{/* Club loaded state */}
			{club && (
				<Text className={clubsTheme.tSmall}>
					{`This is the homepage for the example club extension`}
				</Text>
			)}
			{/* Club loading state */}
			{isLoadingClub && (
				<>
					<Center>
						<Loader variant="oval" color="blue" />
					</Center>
				</>
			)}

			{/* Club error state */}
			{!isLoadingClub && error && (
				<>
					<Center>
						<Text className={clubsTheme.tSmall}>
							Error loading this extension!
						</Text>
					</Center>
				</>
			)}
		</Container>
	)
}
