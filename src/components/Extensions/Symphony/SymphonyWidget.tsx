import { Space } from '@mantine/core'
import React from 'react'
import { ExtensionWidgetContainer } from '../ExtensionWidgetContainer'
import { SymphonyExtensionSettingsContent } from './SymphonyExtensionSettingsContent'

export const SymphonyWidget: React.FC = () => {
	return (
		<ExtensionWidgetContainer extensionSlug="symphony">
			<div>
				<SymphonyExtensionSettingsContent />
				<Space h={16} />
			</div>
		</ExtensionWidgetContainer>
	)
}
