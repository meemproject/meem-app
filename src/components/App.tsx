import { Button, createStyles } from '@mantine/core'
import { useWallet } from '@meemproject/react'
import React, { useEffect } from 'react'

export interface IProps {
	children: React.ReactNode
}

const useStyles = createStyles(_theme => ({
	overlay: {
		alignItems: 'center',
		background: 'rgba(255, 255, 255, 0.85)',
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
	}
}))

export const App: React.FC<IProps> = ({ children }) => {
	const { chainId, setChain } = useWallet()
	const styles = useStyles()

	// useEffect(() => {
	// 	if (
	// 		process.env.NEXT_PUBLIC_CHAIN_ID &&
	// 		chainId &&
	// 		chainId !== +process.env.NEXT_PUBLIC_CHAIN_ID
	// 	) {
	// 		setChain(+process.env.NEXT_PUBLIC_CHAIN_ID)
	// 	}
	// }, [chainId, setChain])

	return (
		<>
			{process.env.NEXT_PUBLIC_CHAIN_ID &&
				chainId &&
				chainId !== +process.env.NEXT_PUBLIC_CHAIN_ID && (
					<div className={styles.classes.overlay}>
						<div>
							<h2>Please switch your network</h2>
							<Button
								onClick={() => {
									if (process.env.NEXT_PUBLIC_CHAIN_ID) {
										setChain(
											+process.env.NEXT_PUBLIC_CHAIN_ID
										)
									}
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
