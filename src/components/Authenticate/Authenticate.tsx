import log from '@kengoldfarb/log'
import { Text, Button, Space, Container, Loader, Center } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useAuth, useSDK } from '@meemproject/react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useCallback, useState } from 'react'
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

				Cookies.set('redirectPath', JSON.stringify(router.asPath ?? ''))

				if (router.query.return) {
					router.push({
						pathname: router.query.return.toString()
					})
				}
			}
		} catch (e) {
			showNotification({
				radius: 'lg',
				title: 'Oops!',
				message:
					'Unable to sign into Meem with your wallet. Please get in touch!'
			})
			log.crit(e)
		}
		setIsLoading(false)
	}, [wallet, router, login])

	const connectWallet = useCallback(async () => {
		setIsLoading(true)
		await wallet.connectWallet()

		setIsLoading(false)
	}, [wallet])

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
								: `Please reconnect your wallet below first.`}
						</Text>
					</div>

					<Space h={40} />

					{isLoading && <Loader variant="oval" color={'blue'} />}
					<div>
						{!isLoading && !wallet.isConnected && (
							<Button
								className={meemTheme.buttonBlack}
								onClick={connectWallet}
							>
								Connect Wallet
							</Button>
						)}
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
