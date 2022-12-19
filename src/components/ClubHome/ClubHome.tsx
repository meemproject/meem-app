/* eslint-disable @typescript-eslint/naming-convention */
import { Container, Text, Space, Loader, Center } from '@mantine/core'
import React, { useState } from 'react'
import { ClubDiscussionWidget } from '../Extensions/Discussion/ClubDiscussionWidget'
import { useClubsTheme } from '../Styles/ClubsTheme'
import { useClub } from './ClubProvider'
import { ClubAddAppsWidget } from './CoreWidgets/ClubAddAppsWidget'
import { ClubExtensionLinksWidget } from './CoreWidgets/ClubExtensionLinksWidget'
import { ClubInfoWidget } from './CoreWidgets/ClubInfoWidget'
import { ClubMembersWidget } from './CoreWidgets/ClubMembersWidget'
import { ClubRequirementsWidget } from './CoreWidgets/ClubRequirementsWidget'

export const ClubDetailComponent: React.FC = () => {
	const { club, isLoadingClub, error } = useClub()
	const { classes: clubsTheme } = useClubsTheme()

	const [doesMeetAllRequirements, setDoesMeetAllRequirements] =
		useState(false)

	return (
		<>
			{isLoadingClub && (
				<Container>
					<Space h={120} />
					<Center>
						<Loader color="red" variant="oval" />
					</Center>
				</Container>
			)}
			{!isLoadingClub && !error && !club?.name && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>Sorry, that club does not exist!</Text>
					</Center>
				</Container>
			)}
			{!isLoadingClub && error && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>
							There was an error loading this club. Please let us
							know!
						</Text>
					</Center>
				</Container>
			)}
			{!isLoadingClub && club?.name && (
				<div>
					<Container
						size={1000}
						className={clubsTheme.pageZeroPaddingMobileContainer}
					>
						<div className={clubsTheme.pageResponsiveContainer}>
							<div className={clubsTheme.pageLeftColumn}>
								<ClubInfoWidget
									club={club}
									meetsReqs={doesMeetAllRequirements}
								/>
								<ClubRequirementsWidget
									club={club}
									onMeetsAllReqsChanged={meetsReqs => {
										setDoesMeetAllRequirements(meetsReqs)
									}}
								/>
								<ClubMembersWidget club={club} />
							</div>
							<div className={clubsTheme.pageRightColumn}>
								{club.extensions && (
									<>
										{club.extensions
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
														'discussion' && (
														<ClubDiscussionWidget
															club={club}
														/>
													)}
												</>
											))}
									</>
								)}

								<ClubExtensionLinksWidget club={club} />
								<ClubAddAppsWidget club={club} />

								<Space h={64} />
							</div>
						</div>
					</Container>
				</div>
			)}
		</>
	)
}
