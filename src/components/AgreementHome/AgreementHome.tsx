/* eslint-disable @typescript-eslint/naming-convention */
import log from '@kengoldfarb/log'
import {
	Container,
	Text,
	Space,
	Loader,
	Center,
	Button,
	Tabs,
	Divider,
	useMantineColorScheme
} from '@mantine/core'
import { useSDK } from '@meemproject/react'
import { MeemAPI } from '@meemproject/sdk'
import React, { useState } from 'react'
import { showErrorNotification } from '../../utils/notifications'
import { DiscussionWidget } from '../Extensions/Discussions/DiscussionWidget'
import { GuildWidget } from '../Extensions/Guild/GuildWidget'
import { SymphonyWidget } from '../Extensions/Symphony/SymphonyWidget'
import { colorLightestGrey, useMeemTheme } from '../Styles/MeemTheme'
import { useAgreement } from './AgreementProvider'
import { AgreementAddExtensionsWidget } from './CoreWidgets/AgreementAddExtensionsWidget'
import { AgreementInfoWidget } from './CoreWidgets/AgreementInfoWidget'
import { AgreementMembersWidget } from './CoreWidgets/AgreementMembersWidget'
import { AgreementPreLaunchAddExtensions } from './CoreWidgets/AgreementPreLaunchAddExtensions'
import { AgreementRequirementsWidget } from './CoreWidgets/AgreementRequirementsWidget'
import { MeemCreateCommunityWidget } from './CoreWidgets/MeemCreateCommunityWidget'

export const AgreementHome: React.FC = () => {
	const { agreement, isLoadingAgreement, error } = useAgreement()
	const { classes: meemTheme } = useMeemTheme()

	const { colorScheme } = useMantineColorScheme()
	const isDarkTheme = colorScheme === 'dark'

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
					isInitialized: true,
					widget: {
						visibility:
							MeemAPI.AgreementExtensionVisibility.TokenHolders
					}
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
				'Unable to launch this community. Contact us using the top-right link on this page.'
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

					{agreement.extensions && (
						<>
							{agreement.extensions
								.filter(ext =>
									agreement.isCurrentUserAgreementMember
										? ext
										: ext.AgreementExtensionWidgets &&
										  ext.AgreementExtensionWidgets.length >
												0 &&
										  ext.AgreementExtensionWidgets[0]
												.visibility ===
												MeemAPI
													.AgreementExtensionVisibility
													.Anyone
								)
								.map(extension => (
									// TODO: Developers, make sure you import your extension's widget
									// TODO: here, checking against the slug you chose for your extension.
									<div key={extension.id}>
										{extension.Extension?.slug ===
											'symphony' && (
											<>
												<SymphonyWidget />
											</>
										)}
										{extension.Extension?.slug ===
											'discussions' && (
											<DiscussionWidget
												key="discussion-widget"
												agreement={agreement}
											/>
										)}

										{extension.Extension?.slug ===
											'guild' && (
											<GuildWidget key="guild-widget" />
										)}
									</div>
								))}
							{agreement.extensions.filter(ext =>
								agreement.isCurrentUserAgreementMember
									? ext
									: ext.AgreementExtensionWidgets &&
									  ext.AgreementExtensionWidgets.length >
											0 &&
									  ext.AgreementExtensionWidgets[0]
											.visibility ===
											MeemAPI.AgreementExtensionVisibility
												.Anyone
							).length > 0 && <Space h={24} />}
						</>
					)}

					{agreement.slug !== 'meem' && !agreement.isLaunched && (
						<AgreementPreLaunchAddExtensions
							onChosenExtensionsChanged={extensions => {
								setChosenExtensions(extensions)
							}}
							agreement={agreement}
						/>
					)}

					{agreement.isLaunched && (
						<>
							<AgreementAddExtensionsWidget
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
					<Divider orientation="vertical" />
					<div className={meemTheme.pageRightColumn}>
						<div className={meemTheme.pageRightColumnInner}>
							{communityExtensionsContents}
						</div>
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
								COMMUNITY
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
						<Loader color="cyan" variant="oval" />
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
							There was an error loading this community. Contact
							us using the top-right link on this page.
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
								<Center>
									<Text
										className={meemTheme.tMediumBold}
										color={'black'}
									>
										Customize your community page
									</Text>
								</Center>
								<Space h={8} />

								<Center>
									<Text
										className={meemTheme.tExtraSmall}
										style={{
											paddingLeft: 16,
											paddingRight: 16,
											textAlign: 'center'
										}}
										color={'black'}
									>
										Add membership requirements, define
										roles & rules for members, and connect
										your tools.
									</Text>
								</Center>

								<Space h={16} />

								<Center>
									<Button
										className={meemTheme.buttonBlack}
										loading={isLaunching}
										disabled={isLaunching}
										onClick={() => {
											launchCommunity()
										}}
									>
										Publish Changes
									</Button>
								</Center>
							</div>
						)}
						<div className={meemTheme.visibleMobileOnly}>
							<Container
								size={1000}
								className={
									meemTheme.pageZeroPaddingMobileContainer
								}
							>
								{mobileHomeLayout}
							</Container>
						</div>

						<div
							className={meemTheme.visibleDesktopOnly}
							style={{ position: 'relative' }}
						>
							<div
								style={{
									backgroundColor: isDarkTheme
										? 'transparent'
										: colorLightestGrey,
									position: 'absolute',
									top: 0,
									left: '50%',
									right: 0,
									bottom: 0,
									zIndex: -1
								}}
							/>

							<Center style={{ marginBottom: -64 }}>
								{desktopHomeLayout}
							</Center>
						</div>
					</div>
				)}
		</>
	)
}
