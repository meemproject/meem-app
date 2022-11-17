import { ClubMember } from '../club'

export interface ForumComment {
	id: string
	content: string
	user: ClubMember
}
