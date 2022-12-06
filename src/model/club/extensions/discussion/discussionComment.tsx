import { ClubMember } from '../../club'

export interface DiscussionComment {
	id: string
	content: string
	user: ClubMember
	votes?: number
	replies?: DiscussionComment[]
}
