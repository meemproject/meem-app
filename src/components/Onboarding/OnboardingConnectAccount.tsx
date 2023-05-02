import { useQuery } from '@apollo/client'
import {
	Center,
	Space,
	Text,
	Button,
	Grid,
	Container,
	Loader
} from '@mantine/core'
import { useMeemApollo, useWallet } from '@meemproject/react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { MyAgreementsQueryQuery } from '../../../generated/graphql'
import { GET_MY_AGREEMENTS } from '../../graphql/agreements'
import { CookieKeys } from '../../utils/cookies'
import { useMeemTheme } from '../Styles/MeemTheme'

export function OnboardingConnectAccount() {
	const router = useRouter()

	const { classes: meemTheme } = useMeemTheme()

	const wallet = useWallet()

	const authIfNecessary = () => {
		Cookies.set(CookieKeys.authRedirectUrl, window.location.toString())
		router.push('/authenticate')
	}

	return <div className={meemTheme.backgroundMeem}>Hello connect account</div>
}
