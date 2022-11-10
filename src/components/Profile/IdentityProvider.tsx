/* eslint-disable @typescript-eslint/naming-convention */
import { useSubscription } from '@apollo/client'
import { useWallet } from '@meemproject/react'
import React, {
	useState,
	useEffect,
	createContext,
	FC,
	useMemo,
	ReactNode,
	useCallback
} from 'react'
import { MeemIdSubscriptionSubscription } from '../../../generated/graphql'
import { MEEM_ID_SUBSCRIPTION } from '../../graphql/id'
import {
	getDefaultIdentity,
	Identity,
	identityFromApi
} from '../../model/identity/identity'
import { useCustomApollo } from '../../providers/ApolloProvider'
import { JoinClubsModal } from './JoinClubsModal'

const defaultState = {
	identity: getDefaultIdentity(''),
	isLoadingIdentity: true,
	hasFetchedIdentity: false,
	// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
	login: (forced: boolean) => {},
	cancelLogin: () => {}
}
const IdentityContext = createContext(defaultState)

export default IdentityContext

export interface IIdentityProviderProps {
	children?: ReactNode
}

export const IdentityProvider: FC<IIdentityProviderProps> = ({ ...props }) => {
	const wallet = useWallet()

	const { userClient } = useCustomApollo()

	console.log({ wallet })

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

	const [isJoinClubsModalOpen, setIsJoinClubsModalOpen] = useState(false)
	const [isLoginForced, setIsLoginForced] = useState(false)

	useEffect(() => {
		async function getIdentity() {
			console.log('GET IDENTITY', { identityData })
			if (identityData) {
				const id = await identityFromApi(
					wallet.accounts[0],
					identityData
				)
				setIsLoadingIdentity(false)
				setHasFetchedIdentity(true)

				let hasIdentityChanged = true
				if (previousIdentity) {
					const previous = JSON.stringify(previousIdentity)
					const current = JSON.stringify(id)
					if (previous === current) {
						hasIdentityChanged = false
					}
				}

				console.log('!!!!! set identity', { id })

				if (hasIdentityChanged) {
					setIdentity(id)
					if (!previousIdentity) {
						setPreviousIdentity(id)
					}
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

	const login = useCallback((forced: boolean) => {
		setIsLoginForced(forced)
		setIsJoinClubsModalOpen(true)
	}, [])

	const cancelLogin = useCallback(() => {
		setIsJoinClubsModalOpen(false)
	}, [])

	const value = useMemo(
		() => ({
			identity,
			isLoadingIdentity,
			hasFetchedIdentity,
			isLoginForced,
			login,
			cancelLogin
		}),
		[
			cancelLogin,
			hasFetchedIdentity,
			identity,
			isLoadingIdentity,
			isLoginForced,
			login
		]
	)
	return (
		<>
			<IdentityContext.Provider value={value} {...props} />
			<JoinClubsModal
				isLoginForced={isLoginForced}
				onModalClosed={() => {
					setIsJoinClubsModalOpen(false)
				}}
				isOpened={isJoinClubsModalOpen}
			/>
		</>
	)
}
