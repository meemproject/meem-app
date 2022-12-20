/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import log from '@kengoldfarb/log'
import { Text, Space, Modal, Divider, Button } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { makeFetcher, MeemAPI } from '@meemproject/sdk'
import router from 'next/router'
// eslint-disable-next-line import/no-extraneous-dependencies
import React, { useState } from 'react'
import { AlertCircle, CircleCheck } from 'tabler-icons-react'
import { Agreement } from '../../../model/agreement/agreements'
import { colorBlue, useMeemTheme } from '../../Styles/AgreementsTheme'

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

				showNotification({
					title: 'Deleted Agreement',
					autoClose: 5000,
					icon: <CircleCheck />,
					message: `Redirecting you. Please wait...`
				})

				router.push('/')
			} catch (e) {
				log.debug(e)
				showNotification({
					title: 'Error',
					autoClose: 5000,
					color: colorBlue,
					icon: <AlertCircle />,
					message: `Unable to delete this agreement. Please let us know!`
				})
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
				>{`Are you sure you want to delete this agreement?`}</Text>
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
					{isDeletingAgreement ? 'Deleting...' : 'Delete Agreement'}
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
