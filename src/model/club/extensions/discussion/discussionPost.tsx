import { ClubMember } from '../../club'
import { DiscussionComment } from './discussionComment'

export interface DiscussionPost {
	id: string
	title: string
	tags?: string[]
	content: string
	attachment?: string
	comments?: DiscussionComment[]
	votes?: number
	user: ClubMember
	clubSlug: string
}
