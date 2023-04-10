import { Space } from '@mantine/core'
import React, { useState } from 'react'
import { ExtensionSettingsModal } from '../ExtensionSettingsModal'
import { ExtensionWidgetContainer } from '../ExtensionWidgetContainer'
import { CommunityTweetsExtension } from './CommunityTweetsExtension'

export const CommunityTweetsWidget: React.FC = () => {
	const extensionSlug = 'community-tweets'
	const [isSettingsModalOpened, setIsSettingsModalOpened] = useState(false)

	return (
		<>
			<ExtensionWidgetContainer
				extensionSlug={'community-tweets'}
				onSettingsOpened={function (): void {
					setIsSettingsModalOpened(true)
				}}
			>
				<div>
					<CommunityTweetsExtension />
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
