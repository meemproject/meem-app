import { Space, Text } from '@mantine/core'
import React from 'react'
import { useMeemTheme } from '../../Styles/MeemTheme'
import { SymphonyExtensionSettings } from './SymphonyExtensionSettings'

/*
Be sure to import your widget in AgreementHome.tsx to ensure it is displayed
when enabled.
*/
export const SymphonyWidget: React.FC = () => {
	/*
	Use the meemTheme object to access agreements styles
	such as colors, fonts and layouts
	*/
	const { classes: meemTheme } = useMeemTheme()

	return (
		/*
		Ensure your widget's UI is contained entirely within the parent <div> element.
		*/
		<div className={meemTheme.widgetLight}>
			<div className={meemTheme.spacedRowCentered}>
				<div className={meemTheme.centeredRow}>
					<Text className={meemTheme.tMediumBold}>Symphony</Text>
					<Space w={6} />
				</div>
				{/* <div className={meemTheme.centeredRow}>
					{agreement.isCurrentUserAgreementAdmin && (
						<div className={meemTheme.row}>
							<Space w={8} />
							<Link
								href={`/${agreement.slug}/e/symphony/settings`}
							>
								<Settings className={meemTheme.clickable} />
							</Link>
						</div>
					)}
				</div> */}
			</div>
			<Space h={24} />
			<SymphonyExtensionSettings />
		</div>
	)
}
