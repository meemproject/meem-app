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
import { useAuth, useSDK } from '@meemproject/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Search } from 'tabler-icons-react'
import { Agreement } from '../../../model/agreement/agreements'
import { DiscussionComment } from '../../../model/agreement/extensions/discussion/discussionComment'
import { DiscussionPost } from '../../../model/agreement/extensions/discussion/discussionPost'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import { useMeemTheme } from '../../Styles/MeemTheme'
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
	const [hasFetchdData, setHasFetchedData] = useState(false)
	const [posts, setPosts] = useState<DiscussionPost[]>([])

	const { sdk } = useSDK()
	const { chainId } = useAuth()

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
	}, [hasFetchdData, agreement, chainId, sdk])

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
										pathname: `/${agreement.slug}/e/discussion/submit`
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
							<DiscussionPostPreview key={post.id} post={post} />
						))}
					</Container>
				</>
			)}
		</>
	)
}
