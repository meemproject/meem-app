export interface DiscussionComment {
	id: string
	body: string
	userId: string
	displayName?: string
	profilePicUrl?: string
	walletAddress: string
	clubSlug: string
	createdAt: number
	updatedAt: number
}
