/* eslint-disable @typescript-eslint/naming-convention */
import log from '@kengoldfarb/log'
import {
	Container,
	Text,
	TextInput,
	Space,
	Center,
	Button
} from '@mantine/core'
import { useSDK } from '@meemproject/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Search } from 'tabler-icons-react'
import {
	Agreement,
	extensionFromSlug
} from '../../../model/agreement/agreements'
import { DiscussionComment } from '../../../model/agreement/extensions/discussion/discussionComment'
import { DiscussionPost } from '../../../model/agreement/extensions/discussion/discussionPost'
import type { DiscussionReaction } from '../../../model/agreement/extensions/discussion/discussionReaction'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import { useMeemTheme } from '../../Styles/MeemTheme'
import { ExtensionBlankSlate, extensionIsReady } from '../ExtensionBlankSlate'
import { ExtensionPageHeader } from '../ExtensionPageHeader'
import { DiscussionPostPreview } from './DiscussionPostPreview'
import { useDiscussions } from './DiscussionProvider'
import 'gun/sea'
import 'gun/lib/open'

export function calculateVotes(
	postOrComment?: DiscussionPost | DiscussionComment
) {
	let upvotes = 0
	let downvotes = 0
	const userVotes: {
		[userId: string]: boolean
	} = {}
	if (postOrComment?.reactions) {
		Object.values(postOrComment.reactions).forEach(r => {
			if (!userVotes[r.userId]) {
				if (r.reaction === 'upvote') {
					userVotes[r.userId] = true
					upvotes++
				} else if (r.reaction === 'downvote') {
					userVotes[r.userId] = true
					downvotes++
				}
			}
		})
	}

	return {
		votes: upvotes - downvotes,
		upvotes,
		downvotes,
		userVotes
	}
}

export function rowToDiscussionReaction(options: {
	row: {
		[columnName: string]: any
	}
}): DiscussionReaction | undefined {
	const { row } = options

	if (!row || !row.data) {
		return
	}

	return {
		id: row.id,
		reaction: row.data.reaction,
		userId: row.data.userId,
		walletAddress: row.data.walletAddress
	}
}

export function rowToDiscussionComment(options: {
	row: {
		[columnName: string]: any
	}
	agreement?: Agreement
}): DiscussionComment | undefined {
	const { row, agreement } = options

	if (!row || !row.data) {
		return
	}

	const comments: DiscussionComment[] = []
	if (row.comments) {
		Object.keys(row.comments).forEach(k => {
			if (row.comments[k].data) {
				const c = rowToDiscussionComment({
					row: { ...row.comments[k], id: k },
					agreement
				})
				if (c) {
					comments.push(c)
				}
			}
		})
	}

	const reactions: DiscussionReaction[] = []

	if (row.reactions) {
		Object.keys(row.reactions).forEach(k => {
			if (row.reactions[k].data) {
				const r = rowToDiscussionReaction({
					row: { ...row.reactions[k], id: k }
				})
				if (r) {
					reactions.push(r)
				}
			}
		})
	}

	return {
		id: row.id,
		agreementSlug: agreement?.slug ?? '',
		body: row.data.body,
		userId: row.data.userId,
		displayName: row.data.displayName ?? row.data.ens,
		walletAddress: row.data.walletAddress,
		profilePicUrl: row.data.profilePicUrl,
		createdAt: row.createdAt,
		updatedAt: row.updatedAt,
		comments,
		reactions
	}
}

export function rowToDiscussionPost(options: {
	row: {
		[columnName: string]: any
	}
	agreement?: Agreement
}): DiscussionPost | undefined {
	const { row, agreement } = options

	if (!row || !row.data) {
		return
	}

	const comments: DiscussionComment[] = []
	if (row.comments) {
		Object.keys(row.comments).forEach(k => {
			if (row.comments[k].data) {
				const c = rowToDiscussionComment({
					row: { ...row.comments[k], id: k },
					agreement
				})
				if (c) {
					comments.push(c)
				}
			}
		})
	}

	const reactions: DiscussionReaction[] = []
	if (row.reactions) {
		Object.keys(row.reactions).forEach(k => {
			if (row.reactions[k].data) {
				const r = rowToDiscussionReaction({
					row: { ...row.reactions[k], id: k }
				})
				if (r) {
					reactions.push(r)
				}
			}
		})
	}

	return {
		id: row.id,
		title: row.data.title,
		tags: row.data.tags,
		agreementSlug: agreement?.slug ?? '',
		body: row.data.body,
		userId: row.data.userId,
		displayName: row.data.displayName ?? row.data.ens,
		walletAddress: row.data.walletAddress,
		profilePicUrl: row.data.profilePicUrl,
		createdAt: row.createdAt,
		updatedAt: row.updatedAt,
		attachment: row.data.attachment,
		comments,
		reactions
	}
}

export const DiscussionHome: React.FC = () => {
	const { classes: meemTheme } = useMeemTheme()
	const router = useRouter()
	const [posts, setPosts] = useState<DiscussionPost[]>([])
	const [hasInitialized, setHasInitialized] = useState(false)

	const { sdk } = useSDK()
	const { privateKey } = useDiscussions()

	const { agreement, isLoadingAgreement } = useAgreement()

	const agreementExtension = extensionFromSlug('discussions', agreement)

	useEffect(() => {
		const run = async () => {
			if (!sdk.id.hasInitialized || !privateKey) {
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

					setPosts(newPosts)
				}
			})

			setHasInitialized(true)
		}
		run()
	}, [sdk, agreement, privateKey])

	return (
		<>
			<ExtensionBlankSlate extensionSlug={'discussions'} />
			{extensionIsReady(
				isLoadingAgreement,
				agreement,
				agreementExtension
			) &&
				hasInitialized && (
					<>
						<ExtensionPageHeader extensionSlug={'discussions'} />

						<Container>
							<Space h={24} />
							{posts.length === 0 && (
								<>
									<Center>
										<Text className={meemTheme.tSmall}>
											There are no posts yet in your
											community. Be the first one to say
											something!
										</Text>
									</Center>
									<Space h={24} />
								</>
							)}

							<Center>
								<Button
									className={meemTheme.buttonBlack}
									onClick={() => {
										router.push({
											pathname: `/${agreement?.slug}/e/discussions/submit`
										})
									}}
								>
									+ Start a discussion
								</Button>
							</Center>
							<Space h={48} />
							{posts.length > 0 && (
								<div className={meemTheme.centeredRow}>
									<TextInput
										radius={20}
										classNames={{
											input: meemTheme.fTextField
										}}
										icon={<Search />}
										placeholder={'Search discussions'}
										className={meemTheme.fullWidth}
										size={'lg'}
										onChange={event => {
											log.debug(event.target.value)
											// TODO
										}}
									/>
									<Space w={16} />
									<Button className={meemTheme.buttonBlack}>
										Sort
									</Button>
								</div>
							)}

							<Space h={32} />
							{posts.map(post => (
								<DiscussionPostPreview
									key={`post-${post.id}`}
									post={post}
								/>
							))}
						</Container>
					</>
				)}
		</>
	)
}
