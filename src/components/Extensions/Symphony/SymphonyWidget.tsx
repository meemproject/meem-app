import { Space } from '@mantine/core'
import React, { useState } from 'react'
import { ExtensionSettingsModal } from '../ExtensionSettingsModal'
import { ExtensionWidgetContainer } from '../ExtensionWidgetContainer'
import { SymphonyExtension } from './SymphonyExtension'

export const SymphonyWidget: React.FC = () => {
	const extensionSlug = 'symphony'
	const [isSettingsModalOpened, setIsSettingsModalOpened] = useState(false)

	return (
		<>
			<ExtensionWidgetContainer
				extensionSlug={extensionSlug}
				onSettingsOpened={function (): void {
					setIsSettingsModalOpened(true)
				}}
			>
				<div>
					<SymphonyExtension />
					<Space h={16} />
				</div>
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
