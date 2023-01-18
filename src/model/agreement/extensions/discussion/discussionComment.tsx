import { DiscussionReaction } from './discussionReaction'

export interface DiscussionComment {
	agreementSlug: string
	body: string
	comments?: DiscussionComment[]
	createdAt: number
	displayName?: string
	id: string
	profilePicUrl?: string
	reactions?: DiscussionReaction[]
	updatedAt: number
	userId: string
	walletAddress: string
}
