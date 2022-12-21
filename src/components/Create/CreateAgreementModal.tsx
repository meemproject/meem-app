import { useSubscription } from '@apollo/client'
import log from '@kengoldfarb/log'
import {
	Text,
	Image,
	Space,
	Modal,
	Loader,
	Stepper,
	Center
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useSDK, useWallet, useMeemApollo } from '@meemproject/react'
import { MeemAPI } from '@meemproject/sdk'
import { ethers } from 'ethers'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { Check } from 'tabler-icons-react'
import { GetTransactionsSubscription } from '../../../generated/graphql'
import { SUB_TRANSACTIONS } from '../../graphql/transactions'
import {
	MembershipSettings,
	MembershipRequirementToMeemPermission
} from '../../model/agreement/agreements'
import { CookieKeys } from '../../utils/cookies'
import { hostnameToChainId } from '../App'
import { colorGreen, colorBlue, useMeemTheme } from '../Styles/MeemTheme'
interface IProps {
	membershipSettings?: MembershipSettings
	isOpened: boolean
	onModalClosed: () => void
}

export const CreateAgreementModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed,
	membershipSettings
}) => {
	const router = useRouter()

	const { sdk } = useSDK()

	const wallet = useWallet()

	const { anonClient } = useMeemApollo()

	const { classes: meemTheme } = useMeemTheme()

	const [activeStep, setActiveStep] = useState(1)

	const [hasStartedCreating, setHasStartedCreating] = useState(false)

	const [hasStartedCreatingSafe, setHasStartedCreatingSafe] = useState(false)

	log.debug({ hasStartedCreatingSafe })

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
			showNotification({
				radius: 'lg',
				title: 'Error Fetching Data',
				message: 'Please reload and try again.',
				color: colorBlue
			})
		}
	}, [error])

	const closeModal = useCallback(() => {
		onModalClosed()

		setHasStartedCreating(false)
		setHasStartedCreatingSafe(false)
	}, [onModalClosed])

	const finishAgreementCreation = useCallback(
		async (slug: string) => {
			// Successfully created agreement
			log.debug('agreement creation complete')

			// Remove all metadata cookies!
			Cookies.remove(CookieKeys.agreementName)
			Cookies.remove(CookieKeys.agreementDescription)
			Cookies.remove(CookieKeys.agreementImage)
			Cookies.remove(CookieKeys.agreementExternalUrl)

			// Route to the created agreement detail page
			showNotification({
				radius: 'lg',
				title: 'Success!',
				autoClose: 5000,
				color: colorGreen,
				icon: <Check color="green" />,

				message: `Your community has been created.`
			})

			router.push({
				pathname: `/${slug}`
			})
			Cookies.remove(CookieKeys.agreementSlug)
		},
		[router]
	)

	const create = useCallback(async () => {
		log.debug('creating agreement...')
		if (!wallet.web3Provider || !wallet.chainId) {
			log.debug('no web3 provider, returning.')
			showNotification({
				radius: 'lg',
				title: 'Error creating community',
				message: 'Please connect your wallet first.',
				color: colorBlue
			})
			closeModal()
			setHasStartedCreating(false)
			return
		}

		if (!membershipSettings) {
			log.debug('no membership settings found, returning.')
			showNotification({
				radius: 'lg',
				title: 'Error creating community',
				message:
					'An error occurred while creating this community. Please try again.',
				color: colorBlue
			})

			closeModal()
			setHasStartedCreating(false)
			return
		}

		try {
			const splits =
				membershipSettings.membershipFundsAddress.length > 0 &&
				membershipSettings.costToJoin > 0
					? [
							{
								amount: 10000,
								toAddress:
									membershipSettings.membershipFundsAddress,
								lockedBy: MeemAPI.zeroAddress
							}
					  ]
					: []

			const mintPermissions: MeemAPI.IMeemPermission[] =
				membershipSettings.requirements.map(mr => {
					return MembershipRequirementToMeemPermission({
						...mr,
						costEth: membershipSettings.costToJoin,
						mintStartTimestamp:
							membershipSettings.membershipStartDate
								? membershipSettings.membershipStartDate.getTime() /
								  1000
								: 0,
						mintEndTimestamp: membershipSettings.membershipEndDate
							? membershipSettings.membershipEndDate.getTime() /
							  1000
							: 0
					})
				})

			// Setup application instructions for agreement
			const applicationInstructions: string[] = []
			membershipSettings.requirements.forEach(requirement => {
				if (
					requirement.applicationInstructions &&
					requirement.applicationInstructions?.length > 0
				) {
					applicationInstructions.push(
						requirement.applicationInstructions
					)
				}
			})

			if (mintPermissions.length === 0) {
				showNotification({
					radius: 'lg',
					title: 'Oops!',
					message: `This community has invalid membership requirements. Please double-check your entries and try again.`,
					color: colorBlue
				})
				closeModal()
				setHasStartedCreating(false)
				return
			}

			const data = {
				shouldMintTokens: true,
				metadata: {
					meem_metadata_type: 'Meem_AgreementContract',
					meem_metadata_version: '20221116',
					name: Cookies.get(CookieKeys.agreementName),
					description: Cookies.get(CookieKeys.agreementDescription),
					image: Cookies.get(CookieKeys.agreementImage),
					associations: [],
					external_url: '',
					application_instructions: applicationInstructions
				},
				shouldCreateAdminRole: true,
				name: Cookies.get(CookieKeys.agreementName) ?? '',
				admins: membershipSettings.agreementAdminsAtAgreementCreation,
				minters: membershipSettings.agreementAdminsAtAgreementCreation,
				maxSupply: ethers.BigNumber.from(
					membershipSettings.membershipQuantity
				).toHexString(),
				mintPermissions,
				splits,
				tokenMetadata: {
					meem_metadata_type: 'Meem_AgreementToken',
					meem_metadata_version: '20221116',
					description: `Membership token for ${Cookies.get(
						CookieKeys.agreementName
					)}`,
					name: `${Cookies.get(
						CookieKeys.agreementName
					)} membership token`,
					image: Cookies.get(CookieKeys.agreementImage),
					associations: [],
					external_url: ''
				},
				chainId:
					wallet.chainId ??
					hostnameToChainId(
						global.window ? global.window.location.host : ''
					)
			}

			const response = await sdk.agreement.createAgreement({
				...data
			})

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
			showNotification({
				radius: 'lg',
				title: 'Error creating community',
				message:
					'An error occurred while creating this community. Please try again.',
				color: colorBlue
			})

			closeModal()
			setHasStartedCreating(false)
		}
	}, [closeModal, membershipSettings, wallet, sdk.agreement])

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
				finishAgreementCreation(cutTransaction.Agreements[0].slug)
			} else {
				// TODO: Handle edge case error
				showNotification({
					radius: 'lg',
					title: 'Error creating community',
					message: 'Please try again.',
					color: colorBlue
				})
			}
		}

		setActiveStep(newActiveStep)
	}, [
		transactionState,
		setActiveStep,
		transactions,
		router,
		finishAgreementCreation
	])

	return (
		<>
			<Modal
				centered
				closeOnClickOutside={false}
				closeOnEscape={false}
				withCloseButton={false}
				radius={16}
				size={'60%'}
				overlayBlur={8}
				padding={'lg'}
				opened={isOpened}
				onClose={() => closeModal()}
			>
				<div className={meemTheme.modalHeader}>
					<Loader color="blue" variant="oval" />
					<Space h={16} />
					<Text
						className={meemTheme.tLargeBold}
					>{`We're creating your community!`}</Text>
					<Space h={32} />
					<div className={meemTheme.row}>
						<div>
							{Cookies.get(CookieKeys.agreementImage) && (
								<>
									<Center>
										<Image
											height={120}
											width={120}
											fit={'cover'}
											className={
												meemTheme.imageAgreementLogo
											}
											src={Cookies.get(
												CookieKeys.agreementImage
											)}
										/>
									</Center>
									<Space h={48} />
								</>
							)}

							<Text
								className={meemTheme.tLargeBold}
								style={{ textAlign: 'center' }}
							>
								{Cookies.get(CookieKeys.agreementName)}
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
						<Stepper
							active={activeStep}
							onStepClick={() => {}}
							breakpoint="sm"
							orientation="vertical"
						>
							<Stepper.Step
								label="Queued"
								description="Community creation has been queued."
							></Stepper.Step>
							<Stepper.Step
								label="Deploying community"
								description="Your community's smart contract is being deployed to the blockchain"
							></Stepper.Step>
							<Stepper.Step
								label="Initializing community"
								description="Setting up your community's smart contract"
							></Stepper.Step>
							<Stepper.Step
								label="Minting tokens"
								description="Minting membership tokens for your community"
							></Stepper.Step>
							<Stepper.Completed>
								{/** TODO: Show a message when complete before redirecting? */}
							</Stepper.Completed>
						</Stepper>
					</div>
				</div>
				<Space h={8} />
			</Modal>
		</>
	)
}
