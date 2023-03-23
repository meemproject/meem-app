import { Text, Space, Image, Button } from '@mantine/core'
import { MeemAPI } from '@meemproject/sdk'
import React from 'react'
import { useMeemTheme } from '../../../Styles/MeemTheme'
import { SymphonyConnection } from '../Model/symphony'

interface IProps {
	input?: SymphonyConnection
	output?: SymphonyConnection
	webhookUrl?: string
	webhookPrivateKey?: string
	onChangeConnectionsPressed?: () => void
}

export const SymphonyRuleBuilderConnections: React.FC<IProps> = ({
	input,
	output,
	webhookUrl,
	webhookPrivateKey,
	onChangeConnectionsPressed
}) => {
	const { classes: meemTheme } = useMeemTheme()

	const inputIcon =
		input?.platform === MeemAPI.RuleIo.Discord
			? '/connect-discord.png'
			: '/connect-slack.png'

	const outputIcon =
		output?.platform === MeemAPI.RuleIo.Twitter
			? '/connect-twitter.png'
			: '/connect-webhook.png'

	const isOutputWebhook = webhookUrl && webhookPrivateKey

	return (
		<>
			<Text className={meemTheme.tExtraSmallLabel}>CONNECTIONS</Text>
			<Space h={24} />
			<div className={meemTheme.centeredRow}>
				<Image width={18} height={18} src={inputIcon} />
				<Space w={8} />
				<Text className={meemTheme.tSmall}>
					Proposals in{' '}
					<span className={meemTheme.tSmallBold}>{input?.name}</span>
				</Text>
			</div>
			<Space h={8} />
			<div className={meemTheme.centeredRow}>
				<Image width={18} height={18} src={outputIcon} />
				<Space w={8} />
				<Text className={meemTheme.tSmall}>
					Publishing to{' '}
					<span className={meemTheme.tSmallBold}>
						{!isOutputWebhook
							? output?.name
							: `Custom Webhook: ${webhookUrl}`}
					</span>
				</Text>
			</div>
			{isOutputWebhook && (
				<>
					<Space h={8} />
					<div style={{ marginLeft: 32 }}>
						<Text className={meemTheme.tSmallFaded}>
							Private Key:{' '}
							<span className={meemTheme.tSmallBoldFaded}>
								{webhookPrivateKey}
							</span>
						</Text>
					</div>
				</>
			)}
			<Space h={18} />
			<Button
				className={meemTheme.buttonWhite}
				onClick={() => {
					if (onChangeConnectionsPressed) {
						onChangeConnectionsPressed()
					}
				}}
			>
				Change Connections
			</Button>
			<Space h={32} />
		</>
	)
}
