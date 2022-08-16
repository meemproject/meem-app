import { useWallet } from '@meemproject/react'
import React, {
	useState,
	useEffect,
	createContext,
	FC,
	useMemo,
	ReactNode
} from 'react'
import {
	getDefaultIdentity,
	Identity,
	identityFromApi
} from '../../model/identity/identity'

const defaultState = {
	identity: getDefaultIdentity(),
	isLoadingIdentity: true
}
const IdentityContext = createContext(defaultState)

export default IdentityContext

export interface IIdentityProviderProps {
	children?: ReactNode
}

export const IdentityProvider: FC<IIdentityProviderProps> = ({ ...props }) => {
	const wallet = useWallet()

	// TODO: fetch profile info
	// const {
	// 	loading,
	// 	error,
	// 	data: profileData
	// } = useQuery<GetProfileQuery>(GET_CLUB, {
	// 	variables: { slug }
	// })
	const [isLoadingIdentity, setIsLoadingIdentity] = useState(
		defaultState.isLoadingIdentity
	)

	const [hasIdentity, setHasIdentity] = useState(false)
	const [identity, setIdentity] = useState<Identity>(defaultState.identity)

	useEffect(() => {
		async function getIdentity() {
			setIsLoadingIdentity(true)
			const id = await identityFromApi(wallet.accounts[0])
			setIdentity(id)
			setIsLoadingIdentity(false)
			setHasIdentity(true)
		}
		if (!hasIdentity && wallet.isConnected) {
			getIdentity()
		} else {
			setIsLoadingIdentity(false)
		}
	}, [hasIdentity, isLoadingIdentity, wallet])
	const value = useMemo(
		() => ({
			identity,
			isLoadingIdentity
		}),
		[identity, isLoadingIdentity]
	)
	return <IdentityContext.Provider value={value} {...props} />
}
