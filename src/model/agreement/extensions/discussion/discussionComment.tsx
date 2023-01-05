import { DiscussionReaction } from './discussionReaction'

export interface DiscussionComment {
	id: string
	body: string
	userId: string
	displayName?: string
	profilePicUrl?: string
	walletAddress: string
	agreementSlug: string
	createdAt: number
	updatedAt: number
	comments?: DiscussionComment[]
	reactions?: DiscussionReaction[]
}
