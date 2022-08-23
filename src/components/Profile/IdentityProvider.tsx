import { useSubscription } from '@apollo/client'
import log from '@kengoldfarb/log'
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
	} = useSubscription<MeemIdSubscriptionSubscription>(MEEM_ID_SUBSCRIPTION, {
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
			log.debug(`got identity for ${wallet.accounts[0]}`)
		}

		if (
			identityData &&
			identityData.MeemIdentities.length > 0 &&
			wallet.isConnected
		) {
			getIdentity()
		} else {
			log.debug(
				`no identity found for ${wallet.accounts[0]}, using fallback...`
			)
			setIsLoadingIdentity(false)
		}
	}, [error, hasIdentity, identityData, isLoadingIdentity, loading, wallet])
	const value = useMemo(
		() => ({
			identity,
			isLoadingIdentity
		}),
		[identity, isLoadingIdentity]
	)
	return <IdentityContext.Provider value={value} {...props} />
}
