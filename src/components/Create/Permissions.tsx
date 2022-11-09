import { Container, Text } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { LoginState, useWallet } from '@meemproject/react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { CookieKeys } from '../../utils/cookies'
import { useGlobalStyles } from '../Styles/GlobalStyles'
import { ClubCreationMembershipSettings } from './ClubCreationMembershipSettings'

export const CreatePermissionsComponent: React.FC = () => {
	const { classes: design } = useGlobalStyles()

	const [clubName, setClubName] = useState('')
	const router = useRouter()
	const wallet = useWallet()

	useEffect(() => {
		if (wallet.loginState === LoginState.NotLoggedIn) {
			router.push({
				pathname: '/authenticate',
				query: {
					return: `/create/permissions`
				}
			})
		}
	}, [router, wallet.loginState])

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
			<div className={design.pageHeader}>
				<div>
					<Text className={design.tBoldFaded}>Create a club</Text>
					<Text className={design.tHeaderTitleText}>{clubName}</Text>
				</div>
			</div>

			<Container style={{ marginTop: '-24px' }}>
				<ClubCreationMembershipSettings />
			</Container>
		</>
	)
}
