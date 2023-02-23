import { Button, Modal, Space, Image, Center } from '@mantine/core'
import { useAuth } from '@meemproject/react'
import React from 'react'
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

	const switchNetworkModalContents = (
		<>
			<Space h={16} />
			<div>
				<Center>
					<Image src={'/meem-icon.png'} height={64} width={64} />
				</Center>
				<Center>
					<h2>Please switch your network.</h2>
				</Center>
				<Center>
					<h3>{`You're currently connected to the wrong network.`}</h3>
				</Center>
				<Space h={8} />
				<Center>
					<Button
						className={meemTheme.buttonBlack}
						onClick={() => {
							setChain(expectedChainId)
						}}
					>
						Switch Network
					</Button>
				</Center>
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
				{switchNetworkModalContents}
			</Modal>
			{children}
		</>
	)
}
