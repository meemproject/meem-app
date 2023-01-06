import { Container, Text } from '@mantine/core'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { CookieKeys } from '../../utils/cookies'
import { showErrorNotification } from '../../utils/notifications'
import { useMeemTheme } from '../Styles/MeemTheme'
import { AgreementCreationMembershipSettings } from './AgreementCreationMembershipSettings'

export const CreatePermissionsComponent: React.FC = () => {
	const { classes: meemTheme } = useMeemTheme()

	const [agreementName, setAgreementName] = useState('')
	const router = useRouter()

	useEffect(() => {
		if (Cookies.get(CookieKeys.agreementName) != null) {
			setAgreementName(Cookies.get(CookieKeys.agreementName) ?? '')
		} else {
			showErrorNotification(
				'Unable to create this community.',
				`Some data is missing. Try again!`
			)
			router.push({ pathname: '/' })
		}
	}, [agreementName, router])

	return (
		<>
			<div className={meemTheme.pageHeader}>
				<div>
					<Text className={meemTheme.tSmallBoldFaded}>
						Create a community
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
