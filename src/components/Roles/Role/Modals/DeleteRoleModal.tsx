import { Text, Space, Modal, Divider, Button } from '@mantine/core'
// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react'
import { ClubRole } from '../../../../model/club/club'
import { useGlobalStyles } from '../../../Styles/GlobalStyles'

interface IProps {
	isOpened: boolean
	onModalClosed: () => void
	role?: ClubRole
}

export const DeleteRoleModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed,
	role
}) => {
	const { classes: styles } = useGlobalStyles()

	const deleteRole = async () => {
		if (role) {
			// TODO: Trigger delete
		}
	}

	return (
		<>
			<Modal
				centered
				radius={16}
				overlayBlur={8}
				size={'60%'}
				padding={'lg'}
				opened={isOpened}
				title={<Text className={styles.tModalTitle}>Delete Role</Text>}
				onClose={() => {
					onModalClosed()
				}}
			>
				<Divider />
				<Space h={24} />
				<Text
					className={styles.tSectionTitle}
				>{`Are you sure you want to delete this role?`}</Text>
				<Space h={32} />
				<div className={styles.row}>
					<Button
						className={styles.buttonBlack}
						onClick={async () => {
							deleteRole()
						}}
					>
						{'Delete'}
					</Button>
					<Space w={8} />
					<Button
						onClick={() => {
							onModalClosed()
						}}
						className={styles.buttonGrey}
					>
						Cancel
					</Button>
				</div>
			</Modal>
		</>
	)
}
