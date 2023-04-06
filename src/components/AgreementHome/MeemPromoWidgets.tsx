import { Space, Text, Divider, Center, Grid, Button } from '@mantine/core'
import React from 'react'
import { ExtensionWidgetContainer } from '../Extensions/ExtensionWidgetContainer'
import { useMeemTheme } from '../Styles/MeemTheme'
import { useAgreement } from './AgreementProvider'

export const MeemPromoWidgets: React.FC = () => {
	const { classes: meemTheme } = useMeemTheme()
	const { agreement } = useAgreement()

	const comingSoonGridItem = (title: string, desc: string, attr: string) => (
		<Grid.Col xs={12} sm={6} md={6} lg={6} xl={6} key={title}>
			<div
				className={meemTheme.extensionGridItem}
				style={{ cursor: 'auto', minHeight: 130 }}
			>
				<Text className={meemTheme.tSmallBold}>{title}</Text>
				<Space h={8} />
				<Text
					className={meemTheme.tExtraSmall}
					style={{ opacity: 0.6 }}
				>
					{desc}
				</Text>
				<Space h={8} />

				<Text
					className={meemTheme.tExtraSmall}
					style={{
						opacity: 0.6,
						fontStyle: 'italic'
					}}
				>
					{attr}
				</Text>
			</div>
		</Grid.Col>
	)

	return (
		<div>
			<>
				{agreement && agreement.slug !== 'meem' && (
					<>
						<Divider />
						<Space h={24} />
						<Center>
							<Text
								className={meemTheme.tMedium}
								style={{ opacity: 0.5 }}
							>
								More from Meem
							</Text>
						</Center>
						<Space h={24} />
					</>
				)}
				<ExtensionWidgetContainer
					extensionSlug={'Coming Soon'}
					customIcon={'/rocket.svg'}
					onSettingsOpened={function (): void {}}
				>
					<Text className={meemTheme.tExtraSmallLabel}>
						IN DEVELOPMENT
					</Text>
					<Space h={24} />
					<Grid>
						{comingSoonGridItem(
							'Libraries',
							'Curate media and links together',
							'with Common Sense[makers]'
						)}
						{comingSoonGridItem(
							'Newsletters',
							'Send regular updates to your community',
							'with Jump, PubDAO'
						)}
						{comingSoonGridItem(
							'News',
							'Manage what gets reported and published',
							'with JournoDAO'
						)}
						{comingSoonGridItem(
							'Meets',
							'Manage event details with participants',
							'with OAK'
						)}
						{comingSoonGridItem(
							'Playlists',
							'Curate music together',
							'with Crate'
						)}
						{comingSoonGridItem(
							'Roster',
							'Help members manage members',
							'with Kernel'
						)}
					</Grid>
					<Space h={24} />
					<Text className={meemTheme.tMedium}>
						Have a community tool you want to build together?
					</Text>
					<Space h={24} />
					<Button
						className={meemTheme.buttonWhite}
						onClick={() => {
							window.open('https://form.typeform.com/to/TyeFu5om')
						}}
					>
						Collaborate with Us
					</Button>
					<Space h={16} />
				</ExtensionWidgetContainer>
				<ExtensionWidgetContainer
					extensionSlug={'What is Meem?'}
					customIcon={'/chat-bubble-question.svg'}
					onSettingsOpened={function (): void {}}
				>
					<Text className={meemTheme.tSmall}>
						We’re building tools by and for communities.
					</Text>
					<Space h={16} />
					<Text className={meemTheme.tSmall}>
						Meem has several components – input channels, output
						channels, editorial rules – that can be remixed and
						extended to create new publishing and curation apps that
						fit different communities’ specific needs. You can
						imagine, for example, a remix which enables a community
						to propose something in Discord that they’d like to
						publish to multiple public social channels (e.g.,
						Farcaster, Lens). Or maybe community members are able to
						suggest an edit, with other members authorized to accept
						or reject changes.
					</Text>
					<Space h={16} />
					<Text className={meemTheme.tSmall}>
						We support and work with communities to design and build
						these new tools and patterns and as we find great use
						cases, we’ll release new apps together for other
						communities to use and adapt. We have an exciting slate
						of tools in development (including collections,
						newsletters, and events) to which collectors of the
						Community Tweets collectible will get early access. We
						hope to inspire others to build together in the same way
						that the CHORUS drop inspired us.
					</Text>
				</ExtensionWidgetContainer>
			</>
		</div>
	)
}
