import { Button, Space } from '@mantine/core'
import { useWallet } from '@meemproject/react'
import React from 'react'
import { useGlobalStyles } from './Styles/GlobalStyles'

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
	const { chainId, setChain } = useWallet()
	const { classes: design } = useGlobalStyles()

	let expectedChainId = process.env.NEXT_PUBLIC_CHAIN_ID
		? +process.env.NEXT_PUBLIC_CHAIN_ID
		: 0

	if (typeof window !== 'undefined' && !expectedChainId) {
		expectedChainId = hostnameToChainId(window.location.hostname)
	}

	return (
		<>
			{chainId && chainId !== expectedChainId && (
				<div
					style={{
						alignItems: 'center',
						background: 'rgba(255, 255, 255, 1)',
						display: 'flex',
						flexDirection: 'column',
						left: 0,
						justifyContent: 'space-around',
						position: 'fixed',
						height: '100vh',
						textAlign: 'center',
						top: 0,
						width: '100vw',
						zIndex: 1000
					}}
				>
					<div>
						<h2>Please switch your network.</h2>
						<h3>{`You're currently connected to the wrong network.`}</h3>
						<Space h={8} />
						<Button
							className={design.buttonBlack}
							onClick={() => {
								setChain(expectedChainId)
							}}
						>
							Switch Network
						</Button>
					</div>
				</div>
			)}
			{children}
		</>
	)
}
