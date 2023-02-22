import { Space } from '@mantine/core'
import React from 'react'
import { ExtensionWidgetContainer } from '../ExtensionWidgetContainer'
import { SymphonyExtension } from './SymphonyExtension'

export const SymphonyWidget: React.FC = () => {
	return (
		<ExtensionWidgetContainer extensionSlug="symphony">
			<div>
				<SymphonyExtension />
				<Space h={16} />
			</div>
		</ExtensionWidgetContainer>
	)
}
