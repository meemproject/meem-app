/* eslint-disable @typescript-eslint/naming-convention */
import log from '@kengoldfarb/log'
import {
	Container,
	Text,
	TextInput,
	Image,
	Space,
	Loader,
	Center,
	Button
} from '@mantine/core'
import { LoginState, useAuth, useSDK } from '@meemproject/react'
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
import { IReactions } from './DiscussionPost'
import { DiscussionPostPreview } from './DiscussionPostPreview'

export function rowToDiscussionPost(options: {
	row: {
		[columnName: string]: any
	}
	agreement?: Agreement
}): DiscussionPost {
	const { row, agreement } = options
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
		attachment: row.data.attachment
	}
}

export function rowToDiscussionComment(options: {
	row: {
		[columnName: string]: any
	}
	agreement?: Agreement
}): DiscussionComment {
	const { row, agreement } = options
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

	const { agreement, isLoadingAgreement, error } = useAgreement()

	// const posts: DiscussionPost[] = [
	// 	{
	// 		id: '1',
	// 		title: 'Test post one',
	// 		tags: ['funny', 'crazy'],
	// 		agreementSlug: agreement?.slug ?? '',
	// 		content: 'This is just a small test post.',
	// 		user: agreement && agreement.members ? agreement.members[0] : { wallet: '' }
	// 	},
	// 	{
	// 		id: '2',
	// 		title: 'Test post two',
	// 		tags: ['funny', 'crazy'],
	// 		agreementSlug: agreement?.slug ?? '',
	// 		content: 'And another test post',
	// 		user: agreement && agreement.members ? agreement.members[0] : { wallet: '' }
	// 	}
	// ]

	const agreementExtension = extensionFromSlug('discussions', agreement)

	useEffect(() => {
		const fetchData = async () => {
			if (hasFetchdData || !chainId || !sdk.id.hasInitialized) {
				return
			}

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
					authSig
				})

				const newPosts: DiscussionPost[] = rows.map(row =>
					rowToDiscussionPost({ row, agreement })
				)

				setPosts(newPosts)

				setHasFetchedData(true)
			}
		}

		fetchData()
	}, [hasFetchdData, agreement, chainId, sdk, agreementExtension])

	useEffect(() => {
		const fetchData = async () => {
			if (
				hasFetchedCommentCount ||
				!hasFetchdData ||
				!chainId ||
				!sdk.id.hasInitialized
			) {
				return
			}

			if (
				agreementExtension &&
				agreementExtension.metadata?.storage?.tableland?.comments
			) {
				const tableName =
					agreementExtension.metadata?.storage?.tableland?.comments
						.tablelandTableName

				const tl = await sdk.storage.getTablelandInstance({ chainId })

				const postIds = posts.map(p => `'${p.id}'`).join(',')

				const query = `select count(1), "refId" from ${tableName} where "refId" in (${postIds}) group by "refId"`

				const result = await tl.read(query)

				const newCommentCounts: { [postId: string]: number } = {}

				result.rows.forEach(row => {
					newCommentCounts[row[1]] = row[0]
				})

				setCommentCounts(newCommentCounts)

				setHasFetchedCommentCount(true)
			}
		}

		fetchData()
	}, [
		hasFetchdData,
		hasFetchedCommentCount,
		agreement,
		chainId,
		sdk,
		agreementExtension,
		posts
	])

	useEffect(() => {
		const fetchData = async () => {
			if (
				hasFetchedReactions ||
				!hasFetchdData ||
				!posts ||
				!chainId ||
				loginState !== LoginState.LoggedIn ||
				!sdk.id.hasInitialized
			) {
				return
			}

			const authSig = await sdk.id.getLitAuthSig()

			const refIds = posts.map(p => p.id)

			// Fetch Reactions
			if (
				agreementExtension &&
				agreementExtension.metadata?.storage?.tableland?.reactions
			) {
				const reactionsTableName =
					agreementExtension.metadata?.storage?.tableland?.reactions
						.tablelandTableName

				const rows = await sdk.storage.read({
					chainId,
					tableName: reactionsTableName,
					authSig,
					where: {
						refId: refIds
					}
				})

				const newReactions: IReactions = { posts: {}, comments: {} }
				rows.forEach(row => {
					if (row.data?.reaction) {
						const table = row.refTable as string
						if (newReactions[table]) {
							if (!newReactions[table][row.refId]) {
								newReactions[table][row.refId] = {
									counts: {},
									walletAddresses: {}
								}
							}

							// Ignore additional reactions from a wallet
							if (
								newReactions[table][row.refId].walletAddresses[
									row.data.walletAddress
								]
							) {
								return
							}

							if (
								!newReactions[table][row.refId].counts[
									row.data.reaction
								]
							) {
								newReactions[table][row.refId].counts[
									row.data.reaction
								] = 1
							} else {
								newReactions[table][row.refId].counts[
									row.data.reaction
								]++
							}

							newReactions[table][row.refId].walletAddresses[
								row.data.walletAddress
							] = true
						}
					}
				})

				setReactions(newReactions)
			}

			setHasFetchedReactions(true)
		}

		fetchData()
	}, [
		hasFetchedReactions,
		hasFetchdData,
		agreement,
		chainId,
		sdk,
		posts,
		loginState,
		agreementExtension
	])

	return (
		<>
			{isLoadingAgreement && (
				<Container>
					<Space h={120} />
					<Center>
						<Loader color="blue" variant="oval" />
					</Center>
				</Container>
			)}
			{!isLoadingAgreement && !error && !agreement?.name && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>Sorry, that community does not exist!</Text>
					</Center>
				</Container>
			)}
			{!isLoadingAgreement && error && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>
							There was an error loading this community. Please
							let us know!
						</Text>
					</Center>
				</Container>
			)}
			{!isLoadingAgreement && agreement?.name && (
				<>
					<Container>
						<Space h={48} />

						<Center>
							<Image
								className={meemTheme.imagePixelated}
								height={100}
								width={100}
								src={agreement.image}
							/>
						</Center>

						<Space h={24} />
						<Center>
							<Text className={meemTheme.tLargeBold}>
								{agreement.name}
							</Text>
						</Center>
						<Space h={8} />

						<Center>
							<Text className={meemTheme.tMedium}>
								{agreement.description}
							</Text>
						</Center>
						<Space h={24} />

						<Center>
							<Button
								className={meemTheme.buttonBlack}
								onClick={() => {
									router.push({
										pathname: `/${agreement.slug}/e/discussions/submit`
									})
								}}
							>
								+ Start a discussion
							</Button>
						</Center>
						<Space h={48} />
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
