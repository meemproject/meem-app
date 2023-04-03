import { Space, Text } from '@mantine/core'
import { useRouter } from 'next/router'
import React from 'react'
import { ExtensionWidgetContainer } from '../Extensions/ExtensionWidgetContainer'
import { colorBlue, useMeemTheme } from '../Styles/MeemTheme'

export const MeemPromoWidgets: React.FC = () => {
	const { classes: meemTheme } = useMeemTheme()
	const router = useRouter()

	return (
		<div>
			<>
				<ExtensionWidgetContainer
					extensionSlug={'What is Meem?'}
					customIcon={'/chat-bubble-question.svg'}
					onSettingsOpened={function (): void {}}
				>
					<Text className={meemTheme.tSmall}>
						<span style={{ fontWeight: 'bold' }}>Meem</span> helps
						people build tools for{' '}
						<span style={{ fontWeight: 'bold' }}>
							portable communities
						</span>
						, letting these groups define their community once, then
						collaborate across the web.
					</Text>
					<Space h={16} />
					<Text className={meemTheme.tSmall}>
						<span style={{ fontWeight: 'bold' }}>
							We empower communities
						</span>{' '}
						to create their own agreements, freeing them from any
						single platform. We then help them connect existing
						tools or build their own to enable collaborative
						publishing.
					</Text>
					<Space h={16} />
					<Text className={meemTheme.tSmall}>
						Our first app,{' '}
						<span
							style={{
								fontWeight: 'bold',
								cursor: 'pointer',
								color: colorBlue
							}}
							onClick={() => {
								router.push('/onboard/community-tweets')
							}}
						>
							CommunityTweets
						</span>
						, lets communities decide together to Tweet something.
					</Text>
				</ExtensionWidgetContainer>
				<ExtensionWidgetContainer
					extensionSlug={'Coming Soon'}
					customIcon={'/rocket.svg'}
					onSettingsOpened={function (): void {}}
				>
					<Text className={meemTheme.tMediumBold}>
						🪩 Post across social
					</Text>
					<Space h={4} />
					<Text className={meemTheme.tSmall}>
						Collaboratively publish to more shared social channels,
						such as Farcaster or ActivityPub
					</Text>
					<Space h={16} />
					<Text className={meemTheme.tMediumBold}>
						🔨 Build & customize your own tools
					</Text>
					<Space h={4} />
					<Text className={meemTheme.tSmall}>
						Utilize an SDK to modify or create tools that address
						unique community publishing needs
					</Text>
					<Space h={16} />
					<Text className={meemTheme.tMediumBold}>
						📌 Collect & curate
					</Text>
					<Space h={4} />
					<Text className={meemTheme.tSmall}>
						Ingest select content from social channels into your
						community spaces (i.e., RSS feeds for your community) &
						organize into Airtable or other structured formats
					</Text>
					<Space h={16} />
					<Text className={meemTheme.tMediumBold}>
						🫂 Manage members
					</Text>
					<Space h={4} />
					<Text className={meemTheme.tSmall}>
						Onboard community members through multiple identity
						layers, lists (e.g., Twitter lists), or other community
						token-gaters like Hats or Guild
					</Text>
					<Space h={16} />
					<Text className={meemTheme.tMediumBold}>
						📰 Publish a newsletter
					</Text>
					<Space h={4} />
					<Text className={meemTheme.tSmall}>
						Collaboratively edit documents, vote on proposed
						changes, and publish to longer-form media platforms like{' '}
						<span
							style={{
								fontWeight: 'bold',
								cursor: 'pointer',
								color: colorBlue
							}}
							onClick={() => {
								window.open('https://mirror.xyz')
							}}
						>
							Mirror
						</span>{' '}
						or Medium
					</Text>
					<Space h={16} />
				</ExtensionWidgetContainer>
			</>
		</div>
	)
}
