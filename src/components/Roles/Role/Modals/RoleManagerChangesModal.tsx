/* eslint-disable @typescript-eslint/naming-convention */
import { useSubscription } from '@apollo/client'
import log from '@kengoldfarb/log'
import { Text, Space, Modal, Loader } from '@mantine/core'
import { cleanNotifications } from '@mantine/notifications'
import { useMeemApollo, useSDK, useWallet } from '@meemproject/react'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { GetTransactionsSubscription } from '../../../../../generated/graphql'
import { SUB_TRANSACTIONS } from '../../../../graphql/transactions'
import {
	Agreement,
	AgreementMember,
	AgreementRole
} from '../../../../model/agreement/agreements'
import {
	showErrorNotification,
	showSuccessNotification
} from '../../../../utils/notifications'
import { useMeemTheme } from '../../../Styles/MeemTheme'

interface IProps {
	agreement?: Agreement
	isExistingRole?: boolean
	role?: AgreementRole
	roleMembers?: AgreementMember[]
	originalRoleMembers?: AgreementMember[]
	haveRoleSettingsChanged?: boolean
	isOpened: boolean
	onModalClosed: () => void
}

export const RoleManagerChangesModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed,
	agreement,
	role,
	isExistingRole,
	haveRoleSettingsChanged,
	roleMembers,
	originalRoleMembers
}) => {
	const wallet = useWallet()

	const router = useRouter()

	const { sdk } = useSDK()

	const { classes: meemTheme } = useMeemTheme()

	const [hasStartedTxs, setHasStartedTx] = useState(false)

	const [hasCompletedTxs, setHasCompletedTx] = useState(false)

	const [isSavingChanges, setIsSavingChanges] = useState(false)

	const { anonClient } = useMeemApollo()

	const [txIds, setTxIds] = useState<string[]>([])

	const { error, data: transactions } =
		useSubscription<GetTransactionsSubscription>(SUB_TRANSACTIONS, {
			variables: {
				transactionIds: txIds
			},
			client: anonClient,
			skip: txIds.length === 0 || !isSavingChanges
		})

	const resetState = () => {
		setTxIds([])
		setHasStartedTx(false)
		setIsSavingChanges(false)
	}

	const closeModal = useCallback(() => {
		resetState()
		onModalClosed()
	}, [onModalClosed])

	useEffect(() => {
		function onRoleChangesSaved() {
			log.debug('role changes saved')

			cleanNotifications()
			showSuccessNotification(
				'Role saved!',
				`This role has been saved. Please wait...`
			)

			if (agreement) {
				if (router.query.createRole) {
					router.push({
						pathname: `/${agreement.slug}/admin`,
						query: { tab: 'roles' }
					})
				} else {
					router.reload()
				}
			}
		}

		async function saveRoleChanges() {
			if (!isSavingChanges) {
				if (!wallet.web3Provider || !agreement) {
					log.debug('no web3provider or agreement')
					return
				}

				setIsSavingChanges(true)

				if (!role) {
					closeModal()
					return
				}

				// List of transaction ids to monitor
				const txs: string[] = []

				if (isExistingRole) {
					// Save the updates to the existing role
					try {
						if (haveRoleSettingsChanged) {
							log.debug(
								'role settings have been changed, calling reinitialize...'
							)

							const reinit =
								await sdk.agreement.reInitializeAgreementRole({
									agreementId: agreement?.id ?? '',
									agreementRoleId: role?.id,
									name: role.name,
									isTransferLocked: role?.isTransferrable,
									metadata: {
										meem_metadata_type:
											'Meem_AgreementRoleContract',
										meem_metadata_version: '20221116',
										name: role.name,
										description: '',
										meem_agreement_address:
											agreement.address
									}
								})
							txs.push(reinit.txId)
						} else {
							log.debug(
								'role name not changed, skipping reinitialize...'
							)
						}

						// What tokens need to be minted or burned?
						const originalRoleMemberWallets =
							originalRoleMembers?.map(or =>
								or.wallet.toLowerCase()
							)
						const roleMemberWallets = roleMembers?.map(r =>
							r.wallet.toLowerCase()
						)
						const toMint: AgreementMember[] = []
						const toBurn: AgreementMember[] = []
						log.debug(
							`modal - original role members = ${originalRoleMembers?.length}`
						)
						log.debug(
							`modal - role members = ${roleMembers?.length}`
						)
						if (
							JSON.stringify(originalRoleMemberWallets) ===
							JSON.stringify(roleMemberWallets)
						) {
							log.debug('the list of members has not changed.')
							if (!haveRoleSettingsChanged) {
								// Nothing has actually changed, so just close the modal.
								showErrorNotification(
									'Oops!',
									`You did not make any changes to this role before saving it.`
								)
								closeModal()
							}
						} else {
							log.debug(
								`roleMembers size = ${roleMembers?.length}`
							)
							log.debug(
								`originalRoleMembers size = ${originalRoleMembers?.length}`
							)
							roleMembers?.forEach(member => {
								// Check to see if original role members includes this member
								const matchingOriginalRoleMembers =
									originalRoleMembers?.filter(
										m => m.wallet === member.wallet
									)

								// New member added. Add this member to 'toMint'
								if (
									matchingOriginalRoleMembers &&
									matchingOriginalRoleMembers?.length === 0
								) {
									log.debug(
										`new member to mint: ${member.wallet} | ${member.ens} | ${member.displayName}`
									)
									toMint.push(member)
								}
							})

							originalRoleMembers?.forEach(member => {
								// Check to see if new role members includes this member
								const matchingNewRoleMembers =
									roleMembers?.filter(
										m => m.wallet === member.wallet
									)

								// New member to burn. Add this member to 'toBurn'
								if (
									matchingNewRoleMembers &&
									matchingNewRoleMembers?.length === 0
								) {
									log.debug(
										`new member to burn >:D : ${member.wallet} | ${member.ens} | ${member.displayName}`
									)
									toBurn.push(member)
								}
							})
						}

						// Minting
						if (toMint.length > 0) {
							log.debug(
								`Minting ${toMint.length} new role members`
							)

							const addressesToMint: any[] = []
							toMint.forEach(member => {
								addressesToMint.push({
									metadata: {
										meem_metadata_type:
											'Meem_AgreementRoleContract',
										meem_metadata_version: '20221116',
										name: role.name,
										description: '',
										meem_agreement_address:
											agreement.address
									},
									to: member.wallet
								})
							})
							const bulkMint =
								await sdk.agreement.bulkMintAgreementRoleTokens(
									{
										agreementId: agreement?.id ?? '',
										agreementRoleId: role.id,
										tokens: addressesToMint
									}
								)
							txs.push(bulkMint.txId)
						}

						if (toBurn.length > 0) {
							log.debug(
								`Burning ${toBurn.length} existing role members`
							)

							const roleTokenIdsToBurn: any[] = []
							toBurn.forEach(member => {
								let tokenId = ''

								agreement.rawAgreement?.AgreementRoleTokens.forEach(
									token => {
										if (
											token.AgreementRoleId === role.id &&
											token.OwnerId === member.ownerId
										) {
											tokenId = token.tokenId
										}
									}
								)

								if (tokenId.length > 0) {
									roleTokenIdsToBurn.push(tokenId)
								}
							})

							log.debug(
								`Found ${roleTokenIdsToBurn.length} matching role token ids to burn`
							)
							const bulkBurn =
								await sdk.agreement.bulkBurnAgreementRoleTokens(
									{
										agreementId: agreement?.id ?? '',
										agreementRoleId: role.id,
										tokenIds: roleTokenIdsToBurn
									}
								)
							txs.push(bulkBurn.txId)
						}

						log.debug('All operations complete. Awaiting tx...')
					} catch (e) {
						log.debug(e)
						showErrorNotification(
							'Error',
							`Unable to save role. Please let us know!`
						)
						setIsSavingChanges(false)
						return
					}
				} else {
					// Create a new role

					const membersArray: string[] = []
					if (roleMembers && roleMembers.length > 0) {
						roleMembers.forEach(member => {
							membersArray.push(member.wallet)
						})
					}

					log.debug(
						`creating new role ${role.name} with ${membersArray.length} members`
					)
					try {
						const data = {
							name: role.name,
							metadata: {
								meem_metadata_type:
									'Meem_AgreementRoleContract',
								meem_metadata_version: '20221116',
								name: role.name ?? '',
								description: '',
								meem_agreement_address: agreement.address
							},
							members: membersArray,
							maxSupply: '0',
							agreementId: agreement.id ?? '',
							shouldMintTokens: true,
							tokenMetadata: {
								meem_metadata_type: 'Meem_AgreementToken',
								meem_metadata_version: '20221116',
								description: `Role token for ${agreement.name}`,
								name: role.name,
								associations: [],
								external_url: ''
							}
						}
						//log.debug(JSON.stringify(data))

						const create = await sdk.agreement.createAgreementRole(
							data
						)

						if (create) {
							txs.push(create?.cutTxId)
							txs.push(create?.deployContractTxId)
							if (create?.mintTxId) {
								txs.push(create?.mintTxId)
							}
							log.debug(
								'createAgreementRole complete. Awaiting tx...'
							)
						}
					} catch (e) {
						log.debug(e)
						showErrorNotification(
							'Error',
							`Unable to save role. Please let us know!`
						)
						setIsSavingChanges(false)
						closeModal()
						return
					}
				}

				// Now set all tx ids to trigger tx watcher
				log.debug(`subscribing to watch txs: ${JSON.stringify(txs)}`)
				setTxIds(txs)
			}
		}

		async function checkTxStatus() {
			if (transactions?.Transactions) {
				const total = txIds.length
				let totalComplete = 0
				let failed = false
				const currentTxs = transactions?.Transactions
				currentTxs.forEach(currentTx => {
					if (currentTx.status === 'success') {
						totalComplete = totalComplete + 1
					} else if (currentTx.status === 'failure') {
						failed = true
					}
				})
				log.debug(`${totalComplete} / ${total} tx are complete...`)
				if (totalComplete === total) {
					// All pending tx are complete, wait for 5s and then close modal
					if (!hasCompletedTxs) {
						setHasCompletedTx(true)
						setTxIds([])
						await new Promise(f => setTimeout(f, 5000))
						log.debug(`all tx are complete!`)
						onRoleChangesSaved()
					}
				} else if (failed) {
					showErrorNotification(
						'Error',
						`Unable to save role. Please let us know!`
					)
					setIsSavingChanges(false)
					closeModal()
				}
			} else if (error) {
				log.debug(JSON.stringify(error))
				showErrorNotification(
					'Error',
					`Unable to save role. Please let us know!`
				)
				setIsSavingChanges(false)
				closeModal()
			}
		}

		if (isOpened && !isSavingChanges && !hasStartedTxs) {
			setHasStartedTx(true)
			saveRoleChanges()
		}

		if (isOpened && isSavingChanges && hasStartedTxs && !hasCompletedTxs) {
			checkTxStatus()
		}
	}, [
		closeModal,
		isSavingChanges,
		agreement,
		isOpened,
		onModalClosed,
		wallet,
		role,
		isExistingRole,
		roleMembers,
		router,
		sdk.agreement,
		haveRoleSettingsChanged,
		originalRoleMembers,
		transactions?.Transactions,
		txIds.length,
		error,
		hasStartedTxs,
		hasCompletedTxs
	])

	return (
		<>
			<Modal
				centered
				withCloseButton={false}
				closeOnClickOutside={false}
				closeOnEscape={false}
				overlayBlur={8}
				radius={16}
				size={'lg'}
				padding={'sm'}
				opened={isOpened}
				onClose={() => {
					onModalClosed()
				}}
			>
				<div className={meemTheme.modalHeader}>
					<Loader color="cyan" variant="oval" />
					<Space h={16} />
					<Text
						className={meemTheme.tMediumBold}
					>{`Saving role...`}</Text>

					<Space h={24} />

					<Text
						className={meemTheme.tSmall}
						style={{ textAlign: 'center' }}
					>{`Please don’t refresh or close this window until this step is complete. This might take a few minutes.`}</Text>
				</div>
			</Modal>
		</>
	)
}
