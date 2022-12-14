import { Text, Button, Space } from '@mantine/core'
import { useSDK } from '@meemproject/react'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
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

	const { sdk } = useSDK()

	useEffect(() => {}, [club])

	useEffect(() => {
		const runQuery = async () => {
			const tl = await sdk.storage.getTablelandInstance({
				chainId: +process.env.NEXT_PUBLIC_CHAIN_ID
			})

			const result = await tl.read(
				'SELECT "data", "accessControlConditions", "createdAt", "updatedAt" from _420_192'
			)

			console.log({ result })
		}

		runQuery()
	}, [sdk])

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
							router.push({
								pathname: `/${club.slug}/e/discussion`
							})
						}}
					>
						View All
					</Button>
				</div>
				<Space h={24} />
				{posts.map(post => (
					<DiscussionPostPreview key={post.id} post={post} />
				))}
			</div>
		</>
	)
}
