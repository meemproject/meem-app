import log from '@kengoldfarb/log'
import { Center, Space, Container, Loader } from '@mantine/core'
import { LoginState, useAuth } from '@meemproject/react'
import { MeemAPI, makeRequest } from '@meemproject/sdk'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect } from 'react'
import { CookieKeys } from '../../utils/cookies'
import {
	showErrorNotification,
	showSuccessNotification
} from '../../utils/notifications'

export const InviteContainer: React.FC = () => {
	const router = useRouter()
	const { loginState } = useAuth()

	const acceptInvite = useCallback(
		async (code: string) => {
			try {
				const { slug } =
					await makeRequest<MeemAPI.v1.AcceptAgreementInvite.IDefinition>(
						MeemAPI.v1.AcceptAgreementInvite.path(),
						{
							method: MeemAPI.v1.AcceptAgreementInvite.method,
							body: {
								code
							}
						}
					)

				showSuccessNotification('Invite accepted!', 'Redirecting...')

				router.push(`/${slug}`)
			} catch (e) {
				log.crit(e)
				showErrorNotification(
					'Unable to accept invite',
					'Please click the link in the email again.'
				)
				router.push('/')
			}
		},
		[router]
	)

	useEffect(() => {
		const code = router.query.code as string | undefined

		if (loginState === LoginState.Unknown) {
			return
		}

		if (loginState === LoginState.NotLoggedIn) {
			if (code) {
				Cookies.set(
					CookieKeys.authRedirectUrl,
					`${router.pathname}?code=${code}`
				)
				router.push('/authenticate')
			}
			return
		}

		if (code) {
			acceptInvite(code)
		} else {
			showErrorNotification(
				'Unable to accept invite',
				'Please click the link in the email again.'
			)
			router.push('/')
		}
	}, [router, acceptInvite, loginState])

	return (
		<Container>
			<Space h={120} />
			<Center>
				<Loader color="cyan" variant="oval" />
			</Center>
			<Space h={120} />
		</Container>
	)
}
