import React, { useState } from 'react'
import { ExtensionSettingsModal } from '../ExtensionSettingsModal'
import { ExtensionWidgetContainer } from '../ExtensionWidgetContainer'
import { ExampleExtension } from './ExampleExtension'

export const ExampleWidget: React.FC = () => {
	const extensionSlug = 'example'
	const [isSettingsModalOpened, setIsSettingsModalOpened] = useState(false)

	return (
		<>
			<ExtensionWidgetContainer
				extensionSlug={extensionSlug}
				onSettingsOpened={function (): void {
					setIsSettingsModalOpened(true)
				}}
			>
				<>
					<ExampleExtension />
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
