import { Space, Text } from '@mantine/core'
import Link from 'next/link'
import React from 'react'
import { Settings } from 'tabler-icons-react'
import { Agreement } from '../../../model/agreement/agreements'
import { useMeemTheme } from '../../Styles/MeemTheme'

/*
Access agreement-level data using the 'agreement' object.
*/
interface IProps {
	agreement: Agreement
}

/*
Be sure to import your widget in AgreementHome.tsx to ensure it is displayed
when enabled.
*/
export const SymphonyWidget: React.FC<IProps> = ({ agreement }) => {
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
					<Text className={meemTheme.tMediumBold}>
						Symphony Extension Widget
					</Text>
					<Space w={6} />
				</div>
				<div className={meemTheme.centeredRow}>
					{agreement.isCurrentUserAgreementAdmin && (
						<div className={meemTheme.row}>
							<Space w={8} />
							<Link
								href={`/${agreement.slug}/e/steward/settings`}
							>
								<Settings className={meemTheme.clickable} />
							</Link>
						</div>
					)}
				</div>
			</div>
			<Space h={24} />
			<Text className={meemTheme.tSmall}>
				{`This is an steward Community Extension Widget for ${agreement.name}`}
			</Text>
		</div>
	)
}
