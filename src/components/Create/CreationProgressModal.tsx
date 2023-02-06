import { useSubscription } from '@apollo/client'
import log from '@kengoldfarb/log'
import { Text, Space, Modal, Loader, Stepper } from '@mantine/core'
import { useSDK, useWallet, useMeemApollo } from '@meemproject/react'
import { MeemAPI } from '@meemproject/sdk'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { GetTransactionsSubscription } from '../../../generated/graphql'
import { SUB_TRANSACTIONS } from '../../graphql/transactions'
import {
	showErrorNotification,
	showSuccessNotification
} from '../../utils/notifications'
import { hostnameToChainId } from '../App'
import { useMeemTheme } from '../Styles/MeemTheme'
interface IProps {
	agreementName: string
	isOpened: boolean
	onModalClosed: (
		status: string,
		agreementSlug: string,
		agreementId: string
	) => void
	quietMode?: boolean
}

export const CreationProgressModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed,
	agreementName,
	quietMode
}) => {
	const router = useRouter()

	const { sdk } = useSDK()

	const wallet = useWallet()

	const { anonClient } = useMeemApollo()

	const { classes: meemTheme } = useMeemTheme()

	const [activeStep, setActiveStep] = useState(1)

	const [hasStartedCreating, setHasStartedCreating] = useState(false)

	const [transactionIds, setTransactionIds] = useState<string[]>([])

	const [transactionState, setTransactionState] = useState<{
		deployContractTxId?: string
		cutTxId?: string
		mintTxId?: string
	}>({})

	const { error, data: transactions } =
		useSubscription<GetTransactionsSubscription>(SUB_TRANSACTIONS, {
			variables: {
				transactionIds
			},
			// @ts-ignore
			client: anonClient
		})

	useEffect(() => {
		if (error) {
			log.crit(error)
			showErrorNotification(
				'Error Fetching Data',
				'Please reload and try again.'
			)
		}
	}, [error])

	const closeModal = useCallback(
		(status: string, agreementSlug?: string, agreementId?: string) => {
			setTransactionIds([])
			setHasStartedCreating(false)
			onModalClosed(status, agreementSlug ?? '', agreementId ?? '')
		},
		[onModalClosed]
	)

	const finishAgreementCreation = useCallback(
		async (slug: string, id: string) => {
			if (hasStartedCreating) {
				// Successfully created agreement
				log.debug('agreement creation complete')

				if (quietMode) {
					showSuccessNotification(
						'Success!',
						`Your community has been created. Let's get you set up.`
					)
					closeModal('success', slug, id)
				} else {
					// Route to the created agreement detail page
					showSuccessNotification(
						'Success!',
						`Your community has been created.`
					)

					router.push({
						pathname: `/${slug}`
					})
				}
			}
		},
		[closeModal, hasStartedCreating, quietMode, router]
	)

	const create = useCallback(async () => {
		log.debug('creating agreement...')

		if (!wallet.web3Provider || !wallet.chainId) {
			log.debug('no web3 provider, returning.')
			showErrorNotification(
				'Error creating community',
				'Please connect your wallet first.'
			)
			closeModal('failure', '')
			setHasStartedCreating(false)
			return
		}

		try {
			const mintPermissions: MeemAPI.IMeemPermission[] = [
				{
					permission: 0,
					mintStartTimestamp: '0',
					mintEndTimestamp: '0',
					addresses: [],
					costWei: '0x00',
					numTokens: '0x00',
					merkleRoot:
						'0x0000000000000000000000000000000000000000000000000000000000000000'
				}
			]

			const data = {
				shouldMintTokens: true,
				metadata: {
					meem_metadata_type: 'Meem_AgreementContract',
					meem_metadata_version: '20221116',
					name: agreementName,
					description: '',
					image: '',
					associations: [],
					external_url: ''
				},
				shouldCreateAdminRole: true,
				name: agreementName,
				admins: wallet.accounts,
				minters: wallet.accounts,
				maxSupply: '0x00',
				mintPermissions,
				splits: [],
				tokenMetadata: {
					meem_metadata_type: 'Meem_AgreementToken',
					meem_metadata_version: '20221116',
					description: `Membership token for ${agreementName}`,
					name: `${agreementName} membership token`,
					image: '',
					associations: [],
					external_url: ''
				},
				chainId:
					wallet.chainId ??
					hostnameToChainId(
						global.window ? global.window.location.host : ''
					)
			}

			log.debug(JSON.stringify(data))

			const response = await sdk.agreement.createAgreement({
				...data
			})

			log.debug(JSON.stringify(response))

			if (response) {
				setTransactionState({
					deployContractTxId: response.deployContractTxId,
					cutTxId: response.cutTxId,
					mintTxId: response.mintTxId
				})

				const tIds = [response.deployContractTxId, response.cutTxId]
				if (response.mintTxId) {
					tIds.push(response.mintTxId)
				}

				setTransactionIds(tIds)

				log.debug('finish fetcher')
			}
		} catch (e) {
			log.crit(e)
			showErrorNotification(
				'Error creating community',
				'An error occurred while creating this community. Please try again.'
			)

			closeModal('failure')
			setHasStartedCreating(false)
		}
	}, [wallet, closeModal, agreementName, sdk.agreement])

	useEffect(() => {
		// Create the agreement
		if (isOpened && !hasStartedCreating) {
			setHasStartedCreating(true)
			create()
		}
	}, [hasStartedCreating, isOpened, create])

	useEffect(() => {
		let newActiveStep = 1
		const deployTransaction = transactions?.Transactions.find(
			(t: { id: string | undefined }) =>
				t.id === transactionState?.deployContractTxId
		)
		const cutTransaction = transactions?.Transactions.find(
			(t: { id: string | undefined }) =>
				t.id === transactionState?.cutTxId
		)
		const mintTransaction = transactions?.Transactions.find(
			(t: { id: string | undefined }) =>
				t.id === transactionState?.mintTxId
		)

		if (deployTransaction?.status === MeemAPI.TransactionStatus.Success) {
			newActiveStep = 2
		}

		if (cutTransaction?.status === MeemAPI.TransactionStatus.Success) {
			newActiveStep = 3
		}

		if (mintTransaction?.status === MeemAPI.TransactionStatus.Success) {
			newActiveStep = 4
			if (cutTransaction?.Agreements[0]) {
				finishAgreementCreation(
					cutTransaction.Agreements[0].slug,
					cutTransaction.Agreements[0].id
				)
			} else {
				// TODO: Handle edge case error
				showErrorNotification(
					'Error creating community',
					'Please try again.'
				)
				closeModal('failure')
			}
		}

		setActiveStep(newActiveStep)
	}, [
		transactionState,
		setActiveStep,
		transactions,
		router,
		finishAgreementCreation,
		closeModal
	])

	const modalContents = (
		<>
			<div className={meemTheme.modalHeader}>
				<Loader color="cyan" variant="oval" />
				<Space h={16} />
				<Text
					className={meemTheme.tLargeBold}
				>{`Creating your community...`}</Text>
				<Space h={32} />
				<div className={meemTheme.rowResponsive}>
					<div>
						<Text
							className={meemTheme.tLargeBold}
							style={{ textAlign: 'center' }}
						>
							{agreementName}
						</Text>
						<Space h={24} />

						<Text
							className={meemTheme.tExtraSmall}
							style={{ textAlign: 'center' }}
						>
							This could take a few minutes.
						</Text>
						<Space h={16} />

						<Text
							className={meemTheme.tExtraSmall}
							style={{ textAlign: 'center' }}
						>{`Please don’t refresh or close this window until this step is complete.`}</Text>
					</div>
					<Space w={32} />
					<Space h={48} />
					<Stepper
						active={activeStep}
						onStepClick={() => {}}
						breakpoint="sm"
						orientation="vertical"
					>
						<Stepper.Step
							label="Queued"
							description={
								<Text
									className={meemTheme.tExtraSmall}
								>{`Community creation has been queued.`}</Text>
							}
						></Stepper.Step>
						<Stepper.Step
							label="Deploying community"
							description={
								<Text
									className={meemTheme.tExtraSmall}
								>{`Your community's smart contract is being deployed to the blockchain`}</Text>
							}
						></Stepper.Step>
						<Stepper.Step
							label="Initializing community"
							description={
								<Text
									className={meemTheme.tExtraSmall}
								>{`Setting up your community's smart contract`}</Text>
							}
						></Stepper.Step>
						<Stepper.Step
							label="Setting up memberships"
							description={
								<Text
									className={meemTheme.tExtraSmall}
								>{`Configuring memberships for your community`}</Text>
							}
						></Stepper.Step>
						<Stepper.Completed>
							{/** TODO: Show a message when complete before redirecting? */}
						</Stepper.Completed>
					</Stepper>
				</div>
			</div>
			<Space h={8} />
		</>
	)

	return (
		<>
			{!quietMode && (
				<>
					<Modal
						className={meemTheme.visibleDesktopOnly}
						centered
						closeOnClickOutside={false}
						closeOnEscape={false}
						withCloseButton={false}
						radius={16}
						size={'60%'}
						overlayBlur={8}
						padding={'lg'}
						opened={isOpened}
						onClose={() => closeModal('failure')}
					>
						{modalContents}
					</Modal>
					<Modal
						className={meemTheme.visibleMobileOnly}
						centered
						closeOnClickOutside={false}
						closeOnEscape={false}
						withCloseButton={false}
						radius={16}
						fullScreen={true}
						overlayBlur={8}
						padding={'lg'}
						opened={isOpened}
						onClose={() => closeModal('failure')}
					>
						{modalContents}
					</Modal>
				</>
			)}
		</>
	)
}
