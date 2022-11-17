import { Text, Button, Space } from '@mantine/core'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { Club } from '../../../model/club/club'
import { ForumPost } from '../../../model/club/forum/forumPost'
import { ForumPostPreview } from '../../ClubExtensions/Forum/ForumPostPreview'
import { useClubsTheme } from '../../Styles/ClubsTheme'
interface IProps {
	club: Club
}

export const ClubForumWidget: React.FC<IProps> = ({ club }) => {
	const { classes: clubsTheme } = useClubsTheme()

	const router = useRouter()

	useEffect(() => {}, [club])

	const posts: ForumPost[] = [
		{
			id: '1',
			title: 'Test post one',
			clubSlug: club.slug ?? '',
			tags: ['funny', 'crazy'],
			content: 'This is just a small test post.',
			user: club.members ? club.members[0] : { wallet: '' }
		},
		{
			id: '2',
			title: 'Test post two',
			clubSlug: club.slug ?? '',

			tags: ['funny', 'crazy'],
			content: 'And another test post',
			user: club.members ? club.members[0] : { wallet: '' }
		}
	]

	return (
		<>
			<div className={clubsTheme.widgetLight}>
				<div className={clubsTheme.spacedRowCentered}>
					<div className={clubsTheme.centeredRow}>
						<Text className={clubsTheme.tLargeBold}>
							Discussions
						</Text>
						<Space w={8} />
						<Text className={clubsTheme.tLarge}>
							{`(${posts.length})`}
						</Text>
					</div>
					<Button
						className={clubsTheme.buttonRed}
						onClick={() => {
							router.push({ pathname: `/${club.slug}/forum` })
						}}
					>
						View All
					</Button>
				</div>
				<Space h={24} />
				{posts.map(post => (
					<ForumPostPreview key={post.id} post={post} />
				))}
			</div>
		</>
	)
}
