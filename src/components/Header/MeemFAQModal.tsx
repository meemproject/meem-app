import { Text, Space, Modal, Divider } from '@mantine/core'
// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react'
import { useMeemTheme } from '../Styles/AgreementsTheme'

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
				<Text
					className={meemTheme.tMediumBold}
				>{`What's a agreement?`}</Text>
				<Space h={16} />

				<Text
					className={meemTheme.tSmall}
				>{`A agreement is your community’s Web3 home base. Set membership criteria and seamlessly issue tokens to authorized participants, then sync your favorite tools and apps to create a living dashboard for your members. Agreements empowers you to manage your community and its activities without dependence on centralized platforms.`}</Text>
				<Space h={24} />

				<Text className={meemTheme.tMediumBold}>
					What can I do with my agreement?
				</Text>
				<Space h={16} />

				<Text className={meemTheme.tSmall}>
					Today, you can manage permissions for your agreement with
					nuanced, intuitive membership logic. Within your agreement,
					set up token-gated access for popular third-party tools such
					as Discord, Notion, and SlikSafe, or use your agreement
					Gnosis wallet to manage funds.
				</Text>
				<Space h={24} />

				<Text className={meemTheme.tMediumBold}>
					{`What's next for Agreements?`}
				</Text>
				<Space h={16} />

				<Text
					className={meemTheme.tSmall}
				>{`We’ll be building more functionality for communities and group leaders, and we’ll be integrating with other Web2 and Web3 tools to allow your agreement to do even more.`}</Text>

				<Space h={24} />
				<Text className={meemTheme.tMediumBold}>
					Have an idea or suggestion?
				</Text>
				<Space h={16} />

				<Text
					onClick={() => {
						window.open('https://airtable.com/shrM296vRoDWmK8Rm')
					}}
					style={{ fontSize: 18 }}
					className={meemTheme.tLink}
				>
					Send us your feedback.
				</Text>
				<Space h={16} />
			</Modal>
		</>
	)
}
