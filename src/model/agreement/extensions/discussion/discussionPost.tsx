// import { AgreementMember } from '../../agreement'
import { DiscussionComment } from './discussionComment'
import { DiscussionReaction } from './discussionReaction'

// export interface DiscussionPost {
// 	id: string
// 	title: string
// 	tags?: string[]
// 	content: string
// 	attachment?: string
// 	comments?: DiscussionComment[]
// 	votes?: number
// 	user: AgreementMember
// 	agreementSlug: string
// }

export interface DiscussionPost {
	agreementSlug: string
	attachment?: string
	body: string
	comments?: DiscussionComment[]
	createdAt: number
	displayName?: string
	id: string
	profilePicUrl?: string
	reactions?: DiscussionReaction[]
	tags?: string[]
	title: string
	updatedAt: number
	userId: string
	votes?: number
	walletAddress: string
}
