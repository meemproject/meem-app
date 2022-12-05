import { Container, Text } from '@mantine/core'
import React, { useEffect } from 'react'
import { Club } from '../../../model/club/club'
import { useClubsTheme } from '../../Styles/ClubsTheme'
interface IProps {
	club: Club
}

export const ExampleExtensionSettings: React.FC<IProps> = ({ club }) => {
	const { classes: clubsTheme } = useClubsTheme()

	useEffect(() => {}, [club])

	return (
		<Container>
			<Text className={clubsTheme.tSmall}>
				This is the settings page for the example club extension.
			</Text>
		</Container>
	)
}