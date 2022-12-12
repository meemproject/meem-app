import { Text, Button, Space } from '@mantine/core'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { Settings } from 'tabler-icons-react'
import { Club } from '../../../model/club/club'
import { DiscussionPost } from '../../../model/club/extensions/discussion/discussionPost'
import { useClubsTheme } from '../../Styles/ClubsTheme'
import { DiscussionPostPreview } from './DiscussionPostPreview'
interface IProps {
	club: Club
}

export const ClubDiscussionWidget: React.FC<IProps> = ({ club }) => {
	const { classes: clubsTheme } = useClubsTheme()

	const router = useRouter()

	useEffect(() => {}, [club])

	const posts: DiscussionPost[] = [
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
						<Text className={clubsTheme.tMediumBold}>
							Discussions
						</Text>
						<Space w={6} />
						<Text className={clubsTheme.tMedium}>
							{`(${posts.length})`}
						</Text>
					</div>
					<div className={clubsTheme.centeredRow}>
						<Button
							className={clubsTheme.buttonRed}
							onClick={() => {
								router.push({
									pathname: `/${club.slug}/e/discussion`
								})
							}}
						>
							View All
						</Button>

						{club.isCurrentUserClubAdmin && (
							<div className={clubsTheme.row}>
								<Space w={8} />
								<Settings
									className={clubsTheme.clickable}
									onClick={() => {
										router.push({
											pathname: `/${club.slug}/e/discussion/settings`
										})
									}}
								/>
							</div>
						)}
					</div>
				</div>
				<Space h={24} />
				{posts.map(post => (
					<DiscussionPostPreview key={post.id} post={post} />
				))}
			</div>
		</>
	)
}
