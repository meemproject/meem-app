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

export const ClubMembersWidget: React.FC<IProps> = ({ club }) => {
	const { classes: clubsTheme } = useClubsTheme()

	useEffect(() => {}, [club])

	return (
		<>
			<div className={clubsTheme.widgetLight}>
				<div className={clubsTheme.spacedRowCentered}>
					<div className={clubsTheme.centeredRow}>
						<Text className={clubsTheme.tLargeBold}>Members</Text>
						<Space w={8} />
						<Text
							className={clubsTheme.tLarge}
							style={{ color: colorDarkGrey }}
						>{`(${club.memberCount})`}</Text>
					</div>
					<Button className={clubsTheme.buttonRed}>View All</Button>
				</div>
				<Space h={24} />
				{postWidget()}
				{postWidget()}
			</div>
		</>
	)
}
