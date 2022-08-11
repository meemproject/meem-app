import { createStyles } from '@mantine/core'
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
		left: 0,
		justifyContent: 'space-around',
		position: 'fixed',
		height: '100vh',
		top: 0,
		width: '100vw',
		zIndex: 1000
	}
}))

export const App: React.FC<IProps> = ({ children }) => {
	const { chainId, setChain } = useWallet()
	const styles = useStyles()

	useEffect(() => {
		if (
			process.env.NEXT_PUBLIC_CHAIN_ID &&
			chainId &&
			chainId !== +process.env.NEXT_PUBLIC_CHAIN_ID
		) {
			setChain(+process.env.NEXT_PUBLIC_CHAIN_ID)
		}
	}, [chainId, setChain])

	return (
		<>
			{process.env.NEXT_PUBLIC_CHAIN_ID &&
				chainId &&
				chainId !== +process.env.NEXT_PUBLIC_CHAIN_ID && (
					<div className={styles.classes.overlay}>
						<h2>Please switch networks</h2>
					</div>
				)}
			{children}
		</>
	)
}
