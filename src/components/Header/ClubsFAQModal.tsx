import { Text, Space, Modal, Divider } from '@mantine/core'
// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react'
import { colorLightGrey, useClubsTheme } from '../Styles/ClubsTheme'

interface IProps {
	isOpened: boolean
	onModalClosed: () => void
}

export const ClubsFAQModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed
}) => {
	const { classes: clubsTheme } = useClubsTheme()

	return (
		<>
			<Modal
				centered
				radius={16}
				overlayBlur={8}
				size={'60%'}
				padding={'lg'}
				opened={isOpened}
				title={<Text className={clubsTheme.tMediumBold}>FAQ</Text>}
				onClose={() => {
					onModalClosed()
				}}
			>
				<Divider color={colorLightGrey} />
				<Space h={24} />
				<Text
					className={clubsTheme.tMediumBold}
				>{`What's a club?`}</Text>
				<Space h={16} />

				<Text
					className={clubsTheme.tSmall}
				>{`A club is your community’s Web3 home base. Set membership criteria and seamlessly issue tokens to authorized participants, then sync your favorite tools and apps to create a living dashboard for your members. Clubs empowers you to manage your community and its activities without dependence on centralized platforms.`}</Text>
				<Space h={24} />

				<Text className={clubsTheme.tMediumBold}>
					What can I do with my club?
				</Text>
				<Space h={16} />

				<Text className={clubsTheme.tSmall}>
					Today, you can manage permissions for your club with
					nuanced, intuitive membership logic. Within your club, set
					up token-gated access for popular third-party tools such as
					Discord, Notion, and SlikSafe, or use your club Gnosis
					wallet to manage funds.
				</Text>
				<Space h={24} />

				<Text className={clubsTheme.tMediumBold}>
					{`What's next for Clubs?`}
				</Text>
				<Space h={16} />

				<Text
					className={clubsTheme.tSmall}
				>{`We’ll be building more functionality for communities and group leaders, and we’ll be integrating with other Web2 and Web3 tools to allow your club to do even more.`}</Text>

				<Space h={24} />
				<Text className={clubsTheme.tMediumBold}>
					Have an idea or suggestion?
				</Text>
				<Space h={16} />

				<Text
					onClick={() => {
						window.open('https://airtable.com/shrM296vRoDWmK8Rm')
					}}
					style={{ fontSize: 18 }}
					className={clubsTheme.tLink}
				>
					Send us your feedback.
				</Text>
				<Space h={16} />
			</Modal>
		</>
	)
}
