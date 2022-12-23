import log from '@kengoldfarb/log'
import {
	Center,
	Space,
	Text,
	Image,
	Badge,
	useMantineColorScheme
} from '@mantine/core'
import { useAuth, useSDK } from '@meemproject/react'
import { DateTime } from 'luxon'
import Link from 'next/link'
import React, { useCallback, useState } from 'react'
import { ChevronDown, ChevronUp, Message, Share } from 'tabler-icons-react'
import { AgreementExtensions } from '../../../../generated/graphql'
import { DiscussionPost } from '../../../model/agreement/extensions/discussion/discussionPost'
import { quickTruncate } from '../../../utils/truncated_wallet'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import { colorDarkerGrey, useMeemTheme } from '../../Styles/MeemTheme'
import { IReactions } from './DiscussionPost'
interface IProps {
	post: DiscussionPost
	reactions: IReactions
	agreementExtension: AgreementExtensions | undefined
	onReaction: () => void
	commentCount?: number
}

export const DiscussionPostPreview: React.FC<IProps> = ({
	post,
	reactions,
	agreementExtension,
	onReaction,
	commentCount
}) => {
	const { classes: meemTheme } = useMeemTheme()
	const { agreement } = useAgreement()

	const [isLoading, setIsLoading] = useState(false)

	log.debug({ isLoading, commentCount })

	const { sdk } = useSDK()
	const { chainId, me } = useAuth()

	const { colorScheme } = useMantineColorScheme()
	const isDarkTheme = colorScheme === 'dark'

	const handleReactionSubmit = useCallback(
		async (options: {
			e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
			reaction: string
		}) => {
			const { e, reaction } = options
			e.preventDefault()
			try {
				if (!chainId) {
					log.crit('No chainId found')
					return
				}
				setIsLoading(true)

				const authSig = await sdk.id.getLitAuthSig()

				const tableName =
					agreementExtension?.metadata?.storage?.tableland?.reactions
						.tablelandTableName

				await sdk.storage.encryptAndWrite({
					chainId,
					tableName,
					authSig,
					writeColumns: {
						refId: post.id,
						refTable: 'posts'
					},
					data: {
						reaction,
						userId: me?.user.id,
						walletAddress: me?.address
					},
					accessControlConditions: [
						{
							contractAddress: agreement?.address
						}
					]
				})

				// Re-fetch
				onReaction()
			} catch (err) {
				log.crit(err)
			}
			setIsLoading(false)
		},
		[sdk, chainId, me, agreementExtension, agreement, onReaction, post]
	)

	const upVotes =
		(post &&
			reactions.posts[post.id] &&
			reactions.posts[post.id].counts.upvote) ??
		0
	const downVotes =
		(post &&
			reactions.posts[post.id] &&
			reactions.posts[post.id].counts.downvote) ??
		0
	const votes = upVotes - downVotes

	return (
		<div className={meemTheme.greyContentBox} style={{ marginBottom: 16 }}>
			<Link href={`/${agreement?.slug}/e/discussion/${post.id}`}>
				<a>
					<div className={meemTheme.row}>
						<div>
							<Center>
								<a
									style={{ cursor: 'pointer' }}
									onClick={e =>
										handleReactionSubmit({
											e,
											reaction: 'upvote'
										})
									}
								>
									<ChevronUp />
								</a>
							</Center>

							<Space h={16} />
							<Center>{votes ?? 0}</Center>
							<Space h={16} />
							<Center>
								<a
									style={{ cursor: 'pointer' }}
									onClick={e =>
										handleReactionSubmit({
											e,
											reaction: 'downvote'
										})
									}
								>
									<ChevronDown />
								</a>
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
									<Space h={8} />
									<Text
										className={meemTheme.tExtraSmall}
										dangerouslySetInnerHTML={{
											// TODO: Sanitize html. Possible XSS vulnerability
											__html: post.body
										}}
									/>
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
														inner: meemTheme.tBadgeTextSmall
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
							<div className={meemTheme.spacedRowCentered}>
								<div className={meemTheme.centeredRow}>
									<Image
										src={
											post.profilePicUrl ??
											`/exampleclub.png`
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
												quickTruncate(
													post.walletAddress
												)}
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
										href={`/${post.agreementSlug}/e/discussion/post1`}
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
												{commentCount ?? 0}
											</Text>
										</div>
									</Link>
									<Space w={16} />
									<div
										className={meemTheme.centeredRow}
										style={{ cursor: 'pointer' }}
									>
										<Share width={20} height={20} />
										<Space w={4} />
										<Text className={meemTheme.tExtraSmall}>
											Share
										</Text>
									</div>
									<Space w={16} />
								</div>
							</div>
						</div>
					</div>
				</a>
			</Link>
		</div>
	)
}
