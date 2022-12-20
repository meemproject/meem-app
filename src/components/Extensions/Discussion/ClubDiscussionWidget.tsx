import { Text, Button, Space } from '@mantine/core'
import { useAuth, useSDK } from '@meemproject/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Settings } from 'tabler-icons-react'
import { Club } from '../../../model/club/club'
import { DiscussionPost } from '../../../model/club/extensions/discussion/discussionPost'
import { useClubsTheme } from '../../Styles/ClubsTheme'
import { rowToDiscussionPost } from './DiscussionHome'
import { DiscussionPostPreview } from './DiscussionPostPreview'
interface IProps {
	club: Club
}

export const ClubDiscussionWidget: React.FC<IProps> = ({ club }) => {
	const { classes: clubsTheme } = useClubsTheme()

	const [hasFetchdData, setHasFetchedData] = useState(false)
	const [posts, setPosts] = useState<DiscussionPost[]>([])

	const router = useRouter()

	const { sdk } = useSDK()
	const { chainId } = useAuth()

	useEffect(() => {}, [club])

	useEffect(() => {
		const fetchData = async () => {
			if (hasFetchdData || !chainId || !sdk.id.hasInitialized) {
				return
			}

			const agreementExtension = club?.rawClub?.AgreementExtensions.find(
				ae => ae.Extension?.slug === 'discussion'
			)

			if (
				agreementExtension &&
				agreementExtension.metadata?.storage?.tableland?.posts
			) {
				const authSig = await sdk.id.getLitAuthSig()

				const tableName =
					agreementExtension.metadata?.storage?.tableland?.posts
						.tablelandTableName

				const rows = await sdk.storage.read({
					chainId,
					tableName,
					authSig,
					limit: 2
				})

				const newPosts: DiscussionPost[] = rows.map(row => {
					return rowToDiscussionPost({ row, club })
				})

				setPosts(newPosts)

				setHasFetchedData(true)
			}
		}

		fetchData()
	}, [hasFetchdData, club, chainId, sdk])

	// const posts: DiscussionPost[] = [
	// 	{
	// 		id: '1',
	// 		title: 'Test post one',
	// 		clubSlug: club.slug ?? '',
	// 		tags: ['funny', 'crazy'],
	// 		content: 'This is just a small test post.',
	// 		user: club.members ? club.members[0] : { wallet: '' }
	// 	},
	// 	{
	// 		id: '2',
	// 		title: 'Test post two',
	// 		clubSlug: club.slug ?? '',

	// 		tags: ['funny', 'crazy'],
	// 		content: 'And another test post',
	// 		user: club.members ? club.members[0] : { wallet: '' }
	// 	}
	// ]

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
							className={clubsTheme.buttonBlue}
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
