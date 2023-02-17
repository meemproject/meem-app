import { Button, Modal, Space } from '@mantine/core'
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

	return (
		<>
			<Modal
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
				<Space h={16} />
				<div>
					<h2>Please switch your network.</h2>
					<h3>{`You're currently connected to the wrong network.`}</h3>
					<Space h={8} />
					<Button
						className={meemTheme.buttonBlack}
						onClick={() => {
							setChain(expectedChainId)
						}}
					>
						Switch Network
					</Button>
				</div>
				<Space h={16} />
			</Modal>

			{children}
		</>
	)
}
