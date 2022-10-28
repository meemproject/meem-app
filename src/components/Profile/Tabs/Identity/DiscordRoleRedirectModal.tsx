/* eslint-disable @typescript-eslint/naming-convention */
import { Text, Space, Modal } from '@mantine/core'
import React, { useCallback } from 'react'
import { useGlobalStyles } from '../../../Styles/GlobalStyles'

interface IProps {
	isOpened: boolean
	onModalClosed: () => void
}

export const DiscordRoleRedirectModal: React.FC<IProps> = ({
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
				fullScreen
				transitionDuration={0}
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
					<Text className={styles.tTitle}>{`Redirecting...`}</Text>
					<Space h={24} />

					<Text
						className={styles.tSubtitle}
						styles={{ textAlign: 'center' }}
					>{`Just a moment.`}</Text>
				</div>
				<Space h={12} />
			</Modal>
		</>
	)
}
