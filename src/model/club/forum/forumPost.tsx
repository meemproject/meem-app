import { ClubMember } from '../club'
import { ForumComment } from './forumComment'

export interface ForumPost {
	id: string
	title: string
	tags?: string[]
	content: string
	attachment?: string
	comments?: ForumComment[]
	votes?: number
	user: ClubMember
}
