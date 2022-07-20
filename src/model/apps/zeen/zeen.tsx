/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
export interface Zeen {
	id: string
	slug: string
	clubSlug: string
	name: string
	description: string
	image: string
	isZeenEditor: boolean
	editors: string[]
}

export default async function zeenFromApi(
	wallet: any,
	clubSlug: string
): Promise<Zeen> {
	return {
		id: '',
		slug: 'zeen',
		clubSlug,
		name: 'Zeen',
		description: 'A zeen',
		image: '/exampleclub.png',
		isZeenEditor: true,
		editors: []
	}
}
