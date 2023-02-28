import { Button, Modal, Space, Image, Center, Text } from '@mantine/core'
import { useAuth, useWallet } from '@meemproject/react'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { CookieKeys } from '../utils/cookies'
import { useMeemTheme } from './Styles/MeemTheme'

export interface IProps {
	children: React.ReactNode
}

export function hostnameToChainId(hostname: string): number {
	if (process.env.NEXT_PUBLIC_CHAIN_ID) {
		return +process.env.NEXT_PUBLIC_CHAIN_ID
	}

	const subHostname = hostname.split('.')[0]
	let expectedChainId = 0

	switch (subHostname) {
		case 'rinkeby':
			expectedChainId = 4
			break

		case 'goerli':
			expectedChainId = 5
			break

		case 'mumbai':
			expectedChainId = 80001
			break

		case 'arbitrum-goerli':
			expectedChainId = 421613
			break

		case 'optimism-goerli':
			expectedChainId = 420
			break

		default:
			break
	}

	return expectedChainId
}

export const App: React.FC<IProps> = ({ children }) => {
	const { chainId, setChain } = useAuth()
	const { classes: meemTheme } = useMeemTheme()
	const router = useRouter()
	const wallet = useWallet()

	let expectedChainId = process.env.NEXT_PUBLIC_CHAIN_ID
		? +process.env.NEXT_PUBLIC_CHAIN_ID
		: 0

	if (typeof window !== 'undefined' && !expectedChainId) {
		expectedChainId = hostnameToChainId(window.location.hostname)
	}

	const isWrongChainId =
		typeof window !== 'undefined' &&
		chainId !== undefined &&
		chainId !== expectedChainId

	const correctChainIdName =
		expectedChainId === 137
			? 'Polygon'
			: expectedChainId === 80001
			? 'Mumbai'
			: expectedChainId === 10
			? 'Optimism'
			: 'The correct network'

	function reAuth() {
		wallet.disconnectWallet()
		Cookies.set(CookieKeys.authRedirectUrl, window.location.href)
		router.push('/authenticate')
	}

	const switchNetworkModalContents = (
		<>
			<Space h={16} />
			<div>
				<Center>
					<Image src={'/meem-icon.png'} height={64} width={64} />
				</Center>
				<Space h={32} />

				<Center>
					<Text className={meemTheme.tLargeBold}>
						Please switch your network.
					</Text>
				</Center>
				<Space h={8} />

				<Center>
					<Text
						className={meemTheme.tMedium}
					>{`You're currently connected to the wrong network.`}</Text>
				</Center>
				<Space h={16} />
				<Center>
					<Button
						className={meemTheme.buttonBlack}
						onClick={async () => {
							await setChain(expectedChainId)
							router.reload()
						}}
					>
						{`Switch Network to ${correctChainIdName}`}
					</Button>
				</Center>
				<Space h={16} />
				<Button
					className={meemTheme.buttonWhite}
					onClick={() => {
						reAuth()
					}}
				>
					Sign in again
				</Button>
			</div>
			<Space h={16} />
		</>
	)

	const switchNetworkMobileModalContents = (
		<>
			<Space h={16} />
			<div>
				<Center>
					<Image src={'/meem-icon.png'} height={64} width={64} />
				</Center>
				<Space h={32} />
				<Center>
					<Text className={meemTheme.tLargeBold}>
						Please switch your network.
					</Text>
				</Center>
				<Space h={16} />
				<Center>
					<Text
						className={meemTheme.tMedium}
						style={{ textAlign: 'center' }}
					>{`You're currently connected to the wrong network. Please connect to ${correctChainIdName} and refresh this page to continue.`}</Text>
				</Center>
				<Space h={16} />
				<Center>
					<Link
						href={
							'https://www.google.com/search?q=how+to+switch+ethereum+network+on+mobile'
						}
						target="_blank"
						rel="noreferrer noopener"
						passHref
						legacyBehavior
					>
						<a>
							<Button className={meemTheme.buttonWhite}>
								How do I change networks?
							</Button>
						</a>
					</Link>
				</Center>
				<Space h={16} />
				<Button
					className={meemTheme.buttonBlack}
					onClick={() => {
						reAuth()
					}}
				>
					Sign in again
				</Button>
			</div>
			<Space h={16} />
		</>
	)

	return (
		<>
			<Modal
				className={meemTheme.visibleDesktopOnly}
				centered
				withCloseButton={false}
				closeOnClickOutside={false}
				radius={16}
				overlayBlur={8}
				size={'60%'}
				padding={'lg'}
				opened={isWrongChainId}
				onClose={() => {}}
			>
				{switchNetworkModalContents}
			</Modal>
			<Modal
				className={meemTheme.visibleMobileOnly}
				withCloseButton={false}
				closeOnClickOutside={false}
				fullScreen
				padding={'lg'}
				opened={isWrongChainId}
				onClose={() => {}}
			>
				{switchNetworkMobileModalContents}
			</Modal>
			{children}
		</>
	)
}
