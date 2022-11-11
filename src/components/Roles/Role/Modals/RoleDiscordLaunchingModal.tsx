/* eslint-disable @typescript-eslint/naming-convention */
import { Text, Space, Modal } from '@mantine/core'
import React, { useCallback } from 'react'
import { useClubsTheme } from '../../../Styles/ClubsTheme'

interface IProps {
	isOpened: boolean
	onModalClosed: () => void
}

export const RoleDiscordLaunchingModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed
}) => {
	const { classes: clubsTheme } = useClubsTheme()

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
				<div className={clubsTheme.modalHeader}>
					<Space h={128} />
					<Text
						className={clubsTheme.tLargeBold}
					>{`Launching Discord...`}</Text>
					<Space h={24} />

					<Text
						className={clubsTheme.tMediumBold}
						styles={{ textAlign: 'center' }}
					>{`Please wait`}</Text>
				</div>
				<Space h={16} />
			</Modal>
		</>
	)
}
