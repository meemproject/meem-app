// import { AgreementMember } from '../../agreement'
import { DiscussionComment } from './discussionComment'

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
	id: string
	title: string
	tags?: string[]
	body: string
	attachment?: string
	comments?: DiscussionComment[]
	votes?: number
	userId: string
	displayName?: string
	profilePicUrl?: string
	walletAddress: string
	agreementSlug: string
	createdAt: number
	updatedAt: number
}
