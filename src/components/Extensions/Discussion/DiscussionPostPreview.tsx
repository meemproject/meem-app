import log from '@kengoldfarb/log'
import {
	Center,
	Space,
	Text,
	Image,
	Badge,
	useMantineColorScheme,
	Tooltip
} from '@mantine/core'
import { useAuth, useSDK } from '@meemproject/react'
import { normalizeImageUrl } from '@meemproject/sdk'
import { DateTime } from 'luxon'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, Message } from 'tabler-icons-react'
import { DiscussionComment } from '../../../model/agreement/extensions/discussion/discussionComment'
import { DiscussionPost } from '../../../model/agreement/extensions/discussion/discussionPost'
import { quickTruncate } from '../../../utils/truncated_wallet'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import { colorDarkerGrey, useMeemTheme } from '../../Styles/MeemTheme'
import { calculateVotes } from './DiscussionHome'
import { useDiscussions } from './DiscussionProvider'
interface IProps {
	post: DiscussionPost
	onReaction?: () => void
}

export const DiscussionPostPreview: React.FC<IProps> = ({
	post,
	onReaction
}) => {
	const { classes: meemTheme } = useMeemTheme()
	const { agreement } = useAgreement()

	const [isLoading, setIsLoading] = useState(false)
	const [votes, setVotes] = useState(0)
	const [commentCount, setCommentCount] = useState(0)
	const [canReact, setCanReact] = useState(false)

	const router = useRouter()
	const { privateKey } = useDiscussions()

	const { sdk } = useSDK()
	const { me } = useAuth()

	const { colorScheme } = useMantineColorScheme()
	const isDarkTheme = colorScheme === 'dark'

	const handleReactionSubmit = useCallback(
		async (options: { reaction: string }) => {
			const { reaction } = options
			try {
				if (!post.id) {
					log.crit('No postId found')
					return
				}
				if (!agreement) {
					log.crit('No agreement found')
					return
				}
				if (!privateKey) {
					log.crit('No privateKey found')
					return
				}
				setIsLoading(true)

				const createdAt = Math.floor(new Date().getTime() / 1000)
				const gun = sdk.storage.getGunInstance()

				const { item } = await sdk.storage.encryptAndWrite({
					path: `meem/${agreement.id}/extensions/discussion/posts/${post.id}/reactions`,
					key: privateKey,
					writeColumns: {
						createdAt
					},
					data: {
						reaction,
						userId: me?.user.id,
						walletAddress: me?.address
					}
				})

				gun.get(
					`meem/${agreement.id}/extensions/discussion/posts/${post.id}`
				)
					// @ts-ignore
					.get('reactions')
					// @ts-ignore
					.set(item)

				if (onReaction) {
					onReaction()
				}
			} catch (err) {
				log.crit(err)
			}
			setIsLoading(false)
		},
		[agreement, sdk, me, post.id, privateKey, onReaction]
	)

	useEffect(() => {
		function countComments(comments: DiscussionComment[]): number {
			let count = 0

			comments.forEach(comment => {
				count = count + 1
				if (comment.comments && comment.comments.length > 0) {
					const childComments = countComments(comment.comments)
					count = count + childComments
				}
			})

			return count
		}
		const { votes: v, userVotes } = calculateVotes(post)
		setVotes(v)

		if (me && userVotes[me.user.id]) {
			setCanReact(false)
		} else {
			setCanReact(true)
		}

		if (post && post.comments) {
			setCommentCount(countComments(post.comments ?? []))
		}
	}, [post, me])

	return (
		<div className={meemTheme.greyContentBox} style={{ marginBottom: 16 }}>
			<>
				<div
					className={meemTheme.clickable}
					onClick={() => {
						router.push({
							pathname: `/${agreement?.slug}/e/discussions/${post.id}`
						})
					}}
				>
					<div className={meemTheme.row}>
						<div>
							<Center>
								<Tooltip
									label="You have already reacted to this post."
									disabled={canReact}
								>
									<span>
										<ChevronUp
											style={{ cursor: 'pointer' }}
											onClick={() => {
												if (canReact && !isLoading) {
													handleReactionSubmit({
														reaction: 'upvote'
													})
												}
											}}
										>
											<ChevronUp />
										</ChevronUp>
									</span>
								</Tooltip>
							</Center>

							<Space h={16} />
							<Center>{votes ?? 0}</Center>
							<Space h={16} />
							<Center>
								<Tooltip
									label="You have already reacted to this post."
									disabled={canReact}
								>
									<span>
										<ChevronDown
											style={{ cursor: 'pointer' }}
											onClick={() => {
												if (canReact && !isLoading) {
													handleReactionSubmit({
														reaction: 'downvote'
													})
												}
											}}
										>
											<ChevronDown />
										</ChevronDown>
									</span>
								</Tooltip>
							</Center>
						</div>
						<Space w={16} />
						<div style={{ width: '100%' }}>
							<div className={meemTheme.row}>
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
									<Text className={meemTheme.tSmallBold}>
										{post.title}
									</Text>
									<Text
										className={meemTheme.tExtraSmall}
										dangerouslySetInnerHTML={{
											// TODO: Sanitize html. Possible XSS vulnerability
											__html: post.body
										}}
									/>
									{post.tags &&
										post.tags.length > 0 &&
										post.tags.map(tag => {
											return (
												<Badge
													style={{
														marginRight: 4
													}}
													key={`post-tag-${post.id}-${tag}`}
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
														inner: meemTheme.tBadgeTextSmall
													}}
													variant={'gradient'}
												>
													{tag.length > 0
														? tag
														: 'UNTAGGED'}
												</Badge>
											)

											return null
										})}

									<Space h={12} />
								</div>
							</div>

							<div className={meemTheme.spacedRowCentered}>
								<div className={meemTheme.centeredRow}>
									<Image
										src={
											post?.profilePicUrl
												? normalizeImageUrl(
														post.profilePicUrl
												  )
												: `/meem-icon.png`
										}
										height={32}
										width={32}
										radius={16}
									/>
									<Space w={8} />
									<div>
										<Text
											className={
												meemTheme.tExtraSmallBold
											}
										>
											{post.displayName ??
											post.walletAddress
												? quickTruncate(
														post.walletAddress
												  )
												: `Community Member`}
										</Text>
										<Text
											className={
												meemTheme.tExtraExtraSmall
											}
										>
											{typeof post.createdAt === 'number'
												? DateTime.fromSeconds(
														post.createdAt
												  ).toRelative()
												: ''}
										</Text>
									</div>
								</div>
								<div
									className={meemTheme.row}
									style={{ marginTop: 16 }}
								>
									<Link
										href={`/${post.agreementSlug}/e/discussions/${post.id}`}
									>
										<div
											className={meemTheme.centeredRow}
											style={{ cursor: 'pointer' }}
										>
											<Message width={20} height={20} />
											<Space w={4} />
											<Text
												className={
													meemTheme.tExtraSmall
												}
											>
												{commentCount}
											</Text>
										</div>
									</Link>
									<Space w={16} />
									{/* <div
										className={meemTheme.centeredRow}
										style={{ cursor: 'pointer' }}
									>
										<Share width={20} height={20} />
										<Space w={4} />
										<Text className={meemTheme.tExtraSmall}>
											Share
										</Text>
									</div>
									<Space w={16} /> */}
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
		</div>
	)
}
