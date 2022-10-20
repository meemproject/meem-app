/* eslint-disable @typescript-eslint/naming-convention */
import { Text, Space, Modal } from '@mantine/core'
import React, { useCallback } from 'react'
import { useGlobalStyles } from '../../../Styles/GlobalStyles'

interface IProps {
	isOpened: boolean
	onModalClosed: () => void
}

export const RoleDiscordLaunchingModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed
}) => {
	const { classes: styles } = useGlobalStyles()

	const closeModal = useCallback(() => {
		onModalClosed()
	}, [onModalClosed])

	return (
		<>
			<Modal
				transitionDuration={0}
				fullScreen
				withCloseButton={false}
				closeOnClickOutside={false}
				closeOnEscape={false}
				size={'lg'}
				padding={'sm'}
				opened={isOpened}
				onClose={() => {
					closeModal()
				}}
			>
				<div className={styles.modalHeader}>
					<Space h={128} />
					<Text
						className={styles.tTitle}
					>{`Launching Discord...`}</Text>
					<Space h={24} />

					<Text
						className={styles.tSubtitle}
						styles={{ textAlign: 'center' }}
					>{`Please wait`}</Text>
				</div>
				<Space h={12} />
			</Modal>
		</>
	)
}
