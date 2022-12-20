import { Text, Button, Space } from '@mantine/core'
import { useAuth, useSDK } from '@meemproject/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Settings } from 'tabler-icons-react'
import { Agreement } from '../../../model/agreement/agreements'
import { DiscussionPost } from '../../../model/agreement/extensions/discussion/discussionPost'
import { useMeemTheme } from '../../Styles/AgreementsTheme'
import { rowToDiscussionPost } from './DiscussionHome'
import { DiscussionPostPreview } from './DiscussionPostPreview'
interface IProps {
	agreement: Agreement
}

export const DiscussionWidget: React.FC<IProps> = ({ agreement }) => {
	const { classes: meemTheme } = useMeemTheme()

	const [hasFetchdData, setHasFetchedData] = useState(false)
	const [posts, setPosts] = useState<DiscussionPost[]>([])

	const router = useRouter()

	const { sdk } = useSDK()
	const { chainId } = useAuth()

	useEffect(() => {}, [agreement])

	useEffect(() => {
		const fetchData = async () => {
			if (hasFetchdData || !chainId || !sdk.id.hasInitialized) {
				return
			}

			const agreementExtension =
				agreement?.rawAgreement?.AgreementExtensions.find(
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
					return rowToDiscussionPost({ row, agreement })
				})

				setPosts(newPosts)

				setHasFetchedData(true)
			}
		}

		fetchData()
	}, [hasFetchdData, agreement, chainId, sdk])

	// const posts: DiscussionPost[] = [
	// 	{
	// 		id: '1',
	// 		title: 'Test post one',
	// 		agreementSlug: agreement.slug ?? '',
	// 		tags: ['funny', 'crazy'],
	// 		content: 'This is just a small test post.',
	// 		user: agreement.members ? agreement.members[0] : { wallet: '' }
	// 	},
	// 	{
	// 		id: '2',
	// 		title: 'Test post two',
	// 		agreementSlug: agreement.slug ?? '',

	// 		tags: ['funny', 'crazy'],
	// 		content: 'And another test post',
	// 		user: agreement.members ? agreement.members[0] : { wallet: '' }
	// 	}
	// ]

	return (
		<>
			<div className={meemTheme.widgetLight}>
				<div className={meemTheme.spacedRowCentered}>
					<div className={meemTheme.centeredRow}>
						<Text className={meemTheme.tMediumBold}>
							Discussions
						</Text>
						<Space w={6} />
						<Text className={meemTheme.tMedium}>
							{`(${posts.length})`}
						</Text>
					</div>
					<div className={meemTheme.centeredRow}>
						<Button
							className={meemTheme.buttonBlue}
							onClick={() => {
								router.push({
									pathname: `/${agreement.slug}/e/discussion`
								})
							}}
						>
							View All
						</Button>

						{agreement.isCurrentUserAgreementAdmin && (
							<div className={meemTheme.row}>
								<Space w={8} />
								<Settings
									className={meemTheme.clickable}
									onClick={() => {
										router.push({
											pathname: `/${agreement.slug}/e/discussion/settings`
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
