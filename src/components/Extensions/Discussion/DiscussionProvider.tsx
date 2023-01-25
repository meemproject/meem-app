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
	const [privateKey, setPrivateKey] = useState<JsonWebKey>()

	useEffect(() => {
		const run = async () => {
			if (
				!sdk.id.hasInitialized ||
				!agreement ||
				!chainId ||
				privateKey ||
				hasFetchedKeys
			) {
				return
			}

			setHasFetchedKeys(true)

			const path = `meem/${agreement?.id}/e/discussions/keys/v2`

			const gun = sdk.storage.getGunInstance()

			gun?.get(path).once(async (items: any) => {
				if (!items) {
					const key = await sdk.storage.generateAESKey()

					await sdk.storage.encryptWithLitAndWrite({
						chainId,
						path,
						data: { key },
						accessControlConditions: [
							{
								contractAddress: agreement.address
							}
						]
					})

					setPrivateKey(key)
				}
			})

			sdk.storage.on({
				chainId,
				path,
				cb: (items: any) => {
					const keys = Object.keys(items)
					if (
						keys &&
						keys[0] &&
						items[keys[0]] &&
						items[keys[0]].data &&
						items[keys[0]].data.key
					) {
						setPrivateKey(items[keys[0]].data.key)
						log.debug('Discussions keys set')
					}
				}
			})
		}
		run()
	}, [sdk, agreement, chainId, privateKey, hasFetchedKeys])

	const value = useMemo(
		() => ({
			privateKey
		}),
		[privateKey]
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
