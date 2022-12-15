import { Space, Text } from '@mantine/core'
import { useRouter } from 'next/router'
import React from 'react'
import { Settings } from 'tabler-icons-react'
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
	const router = useRouter()
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
			<div className={clubsTheme.spacedRowCentered}>
				<div className={clubsTheme.centeredRow}>
					<Text className={clubsTheme.tMediumBold}>
						Example Extension Widget
					</Text>
					<Space w={6} />
				</div>
				<div className={clubsTheme.centeredRow}>
					{club.isCurrentUserClubAdmin && (
						<div className={clubsTheme.row}>
							<Space w={8} />
							<Settings
								className={clubsTheme.clickable}
								onClick={() => {
									router.push({
										pathname: `/${club.slug}/e/example/settings`
									})
								}}
							/>
						</div>
					)}
				</div>
			</div>
			<Space h={24} />
			<Text className={clubsTheme.tSmall}>
				{`This is an example Club Extension Widget for ${club.name}`}
			</Text>
		</div>
	)
}
