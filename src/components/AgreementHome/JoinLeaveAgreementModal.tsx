/* eslint-disable @typescript-eslint/naming-convention */
import { Text, Space, Modal, Loader } from '@mantine/core'
import React, { useCallback } from 'react'
import { useMeemTheme } from '../Styles/MeemTheme'

interface IProps {
	isOpened: boolean
	onModalClosed: () => void
}

export const JoinLeaveAgreementModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed
}) => {
	const { classes: meemTheme } = useMeemTheme()

	const closeModal = useCallback(() => {
		onModalClosed()
	}, [onModalClosed])

	const modalContent = (
		<>
			<div className={meemTheme.modalHeader}>
				<Loader color="cyan" variant="oval" />
				<Space h={24} />

				<Text
					className={meemTheme.tMediumBold}
					styles={{ textAlign: 'center' }}
				>{`Please wait while we add you to this on-chain community!\nThis could take a minute.`}</Text>
			</div>
			<Space h={8} />
		</>
	)

	return (
		<>
			<Modal
				className={meemTheme.visibleDesktopOnly}
				withCloseButton={false}
				closeOnClickOutside={false}
				closeOnEscape={false}
				radius={16}
				overlayBlur={8}
				size={'lg'}
				padding={'lg'}
				opened={isOpened}
				onClose={() => {
					closeModal()
				}}
			>
				{modalContent}
			</Modal>
			<Modal
				className={meemTheme.visibleMobileOnly}
				fullScreen
				withCloseButton={false}
				closeOnClickOutside={false}
				closeOnEscape={false}
				padding={'lg'}
				opened={isOpened}
				onClose={() => {
					closeModal()
				}}
			>
				{modalContent}
			</Modal>
		</>
	)
}
