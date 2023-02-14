import { Text, Button, Space, Center, Loader } from '@mantine/core'
import { useSDK } from '@meemproject/react'
import { Plus, Settings } from 'iconoir-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import {
	Agreement,
	extensionFromSlug
} from '../../../model/agreement/agreements'
import { DiscussionPost } from '../../../model/agreement/extensions/discussion/discussionPost'
import { useMeemTheme } from '../../Styles/MeemTheme'
import { rowToDiscussionPost } from './DiscussionHome'
import { DiscussionPostPreview } from './DiscussionPostPreview'
import { useDiscussions } from './DiscussionProvider'
interface IProps {
	agreement: Agreement
}

export const DiscussionWidget: React.FC<IProps> = ({ agreement }) => {
	const { classes: meemTheme } = useMeemTheme()

	const [hasFetchedData, setHasFetchedData] = useState(false)
	const [posts, setPosts] = useState<DiscussionPost[]>([])

	const { sdk } = useSDK()
	const { privateKey } = useDiscussions()

	const agreementExtension = extensionFromSlug('discussions', agreement)

	useEffect(() => {
		const fetchData = async () => {
			if (hasFetchedData || !sdk.id.hasInitialized || !privateKey) {
				setHasFetchedData(true)
				return
			}

			const path = `meem/${agreement?.id}/extensions/discussion/posts`

			sdk.storage.on({
				privateKey,
				path,
				cb: (items: any) => {
					const newPosts: DiscussionPost[] = []

					Object.keys(items).forEach(k => {
						const item = items[k]
						if (typeof item.data === 'object') {
							const p = rowToDiscussionPost({
								row: { ...item, id: k },
								agreement
							})
							if (p && p.title && p.body) {
								newPosts.push(p)
							}
						}
					})

					newPosts.sort((a, b) => {
						if (!a.createdAt) {
							return 1
						}
						if (!b.createdAt) {
							return -1
						}
						if (a.createdAt > b.createdAt) {
							return -1
						}
						if (a.createdAt < b.createdAt) {
							return 1
						}
						return 0
					})

					setPosts(newPosts.slice(0, 3))
				}
			})

			setHasFetchedData(true)
		}

		fetchData()
	}, [hasFetchedData, agreement, sdk, privateKey, agreementExtension])

	return (
		<>
			<div className={meemTheme.widgetLight}>
				<div className={meemTheme.spacedRowCentered}>
					<div className={meemTheme.centeredRow}>
						<Text className={meemTheme.tMediumBold}>
							Discussions
						</Text>
						<Space w={6} />
						{hasFetchedData &&
							agreementExtension?.isInitialized && (
								<Text className={meemTheme.tMedium}>
									{`(${posts.length})`}
								</Text>
							)}
					</div>
					{agreementExtension?.isInitialized && (
						<div className={meemTheme.centeredRow}>
							{posts.length > 0 && (
								<>
									<>
										<Link
											href={`/${agreement.slug}/e/discussions/submit`}
											legacyBehavior
										>
											<Button
												className={
													meemTheme.buttonDarkGrey
												}
											>
												<div>
													<Plus />
												</div>
											</Button>
										</Link>
									</>
									<Space w={8} />
									<Link
										href={`/${agreement.slug}/e/discussions`}
										legacyBehavior
									>
										<Button
											className={meemTheme.buttonDarkGrey}
										>
											View All
										</Button>
									</Link>
								</>
							)}

							{agreement.isCurrentUserAgreementAdmin && (
								<div className={meemTheme.row}>
									<Space w={8} />
									<Link
										href={`/${agreement.slug}/e/discussions/settings`}
										legacyBehavior
									>
										<div>
											<Settings
												className={meemTheme.clickable}
											/>
										</div>
									</Link>
								</div>
							)}
						</div>
					)}
				</div>
				<Space h={24} />
				{!hasFetchedData && agreementExtension?.isInitialized && (
					<>
						<Center>
							<Loader variant="oval" color="cyan" />
						</Center>
						<Space h={8} />
					</>
				)}
				{hasFetchedData && agreementExtension?.isInitialized && (
					<>
						{posts.length > 0 && (
							<>
								{posts.map(post => (
									<DiscussionPostPreview
										key={post.id}
										post={post}
									/>
								))}
							</>
						)}
						{posts.length == 0 && (
							<>
								{!agreement.isCurrentUserAgreementMember && (
									<Center>
										<Text className={meemTheme.tSmallBold}>
											Join this community to view its
											discussions.
										</Text>
									</Center>
								)}
								{agreement.isCurrentUserAgreementMember && (
									<>
										<Center>
											<Text
												className={meemTheme.tSmallBold}
											>
												There are no discussions yet.
											</Text>
										</Center>
										<Space h={12} />
										<Center>
											<Link
												href={`/${agreement.slug}/e/discussions/submit`}
												legacyBehavior
											>
												<Button
													className={
														meemTheme.buttonDarkGrey
													}
												>
													+ Create a discussion
												</Button>
											</Link>
										</Center>
										<Space h={8} />
									</>
								)}
							</>
						)}
					</>
				)}
				{!agreementExtension?.isInitialized && (
					<Center>
						<Text
							className={meemTheme.tMedium}
						>{`${agreementExtension?.Extension?.name} is being set up. Come back in a few minutes!`}</Text>
					</Center>
				)}
			</div>
		</>
	)
}
