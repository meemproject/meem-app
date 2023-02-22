import { Text, Space, Modal, Divider } from '@mantine/core'
import Link from 'next/link'
// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react'
import { useMeemTheme } from '../Styles/MeemTheme'

interface IProps {
	isOpened: boolean
	onModalClosed: () => void
}

export const MeemFAQModal: React.FC<IProps> = ({ isOpened, onModalClosed }) => {
	const { classes: meemTheme } = useMeemTheme()

	return (
		<>
			<Modal
				centered
				radius={16}
				overlayBlur={8}
				size={'60%'}
				padding={'lg'}
				opened={isOpened}
				title={<Text className={meemTheme.tMediumBold}>FAQ</Text>}
				onClose={() => {
					onModalClosed()
				}}
			>
				<Divider />
				<Space h={24} />
				<Text className={meemTheme.tMediumBold}>{`What's Meem?`}</Text>
				<Space h={16} />
				<Text
					className={meemTheme.tSmall}
				>{`At Meem, we’re enabling a future of portable communities — that is, groups of people linked by their desire to do something together, not by the platforms on which they operate.
				`}</Text>
				<Space h={16} />
				<Text
					className={meemTheme.tSmall}
				>{`We’re letting communities decide for themselves who’s in their group, what those members’ roles and rules are, and what tools they want to use together. And we’re stitching together a multitude of Web2 and Web3 platforms to let communities collaboratively publish.
				`}</Text>
				<Space h={16} />
				<Text
					className={meemTheme.tSmall}
				>{`We do this through community agreements — Meem smart contracts deployed, owned, and controlled by the communities themselves.`}</Text>
				<Space h={24} />
				<Text className={meemTheme.tMediumBold}>
					What can I do with my Meem community agreement?
				</Text>
				<Space h={16} />
				<Text className={meemTheme.tSmall}>
					{`Set nuanced, intuitive membership logic to determine who can participate in your community and how they can join. Create multiple roles for members and set rules and permissions for each. Using Meem’s native extensions, discuss and publish content together across platforms. Finally, connect a wide range of Web2 and Web3 tools to use with your community, ensuring they respect the roles and rules you’ve already established.`}
				</Text>
				<Space h={24} />
				<Text
					className={meemTheme.tMediumBold}
				>{`What's Symphony?`}</Text>
				<Space h={16} />
				<Text className={meemTheme.tSmall}>
					{`Symphony is an extension that lets your community publish together. Today, Symphony lets you use Discord to decide what to Tweet from a shared account. Coming soon, we’ll be adding even more platforms in which you can collaborate, more platforms to which you can publish, and advanced publishing and editing capabilities.`}
				</Text>
				<Space h={24} />
				<Text className={meemTheme.tMediumBold}>
					{`What's next for Meem?`}
				</Text>
				<Space h={16} />
				<Text
					className={meemTheme.tSmall}
				>{`We’ll be building more open-source extensions and expanding our SDK, allowing developers to create and modify even more apps. We’ll also be integrating with other Web2 and Web3 tools to make communities’ existing apps more interoperable.`}</Text>
				<Space h={24} />
				<Text className={meemTheme.tMediumBold}>
					Have an idea or suggestion?
				</Text>
				<Space h={16} />
				<Link
					href={`https://airtable.com/shrM296vRoDWmK8Rm`}
					legacyBehavior
					passHref
				>
					<a
						target="_blank"
						rel="noreferrer noopener"
						className={meemTheme.unstyledLink}
					>
						<Text
							style={{ fontSize: 18 }}
							className={meemTheme.tLink}
						>
							Send us your feedback.
						</Text>
					</a>
				</Link>
				<Space h={16} />
			</Modal>
		</>
	)
}
