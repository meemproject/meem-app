import { Text, Space, Modal, Button } from '@mantine/core'
// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react'
import { useMeemTheme } from '../../Styles/MeemTheme'

interface IProps {
	isOpened: boolean
	onOptionChosen: (option: boolean) => void
	onModalClosed: () => void
}

export const RemoveMemberConfirmationModal: React.FC<IProps> = ({
	isOpened,
	onOptionChosen,
	onModalClosed
}) => {
	const { classes: meemTheme } = useMeemTheme()

	return (
		<>
			<Modal
				centered
				radius={16}
				overlayBlur={8}
				size={'60%'}
				padding={'lg'}
				opened={isOpened}
				title={
					<Text className={meemTheme.tMediumBold}>
						Are you sure you want to remove this member?
					</Text>
				}
				onClose={() => {
					onModalClosed()
				}}
			>
				<Space h={24} />
				<div className={meemTheme.rowEndAlign}>
					<Button
						onClick={() => {
							onOptionChosen(false)
							onModalClosed()
						}}
						className={meemTheme.buttonWhite}
					>
						Cancel
					</Button>
					<Space w={8} />
					<Button
						onClick={() => {
							onOptionChosen(true)
							onModalClosed()
						}}
						className={meemTheme.buttonOrangeRedBordered}
					>
						Remove
					</Button>
				</div>
			</Modal>
		</>
	)
}
