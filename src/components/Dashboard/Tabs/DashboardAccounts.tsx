/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { Text, Space, Loader } from '@mantine/core'
import React from 'react'
import { useMeemTheme } from '../../Styles/MeemTheme'
import { ConnectedAccount } from '../Flows/Model/flows'
import { DashboardAccountsContent } from './DashboardAccountsContent'

interface IProps {
	connectedAccounts: ConnectedAccount[]
	isFetchingDiscordConnections: boolean
	isFetchingSlackConnections: boolean
	isFetchingTwitterConnections: boolean
	isFetchingConnections: boolean
}

export const DashboardAccounts: React.FC<IProps> = ({
	connectedAccounts,
	isFetchingConnections,
	isFetchingDiscordConnections,
	isFetchingSlackConnections,
	isFetchingTwitterConnections
}) => {
	const { classes: meemTheme } = useMeemTheme()

	return (
		<div className={meemTheme.fullWidth}>
			<>
				<div>
					<Space h={24} />

					<Text className={meemTheme.tLargeBold}>
						Connected Accounts
					</Text>

					<Space h={8} />
				</div>

				{(isFetchingDiscordConnections ||
					isFetchingSlackConnections ||
					isFetchingTwitterConnections ||
					isFetchingConnections) && (
					<>
						<Space h={24} />
						<Loader variant="oval" color="cyan" />
					</>
				)}

				{connectedAccounts &&
					!isFetchingConnections &&
					!isFetchingDiscordConnections &&
					!isFetchingSlackConnections &&
					!isFetchingTwitterConnections && (
						<>
							<Space h={24} />
							<DashboardAccountsContent
								connections={connectedAccounts}
							/>
						</>
					)}
			</>
		</div>
	)
}
