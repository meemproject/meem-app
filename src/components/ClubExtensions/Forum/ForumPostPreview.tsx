import { Center, Space, Text, Image } from '@mantine/core'
import React from 'react'
import { ChevronDown, ChevronUp, Message, Share } from 'tabler-icons-react'
import { ForumPost } from '../../../model/club/forum/forumPost'
import { useClubsTheme } from '../../Styles/ClubsTheme'
interface IProps {
	post: ForumPost
}

export const ForumPostPreview: React.FC<IProps> = ({ post }) => {
	const { classes: clubsTheme } = useClubsTheme()

	return (
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
					<Text className={clubsTheme.tSmallBold}>{post.title}</Text>
					<Space h={8} />
					<Text className={clubsTheme.tExtraSmall}>
						{post.content}
					</Text>
					<Space h={20} />
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
								<Text className={clubsTheme.tExtraSmallBold}>
									Kate
								</Text>
								<Text className={clubsTheme.tExtraExtraSmall}>
									1h ago
								</Text>
							</div>
						</div>
						<div
							className={clubsTheme.row}
							style={{ marginTop: 16 }}
						>
							<div
								className={clubsTheme.centeredRow}
								style={{ cursor: 'pointer' }}
							>
								<Message width={20} height={20} />
								<Space w={4} />
								<Text className={clubsTheme.tExtraSmall}>
									14 Comments
								</Text>
							</div>
							<Space w={16} />
							<div
								className={clubsTheme.centeredRow}
								style={{ cursor: 'pointer' }}
							>
								<Share width={20} height={20} />
								<Space w={4} />
								<Text className={clubsTheme.tExtraSmall}>
									Share
								</Text>
							</div>
							<Space w={16} />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
