/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import {
	Text,
	Space,
	Radio,
	Button,
	Image,
	Loader,
	Grid,
	Divider
} from '@mantine/core'
import { MeemAPI } from '@meemproject/sdk'
import React, { useState } from 'react'
import { Agreement } from '../../../model/agreement/agreements'
import { useAgreement } from '../../Providers/AgreementProvider'
import { useAnalytics } from '../../Providers/AnalyticsProvider'
import { useMeemTheme } from '../../Styles/MeemTheme'
import { CTConnection } from '../Flows/Model/communityTweets'
import { DeleteAgreementModal } from '../Modals/DeleteAgreementModal'
import { DashboardAccountsContent } from './DashboardAccountsContent'

interface IProps {
	communityTweetsConnections: CTConnection[]
	isFetchingDiscordConnections: boolean
	isFetchingSlackConnections: boolean
	isFetchingTwitterConnections: boolean
	isFetchingConnections: boolean
}

export const DashboardAccounts: React.FC<IProps> = ({
	communityTweetsConnections,
	isFetchingConnections,
	isFetchingDiscordConnections,
	isFetchingSlackConnections,
	isFetchingTwitterConnections
}) => {
	const { classes: meemTheme } = useMeemTheme()

	const [isManageConnectionsModalOpen, setIsManageConnectionsModalOpen] =
		useState(false)

	const analytics = useAnalytics()

	const { agreement } = useAgreement()

	const connectionSummaryGridItem = (
		connectionPlatform: MeemAPI.RuleIo,
		connectionCount: number
	) => (
		<>
			<div className={meemTheme.gridItemFlat} style={{ cursor: 'auto' }}>
				<div className={meemTheme.centeredRow}>
					<Image
						src={
							connectionPlatform === MeemAPI.RuleIo.Discord
								? '/connect-discord.png'
								: connectionPlatform === MeemAPI.RuleIo.Slack
								? '/connect-slack.png'
								: '/connect-twitter.png'
						}
						width={24}
						height={24}
						style={{
							marginRight: 8
						}}
					/>
					<Text className={meemTheme.tSmallBold}>
						{connectionPlatform === MeemAPI.RuleIo.Discord
							? 'Discord'
							: connectionPlatform === MeemAPI.RuleIo.Slack
							? 'Slack'
							: 'Twitter'}
					</Text>
				</div>
				<Space h={16} />
				<Text
					className={meemTheme.tExtraSmallFaded}
				>{`${connectionCount} ${
					connectionCount === 1 ? `account` : 'accounts'
				} connected`}</Text>
			</div>
		</>
	)

	const connectedDiscordAccounts = communityTweetsConnections
		? communityTweetsConnections.filter(
				c => c.platform === MeemAPI.RuleIo.Discord
		  ).length
		: 0

	const connectedTwitterAccounts = communityTweetsConnections
		? communityTweetsConnections.filter(
				c => c.platform === MeemAPI.RuleIo.Twitter
		  ).length
		: 0

	const connectedSlackAccounts = communityTweetsConnections
		? communityTweetsConnections.filter(
				c => c.platform === MeemAPI.RuleIo.Slack
		  ).length
		: 0

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

				{communityTweetsConnections &&
					!isFetchingConnections &&
					!isFetchingDiscordConnections &&
					!isFetchingSlackConnections &&
					!isFetchingTwitterConnections && (
						<>
							<Space h={24} />
							<DashboardAccountsContent
								connections={communityTweetsConnections}
							/>
						</>
					)}

				<Space h={24} />
				<Button
					className={meemTheme.buttonWhite}
					onClick={() => {
						setIsManageConnectionsModalOpen(true)
						analytics.track('Community Tweets Manage Connections', {
							communityId: agreement?.id,
							communityName: agreement?.name
						})
					}}
				>
					Manage Connections
				</Button>
				<Space h={32} />
			</>
		</div>
	)
}
