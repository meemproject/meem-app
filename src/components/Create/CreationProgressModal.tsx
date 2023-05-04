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
	Agreement,
	agreementSummaryFromDb
} from '../../model/agreement/agreements'
import {
	showErrorNotification,
	showSuccessNotification
} from '../../utils/notifications'
import { useAnalytics } from '../Providers/AnalyticsProvider'
import { useMeemTheme } from '../Styles/MeemTheme'
interface IProps {
	agreementName: string
	isAgreementOnChain: boolean
	isOpened: boolean
	onModalClosed: (status: string, agreement?: Agreement) => void
}

export const CreationProgressModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed,
	isAgreementOnChain,
	agreementName
}) => {
	const router = useRouter()

	const { sdk } = useSDK()

	const wallet = useWallet()

	const { anonClient } = useMeemApollo()

	const { classes: meemTheme } = useMeemTheme()

	const [activeStep, setActiveStep] = useState(1)

	const [hasStartedCreating, setHasStartedCreating] = useState(false)

	const [transactionIds, setTransactionIds] = useState<string[]>([])

	const analytics = useAnalytics()

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
			client: anonClient,
			skip: !isOpened || transactionIds.length === 0
		})

	useEffect(() => {
		if (error) {
			log.crit(error)
			if (!JSON.stringify(error).includes('OwnerId')) {
				showErrorNotification(
					'Error Fetching Data',
					'Please reload and try again.'
				)
			}
		}
	}, [error])

	const closeModal = useCallback(
		(status: string, agreement?: Agreement) => {
			setTransactionIds([])
			setHasStartedCreating(false)
			onModalClosed(status, agreement)
		},
		[onModalClosed]
	)

	const finishAgreementCreation = useCallback(
		async (slug: string) => {
			log.debug('Finishing agreement creation...', { hasStartedCreating })
			// if (hasStartedCreating) {
			// Successfully created agreement
			log.debug('agreement creation complete')

			showSuccessNotification(
				'Success!',
				`Your community has been created.`
			)

			analytics.track('Agreement Created', {
				slug
			})

			router.push(`/${slug}/questions`)
			// }
		},
		[analytics, hasStartedCreating, router]
	)

	const create = useCallback(async () => {
		log.debug('creating agreement...')

		if (!wallet.web3Provider || !wallet.chainId) {
			log.debug('no web3 provider, returning.')
			showErrorNotification(
				'Error creating community',
				'Please connect your wallet first.'
			)
			closeModal('failure')
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
				shouldCreateContract: isAgreementOnChain,
				name: agreementName,
				admins: wallet.accounts,
				members: wallet.accounts,
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
				chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID)
			}

			log.debug(JSON.stringify(data))

			const response = await sdk.agreement.createAgreement({
				...data
			})

			log.debug(response)

			if (response) {
				if (response.slug) {
					finishAgreementCreation(response.slug)
				} else {
					setTransactionState({
						deployContractTxId: response.deployContractTxId,
						cutTxId: response.cutTxId,
						mintTxId: response.mintTxId
					})
					if (response.deployContractTxId && response.cutTxId) {
						const tIds = [
							response.deployContractTxId,
							response.cutTxId
						]
						if (response.mintTxId) {
							tIds.push(response.mintTxId)
						}

						setTransactionIds(tIds)
					}
				}

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
	}, [
		wallet.web3Provider,
		wallet.chainId,
		wallet.accounts,
		closeModal,
		agreementName,
		isAgreementOnChain,
		sdk.agreement,
		finishAgreementCreation
	])

	useEffect(() => {
		// Create the agreement
		if (isOpened && !hasStartedCreating && transactionIds.length === 0) {
			setHasStartedCreating(true)
			create()
		}
	}, [hasStartedCreating, isOpened, create, transactionIds.length])

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
				const possibleAgreement = agreementSummaryFromDb(
					cutTransaction?.Agreements[0],
					wallet.accounts[0]
				)
				if (!possibleAgreement.slug) {
					showErrorNotification(
						'Error creating community',
						'Please try again.'
					)
					return
				}
				finishAgreementCreation(possibleAgreement.slug)
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
		closeModal,
		wallet.accounts
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
			{isAgreementOnChain && (
				<>
					<Modal
						className={meemTheme.visibleDesktopOnly}
						centered
						closeOnClickOutside={false}
						closeOnEscape={false}
						withCloseButton={false}
						radius={16}
						size={'60%'}
						overlayProps={{ blur: 8 }}
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
						fullScreen={true}
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
