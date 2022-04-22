import type { NextPage } from 'next'
import React from 'react'
import { GraphQLTestPage } from '../components/GraphQLTestPage'

const Home: NextPage = () => {
	return <div>{GraphQLTestPage({})}</div>
}

export default Home
