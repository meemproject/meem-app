import { useSubscription } from '@apollo/client'
import log from '@kengoldfarb/log'
import { Text, Image, Space, Modal, Loader, Stepper } from '@mantine/core'
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
} from '../../model/club/club'
import { CookieKeys } from '../../utils/cookies'
import { hostnameToChainId } from '../App'
import { colorGreen, colorPink, useClubsTheme } from '../Styles/ClubsTheme'
interface IProps {
	membershipSettings?: MembershipSettings
	isOpened: boolean
	onModalClosed: () => void
}

export const CreateClubModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed,
	membershipSettings
}) => {
	const router = useRouter()

	const { sdk } = useSDK()

	const wallet = useWallet()

	const { anonClient } = useMeemApollo()

	const { classes: clubsTheme } = useClubsTheme()

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
				color: colorPink
			})
		}
	}, [error])

	const closeModal = useCallback(() => {
		onModalClosed()

		setHasStartedCreating(false)
		setHasStartedCreatingSafe(false)
	}, [onModalClosed])

	const finishClubCreation = useCallback(
		async (slug: string) => {
			// Successfully created club
			log.debug('club creation complete')

			// Remove all metadata cookies!
			Cookies.remove(CookieKeys.clubName)
			Cookies.remove(CookieKeys.clubDescription)
			Cookies.remove(CookieKeys.clubImage)
			Cookies.remove(CookieKeys.clubExternalUrl)

			// Route to the created club detail page
			showNotification({
				radius: 'lg',
				title: 'Success!',
				autoClose: 5000,
				color: colorGreen,
				icon: <Check color="green" />,

				message: `Your club has been published.`
			})

			router.push({
				pathname: `/${slug}`
			})
			Cookies.remove(CookieKeys.clubSlug)
		},
		[router]
	)

	const create = useCallback(async () => {
		log.debug('creating club...')
		if (!wallet.web3Provider || !wallet.chainId) {
			log.debug('no web3 provider, returning.')
			showNotification({
				radius: 'lg',
				title: 'Error Creating Club',
				message: 'Please connect your wallet first.',
				color: colorPink
			})
			closeModal()
			setHasStartedCreating(false)
			return
		}

		if (!membershipSettings) {
			log.debug('no membership settings found, returning.')
			showNotification({
				radius: 'lg',
				title: 'Error Creating Club',
				message:
					'An error occurred while creating the club. Please try again.',
				color: colorPink
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

			// Setup application instructions for club
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
					message: `This club has invalid membership requirements. Please double-check your entries and try again.`,
					color: colorPink
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
					name: Cookies.get(CookieKeys.clubName),
					description: Cookies.get(CookieKeys.clubDescription),
					image: Cookies.get(CookieKeys.clubImage),
					associations: [],
					external_url: '',
					application_instructions: applicationInstructions
				},
				name: Cookies.get(CookieKeys.clubName) ?? '',
				admins: membershipSettings.clubAdminsAtClubCreation,
				minters: membershipSettings.clubAdminsAtClubCreation,
				maxSupply: ethers.BigNumber.from(
					membershipSettings.membershipQuantity
				).toHexString(),
				mintPermissions,
				splits,
				tokenMetadata: {
					meem_metadata_type: 'Meem_AgreementToken',
					meem_metadata_version: '20221116',
					description: `Membership token for ${Cookies.get(
						CookieKeys.clubName
					)}`,
					name: `${Cookies.get(
						CookieKeys.clubName
					)} membership token`,
					image: Cookies.get(CookieKeys.clubImage),
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
				title: 'Error Creating Club',
				message:
					'An error occurred while creating the club. Please try again.',
				color: colorPink
			})

			closeModal()
			setHasStartedCreating(false)
		}
	}, [closeModal, membershipSettings, wallet, sdk.agreement])

	useEffect(() => {
		// Create the club
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
				finishClubCreation(cutTransaction.Agreements[0].slug)
			} else {
				// TODO: Handle edge case error
				showNotification({
					radius: 'lg',
					title: 'Error Creating Club',
					message: 'Please try again.',
					color: colorPink
				})
			}
		}

		setActiveStep(newActiveStep)
	}, [
		transactionState,
		setActiveStep,
		transactions,
		router,
		finishClubCreation
	])

	return (
		<>
			<Modal
				centered
				closeOnClickOutside={false}
				closeOnEscape={false}
				withCloseButton={false}
				radius={16}
				overlayBlur={8}
				padding={'lg'}
				opened={isOpened}
				onClose={() => closeModal()}
			>
				<div className={clubsTheme.modalHeader}>
					<Loader color="red" variant="oval" />
					<Space h={16} />
					<Text
						className={clubsTheme.tLargeBold}
					>{`We're creating your club!`}</Text>
					<Space h={32} />
					<Stepper
						active={activeStep}
						onStepClick={() => {}}
						breakpoint="sm"
						orientation="vertical"
					>
						<Stepper.Step
							label="Queued"
							description="Club creation has been queued"
						></Stepper.Step>
						<Stepper.Step
							label="Deploying Club"
							description="Your Club smart contract is being deployed to the blockchain"
						></Stepper.Step>
						<Stepper.Step
							label="Initializing Club"
							description="Setting up your Club's smart contract"
						></Stepper.Step>
						<Stepper.Step
							label="Minting Tokens"
							description="Minting membership tokens for your club"
						></Stepper.Step>
						<Stepper.Completed>
							{/** TODO: Show a message when complete before redirecting? */}
						</Stepper.Completed>
					</Stepper>
					<Space h={32} />
					<Image
						height={120}
						width={120}
						fit={'cover'}
						className={clubsTheme.imageClubLogo}
						src={Cookies.get(CookieKeys.clubImage)}
					/>
					<Space h={16} />
					<Text className={clubsTheme.tLargeBold}>
						{Cookies.get(CookieKeys.clubName)}
					</Text>
					<Space h={24} />

					<Text
						className={clubsTheme.tExtraSmall}
						style={{ textAlign: 'center' }}
					>
						This could take a few minutes.
					</Text>
					<Space h={16} />

					<Text
						className={clubsTheme.tExtraSmall}
						style={{ textAlign: 'center' }}
					>{`Please don’t refresh or close this window until this step is complete.`}</Text>
				</div>
				<Space h={8} />
			</Modal>
		</>
	)
}
