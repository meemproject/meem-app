import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	HttpLink,
	split
} from '@apollo/client'
import type { NormalizedCacheObject } from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { useWallet } from '@meemproject/react'
import { createClient } from 'graphql-ws'
import React, {
	useState,
	useEffect,
	FC,
	ReactNode,
	createContext,
	useMemo,
	useContext
} from 'react'

export interface IApolloProviderProps {
	children?: ReactNode
}

const defaultState: {
	/** Sets x-hasura-role: user */
	userClient?: ApolloClient<NormalizedCacheObject>

	/** Sets x-hasura-role: mutualClubMember */
	mutualMembersClient?: ApolloClient<NormalizedCacheObject>

	/** Sets x-hasura-role: anonymous */
	anonClient?: ApolloClient<NormalizedCacheObject>
} = {}

const CustomApolloContext = createContext(defaultState)

export default CustomApolloContext

function createApolloClient(options: {
	jwt?: string
	headers?: Record<string, string>
}) {
	const { jwt, headers } = options

	const httpLink = new HttpLink({
		uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL,
		headers
	})

	const wsLink =
		typeof window !== 'undefined'
			? new GraphQLWsLink(
					createClient({
						url: process.env.NEXT_PUBLIC_GRAPHQL_API_WS_URL ?? '',
						connectionParams: () => {
							return jwt
								? {
										headers
								  }
								: {}
						}
					})
			  )
			: null

	// The split function takes three parameters:
	//
	// * A function that's called for each operation to execute
	// * The Link to use for an operation if the function returns a "truthy" value
	// * The Link to use for an operation if the function returns a "falsy" value
	const splitLink =
		typeof window !== 'undefined' && wsLink != null
			? split(
					({ query }) => {
						const definition = getMainDefinition(query)
						return (
							definition.kind === 'OperationDefinition' &&
							definition.operation === 'subscription'
						)
					},
					wsLink,
					httpLink
			  )
			: httpLink

	const c = new ApolloClient({
		link: splitLink,
		cache: new InMemoryCache()
	})

	return c
}

export const CustomApolloProvider: FC<IApolloProviderProps> = ({
	children
}) => {
	const { jwt } = useWallet()

	const [userClient, setUserClient] = useState<
		ApolloClient<NormalizedCacheObject>
	>(
		new ApolloClient({
			cache: new InMemoryCache()
		})
	)

	const [anonClient, setAnonClient] = useState<
		ApolloClient<NormalizedCacheObject>
	>(
		new ApolloClient({
			cache: new InMemoryCache()
		})
	)

	const [mutualMembersClient, setMutualMembersClient] = useState<
		ApolloClient<NormalizedCacheObject>
	>(
		new ApolloClient({
			cache: new InMemoryCache()
		})
	)

	useEffect(() => {
		const headers = {
			authorization: `Bearer ${jwt}`
		}

		const uClient = createApolloClient({
			jwt,
			headers: {
				...headers,
				'x-hasura-role': 'user'
			}
		})
		const mmClient = createApolloClient({
			jwt,
			headers: {
				...headers,
				'x-hasura-role': 'mutualClubMember'
			}
		})
		const aClient = createApolloClient({
			jwt,
			headers: {
				...headers,
				'x-hasura-role': 'anonymous'
			}
		})

		setUserClient(uClient)
		setAnonClient(aClient)
		setMutualMembersClient(mmClient)
	}, [jwt])

	const value = useMemo(
		() => ({
			userClient,
			anonClient,
			mutualMembersClient
		}),
		[userClient, anonClient, mutualMembersClient]
	)

	return (
		<CustomApolloContext.Provider value={value}>
			<ApolloProvider client={anonClient}>
				<ApolloProvider client={userClient}>
					<ApolloProvider client={mutualMembersClient}>
						{children}
					</ApolloProvider>
				</ApolloProvider>
			</ApolloProvider>
		</CustomApolloContext.Provider>
	)
}

export function useCustomApollo() {
	const context = useContext(CustomApolloContext)

	if (typeof context === 'undefined') {
		throw new Error(
			`useCustomApollo must be used within a CustomApolloProvider`
		)
	}

	return context
}
