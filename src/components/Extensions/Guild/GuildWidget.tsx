import React from 'react'
import { ExtensionWidgetContainer } from '../ExtensionWidgetContainer'
import { GuildExtensionSettings } from './GuildExtensionSettings'

export const GuildWidget: React.FC = () => {
	return (
		<ExtensionWidgetContainer extensionSlug="guild">
			<GuildExtensionSettings />
		</ExtensionWidgetContainer>
	)
}
