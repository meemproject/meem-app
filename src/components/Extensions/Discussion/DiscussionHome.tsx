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
import { LoginState, useAuth, useSDK } from '@meemproject/react'
import Gun from 'gun/gun'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Search } from 'tabler-icons-react'
import {
	Agreement,
	extensionFromSlug
} from '../../../model/agreement/agreements'
import { DiscussionComment } from '../../../model/agreement/extensions/discussion/discussionComment'
import { DiscussionPost } from '../../../model/agreement/extensions/discussion/discussionPost'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import { useMeemTheme } from '../../Styles/MeemTheme'
import { ExtensionBlankSlate, extensionIsReady } from '../ExtensionBlankSlate'
import { ExtensionPageHeader } from '../ExtensionPageHeader'
import { IReactions } from './DiscussionPost'
import { DiscussionPostPreview } from './DiscussionPostPreview'
import 'gun/sea'
import 'gun/lib/open'
import { useDiscussions } from './DiscussionProvider'

export function rowToDiscussionPost(options: {
	row: {
		[columnName: string]: any
	}
	agreement?: Agreement
}): DiscussionPost {
	const { row, agreement } = options
	console.log({ row })
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
		comments: row.comments
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

	return {
		id: row.id,
		agreementSlug: agreement?.slug ?? '',
		body: row.data.body,
		userId: row.data.userId,
		displayName: row.data.displayName ?? row.data.ens,
		walletAddress: row.data.walletAddress,
		profilePicUrl: row.data.profilePicUrl,
		createdAt: row.createdAt,
		updatedAt: row.updatedAt
	}
}

