import log from '@kengoldfarb/log'
import {
	createStyles,
	Text,
	Button,
	Space,
	Container,
	Loader
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { MeemAPI } from '@meemproject/api'
import { useWallet, makeFetcher, makeRequest } from '@meemproject/react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'

const MAuthenticate: React.FC = () => {
	const wallet = useWallet()
	const router = useRouter()

	const useStyles = createStyles(theme => ({
		buttonSaveChanges: {
			marginTop: 48,
			marginBottom: 48,

			backgroundColor: 'black',
			'&:hover': {
				backgroundColor: theme.colors.gray[8]
			},
			borderRadius: 24
		},
		authHeader: {
			fontSize: 24,
			fontWeight: 600,
			marginTop: 60
		},
		authSubHeader: {
			fontSize: 20,
			fontWeight: 600,
			marginTop: 16
		},
		loader: {
			marginTop: 48
		}
	}))

	const [isConnected, setIsConnected] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const { classes } = useStyles()

	const getNonceFetcher = makeFetcher<
		MeemAPI.v1.GetNonce.IQueryParams,
		MeemAPI.v1.GetNonce.IRequestBody,
		MeemAPI.v1.GetNonce.IResponseBody
	>({
		method: MeemAPI.v1.GetNonce.method
	})

	useEffect(() => {
		setIsConnected(wallet.isConnected)
	}, [wallet.isConnected])

	const login = useCallback(
		async (walletSig: string) => {
			const address = wallet.accounts[0]

			log.info('Logging in to Meem...')
			log.debug(`address = ${wallet.accounts[0]}`)
			log.debug(`sig = ${walletSig}`)

			if (address && walletSig) {
				try {
					setIsLoading(true)

					const loginRequest =
						await makeRequest<MeemAPI.v1.Login.IDefinition>(
							MeemAPI.v1.Login.path(),
							{
								method: MeemAPI.v1.Login.method,
								body: {
									address,
									signature: walletSig
								}
							}
						)

					log.debug(`logged in successfully.`)
					wallet.setJwt(loginRequest.jwt)

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
				}
			}

			setIsLoading(false)
		},
		[router, wallet]
	)

	const sign = useCallback(async () => {
		const address = wallet.accounts[0]
		setIsLoading(true)

		try {
			const { nonce } = await getNonceFetcher(
				MeemAPI.v1.GetNonce.path(),
				{
					address
				}
			)
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
	}, [getNonceFetcher, login, wallet.signer, wallet.accounts])

	const connectWallet = useCallback(async () => {
		setIsLoading(true)
		await wallet.connectWallet()

		const address = wallet.accounts[0]
		if (address) {
			setIsConnected(true)
			setIsLoading(false)
		} else {
			log.debug('Unable to authenticate - wallet address not found.')
			showNotification({
				radius: 'lg',
				title: 'Oops!',
				message:
					'Unable to authenticate with your wallet. Please try again.'
			})
		}
	}, [wallet])

	return (
		<Container>
			<Text
				className={classes.authHeader}
			>{`Let's make sure it's really you.`}</Text>
			<div>
				<Text className={classes.authSubHeader}>
					{wallet.isConnected
						? 'Add Your Signature'
						: 'Connect Your Wallet'}
				</Text>
				<Space h={16} />
			</div>

			<div>
				<Text>
					{wallet.isConnected
						? `Let's connect your wallet again.`
						: `Please sign a message to confirm it's really you. The signature request might take a moment
					to pop up - please be patient!`}
				</Text>
			</div>

			{isLoading && (
				<Loader
					className={classes.loader}
					variant="bars"
					color={'red'}
				/>
			)}
			<div>
				{!isLoading && !isConnected && (
					<Button
						className={classes.buttonSaveChanges}
						onClick={connectWallet}
					>
						Connect wallet
					</Button>
				)}
				{!isLoading && isConnected && (
					<Button
						className={classes.buttonSaveChanges}
						onClick={sign}
					>
						Add your signature
					</Button>
				)}
			</div>
		</Container>
	)
}

export default MAuthenticate
