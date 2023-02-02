/* eslint-disable @typescript-eslint/naming-convention */
import log from '@kengoldfarb/log'
import {
	Container,
	Text,
	Space,
	Loader,
	Center,
	Button,
	Tabs
} from '@mantine/core'
import { useSDK } from '@meemproject/react'
import React, { useState } from 'react'
import { showErrorNotification } from '../../utils/notifications'
import { DiscussionWidget } from '../Extensions/Discussion/DiscussionWidget'
import { useMeemTheme } from '../Styles/MeemTheme'
import { useAgreement } from './AgreementProvider'
import { AgreementAddMoreExtensionsWidget } from './CoreWidgets/AgreementAddMoreExtensionsWidget'
import { AgreementBlankSlateWidget } from './CoreWidgets/AgreementBlankSlateWidget'
import { AgreementExtensionLinksWidget } from './CoreWidgets/AgreementExtensionLinksWidget'
import { AgreementInfoWidget } from './CoreWidgets/AgreementInfoWidget'
import { AgreementMembersWidget } from './CoreWidgets/AgreementMembersWidget'
import { AgreementRequirementsWidget } from './CoreWidgets/AgreementRequirementsWidget'
import { MeemCreateCommunityWidget } from './CoreWidgets/MeemCreateCommunityWidget'

export const AgreementHome: React.FC = () => {
	const { agreement, isLoadingAgreement, error } = useAgreement()
	const { classes: meemTheme } = useMeemTheme()

	const { sdk } = useSDK()

	const [reqsChecked, setReqsChecked] = useState(false)

	const [doesMeetAllRequirements, setDoesMeetAllRequirements] =
		useState(false)

	const [isLaunching, setIsLaunching] = useState(false)

	const [chosenExtensions, setChosenExtensions] = useState<string[]>([])

	const launchCommunity = async () => {
		setIsLaunching(true)

		try {
			const agreementId = agreement && agreement.id ? agreement.id : ''
			for (const ext of chosenExtensions) {
				log.debug(`enabling extension by id ${ext}`)
				await sdk.agreementExtension.createAgreementExtension({
					agreementId,
					extensionId: ext,
					isInitialized: true
				})
			}
			log.debug(`launching agreement...`)
			await sdk.agreement.updateAgreement({
				isLaunched: true,
				agreementId
			})
		} catch (e) {
			log.debug(e)
			setIsLaunching(false)
			showErrorNotification(
				'Oops!',
				'Unable to launch this community. Please let us know!'
			)
		}
	}

	const communityInfoContents = (
		<>
			{agreement && (
				<>
					<AgreementRequirementsWidget
						agreement={agreement}
						onMeetsAllReqsChanged={meetsReqs => {
							setDoesMeetAllRequirements(meetsReqs)
						}}
						onRequirementsChecked={checked => {
							setReqsChecked(checked)
						}}
					/>
					<AgreementMembersWidget agreement={agreement} />
				</>
			)}
		</>
	)

	const communityExtensionsContents = (
		<>
			{agreement && (
				<>
					{agreement.slug === 'meem' && (
						<MeemCreateCommunityWidget agreement={agreement} />
					)}

					{agreement.slug !== 'meem' && !agreement.isLaunched && (
						<AgreementBlankSlateWidget
							onChosenExtensionsChanged={extensions => {
								setChosenExtensions(extensions)
							}}
							agreement={agreement}
						/>
					)}

					{agreement.extensions &&
						agreement.extensions
							.filter(
								ext =>
									ext.Extension &&
									ext.Extension.capabilities.includes(
										'widget'
									) &&
									ext.AgreementExtensionWidgets.length > 0 &&
									ext.isSetupComplete
							)
							.map(extension => (
								// TODO: Developers, make sure you import your extension's widget
								// TODO: here, checking against the slug you chose for your extension.
								<>
									{extension.Extension?.slug ===
										'discussions' && (
										<DiscussionWidget
											key="discussion-widget"
											agreement={agreement}
										/>
									)}
								</>
							))}

					<AgreementExtensionLinksWidget agreement={agreement} />
					{agreement.isLaunched && (
						<>
							<AgreementAddMoreExtensionsWidget
								agreement={agreement}
							/>
						</>
					)}
				</>
			)}
		</>
	)

	const desktopHomeLayout = (
		<>
			{agreement && (
				<div className={meemTheme.pageResponsiveContainer}>
					<div className={meemTheme.pageLeftColumn}>
						<AgreementInfoWidget
							agreement={agreement}
							reqsChecked={reqsChecked}
							meetsReqs={doesMeetAllRequirements}
						/>
						{communityInfoContents}
					</div>
					<div className={meemTheme.pageRightColumn}>
						{communityExtensionsContents}
						<Space h={64} />
					</div>
				</div>
			)}
		</>
	)

	const mobileHomeLayout = (
		<>
			{agreement && (
				<>
					<AgreementInfoWidget
						agreement={agreement}
						reqsChecked={reqsChecked}
						meetsReqs={doesMeetAllRequirements}
					/>
					<Tabs color="dark" defaultValue="widgets">
						<Tabs.List grow>
							<Tabs.Tab
								style={{ fontWeight: 700 }}
								value="widgets"
							>
								WIDGETS
							</Tabs.Tab>
							<Tabs.Tab
								style={{ fontWeight: 700 }}
								value="community"
							>
								COMMMUNITY
							</Tabs.Tab>
						</Tabs.List>

						<Tabs.Panel value="widgets">
							{communityExtensionsContents}
						</Tabs.Panel>

						<Tabs.Panel value="community">
							{communityInfoContents}
						</Tabs.Panel>
					</Tabs>
				</>
			)}
		</>
	)

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
									<Text
										className={meemTheme.tMediumBold}
										color={'black'}
									>
										Customize your community
									</Text>
								</Center>
								<Space h={8} />

								<Center>
									<Text
										className={meemTheme.tMedium}
										style={{
											paddingLeft: 16,
											paddingRight: 16,
											textAlign: 'center'
										}}
										color={'black'}
									>
										Add details, connect tools and tweak
										settings to build out your member
										experience.
									</Text>
								</Center>
								<Space h={24} />

								<Center>
									<Button
										className={meemTheme.buttonBlack}
										loading={isLaunching}
										disabled={isLaunching}
										onClick={() => {
											launchCommunity()
										}}
									>
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
							<div className={meemTheme.visibleDesktopOnly}>
								{desktopHomeLayout}
							</div>

							<div className={meemTheme.visibleMobileOnly}>
								{mobileHomeLayout}
							</div>
						</Container>
					</div>
				)}
		</>
	)
}
