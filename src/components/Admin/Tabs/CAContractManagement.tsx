/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { Text, Space, Radio } from '@mantine/core'
import React, { useState } from 'react'
import { Club } from '../../../model/club/club'
import { useGlobalStyles } from '../../Styles/GlobalStyles'

interface IProps {
	club: Club
}

export const CAContractManagement: React.FC<IProps> = ({ club }) => {
	const { classes: styles } = useGlobalStyles()

	const [smartContractPermission, setSmartContractPermission] =
		useState('members-and-meem')

	return (
		<div className={styles.fullWidth}>
			<Space h={12} />

			<Text className={styles.tTitle}>ContractManagement</Text>
			<Text>{`Who has permission to manage your club's smart contract?`}</Text>
			<Radio.Group
				orientation="vertical"
				spacing={10}
				size="sm"
				color="dark"
				value={smartContractPermission}
				onChange={(value: any) => {
					setSmartContractPermission(value)
				}}
				required
			>
				<Radio value="members" label="Designated club members" />
				<Radio
					value="members-and-meem"
					label="Designated club members and Meem protocol"
				/>
			</Radio.Group>
		</div>
	)
}
