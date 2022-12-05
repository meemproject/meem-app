import log from '@kengoldfarb/log'
import { Text, Button, Space, Container, Loader, Center } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useAuth, useMeemSDK } from '@meemproject/react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useCallback, useState } from 'react'
import { useClubsTheme } from '../Styles/ClubsTheme'

const MAuthenticate: React.FC = () => {
	const wallet = useAuth()
	const router = useRouter()
	const { sdk } = useMeemSDK()

	const [isLoading, setIsLoading] = useState(false)
	const { classes: clubsTheme } = useClubsTheme()

	const login = useCallback(
		async (walletSig: string) => {
			const address = wallet.accounts[0]

			log.info('Logging in to Meem...')
			log.debug(`address = ${wallet.accounts[0]}`)
			log.debug(`sig = ${walletSig}`)

			if (address && walletSig) {
				try {
					setIsLoading(true)
					const loginRequest = await sdk.id.login({
						address,
						signature: walletSig
					})

					log.debug(`logged in successfully.`, { loginRequest })
					wallet.setJwt(loginRequest.jwt)
					log.debug(`setting full pathname as ${router.asPath}`)
					Cookies.set(
						'redirectPath',
						JSON.stringify(router.asPath ?? '')
					)
					router.push({
						pathname: router.query.return
							? (router.query.return as string)
							: '/'
					})
				} catch (e) {
					log.error(e)
					showNotification({
						radius: 'lg',
						title: 'Login Failed',
						message: 'Please refresh the page and try again.'
					})
					setIsLoading(false)
				}
			}
		},
		[router, wallet, sdk]
	)

	const sign = useCallback(async () => {
		const address = wallet.accounts[0]
		setIsLoading(true)

		try {
			const { nonce } = await sdk.id.getNonce({
				address
			})
			log.debug('got nonce')
			const signature = await wallet.signer?.signMessage(nonce)
			log.debug({ signature })

			if (signature === undefined) {
				log.debug('Unable to authenticate - signature is undefined.')
				showNotification({
					radius: 'lg',
					title: 'Oops!',
					message:
						'Unable to authenticate with your wallet. Please try again.'
				})
				setIsLoading(false)
			} else {
				login(signature)
			}
		} catch (e) {
			showNotification({
				radius: 'lg',
				title: 'Oops!',
				message:
					'Unable to authenticate with your wallet. Please get in touch!'
			})
			setIsLoading(false)
			log.crit(e)
		}
	}, [login, wallet.signer, wallet.accounts, sdk])

	const connectWallet = useCallback(async () => {
		setIsLoading(true)
		await wallet.connectWallet()

		setIsLoading(false)
	}, [wallet])

	return (
		<Center>
			<Container>
				<div className={clubsTheme.centered}>
					<Space h={80} />
					<Text
						className={clubsTheme.tLargeBold}
					>{`Let's make sure it's really you.`}</Text>
					<Space h={16} />

					<div>
						<Text>
							{wallet.isConnected
								? `Please sign the message below.`
								: `Please reconnect your wallet below first.`}
						</Text>
					</div>

					<Space h={40} />

					{isLoading && <Loader variant="oval" color={'red'} />}
					<div>
						{!isLoading && !wallet.isConnected && (
							<Button
								className={clubsTheme.buttonBlack}
								onClick={connectWallet}
							>
								Connect Wallet
							</Button>
						)}
						{!isLoading && wallet.isConnected && (
							<Button
								className={clubsTheme.buttonBlack}
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
