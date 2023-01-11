/* eslint-disable @typescript-eslint/naming-convention */
import { Container, Text, Space, Loader, Center, Button } from '@mantine/core'
import React, { useState } from 'react'
import { DiscussionWidget } from '../Extensions/Discussion/DiscussionWidget'
import { useMeemTheme } from '../Styles/MeemTheme'
import { useAgreement } from './AgreementProvider'
import { AgreementAddAppsWidget } from './CoreWidgets/AgreementAddAppsWidget'
import { AgreementBlankSlateWidget } from './CoreWidgets/AgreementBlankSlateWidget'
import { AgreementExtensionLinksWidget } from './CoreWidgets/AgreementExtensionLinksWidget'
import { AgreementInfoWidget } from './CoreWidgets/AgreementInfoWidget'
import { AgreementMembersWidget } from './CoreWidgets/AgreementMembersWidget'
import { AgreementRequirementsWidget } from './CoreWidgets/AgreementRequirementsWidget'
import { MeemCreateCommunityWidget } from './CoreWidgets/MeemCreateCommunityWidget'

export const AgreementHome: React.FC = () => {
	const { agreement, isLoadingAgreement, error } = useAgreement()
	const { classes: meemTheme } = useMeemTheme()

	const [doesMeetAllRequirements, setDoesMeetAllRequirements] =
		useState(false)

	return (
		<>
			{isLoadingAgreement && (
				<Container>
					<Space h={120} />
					<Center>
						<Loader color="blue" variant="oval" />
					</Center>
				</Container>
			)}
			{!isLoadingAgreement && !error && !agreement?.name && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>Sorry, this community does not exist!</Text>
					</Center>
				</Container>
			)}
			{!isLoadingAgreement && error && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>
							There was an error loading this community. Please
							let us know!
						</Text>
					</Center>
				</Container>
			)}
			{!isLoadingAgreement &&
				agreement?.name &&
				!agreement.isLaunched &&
				!agreement.isCurrentUserAgreementAdmin && (
					<>
						<Container>
							<Space h={120} />
							<Center>
								<Text>
									This community is not yet available to the
									public. Check back later!
								</Text>
							</Center>
						</Container>
					</>
				)}
			{!isLoadingAgreement &&
				agreement?.name &&
				(agreement.isLaunched ||
					agreement.isCurrentUserAgreementAdmin) && (
					<div>
						{!agreement.isLaunched && (
							<div className={meemTheme.communityLaunchHeader}>
								<Space h={40} />
								<Center>
									<Text className={meemTheme.tMediumBold}>
										Customize your community
									</Text>
								</Center>
								<Space h={8} />

								<Center>
									<Text className={meemTheme.tMedium}>
										Add details, connect tools and tweak
										settings to build out your member
										experience.
									</Text>
								</Center>
								<Space h={24} />

								<Center>
									<Button className={meemTheme.buttonBlack}>
										Launch
									</Button>
								</Center>
								<Space h={40} />
							</div>
						)}
						<Container
							size={1000}
							className={meemTheme.pageZeroPaddingMobileContainer}
						>
							<div className={meemTheme.pageResponsiveContainer}>
								<div className={meemTheme.pageLeftColumn}>
									<AgreementInfoWidget
										agreement={agreement}
										meetsReqs={doesMeetAllRequirements}
									/>
									<AgreementRequirementsWidget
										agreement={agreement}
										onMeetsAllReqsChanged={meetsReqs => {
											setDoesMeetAllRequirements(
												meetsReqs
											)
										}}
									/>
									<AgreementMembersWidget
										agreement={agreement}
									/>
								</div>
								<div className={meemTheme.pageRightColumn}>
									{agreement.slug === 'meem' && (
										<MeemCreateCommunityWidget
											agreement={agreement}
										/>
									)}

									{agreement.slug !== 'meem' && (
										<AgreementBlankSlateWidget
											agreement={agreement}
										/>
									)}

									{agreement.extensions &&
										agreement.extensions
											// As of MVP, we only support one widget per extension, so we can
											// safely make the assumption that if the extension doesn't have a
											// widget, it's either a link extension or its contents are private.
											.filter(
												ext =>
													ext.AgreementExtensionWidgets &&
													ext
														.AgreementExtensionWidgets[0]
											)
											.map(extension => (
												// TODO: Developers, make sure you import your extension's widget
												// TODO: here, checking against the slug you chose for your extension.
												<>
													{extension.Extension
														?.slug ===
														'discussions' && (
														<DiscussionWidget
															key="discussion-widget"
															agreement={
																agreement
															}
														/>
													)}
												</>
											))}

									<AgreementExtensionLinksWidget
										agreement={agreement}
									/>
									<AgreementAddAppsWidget
										agreement={agreement}
									/>

									<Space h={64} />
								</div>
							</div>
						</Container>
					</div>
				)}
		</>
	)
}
