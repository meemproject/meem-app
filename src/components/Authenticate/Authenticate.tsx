import log from '@kengoldfarb/log'
import { Text, Button, Space, Container, Loader, Center } from '@mantine/core'
import { LoginForm, useAuth, useSDK } from '@meemproject/react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useCallback, useState } from 'react'
import { CookieKeys } from '../../utils/cookies'
import { showErrorNotification } from '../../utils/notifications'
import { useMeemTheme } from '../Styles/MeemTheme'

const MAuthenticate: React.FC = () => {
	const wallet = useAuth()
	const router = useRouter()
	const { login } = useSDK()

	const [isLoading, setIsLoading] = useState(false)
	const { classes: meemTheme } = useMeemTheme()
	const sign = useCallback(async () => {
		setIsLoading(true)

		try {
			if (wallet.signer && wallet.chainId) {
				await login({
					message: process.env.NEXT_PUBLIC_LOGIN_MESSAGE ?? '',
					signer: wallet.signer,
					chainId: wallet.chainId,
					uri: window.location.href
				})

				const redirect = Cookies.get(CookieKeys.authRedirectUrl)

				if (redirect && !redirect?.includes('authenticate')) {
					const fixedPathName = redirect.replaceAll('%3F', '?')
					log.debug(`fixed path name = ${fixedPathName}`)
					router.push(fixedPathName)
				} else {
					router.push('/')
				}
			}
		} catch (e) {
			setIsLoading(false)
			showErrorNotification(
				'Oops!',
				'Unable to sign into Meem with your wallet. Contact us using the top-right link on this page.'
			)
			log.crit(e)
		}
	}, [wallet, router, login])

	return (
		<Center>
			<Container>
				<div className={meemTheme.centered}>
					<Space h={80} />
					<Text
						className={meemTheme.tLargeBold}
					>{`Sign in with Meem`}</Text>
					<Space h={16} />

					<div>
						<Text>
							{wallet.isConnected
								? `Please sign the message below.`
								: `Connect with your wallet or email address.`}
						</Text>
					</div>

					<Space h={40} />

					{isLoading && <Loader variant="oval" color={'cyan'} />}
					<div>
						{!isLoading && !wallet.isConnected && <LoginForm />}
						{!isLoading && wallet.isConnected && (
							<Button
								className={meemTheme.buttonBlack}
								onClick={sign}
							>
								Sign Message
							</Button>
						)}
					</div>
				</div>
			</Container>
		</Center>
	)
}

export default MAuthenticate
