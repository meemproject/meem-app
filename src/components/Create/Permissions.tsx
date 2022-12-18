import { Container, Text } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { CookieKeys } from '../../utils/cookies'
import { useClubsTheme } from '../Styles/ClubsTheme'
import { ClubCreationMembershipSettings } from './ClubCreationMembershipSettings'

export const CreatePermissionsComponent: React.FC = () => {
	const { classes: clubsTheme } = useClubsTheme()

	const [clubName, setClubName] = useState('')
	const router = useRouter()

	useEffect(() => {
		if (Cookies.get(CookieKeys.clubName) != null) {
			setClubName(Cookies.get(CookieKeys.clubName) ?? '')
		} else {
			showNotification({
				radius: 'lg',
				title: 'Unable to create this club.',
				message: `Some data is missing. Try again!`,
				autoClose: 5000
			})
			router.push({ pathname: '/' })
		}
	}, [clubName, router])

	return (
		<>
			<div className={clubsTheme.pageHeader}>
				<div>
					<Text className={clubsTheme.tSmallBoldFaded}>
						Create a club
					</Text>
					<Text className={clubsTheme.tLargeBold}>{clubName}</Text>
				</div>
			</div>

			<Container style={{ marginTop: '-24px' }}>
				<ClubCreationMembershipSettings />
			</Container>
		</>
	)
}
