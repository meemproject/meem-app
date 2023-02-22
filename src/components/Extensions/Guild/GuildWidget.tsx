import { Center, Text } from '@mantine/core'
import React, { useState } from 'react'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import { useMeemTheme } from '../../Styles/MeemTheme'
import { ExtensionSettingsModal } from '../ExtensionSettingsModal'
import { ExtensionWidgetContainer } from '../ExtensionWidgetContainer'
import { GuildExtension } from './GuildExtension'

export const GuildWidget: React.FC = () => {
	const extensionSlug = 'guild'
	const [isSettingsModalOpened, setIsSettingsModalOpened] = useState(false)
	const { agreement } = useAgreement()
	const { classes: meemTheme } = useMeemTheme()

	return (
		<>
			<ExtensionWidgetContainer
				extensionSlug={extensionSlug}
				onSettingsOpened={function (): void {
					setIsSettingsModalOpened(true)
				}}
			>
				<>
					{agreement?.isCurrentUserAgreementAdmin && (
						<>
							<GuildExtension />
						</>
					)}
					{!agreement?.isCurrentUserAgreementAdmin && (
						<>
							<Center>
								<Text className={meemTheme.tSmallBold}>
									Guild settings for this community are only
									visible to community admins.
								</Text>
							</Center>
						</>
					)}
				</>
			</ExtensionWidgetContainer>
			<ExtensionSettingsModal
				extensionSlug={extensionSlug}
				isOpened={isSettingsModalOpened}
				onModalClosed={function (): void {
					setIsSettingsModalOpened(false)
				}}
			/>
		</>
	)
}