export const DiscussionHome: React.FC = () => {
	const { classes: meemTheme } = useMeemTheme()
	const router = useRouter()
	const [commentCounts, setCommentCounts] = useState<{
		[postId: string]: number
	}>({})
	const [hasFetchdData, setHasFetchedData] = useState(false)
	const [hasFetchedCommentCount, setHasFetchedCommentCount] = useState(false)
	const [hasFetchedReactions, setHasFetchedReactions] = useState(false)
	const [reactions, setReactions] = useState<IReactions>({
		posts: {},
		comments: {}
	})
	const [posts, setPosts] = useState<DiscussionPost[]>([])

	const { sdk } = useSDK()
	const { chainId, loginState } = useAuth()
	const { privateKey } = useDiscussions()

	const { agreement, isLoadingAgreement } = useAgreement()

	const agreementExtension = extensionFromSlug('discussions', agreement)

	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		if (
	// 			hasFetchedCommentCount ||
	// 			!hasFetchdData ||
	// 			!chainId ||
	// 			!sdk.id.hasInitialized
	// 		) {
	// 			return
	// 		}

	// 		if (
	// 			agreementExtension &&
	// 			agreementExtension.metadata?.storage?.tableland?.comments
	// 		) {
	// 			const tableName =
	// 				agreementExtension.metadata?.storage?.tableland?.comments
	// 					.tablelandTableName

	// 			const tl = await sdk.storage.getTablelandInstance({ chainId })

	// 			const postIds = posts.map(p => `'${p.id}'`).join(',')

	// 			const query = `select count(1), "refId" from ${tableName} where "refId" in (${postIds}) group by "refId"`

	// 			const result = await tl.read(query)

	// 			const newCommentCounts: { [postId: string]: number } = {}

	// 			result.rows.forEach(row => {
	// 				newCommentCounts[row[1]] = row[0]
	// 			})

	// 			setCommentCounts(newCommentCounts)

	// 			setHasFetchedCommentCount(true)
	// 		}
	// 	}

	// 	fetchData()
	// }, [
	// 	hasFetchdData,
	// 	hasFetchedCommentCount,
	// 	agreement,
	// 	chainId,
	// 	sdk,
	// 	agreementExtension,
	// 	posts
	// ])

	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		if (
	// 			hasFetchedReactions ||
	// 			!hasFetchdData ||
	// 			!posts ||
	// 			!chainId ||
	// 			loginState !== LoginState.LoggedIn ||
	// 			!sdk.id.hasInitialized
	// 		) {
	// 			return
	// 		}

	// 		const authSig = await sdk.id.getLitAuthSig()

	// 		const refIds = posts.map(p => p.id)

	// 		// Fetch Reactions
	// 		if (
	// 			agreementExtension &&
	// 			agreementExtension.metadata?.storage?.tableland?.reactions
	// 		) {
	// 			const reactionsTableName =
	// 				agreementExtension.metadata?.storage?.tableland?.reactions
	// 					.tablelandTableName

	// 			const rows = await sdk.storage.read({
	// 				chainId,
	// 				tableName: reactionsTableName,
	// 				authSig,
	// 				where: {
	// 					refId: refIds
	// 				}
	// 			})

	// 			const newReactions: IReactions = { posts: {}, comments: {} }
	// 			rows.forEach(row => {
	// 				if (row.data?.reaction) {
	// 					const table = row.refTable as string
	// 					if (newReactions[table]) {
	// 						if (!newReactions[table][row.refId]) {
	// 							newReactions[table][row.refId] = {
	// 								counts: {},
	// 								walletAddresses: {}
	// 							}
	// 						}

	// 						// Ignore additional reactions from a wallet
	// 						if (
	// 							newReactions[table][row.refId].walletAddresses[
	// 								row.data.walletAddress
	// 							]
	// 						) {
	// 							return
	// 						}

	// 						if (
	// 							!newReactions[table][row.refId].counts[
	// 								row.data.reaction
	// 							]
	// 						) {
	// 							newReactions[table][row.refId].counts[
	// 								row.data.reaction
	// 							] = 1
	// 						} else {
	// 							newReactions[table][row.refId].counts[
	// 								row.data.reaction
	// 							]++
	// 						}

	// 						newReactions[table][row.refId].walletAddresses[
	// 							row.data.walletAddress
	// 						] = true
	// 					}
	// 				}
	// 			})

	// 			setReactions(newReactions)
	// 		}

	// 		setHasFetchedReactions(true)
	// 	}

	// 	fetchData()
	// }, [
	// 	hasFetchedReactions,
	// 	hasFetchdData,
	// 	agreement,
	// 	chainId,
	// 	sdk,
	// 	posts,
	// 	loginState,
	// 	agreementExtension
	// ])

	useEffect(() => {
		const run = async () => {
			if (!sdk.id.hasInitialized || !chainId || !privateKey) {
				return
			}

			const path = `meem/${agreement?.id}/extensions/discussion/posts`

			sdk.storage.on({
				chainId,
				privateKey,
				path,
				cb: items => {
					console.log('DATA!!!')
					console.log({ items })
					const newPosts: DiscussionPost[] = []

					Object.keys(items).forEach(k => {
						const item = items[k]
						if (typeof item.data === 'object') {
							newPosts.push(
								rowToDiscussionPost({
									row: { ...item, id: k },
									agreement
								})
							)
						}
					})
					// .filter(
					// 	(item: Record<string, any>) =>
					// 		typeof item.data === 'object'
					// )
					// .map(item =>
					// 	rowToDiscussionPost({ row: item, agreement })
					// )

					console.log({ newPosts })

					setPosts(newPosts)
				}
			})

			// gun.get(path).open(data => {
			// 	console.log({ data })
			// })

			// const discussionPosts = gun.get(
			// 	`meem-${agreement?.id}-extensions-discussion-posts`
			// )

			// discussionPosts.map().once(data => {
			// 	console.log('RECEIVE DATA!!!!!!!!!!!')
			// 	console.log({ data })
			// })

			console.log('!!!!!!!!!!!!!!!!!!!!!!! END DATA FROM GUN')
		}
		run()
	}, [sdk, agreement, chainId, privateKey])

	return (
		<>
			<ExtensionBlankSlate extensionSlug={'discussions'} />
			{extensionIsReady(
				isLoadingAgreement,
				agreement,
				agreementExtension
			) && (
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
								key={post.id}
								post={post}
								onReaction={() => {
									setHasFetchedReactions(false)
								}}
								reactions={reactions}
								agreementExtension={agreementExtension}
								commentCount={commentCounts[post.id.toString()]}
							/>
						))}
					</Container>
				</>
			)}
		</>
	)
}
