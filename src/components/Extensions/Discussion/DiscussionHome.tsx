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
import { useRouter } from 'next/router'
import React from 'react'
import { Search } from 'tabler-icons-react'
import { DiscussionPost } from '../../../model/club/extensions/discussion/discussionPost'
import { useClub } from '../../ClubHome/ClubProvider'
import { useClubsTheme } from '../../Styles/ClubsTheme'
import { DiscussionPostPreview } from './DiscussionPostPreview'

export const DiscussionHome: React.FC = () => {
	const { classes: clubsTheme } = useClubsTheme()
	const router = useRouter()

	const { club, isLoadingClub, error } = useClub()

	const posts: DiscussionPost[] = [
		{
			id: '1',
			title: 'Test post one',
			tags: ['funny', 'crazy'],
			clubSlug: club?.slug ?? '',
			content: 'This is just a small test post.',
			user: club && club.members ? club.members[0] : { wallet: '' }
		},
		{
			id: '2',
			title: 'Test post two',
			tags: ['funny', 'crazy'],
			clubSlug: club?.slug ?? '',
			content: 'And another test post',
			user: club && club.members ? club.members[0] : { wallet: '' }
		}
	]

	return (
		<>
			{isLoadingClub && (
				<Container>
					<Space h={120} />
					<Center>
						<Loader color="red" variant="oval" />
					</Center>
				</Container>
			)}
			{!isLoadingClub && !error && !club?.name && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>Sorry, that club does not exist!</Text>
					</Center>
				</Container>
			)}
			{!isLoadingClub && error && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>
							There was an error loading this club. Please let us
							know!
						</Text>
					</Center>
				</Container>
			)}
			{!isLoadingClub && club?.name && (
				<>
					<Container>
						<Space h={48} />

						<Center>
							<Image
								className={clubsTheme.imagePixelated}
								height={100}
								width={100}
								src={club.image}
							/>
						</Center>

						<Space h={24} />
						<Center>
							<Text className={clubsTheme.tLargeBold}>
								{club.name}
							</Text>
						</Center>
						<Space h={8} />

						<Center>
							<Text className={clubsTheme.tMedium}>
								{club.description}
							</Text>
						</Center>
						<Space h={24} />

						<Center>
							<Button
								className={clubsTheme.buttonBlack}
								onClick={() => {
									router.push({
										pathname: `/${club.slug}/e/discussion/submit`
									})
								}}
							>
								+ Start a discussion
							</Button>
						</Center>
						<Space h={48} />
						<div className={clubsTheme.centeredRow}>
							<TextInput
								radius={20}
								classNames={{
									input: clubsTheme.fTextField
								}}
								icon={<Search />}
								placeholder={'Search discussions'}
								className={clubsTheme.fullWidth}
								size={'lg'}
								onChange={event => {
									log.debug(event.target.value)
									// TODO
								}}
							/>
							<Space w={16} />
							<Button className={clubsTheme.buttonBlack}>
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
