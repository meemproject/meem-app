import React from 'react'
import { ExtensionWidgetContainer } from '../ExtensionWidgetContainer'
import { GuildExtension } from './GuildExtension'

export const GuildWidget: React.FC = () => {
	return (
		<ExtensionWidgetContainer extensionSlug="guild">
			<GuildExtension />
		</ExtensionWidgetContainer>
	)
}
