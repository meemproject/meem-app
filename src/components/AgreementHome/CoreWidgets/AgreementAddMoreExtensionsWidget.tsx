import { Button, Center, Space, Text } from '@mantine/core'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { Agreement } from '../../../model/agreement/agreements'
import { useMeemTheme } from '../../Styles/MeemTheme'
interface IProps {
	agreement: Agreement
}

export const AgreementAddMoreExtensionsWidget: React.FC<IProps> = ({
	agreement
}) => {
	const { classes: meemTheme } = useMeemTheme()

	useEffect(() => {}, [agreement])

	// How many extensions have been set up and have widgets
	const extensionsSetupWithWidgets =
		agreement.extensions?.filter(
			ext =>
				ext.AgreementExtensionWidgets.length > 0 && ext.isSetupComplete
		).length ?? 0

	// How many extensions have not been set up and have widgets
	const extensionsNotSetupWithWidgets =
		agreement.extensions?.filter(
			ext =>
				ext.AgreementExtensionWidgets.length > 0 && !ext.isSetupComplete
		).length ?? 0

	// How many extensions have been set up and have links
	// const extensionsSetupWithLinks =
	// 	agreement.extensions?.filter(
	// 		ext => ext.AgreementExtensionLinks.length > 0 && ext.isSetupComplete
	// 	).length ?? 0

	// Total extensions, including links and other integrations
	const totalExtensions = agreement.extensions?.length ?? 0

	return (
		<div>
			{agreement.isLaunched && (
				<>
					{agreement.isCurrentUserAgreementAdmin && (
						<>
							{/* No extensions at all */}
							{totalExtensions === 0 && (
								<div className={meemTheme.widgetLight}>
									<Center>
										<Text className={meemTheme.tLargeBold}>
											Get started
										</Text>
									</Center>
									<Space h={16} />
									<Center>
										<Text className={meemTheme.tSmall}>
											Your community does not have any
											extensions yet. Extensions are apps
											you can add which enable
											functionality for your community,
											such as discussions, events and
											more.
										</Text>
									</Center>
									<Space h={32} />

									<Center>
										<Link
											href={`${agreement.slug}/admin?tab=extensions`}
											legacyBehavior
										>
											<Button
												className={meemTheme.buttonAsh}
											>
												+ Add your first extension
											</Button>
										</Link>
									</Center>
									<Space h={8} />
								</div>
							)}

							{/* Extensions enabled but none with widgets */}
							{totalExtensions === 0 && (
								<div
									className={meemTheme.widgetLight}
									style={{ marginTop: 16 }}
								>
									<Center>
										<Text className={meemTheme.tLargeBold}>
											Add your first widget
										</Text>
									</Center>
									<Space h={16} />
									<Center>
										<Text className={meemTheme.tSmall}>
											{`Your community has extensions
												enabled but none of these have any
												widgets. You can add extensions
												with widgets by looking for the
												'widget' badge in your extension settings.`}
										</Text>
									</Center>
									<Space h={32} />

									<Center>
										<Link
											href={`${agreement.slug}/admin?tab=extensions`}
											legacyBehavior
										>
											<Button
												className={meemTheme.buttonAsh}
											>
												+ Add your first widget
											</Button>
										</Link>
									</Center>
									<Space h={8} />
								</div>
							)}

							{/* Some exts with widgets have not been set up yet	 */}
							{agreement.extensions &&
								totalExtensions > 0 &&
								extensionsNotSetupWithWidgets > 0 &&
								extensionsSetupWithWidgets === 0 && (
									<div
										className={meemTheme.widgetLight}
										style={{ marginTop: 16 }}
									>
										<Center>
											<Text
												className={meemTheme.tLargeBold}
											>
												Complete extension setup
											</Text>
										</Center>
										<Space h={16} />
										<Center>
											<Text className={meemTheme.tSmall}>
												Your community has extensions
												enabled but one or more are not
												ready to display until they have
												been properly set up.
											</Text>
										</Center>
										<Space h={32} />

										<Center>
											<Link
												href={`${agreement.slug}/admin?tab=extensions`}
												legacyBehavior
											>
												<Button
													className={
														meemTheme.buttonAsh
													}
												>
													Complete setup
												</Button>
											</Link>
										</Center>
										<Space h={8} />
									</div>
								)}

							{/* There's already at least one widget that has been set up  */}
							{agreement.extensions &&
								totalExtensions > 0 &&
								extensionsNotSetupWithWidgets === 0 &&
								extensionsSetupWithWidgets > 0 && (
									<>
										<Space h={32} />
										<Center>
											<Text
												className={meemTheme.tSmall}
											></Text>
										</Center>
										<Center>
											<Link
												href={`${agreement.slug}/admin?tab=extensions`}
												legacyBehavior
											>
												<Button
													className={
														meemTheme.buttonGrey
													}
												>
													+ Add an extension
												</Button>
											</Link>
										</Center>
										<Space h={32} />
									</>
								)}
						</>
					)}

					{!agreement.isCurrentUserAgreementAdmin && (
						<>
							{totalExtensions === 0 && (
								<div
									className={meemTheme.widgetLight}
									style={{ marginTop: 26 }}
								>
									<Center>
										<Text className={meemTheme.tMediumBold}>
											Under construction
										</Text>
									</Center>
									<Space h={16} />
									<Center>
										<Text className={meemTheme.tSmall}>
											This community is not using any
											tools yet. Check back later!
										</Text>
									</Center>
								</div>
							)}
						</>
					)}
				</>
			)}
		</div>
	)
}
