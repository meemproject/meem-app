/* eslint-disable @typescript-eslint/naming-convention */
import log from '@kengoldfarb/log'
import { useSDK, useWallet } from '@meemproject/react'
import { Contract } from 'ethers'
import React, { useCallback, useEffect, useState } from 'react'
// eslint-disable-next-line import/namespace
import { GetBundleByIdQuery } from '../../../../generated/graphql'
import {
	Agreement,
	AgreementAdminRole
} from '../../../model/agreement/agreements'
import { showErrorNotification } from '../../../utils/notifications'
import { useAgreement } from '../../Providers/AgreementProvider'
import {
	correctChainIdName,
	isWrongChainId,
	SwitchChainsModal
} from '../../Authenticate/SwitchChainsModal'

interface IProps {
	agreement?: Agreement
	isOpened: boolean
	onModalClosed: () => void
	bundleData: GetBundleByIdQuery | undefined
	smartContractPermission: string
}

export const ChangeMeemProtocolPermissionsComponent: React.FC<IProps> = ({
	isOpened,
	onModalClosed,
	agreement,
	bundleData,
	smartContractPermission
}) => {
	const wallet = useWallet()

	const { sdk } = useSDK()

	const { watchTransactions } = useAgreement()

	const [isSavingChanges, setIsSavingChanges] = useState(false)

	const [isSwitchChainsModalOpened, setIsSwitchChainsModalOpened] =
		useState(false)

	const closeModal = useCallback(() => {
		onModalClosed()
		setIsSavingChanges(false)
	}, [onModalClosed])

	useEffect(() => {
		async function changeMeemProtocolPermissions() {
			if (!wallet.web3Provider || !agreement) {
				log.debug('no web3provider or agreement')
				showErrorNotification(
					'Unable to change Meem protocol permissions.',
					`Make sure you are connected to the ${correctChainIdName()} network.`
				)
				return
			}

			if (!isSavingChanges) {
				log.debug(`changing meem contract admin permissions...`)

				if (!bundleData) {
					showErrorNotification(
						'Oops!',
						'Bundle data not found. Contact us using the top-right link on this page.'
					)
					closeModal()
				}

				if (isWrongChainId(wallet.chainId ?? 0)) {
					log.debug(`wrong chain id for action.`)
					setIsSwitchChainsModalOpened(true)
					return
				}

				setIsSavingChanges(true)

				try {
					const agreementContract = new Contract(
						agreement?.address ?? '',
						bundleData?.Bundles[0].abi,
						wallet.signer
					)

					if (
						// If not controlled by meem api and the user wants to enable control...
						smartContractPermission === 'members-and-meem' &&
						!agreement.isAgreementControlledByMeemApi
					) {
						const tx = await agreementContract?.grantRole(
							AgreementAdminRole,
							process.env.NEXT_PUBLIC_MEEM_API_WALLET_ADDRESS
						)

						await tx.wait()
					} else if (
						// If controlled by meem api and user wants to remove control...
						smartContractPermission === 'members' &&
						agreement.isAgreementControlledByMeemApi
					) {
						const tx = await agreementContract?.revokeRole(
							AgreementAdminRole,
							process.env.NEXT_PUBLIC_MEEM_API_WALLET_ADDRESS
						)

						if (tx) {
							log.debug(JSON.stringify(tx))
							if (tx.id) {
								watchTransactions([tx.id])
							} else {
								watchTransactions([tx])
							}
							closeModal()
						}
					}
				} catch (e) {
					closeModal()
					log.debug(e)
				}
			}
		}

		if (isOpened && !isSavingChanges) {
			changeMeemProtocolPermissions()
		}
	}, [
		closeModal,
		isSavingChanges,
		agreement,
		isOpened,
		onModalClosed,
		wallet,
		sdk.agreement,
		bundleData,
		smartContractPermission,
		watchTransactions
	])

	return (
		<>
			<SwitchChainsModal
				isOpened={isSwitchChainsModalOpened}
				onModalClosed={function (): void {
					setIsSwitchChainsModalOpened(false)
				}}
			/>
		</>
	)
}
