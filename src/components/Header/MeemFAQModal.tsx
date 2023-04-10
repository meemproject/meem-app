import { Text, Space, Modal, Divider } from '@mantine/core'
import Link from 'next/link'
// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react'
import { colorBlue, useMeemTheme } from '../Styles/MeemTheme'

interface IProps {
	isOpened: boolean
	onModalClosed: () => void
}

export const MeemFAQModal: React.FC<IProps> = ({ isOpened, onModalClosed }) => {
	const { classes: meemTheme } = useMeemTheme()

	const modalContents = (
		<>
			<Divider />
			<Space h={24} />
			<Text className={meemTheme.tMediumBold}>{`What's Meem?`}</Text>
			<Space h={16} />
			<Text
				className={meemTheme.tSmall}
			>{`Meem is a (co-)operating system for community apps. We’re collaborating to build tools by and for communities.`}</Text>
			<Space h={16} />
			<Text
				className={meemTheme.tSmall}
			>{`We partner to design, develop, and release new apps for communities to use and adapt. In partnership with a myriad of collaborators, we have an exciting slate of tools in development that’ll let communities publish together according to their unique needs.`}</Text>

			<Space h={24} />
			<Text
				className={meemTheme.tMediumBold}
			>{`What's Community Tweets?`}</Text>
			<Space h={16} />
			<Text className={meemTheme.tSmall}>
				{`Community Tweets is an open-source tool which lets communities use Discord or Slack to decide what to Tweet from a shared account. Set the rules for how your community wants to publish, then collectively approve proposed Tweets using emojis.`}
			</Text>
			<Space h={24} />
			<Text
				className={meemTheme.tMediumBold}
			>{`What can I do with my Meem community agreement?`}</Text>
			<Space h={16} />
			<Text className={meemTheme.tSmall}>
				{`Bring your community to any token-gated dApp and ensure members have the right access. Set nuanced, intuitive membership logic to determine who can participate in your community and how they can join. Create multiple roles for members and set rules and permissions for each.`}
			</Text>
			<Space h={24} />
			<Text className={meemTheme.tMediumBold}>
				{`What's next for Meem?`}
			</Text>
			<Space h={16} />
			<Text className={meemTheme.tSmall}>
				We’re collaborating to launch even more publishing tools by and
				for communities, including newsletters, libraries, calendars,
				and more. We’d love to have you{' '}
				<span
					style={{ color: colorBlue, cursor: 'pointer' }}
					onClick={() => {
						window.open('https://form.typeform.com/to/TyeFu5om')
					}}
				>
					join us
				</span>{' '}
				on these projects (or dream up one of your own)!
			</Text>
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
					<Text style={{ fontSize: 18 }} className={meemTheme.tLink}>
						Send us your feedback.
					</Text>
				</a>
			</Link>
			<Space h={16} />
		</>
	)

	return (
		<>
			<Modal
				className={meemTheme.visibleDesktopOnly}
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
				{modalContents}
			</Modal>
			<Modal
				className={meemTheme.visibleMobileOnly}
				centered
				fullScreen
				padding={'lg'}
				opened={isOpened}
				title={<Text className={meemTheme.tMediumBold}>FAQ</Text>}
				onClose={() => {
					onModalClosed()
				}}
			>
				{modalContents}
			</Modal>
		</>
	)
}
