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

export const ClubForumWidget: React.FC<IProps> = ({ club }) => {
	const { classes: clubsTheme } = useClubsTheme()

	useEffect(() => {}, [club])

	return <div>Club Forum</div>
}
