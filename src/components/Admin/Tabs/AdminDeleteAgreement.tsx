/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { Text, Space, Radio, Button } from '@mantine/core'
import React, { useState } from 'react'
import { Agreement } from '../../../model/agreement/agreements'
import { useMeemTheme } from '../../Styles/MeemTheme'
import { DeleteAgreementModal } from '../Modals/DeleteAgreementModal'

interface IProps {
	agreement: Agreement
}

export const CADeleteAgreement: React.FC<IProps> = ({ agreement }) => {
	const { classes: meemTheme } = useMeemTheme()

	const [isDeleteAgreementModalOpened, setIsDeleteAgreementModalOpened] =
		useState(false)

	return (
		<div className={meemTheme.fullWidth}>
			<Space h={16} />

			<Text className={meemTheme.tLargeBold}>Delete Community</Text>
			<Space h={24} />

			<Text
				className={meemTheme.tSmallBold}
			>{`Once deleted, your community will be removed from Meem's database and will no longer be discoverable for new or existing members. This action cannot be undone.`}</Text>
			<Space h={16} />

			<Text>{`Contract admins will still be able to manage the community's agreement contract either manually or with our Ethereum Package Manager (EPM).`}</Text>
			<Space h={24} />

			<Button
				className={meemTheme.buttonBlue}
				onClick={() => {
					setIsDeleteAgreementModalOpened(true)
				}}
			/>
			<DeleteAgreementModal
				isOpened={isDeleteAgreementModalOpened}
				onModalClosed={() => {
					setIsDeleteAgreementModalOpened(false)
				}}
				agreement={agreement}
			/>
		</div>
	)
}
