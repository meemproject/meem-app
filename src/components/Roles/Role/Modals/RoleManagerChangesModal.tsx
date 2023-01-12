/* eslint-disable @typescript-eslint/naming-convention */
import { useSubscription } from '@apollo/client'
import log from '@kengoldfarb/log'
import { Text, Space, Modal, Loader } from '@mantine/core'
import {
	useMeemApollo,
	useSDK,
	useSockets,
	useWallet
} from '@meemproject/react'
import { MeemAPI } from '@meemproject/sdk'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { GetAgreementSubscriptionSubscription } from '../../../../../generated/graphql'
import { SUB_AGREEMENT_AS_MEMBER } from '../../../../graphql/agreements'
import {
	Agreement,
	AgreementMember,
	AgreementRole
} from '../../../../model/agreement/agreements'
import {
	showErrorNotification,
	showSuccessNotification
} from '../../../../utils/notifications'
import { hostnameToChainId } from '../../../App'
import { useMeemTheme } from '../../../Styles/MeemTheme'

interface IProps {
	agreement?: Agreement
	isExistingRole?: boolean
	role?: AgreementRole
	roleMembers?: AgreementMember[]
	originalRoleMembers?: AgreementMember[]
	hasRoleNameChanged?: boolean
	isOpened: boolean
	onModalClosed: () => void
}

export const RoleManagerChangesModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed,
	agreement,
	role,
	isExistingRole,
	hasRoleNameChanged,
	roleMembers,
	originalRoleMembers
}) => {
	const wallet = useWallet()

	const router = useRouter()

	const { sdk } = useSDK()

	const { classes: meemTheme } = useMeemTheme()

	const [isSavingChanges, setIsSavingChanges] = useState(false)

	const [currentAgreementDataString, setCurrentAgreementDataString] =
		useState('')

	const [hasSubscribedToSockets, setHasSubscribedToSockets] = useState(false)

	const { connect, sockets } = useSockets()

	const { mutualMembersClient } = useMeemApollo()

	const {
		loading,
		error,
		data: agreementData
	} = useSubscription<GetAgreementSubscriptionSubscription>(
		SUB_AGREEMENT_AS_MEMBER,
		{
			variables: {
				slug: agreement?.slug ?? '',
				chainId:
					wallet.chainId ??
					hostnameToChainId(
						global.window ? global.window.location.host : ''
					)
			},
			client: mutualMembersClient
		}
	)

	const closeModal = useCallback(() => {
		if (sockets) {
			sockets.unsubscribe([
				{ type: MeemAPI.MeemEvent.Err },
				{ type: MeemAPI.MeemEvent.MeemIdUpdated },
				{ type: MeemAPI.MeemEvent.MeemMinted }
			])
		}
		onModalClosed()
		setHasSubscribedToSockets(false)
		setIsSavingChanges(false)
		setCurrentAgreementDataString('')
	}, [onModalClosed, sockets])

	useEffect(() => {
		function onRoleChangesSaved() {
			log.debug('role changes saved')

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

				const permissionsArray: string[] = []
				role.permissions.forEach(permission => {
					if (permission.enabled) {
						permissionsArray.push(permission.id)
					}
				})

				if (isExistingRole) {
					// Save the updates to the existing role
					try {
						if (hasRoleNameChanged) {
							log.debug(
								'role name has been changed, calling reinitialize...'
							)
							await sdk.agreement.reInitializeAgreementRole({
								agreementId: agreement?.id ?? '',
								agreementRoleId: role?.id,
								name: role.name,
								metadata: {
									meem_metadata_type:
										'Meem_AgreementRoleContract',
									meem_metadata_version: '20221116',
									name: role.name,
									description: '',
									meem_agreement_address: agreement.address
								}
							})
						} else {
							log.debug(
								'role name not changed, skipping reinitialize...'
							)
						}

						// What tokens need to be minted or burned?
						const toMint: AgreementMember[] = []
						const toBurn: AgreementMember[] = []
						log.debug(
							`modal - original role members = ${originalRoleMembers?.length}`
						)
						log.debug(
							`modal - role members = ${roleMembers?.length}`
						)
						if (
							JSON.stringify(originalRoleMembers) ===
							JSON.stringify(roleMembers)
						) {
							log.debug('the list of members has not changed.')
							if (!hasRoleNameChanged) {
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
							await sdk.agreement.bulkMintAgreementRoleTokens({
								agreementId: agreement?.id ?? '',
								agreementRoleId: '',
								tokens: addressesToMint
							})
						}

						log.debug(
							`Burning ${toBurn.length} existing role members`
						)

						log.debug(
							'All operations complete. Awaiting DB changes...'
						)
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
						await sdk.agreement.createAgreementRole({
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
							agreementId: agreement.id ?? ''
						})

						log.debug(
							'createAgreementRole complete. Awaiting DB changes...'
						)
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
			}
		}

		if (
			!hasSubscribedToSockets &&
			sockets &&
			wallet.accounts[0] &&
			isOpened
		) {
			setHasSubscribedToSockets(true)

			sockets.subscribe(
				[{ key: MeemAPI.MeemEvent.Err }],
				wallet.accounts[0]
			)
			sockets.on({
				eventName: MeemAPI.MeemEvent.Err,
				handler: err => {
					log.crit('SOCKET ERROR CAUGHT!!!!!!!!!!')
					log.crit(err)
					log.crit(err.detail.code)

					if (err.detail.code === 'TX_LIMIT_EXCEEDED') {
						showErrorNotification(
							'Transaction limit exceeded',
							'You have used all the transactions available to you today. Get in touch or wait until tomorrow.'
						)
					} else {
						showErrorNotification(
							'Error saving changes',
							'An error occurred while saving changes. Please try again.'
						)
					}

					closeModal()
				}
			})
		}

		function compareAgreementData() {
			if (agreementData) {
				const newAgreementDataString = JSON.stringify(agreementData)

				if (currentAgreementDataString === newAgreementDataString) {
					log.debug('nothing has changed on the agreement yet.')
				} else {
					log.debug('changes detected on the agreement.')
					if (isSavingChanges) {
						setIsSavingChanges(false)
						onRoleChangesSaved()
					}
				}
			}
		}

		if (agreementData && !loading && !error && isOpened) {
			if (currentAgreementDataString.length === 0) {
				if (agreementData.Agreements.length > 0) {
					// Set initial agreement data
					log.debug('setting initial agreement data...')
					setCurrentAgreementDataString(JSON.stringify(agreementData))
				}
			} else {
				// compare to initial agreement fata
				compareAgreementData()
			}
		}

		if (isOpened && !hasSubscribedToSockets) {
			connect()
			saveRoleChanges()
		}
	}, [
		closeModal,
		isSavingChanges,
		agreement,
		currentAgreementDataString,
		isOpened,
		onModalClosed,
		wallet,
		role,
		isExistingRole,
		roleMembers,
		router,
		sdk.agreement,
		hasSubscribedToSockets,
		sockets,
		connect,
		agreementData,
		loading,
		error,
		hasRoleNameChanged,
		originalRoleMembers
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
					closeModal()
				}}
			>
				<div className={meemTheme.modalHeader}>
					<Loader color="blue" variant="oval" />
					<Space h={16} />
					<Text
						className={meemTheme.tMediumBold}
					>{`Saving role changes...`}</Text>
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
