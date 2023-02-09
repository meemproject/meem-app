import { Button, Space, Text } from '@mantine/core'
import Link from 'next/link'
import React from 'react'
import {
	Agreement,
	extensionFromSlug
} from '../../../model/agreement/agreements'
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

	const agreementExtension = extensionFromSlug('symphony', agreement)

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
			{!agreementExtension?.isSetupComplete && (
				<>
					<Text>You have not yet set up any Symphony rules.</Text>
					<Space h={8} />
					<Link href={`/${agreement.slug}/e/symphony/settings`}>
						<Button className={meemTheme.buttonBlack}>
							Continue Symphony setup
						</Button>
					</Link>
				</>
			)}
			{agreementExtension?.isSetupComplete && (
				<>
					<Text>
						Your Symphony rules are set up. Click below to change
						them.
					</Text>
					<Space h={8} />
					<Link href={`/${agreement.slug}/e/symphony/settings`}>
						<Button className={meemTheme.buttonBlack}>
							Configure Symphony
						</Button>
					</Link>
				</>
			)}
		</div>
	)
}
