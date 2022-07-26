/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
export interface Zeen {
	id: string
	slug: string
	clubSlug: string
	clubName: string
	name: string
	description: string
	image: string
	isZeenEditor: boolean
	editors: string[]
}

export default async function zeenFromApi(wallet: any): Promise<Zeen> {
	return {
		id: '',
		slug: '',
		clubSlug: 'club-club',
		clubName: 'Club Club',
		name: 'Zeen post',
		description: 'This is a mock zeen post.',
		image: '/exampleclub.png',
		isZeenEditor: true,
		editors: []
	}
}
