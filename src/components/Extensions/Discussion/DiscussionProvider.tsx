/* eslint-disable @typescript-eslint/naming-convention */
import { ApolloError, useSubscription } from '@apollo/client'
import log from '@kengoldfarb/log'
import { useWallet, useSDK } from '@meemproject/react'
import React, {
	useState,
	useEffect,
	createContext,
	FC,
	useMemo,
	ReactNode,
	useContext
} from 'react'
import { useAgreement } from '../../AgreementHome/AgreementProvider'

const defaultState: {
	publicKey?: JsonWebKey
	privateKey?: JsonWebKey
} = {}

const DiscussionsContext = createContext(defaultState)

export default DiscussionsContext

export interface IDiscussionsProviderProps {
	children?: ReactNode
}

export const DiscussionsProvider: FC<IDiscussionsProviderProps> = ({
	...props
}) => {
	const { sdk } = useSDK()
	const { agreement } = useAgreement()
	const { chainId } = useWallet()

	const [hasFetchedKeys, setHasFetchedKeys] = useState(false)
	const [publicKey, setPublicKey] = useState<JsonWebKey>()
	const [privateKey, setPrivateKey] = useState<JsonWebKey>()

	useEffect(() => {
		const run = async () => {
			if (
				!sdk.id.hasInitialized ||
				!agreement ||
				!chainId ||
				privateKey ||
				publicKey ||
				hasFetchedKeys
			) {
				return
			}

			setHasFetchedKeys(true)

			const path = `meem/${agreement?.id}/e/discussions/keys/t2`

			const authSig = sdk.id.getLitAuthSig()

			const gun = sdk.storage.getGunInstance()

			gun.get(path).once(async (items: any) => {
				if (!items) {
					const { publicKey: pub, privateKey: priv } =
						await sdk.storage.generateKeyPair()

					await sdk.storage.encryptWithLitAndWrite({
						chainId,
						path,
						data: { privateKey: priv },
						writeColumns: {
							publicKey: pub
						},
						accessControlConditions: [
							{
								contractAddress: agreement.address
							}
						]
					})

					setPublicKey(pub)
					setPrivateKey(priv)
				}
			})

			sdk.storage.on({
				chainId,
				authSig,
				path,
				cb: (items: any) => {
					const keys = Object.keys(items)
					if (
						keys &&
						keys[0] &&
						items[keys[0]] &&
						items[keys[0]].publicKey &&
						items[keys[0]].data.privateKey
					) {
						setPublicKey(items[keys[0]].publicKey)
						setPrivateKey(items[keys[0]].data.privateKey)
						log.debug('Discussions keys set')
					}
				}
			})
		}
		run()
	}, [sdk, agreement, chainId, privateKey, publicKey, hasFetchedKeys])

	const value = useMemo(
		() => ({
			publicKey,
			privateKey
		}),
		[publicKey, privateKey]
	)
	return <DiscussionsContext.Provider value={value} {...props} />
}

export function useDiscussions() {
	const context = useContext(DiscussionsContext)

	if (typeof context === 'undefined') {
		throw new Error(
			'useAgreement must be used within a DiscussionsProvider'
		)
	}
	return context
}
