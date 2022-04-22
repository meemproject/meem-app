/* eslint-disable @typescript-eslint/naming-convention */
import { useQuery } from '@apollo/client'
import React from 'react'
import { GetLastMeem } from '../graphql/__generated__/GetLastMeem'
import { GET_LAST_MEEM } from '../graphql/meems'

export const GraphQLTestPage: React.FC = () => {
	const { loading, error, data } = useQuery<GetLastMeem>(GET_LAST_MEEM)

	return (
		<>
			{loading && <p>Loading...</p>}
			{!loading && error && <p>Error: ${error.message}.</p>}
			{!loading && !error && <p>Got meem! ${data?.Meems[0].metadata.name}</p>}
		</>
	)
}
