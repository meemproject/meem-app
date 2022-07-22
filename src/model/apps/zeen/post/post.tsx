/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
export interface Post {
	// Background metadata
	id: string
	slug: string
	zeenSlug: string
	clubSlug: string
	clubName: string

	// Post data
	title: string
	recap: string
	body: string
	coverPhoto: string

	// Access rights
	isContributor: boolean
	contributors: string[]
}

export default async function postFromApi(wallet: any): Promise<Post> {
	return {
		id: '',
		slug: '',
		zeenSlug: 'zeen',
		clubSlug: 'club-club',
		clubName: 'Club Club',
		title: 'Zeen post',
		recap: 'This is a mock zeen post.',
		body: 'Hello world!',
		coverPhoto: '/exampleclub.png',
		isContributor: true,
		contributors: []
	}
}

export function emptyPost(): Post {
	return {
		id: '',
		slug: '',
		zeenSlug: '',
		clubSlug: '',
		clubName: '',
		title: '',
		recap: '',
		body: '',
		coverPhoto: '',
		isContributor: true,
		contributors: []
	}
}
