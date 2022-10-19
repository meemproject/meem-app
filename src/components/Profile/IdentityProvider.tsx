/* eslint-disable @typescript-eslint/naming-convention */
import { useSubscription } from '@apollo/client'
import { useWallet } from '@meemproject/react'
import React, {
	useState,
	useEffect,
	createContext,
	FC,
	useMemo,
	ReactNode
} from 'react'
import { MeemIdSubscriptionSubscription } from '../../../generated/graphql'
import { MEEM_ID_SUBSCRIPTION } from '../../graphql/id'
import {
	getDefaultIdentity,
	Identity,
	identityFromApi
} from '../../model/identity/identity'
import { useCustomApollo } from '../../providers/ApolloProvider'

const defaultState = {
	identity: getDefaultIdentity(''),
	isLoadingIdentity: true,
	hasFetchedIdentity: false
}
const IdentityContext = createContext(defaultState)

export default IdentityContext

export interface IIdentityProviderProps {
	children?: ReactNode
}

export const IdentityProvider: FC<IIdentityProviderProps> = ({ ...props }) => {
	const wallet = useWallet()

	const { userClient } = useCustomApollo()

	// Fetch profile info
	const {
		loading,
		error,
		data: identityData
	} = useSubscription<MeemIdSubscriptionSubscription>(MEEM_ID_SUBSCRIPTION, {
		variables: { walletAddress: wallet.accounts[0] ?? '' },
		client: userClient
	})
	const [isLoadingIdentity, setIsLoadingIdentity] = useState(
		defaultState.isLoadingIdentity
	)

	const [hasFetchedIdentity, setHasFetchedIdentity] = useState(false)
	const [hasIdentity, setHasIdentity] = useState(false)
	const [identity, setIdentity] = useState<Identity>(defaultState.identity)
	const [previousIdentity, setPreviousIdentity] = useState<Identity>()

	useEffect(() => {
		async function getIdentity() {
			if (identityData) {
				setIsLoadingIdentity(true)
				const id = await identityFromApi(
					wallet.accounts[0],
					identityData
				)
				setHasFetchedIdentity(true)

				let hasIdentityChanged = true
				if (previousIdentity) {
					const previous = JSON.stringify(previousIdentity)
					const current = JSON.stringify(id)
					if (previous === current) {
						hasIdentityChanged = false
					}
				}

				if (hasIdentityChanged) {
					setIdentity(id)
					if (!previousIdentity) {
						setPreviousIdentity(id)
					}
					setIsLoadingIdentity(false)
					// if (!hasIdentity) {
					// 	log.debug(`got identity for ${wallet.accounts[0]}`)
					// }
					setHasIdentity(true)
				}
			} else if (error) {
				setIsLoadingIdentity(false)
			}
		}

		getIdentity()
	}, [
		error,
		hasIdentity,
		identityData,
		isLoadingIdentity,
		loading,
		previousIdentity,
		wallet
	])
	const value = useMemo(
		() => ({
			identity,
			isLoadingIdentity,
			hasFetchedIdentity
		}),
		[hasFetchedIdentity, identity, isLoadingIdentity]
	)
	return <IdentityContext.Provider value={value} {...props} />
}
