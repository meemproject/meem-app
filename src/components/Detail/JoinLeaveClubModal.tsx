/* eslint-disable @typescript-eslint/naming-convention */
import { Text, Space, Modal, Loader } from '@mantine/core'
import React, { useCallback } from 'react'
import { useGlobalStyles } from '../Styles/GlobalStyles'

interface IProps {
	isOpened: boolean
	onModalClosed: () => void
}

export const JoinLeaveClubModal: React.FC<IProps> = ({
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

					<Loader color="red" variant="oval" />
					<Space h={24} />
					<Text
						className={styles.tTitle}
					>{`There's magic happening on the blockchain.`}</Text>
					<Space h={24} />

					<Text
						className={styles.tSubtitle}
						styles={{ textAlign: 'center' }}
					>{`Please wait while your request is confirmed.\nThis could take up to a few minutes.`}</Text>
				</div>
				<Space h={12} />
			</Modal>
		</>
	)
}