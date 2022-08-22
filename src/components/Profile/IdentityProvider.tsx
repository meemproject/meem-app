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
import { MEEM_ID_SUBSCRIPTION } from '../../graphql/clubs'
import {
	getDefaultIdentity,
	Identity,
	identityFromApi
} from '../../model/identity/identity'

const defaultState = {
	identity: getDefaultIdentity(''),
	isLoadingIdentity: true
}
const IdentityContext = createContext(defaultState)

export default IdentityContext

export interface IIdentityProviderProps {
	children?: ReactNode
}

export const IdentityProvider: FC<IIdentityProviderProps> = ({ ...props }) => {
	const wallet = useWallet()

	// Fetch profile info
	const {
		loading,
		error,
		data: identityData
	} = useSubscription<MeemIdSubscription>(MEEM_ID_SUBSCRIPTION, {
		variables: { walletAddress: wallet.accounts[0] ?? '' }
	})
	const [isLoadingIdentity, setIsLoadingIdentity] = useState(
		defaultState.isLoadingIdentity
	)

	const [hasIdentity, setHasIdentity] = useState(false)
	const [identity, setIdentity] = useState<Identity>(defaultState.identity)

	useEffect(() => {
		async function getIdentity() {
			setIsLoadingIdentity(true)
			const id = await identityFromApi(wallet.accounts[0], identityData)
			setIdentity(id)
			setIsLoadingIdentity(false)
			setHasIdentity(true)
		}

		async function getDefault() {
			setIsLoadingIdentity(true)
			const id = getDefaultIdentity(
				wallet.isConnected ? wallet.accounts[0] : ''
			)
			setIdentity(id)
			setIsLoadingIdentity(false)
			setHasIdentity(true)
		}

		setIsLoadingIdentity(loading)

		if (!hasIdentity && identityData && wallet.isConnected) {
			getIdentity()
		} else {
			// TODO: check to see if identies array is empty here
			if (error) {
				// TODO: Get default identiy

				getDefault()
			}
			setIsLoadingIdentity(false)
		}
	}, [error, hasIdentity, identityData, isLoadingIdentity, wallet])
	const value = useMemo(
		() => ({
			identity,
			isLoadingIdentity
		}),
		[identity, isLoadingIdentity]
	)
	return <IdentityContext.Provider value={value} {...props} />
}
