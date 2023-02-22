import React, { useState } from 'react'
import { ExtensionSettingsModal } from '../ExtensionSettingsModal'
import { ExtensionWidgetContainer } from '../ExtensionWidgetContainer'
import { GuildExtension } from './GuildExtension'

export const GuildWidget: React.FC = () => {
	const extensionSlug = 'guild'
	const [isSettingsModalOpened, setIsSettingsModalOpened] = useState(false)

	return (
		<>
			<ExtensionWidgetContainer
				extensionSlug={extensionSlug}
				onSettingsOpened={function (): void {
					setIsSettingsModalOpened(true)
				}}
			>
				<GuildExtension />
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
