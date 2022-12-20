import { Container, Text } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { CookieKeys } from '../../utils/cookies'
import { useMeemTheme } from '../Styles/AgreementsTheme'
import { AgreementCreationMembershipSettings } from './AgreementCreationMembershipSettings'

export const CreatePermissionsComponent: React.FC = () => {
	const { classes: meemTheme } = useMeemTheme()

	const [agreementName, setAgreementName] = useState('')
	const router = useRouter()

	useEffect(() => {
		if (Cookies.get(CookieKeys.agreementName) != null) {
			setAgreementName(Cookies.get(CookieKeys.agreementName) ?? '')
		} else {
			showNotification({
				radius: 'lg',
				title: 'Unable to create this agreement.',
				message: `Some data is missing. Try again!`,
				autoClose: 5000
			})
			router.push({ pathname: '/' })
		}
	}, [agreementName, router])

	return (
		<>
			<div className={meemTheme.pageHeader}>
				<div>
					<Text className={meemTheme.tSmallBoldFaded}>
						Create a agreement
					</Text>
					<Text className={meemTheme.tLargeBold}>
						{agreementName}
					</Text>
				</div>
			</div>

			<Container style={{ marginTop: '-24px' }}>
				<AgreementCreationMembershipSettings />
			</Container>
		</>
	)
}
