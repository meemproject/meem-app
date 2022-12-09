import { Text } from '@mantine/core'
import React from 'react'
import { Club } from '../../../model/club/club'
import { useClubsTheme } from '../../Styles/ClubsTheme'

/*
Access club-level data using the 'club' object.
*/
interface IProps {
	club: Club
}

/*
Be sure to import your widget in ClubHome.tsx to ensure it is displayed
when enabled.
*/
export const ExampleWidget: React.FC<IProps> = ({ club }) => {
	/*
	Use the clubsTheme object to access clubs styles
	such as colors, fonts and layouts
	*/
	const { classes: clubsTheme } = useClubsTheme()

	return (
		/*
		Ensure your widget's UI is contained entirely within the parent <div> element.
		*/
		<div className={clubsTheme.widgetLight}>
			<Text className={clubsTheme.tSmall}>
				{`This is an example Club Extension Widget for ${club.name}`}
			</Text>
		</div>
	)
}
