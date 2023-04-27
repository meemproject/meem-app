/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import log from '@kengoldfarb/log'
import { Text, Space, Modal, Button } from '@mantine/core'
import router from 'next/router'
// eslint-disable-next-line import/no-extraneous-dependencies
import React, { useState } from 'react'
import { Agreement } from '../../../model/agreement/agreements'
import {
	showErrorNotification,
	showSuccessNotification
} from '../../../utils/notifications'
import { useMeemTheme } from '../../Styles/MeemTheme'

interface IProps {
	isOpened: boolean
	onModalClosed: () => void
	agreement?: Agreement
}

export const DeleteAgreementModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed,
	agreement
}) => {
	const { classes: meemTheme } = useMeemTheme()

	const [isDeletingAgreement, setIsDeletingAgreement] = useState(false)

	const deleteAgreement = async () => {
		if (agreement) {
			setIsDeletingAgreement(true)

			try {
				// TODO: Actually delete the agreement here

				showSuccessNotification(
					'Deleted community',
					`Redirecting you. Please wait...`
				)

				router.push('/')
			} catch (e) {
				log.debug(e)
				showErrorNotification(
					'Error',
					`Unable to delete this community. Contact us using the top-right link on this page.`
				)

				setIsDeletingAgreement(false)
				return
			}
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
				withCloseButton={false}
				opened={isOpened}
				onClose={() => {
					onModalClosed()
				}}
			>
				<Space h={24} />
				<Text
					className={meemTheme.tMediumBold}
				>{`Are you sure you want to delete this community?`}</Text>
				<Space h={8} />
				<Text>This action is permanent and cannot be undone.</Text>
				<Space h={32} />
				<Button
					loading={isDeletingAgreement}
					className={meemTheme.buttonBlue}
					onClick={async () => {
						deleteAgreement()
					}}
				>
					{isDeletingAgreement ? 'Deleting...' : 'Delete community'}
				</Button>
				{!isDeletingAgreement && (
					<>
						<Space w={8} />
						<Button
							onClick={() => {
								onModalClosed()
							}}
							className={meemTheme.buttonGrey}
						>
							Cancel
						</Button>
					</>
				)}
			</Modal>
		</>
	)
}
