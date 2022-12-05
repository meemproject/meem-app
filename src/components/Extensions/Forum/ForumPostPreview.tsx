import {
	Center,
	Space,
	Text,
	Image,
	Badge,
	useMantineColorScheme
} from '@mantine/core'
import Link from 'next/link'
import React from 'react'
import { ChevronDown, ChevronUp, Message, Share } from 'tabler-icons-react'
import { ForumPost } from '../../../model/club/forum/forumPost'
import { colorDarkerGrey, useClubsTheme } from '../../Styles/ClubsTheme'
interface IProps {
	post: ForumPost
}

export const ForumPostPreview: React.FC<IProps> = ({ post }) => {
	const { classes: clubsTheme } = useClubsTheme()

	const { colorScheme } = useMantineColorScheme()
	const isDarkTheme = colorScheme === 'dark'

	return (
		<div className={clubsTheme.greyContentBox} style={{ marginBottom: 16 }}>
			<div className={clubsTheme.row}>
				<div>
					<Center>
						<ChevronUp />
					</Center>

					<Space h={16} />
					<Center>{post.votes ?? 0}</Center>
					<Space h={16} />
					<Center>
						<ChevronDown />
					</Center>
				</div>
				<Space w={16} />
				<div style={{ width: '100%' }}>
					<div className={clubsTheme.row}>
						{post.attachment && (
							<>
								<Image
									src={post.attachment}
									height={80}
									width={80}
									radius={4}
								/>
								<Space w={12} />
							</>
						)}
						<div>
							<Text className={clubsTheme.tSmallBold}>
								{post.title}
							</Text>
							<Space h={8} />
							<Text className={clubsTheme.tExtraSmall}>
								{post.content}
							</Text>
							<Space h={12} />
							{post.tags && (
								<>
									{post.tags.map(tag => (
										<Badge
											style={{ marginRight: 4 }}
											key={tag}
											size={'xs'}
											gradient={{
												from: isDarkTheme
													? colorDarkerGrey
													: '#DCDCDC',
												to: isDarkTheme
													? colorDarkerGrey
													: '#DCDCDC',
												deg: 35
											}}
											classNames={{
												inner: clubsTheme.tBadgeTextSmall
											}}
											variant={'gradient'}
										>
											{tag}
										</Badge>
									))}
								</>
							)}
						</div>
					</div>

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
							<Link href={`/${post.clubSlug}/e/forum/post1`}>
								<div
									className={clubsTheme.centeredRow}
									style={{ cursor: 'pointer' }}
								>
									<Message width={20} height={20} />
									<Space w={4} />
									<Text className={clubsTheme.tExtraSmall}>
										14
									</Text>
								</div>
							</Link>
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
