import { Button, Center, Space, Text } from '@mantine/core'
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
			{!agreement.isCurrentUserAgreementAdmin && (
				<Center>
					<Text
						className={meemTheme.tSmallBold}
					>{`${agreement.name} is using Symphony to publish together on Twitter!`}</Text>
				</Center>
			)}
			{agreement.isCurrentUserAgreementMember && (
				<>
					{!agreementExtension?.isSetupComplete && (
						<>
							<Center>
								<Text className={meemTheme.tSmallBold}>
									You have not yet set up any Symphony rules.
								</Text>
							</Center>
							<Space h={12} />
							<Center>
								<Link
									href={`/${agreement.slug}/e/symphony/settings`}
									passHref
									legacyBehavior
								>
									<a className={meemTheme.unstyledLink}>
										<Button
											className={meemTheme.buttonDarkGrey}
										>
											Continue Symphony setup
										</Button>
									</a>
								</Link>
							</Center>
						</>
					)}
					{agreementExtension?.isSetupComplete && (
						<>
							<Center>
								<Text className={meemTheme.tSmallBold}>
									Your Symphony rules are set up. Click below
									to change them.
								</Text>
							</Center>
							<Space h={12} />
							<Center>
								<Link
									href={`/${agreement.slug}/e/symphony/settings`}
									legacyBehavior
									passHref
								>
									<a className={meemTheme.unstyledLink}>
										<Button
											className={meemTheme.buttonDarkGrey}
										>
											Configure Symphony
										</Button>
									</a>
								</Link>
							</Center>
						</>
					)}
					<Space h={8} />
				</>
			)}
		</div>
	)
}
