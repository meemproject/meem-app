import log from '@kengoldfarb/log'
import {
	Text,
	Button,
	Textarea,
	Space,
	Image,
	TextInput,
	Center
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import React, { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, Message } from 'tabler-icons-react'
import { Club } from '../../../model/club/club'
import {
	colorDarkGrey,
	colorGrey,
	useClubsTheme
} from '../../Styles/ClubsTheme'
import { ClubAdminChangesModal } from '../ClubAdminChangesModal'
interface IProps {
	club: Club
}

export const ClubForumWidget: React.FC<IProps> = ({ club }) => {
	const { classes: clubsTheme } = useClubsTheme()

	useEffect(() => {}, [club])

	const postWidget = () => (
		<div className={clubsTheme.greyContentBox} style={{ marginBottom: 16 }}>
			<div className={clubsTheme.row}>
				<div>
					<Center>
						<ChevronUp />
					</Center>

					<Space h={16} />
					<Center>{`16`}</Center>
					<Space h={16} />
					<Center>
						<ChevronDown />
					</Center>
				</div>
				<Space w={16} />
				<div>
					<Text className={clubsTheme.tSmallBold}>
						Why are shiba inus so cute?
					</Text>
					<Space h={8} />
					<Text className={clubsTheme.tExtraSmall}>
						Nunc posuere risus ac varius rutrum. Aenean dignissim
						ultrices est eget aliquam. Fusce at eleifend augue.
						Class aptent taciti sociosqu ad litora torquent per
						conubia nostra, per inceptos himenaeos.
					</Text>
					<Space h={16} />
					<div className={clubsTheme.spacedRowCentered}>
						<div className={clubsTheme.centeredRow}>
							<Image
								src={`/exampleclub.png`}
								height={32}
								width={32}
								radius={16}
							/>
							<Space w={8} />
							<div>
								<Text className={clubsTheme.tSmallBold}>
									Kate
								</Text>
								<Text className={clubsTheme.tExtraExtraSmall}>
									1h ago
								</Text>
							</div>
						</div>
						<div className={clubsTheme.row}>
							<div
								className={clubsTheme.centeredRow}
								style={{ cursor: 'pointer' }}
							>
								<Message
									width={20}
									height={20}
									color={colorDarkGrey}
								/>
								<Space w={4} />
								<Text className={clubsTheme.tExtraSmall}>
									14 Comments
								</Text>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)

	return (
		<>
			<div className={clubsTheme.widgetLight}>
				<div className={clubsTheme.spacedRowCentered}>
					<div className={clubsTheme.centeredRow}>
						<Text className={clubsTheme.tLargeBold}>
							Discussions
						</Text>
						<Space w={8} />
						<Text
							className={clubsTheme.tLarge}
							style={{ color: colorDarkGrey }}
						>{`(153)`}</Text>
					</div>
					<Button className={clubsTheme.buttonRed}>View All</Button>
				</div>
				<Space h={24} />
				{postWidget()}
				{postWidget()}
			</div>
		</>
	)
}
