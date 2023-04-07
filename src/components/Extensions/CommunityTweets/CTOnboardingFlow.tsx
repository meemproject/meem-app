import { useQuery, useSubscription } from '@apollo/client'
import log from '@kengoldfarb/log'
import {
	Text,
	Image,
	Space,
	Loader,
	Button,
	Center,
	Grid,
	Badge,
	useMantineColorScheme,
	Container,
	Stepper,
	TextInput,
	Code,
	Progress,
	Checkbox
} from '@mantine/core'
import {
	useWallet,
	useMeemApollo,
	useSDK,
	LoginState,
	useAuth
} from '@meemproject/react'
import { MeemAPI } from '@meemproject/sdk'
import { IconBrandSlack } from '@tabler/icons'
import { Group } from 'iconoir-react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import {
	GetExtensionsQuery,
	GetTransactionsSubscription,
	MyAgreementsSubscriptionSubscription,
	SubDiscordSubscription,
	SubSlackSubscription,
	SubTwitterSubscription
} from '../../../../generated/graphql'
import { useAnalytics } from '../../../contexts/AnalyticsProvider'
import {
	GET_AGREEMENT_AS_MEMBER,
	GET_AGREEMENT_EXISTS,
	GET_EXTENSIONS,
	SUB_MY_AGREEMENTS
} from '../../../graphql/agreements'
import { SUB_TRANSACTIONS } from '../../../graphql/transactions'
import {
	Agreement,
	agreementSummaryFromDb,
	isJwtError
} from '../../../model/agreement/agreements'
import { CookieKeys } from '../../../utils/cookies'
import {
	showErrorNotification,
	showSuccessNotification
} from '../../../utils/notifications'
import { MeemFAQModal } from '../../Header/MeemFAQModal'
import {
	colorAshLight,
	colorBlack,
	colorBlue,
	colorDarkerGrey,
	colorWhite,
	useMeemTheme
} from '../../Styles/MeemTheme'
import { SUB_DISCORDS, SUB_SLACKS, SUB_TWITTERS } from './communityTweetsGql'

enum PageState {
	Loading,
	Error,
	PickCommunity,
	Onboarding,
	SetupComplete
}

export const CTOnboardingFlow: React.FC = () => {
	// General imports
	const { classes: meemTheme } = useMeemTheme()
	const router = useRouter()
	const wallet = useWallet()
	const analytics = useAnalytics()
	const { sdk } = useSDK()
	const { jwt } = useAuth()
	const { colorScheme } = useMantineColorScheme()
	const isDarkTheme = colorScheme === 'dark'

	// Agreement / network
	const { anonClient, mutualMembersClient } = useMeemApollo()
	const [newAgreementName, setNewAgreementName] = useState('')
	const [myAgreements, setMyAgreements] = useState<Agreement[]>()
	const [chosenAgreement, setChosenAgreement] = useState<Agreement>()

	// Extension vars
	const extensionSlug = 'community-tweets'
	const extensionName = 'Communitytweets'
	const extensionIcon = `ext-ct.png`

	// Page state
	const [pageState, setPageState] = useState<PageState>(PageState.Loading)
	const [onboardingStep, setOnboardingStep] = useState(0)
	const [isEnablingExtension, setIsEnablingExtension] = useState(false)
	const [shouldShowCreateNewCommunity, setShouldShowCreateNewCommunity] =
		useState(false)
	const [isMeemFaqModalOpen, setIsMeemFaqModalOpen] = useState(false)
	const [isWaitingForStateChangeDelay] = useState(false)

	// Which input connections have been selected?
	const [hasOutputsBeenSelected, setHasOutputsBeenSelected] = useState(false)
	const [isDiscordInputEnabled, setIsDiscordInputEnabled] = useState(false)
	const [isSlackInputEnabled, setIsSlackInputEnabled] = useState(false)

	// Which output connections have been selected?
	const [isTwitterOutputEnabled, setIsTwitterOutputEnabled] = useState(false)
	const [isWebhookOutputEnabled, setIsWebhookOutputEnabled] = useState(false)
	const [isSkippingTwitterAuth, setIsSkippingTwitterAuth] = useState(false)

	// Agreement creation
	const [isCreatingNewCommunity, setIsCreatingNewCommunity] = useState(false)
	const [isAgreementOnChain, setIsAgreementOnChain] = useState(false)
	const [activeStep, setActiveStep] = useState(1)

	// Bot code / invite data
	const [discordInviteUrl, setDiscordInviteUrl] = useState('')
	const [botCode, setDiscordBotCode] = useState<string | undefined>()
	const [shouldActivateBot] = useState(false)

	// Subscriptions
	const {
		loading: isLoadingMyAgreements,
		data: myAgreementsData,
		error: myAgreementsError
	} = useSubscription<MyAgreementsSubscriptionSubscription>(
		SUB_MY_AGREEMENTS,
		{
			variables: {
				chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
				walletAddress:
					wallet.accounts &&
					wallet.accounts[0] &&
					wallet.accounts[0].toLowerCase()
			},
			client: mutualMembersClient
		}
	)

	const { loading: isExtensionsLoading, data: availableExtensionsData } =
		useQuery<GetExtensionsQuery>(GET_EXTENSIONS, {
			client: anonClient
		})

	const { data: twitterData, loading: isTwitterDataLoading } =
		useSubscription<SubTwitterSubscription>(SUB_TWITTERS, {
			variables: {
				agreementId: chosenAgreement?.id
			},
			skip: !mutualMembersClient || !chosenAgreement?.id,
			client: mutualMembersClient
		})

	const { data: discordData, loading: isDiscordInfoLoading } =
		useSubscription<SubDiscordSubscription>(SUB_DISCORDS, {
			variables: {
				agreementId: chosenAgreement?.id
			},
			skip: !mutualMembersClient || !chosenAgreement?.id,
			client: mutualMembersClient
		})

	const { data: slackData, loading: isSlackInfoLoading } =
		useSubscription<SubSlackSubscription>(SUB_SLACKS, {
			variables: {
				agreementId: chosenAgreement?.id
			},
			skip:
				process.env.NEXT_PUBLIC_SYMPHONY_ENABLE_SLACK !== 'true' ||
				!mutualMembersClient ||
				!chosenAgreement?.id,
			client: mutualMembersClient
		})

	const [transactionIds, setTransactionIds] = useState<string[]>([])

	const [transactionState, setTransactionState] = useState<{
		deployContractTxId?: string
		cutTxId?: string
		mintTxId?: string
	}>({})

	const { data: transactions } = useSubscription<GetTransactionsSubscription>(
		SUB_TRANSACTIONS,
		{
			variables: {
				transactionIds
			},
			// @ts-ignore
			client: anonClient,
			skip: !isCreatingNewCommunity || transactionIds.length === 0
		}
	)

	useEffect(() => {
		if (!myAgreements && myAgreementsData) {
			// Parse my existing agreements
			const agrs: Agreement[] = []
			myAgreementsData?.Agreements.forEach(agr => {
				const possibleAgreement = agreementSummaryFromDb(
					agr,
					wallet.accounts[0]
				)

				if (
					possibleAgreement.name &&
					possibleAgreement.isCurrentUserAgreementAdmin
				) {
					agrs.push(possibleAgreement)
				}
			})
			setMyAgreements(agrs)
		}
	}, [myAgreements, myAgreementsData, wallet.accounts])

	const chooseAgreementAndEnableExtension = useCallback(
		async (chosen?: Agreement) => {
			if (chosen) {
				// Agreement exists already. Let's see if it already has communityTweets enabled...
				let isExtensionEnabled = false
				chosen.extensions?.forEach(ext => {
					if (ext.Extension?.slug === extensionSlug) {
						isExtensionEnabled = true
					}
				})
				if (isExtensionEnabled) {
					log.debug('extension already enabled for this community')
					router.push(`/${chosen?.slug}`)
					return
				}
			}

			if (availableExtensionsData) {
				setIsEnablingExtension(true)
				try {
					let extensionId = ''
					availableExtensionsData.Extensions.forEach(ext => {
						if (ext.slug === extensionSlug) {
							extensionId = ext.id
						}
					})

					if (extensionId.length === 0) {
						log.debug('no matching extensions to enable...')
						showErrorNotification(
							'Oops!',
							`There was an error enabling ${extensionName} on this community. Contact us using the top-right link on this page.`
						)
						setIsEnablingExtension(false)
						return
					}

					const enableAgrData = {
						agreementId: chosen?.id ?? '',
						extensionId,
						isInitialized: true,
						widget: {
							visibility:
								MeemAPI.AgreementExtensionVisibility
									.TokenHolders
						}
					}
					log.debug(JSON.stringify(enableAgrData))
					await sdk.agreementExtension.createAgreementExtension(
						enableAgrData
					)
					setChosenAgreement(chosen)
					setIsEnablingExtension(false)
				} catch (e) {
					log.debug(e)
					showErrorNotification(
						'Oops!',
						`There was an error enabling ${extensionName} on this community. Contact us using the top-right link on this page.`
					)
					setIsEnablingExtension(false)
				}
			} else {
				log.debug('no matching extensions to enable...')
				showErrorNotification(
					'Oops!',
					`There was an error enabling ${extensionName} on this community. Contact us using the top-right link on this page.`
				)
				setIsEnablingExtension(false)
			}
		},
		[availableExtensionsData, router, sdk.agreementExtension]
	)

	async function createAgreement() {
		if (isCreatingNewCommunity) {
			log.debug('already creating a new community.')
			return
		}

		setIsCreatingNewCommunity(true)

		// Step 1. Some basic validation
		if (
			!newAgreementName ||
			newAgreementName.length < 3 ||
			newAgreementName.length > 30
		) {
			// Agreement name invalid
			log.debug('agreement name is invalid')
			setIsCreatingNewCommunity(false)
			showErrorNotification(
				'Oops!',
				'You entered an invalid community name. Please choose a longer or shorter name.'
			)

			return
		}

		// Step 2 - check if agreement name already exists
		let doesAgreementNameExist = false
		if (anonClient) {
			const agreementCollisions = await anonClient.query({
				query: GET_AGREEMENT_EXISTS,
				variables: {
					slug: newAgreementName
						.toString()
						.replaceAll(' ', '-')
						.toLowerCase(),
					chainId: process.env.NEXT_PUBLIC_CHAIN_ID
				}
			})

			if (agreementCollisions.data.Agreements.length > 0) {
				doesAgreementNameExist = true
			}
		}

		if (doesAgreementNameExist) {
			log.debug('agreement already exists...')
			setIsCreatingNewCommunity(false)
			showErrorNotification(
				'Oops!',
				`A community by that name already exists. Choose a different name.`
			)
			return
		}

		// Step 3 - Create the agreement
		log.debug('creating agreement...')

		if (!wallet.web3Provider || !wallet.chainId) {
			log.debug('no web3 provider, returning.')
			showErrorNotification(
				'Error creating community',
				'Please connect your wallet first.'
			)
			setIsCreatingNewCommunity(false)
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
					name: newAgreementName,
					description: '',
					image: '',
					associations: [],
					external_url: ''
				},
				shouldCreateAdminRole: true,
				name: newAgreementName,
				admins: wallet.accounts,
				members: wallet.accounts,
				minters: wallet.accounts,
				shouldCreateContract: isAgreementOnChain,
				maxSupply: '0x00',
				mintPermissions,
				splits: [],
				tokenMetadata: {
					meem_metadata_type: 'Meem_AgreementToken',
					meem_metadata_version: '20221116',
					description: `Membership token for ${newAgreementName}`,
					name: `${newAgreementName} membership token`,
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

			log.debug(JSON.stringify(response))

			if (isAgreementOnChain) {
				log.debug('agreement is on chain, subscribe to tx updates...')

				if (
					response &&
					response.deployContractTxId &&
					response.cutTxId
				) {
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
			} else {
				if (!response) {
					log.debug('no response from server...')
					setIsCreatingNewCommunity(false)
					return
				}
				log.debug('agreement is off chain, skip tx listening')

				log.debug(`fetching agreement with slug ${response.slug}`)

				mutualMembersClient
					?.query({
						query: GET_AGREEMENT_AS_MEMBER,
						variables: {
							slug: response.slug,
							chainId: process.env.NEXT_PUBLIC_CHAIN_ID
						}
					})
					.then(agree => {
						const possibleAgreement = agreementSummaryFromDb(
							agree.data.Agreements[0],
							wallet.accounts[0]
						)
						setChosenAgreement(possibleAgreement)
						setIsCreatingNewCommunity(false)
						chooseAgreementAndEnableExtension(possibleAgreement)
					})
			}
		} catch (e) {
			log.crit(e)
			showErrorNotification(
				'Error creating community',
				'An error occurred while creating this community. Please try again.'
			)
			setIsCreatingNewCommunity(false)
		}
	}

	// Authentication check
	useEffect(() => {
		if (
			isJwtError(myAgreementsError) ||
			wallet.loginState === LoginState.NotLoggedIn
		) {
			Cookies.set(CookieKeys.authRedirectUrl, `/onboard/community-tweets`)
			router.push('/authenticate')
		}
	}, [
		myAgreementsError,
		extensionSlug,
		isLoadingMyAgreements,
		router,
		wallet.isConnected,
		wallet.loginState
	])

	const getDiscordInviteAndBotCode = useCallback(async () => {
		if (!chosenAgreement?.id) {
			return
		}
		const { code, inviteUrl } = await sdk.symphony.inviteDiscordBot({
			agreementId: chosenAgreement?.id
		})

		setDiscordBotCode(code)
		setDiscordInviteUrl(inviteUrl)
	}, [chosenAgreement?.id, sdk])

	// Intregrations data
	const twitterUsername =
		twitterData?.AgreementTwitters[0] &&
		twitterData?.AgreementTwitters[0].Twitter?.username
	const discordInfo = discordData?.AgreementDiscords[0]
	const hasDiscordName =
		discordInfo &&
		discordData?.AgreementDiscords[0].Discord?.name !== undefined
	const slackInfo = slackData?.AgreementSlacks[0]

	// Handle page state changes
	useEffect(() => {
		// Prevent page state flickering when several variables update simultaneously

		const twitterAuthRedirectAgreementSlug = Cookies.get(
			CookieKeys.ctOnboardingAgreementSlug
		)

		// Set page state
		if (
			isLoadingMyAgreements ||
			isExtensionsLoading ||
			(onboardingStep !== 0 &&
				(isTwitterDataLoading ||
					isDiscordInfoLoading ||
					isSlackInfoLoading)) ||
			(!chosenAgreement && twitterAuthRedirectAgreementSlug)
		) {
			setPageState(PageState.Loading)
			log.debug(`set page state = loading`)
			log.debug(
				`reason: isLoadingMyAgreements: ${isLoadingMyAgreements}, extLoad=${isExtensionsLoading} twitterLoad=${isTwitterDataLoading} discordLoad=${isDiscordInfoLoading} slackLoad=${isSlackInfoLoading} chosenAgr=${
					chosenAgreement !== undefined
				} twitterAuthSlug=${
					twitterAuthRedirectAgreementSlug !== undefined
				}`
			)
		} else if (myAgreementsError) {
			setPageState(PageState.Error)
			log.debug('set page state = error')
		} else if (
			!isLoadingMyAgreements &&
			!myAgreementsError &&
			(myAgreements?.length === 0 || shouldShowCreateNewCommunity)
		) {
			setPageState(PageState.Onboarding)
			log.debug('set page state = onboarding')
		} else if (
			!isLoadingMyAgreements &&
			!myAgreementsError &&
			myAgreements &&
			myAgreements.length > 0 &&
			!chosenAgreement
		) {
			setPageState(PageState.PickCommunity)
			log.debug('set page state = pickCommunity')
		} else if (chosenAgreement) {
			setPageState(PageState.Onboarding)
			log.debug('set page state = onboarding')
		}

		// Set onboarding step
		if (pageState === PageState.Onboarding) {
			if (!chosenAgreement || isEnablingExtension) {
				setOnboardingStep(0)
			} else if (chosenAgreement) {
				if (!twitterUsername && !isSkippingTwitterAuth) {
					// Pick publishing platform(s)
					setOnboardingStep(1)
				} else {
					if (
						!hasOutputsBeenSelected &&
						!discordInfo?.Discord?.name &&
						!slackInfo?.Slack?.name
					) {
						// Pick proposal platform(s)
						setOnboardingStep(2)
					} else {
						// Proposal platform has been picked
						// OR we already have discord or slack data.

						if (
							!discordInfo?.Discord?.name &&
							isDiscordInputEnabled
						) {
							// Connect discord if we haven't already
							if (
								isDiscordInputEnabled &&
								(!discordInviteUrl || !botCode)
							) {
								getDiscordInviteAndBotCode()
							}
							setOnboardingStep(3)
						} else if (
							!slackInfo?.Slack?.name &&
							isSlackInputEnabled
						) {
							// Connect slack if we haven't already
							setOnboardingStep(4)
						} else {
							// Setup is complete!
							setOnboardingStep(5)
						}
					}
				}
			}
		}

		if (twitterAuthRedirectAgreementSlug) {
			myAgreements?.forEach(agr => {
				if (agr.slug === twitterAuthRedirectAgreementSlug) {
					log.debug(
						'found cookie, re-choosing existing agreement to continue flow...'
					)
					setIsTwitterOutputEnabled(true)
					setChosenAgreement(agr)
					Cookies.remove(CookieKeys.ctOnboardingAgreementSlug)
				}
			})
		}
	}, [
		isEnablingExtension,
		isLoadingMyAgreements,
		myAgreements?.length,
		myAgreementsError,
		isExtensionsLoading,
		pageState,
		chosenAgreement,
		twitterUsername,
		discordInfo,
		shouldActivateBot,
		myAgreements,
		slackInfo,
		router,
		isTwitterDataLoading,
		isDiscordInfoLoading,
		isSlackInfoLoading,
		botCode,
		hasDiscordName,
		isWaitingForStateChangeDelay,
		shouldShowCreateNewCommunity,
		isCreatingNewCommunity,
		getDiscordInviteAndBotCode,
		discordInviteUrl,
		availableExtensionsData,
		twitterData,
		discordData,
		slackData,
		isSkippingTwitterAuth,
		isDiscordInputEnabled,
		hasOutputsBeenSelected,
		isSlackInputEnabled,
		onboardingStep
	])

	// Handle Transaction state changes
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
				setChosenAgreement(possibleAgreement)
				setTransactionIds([])
				setIsCreatingNewCommunity(false)
				chooseAgreementAndEnableExtension(possibleAgreement)
			} else {
				showErrorNotification(
					'Error creating community',
					'Please try again.'
				)
				setTransactionIds([])
				setIsCreatingNewCommunity(false)
			}
		}

		setActiveStep(newActiveStep)
	}, [
		transactionState,
		setActiveStep,
		transactions,
		router,
		wallet.accounts,
		chooseAgreementAndEnableExtension
	])

	const handleAuthTwitter = useCallback(async () => {
		if (!chosenAgreement?.id || !jwt) {
			return
		}

		Cookies.set(
			CookieKeys.ctOnboardingAgreementSlug,
			chosenAgreement?.slug ?? ''
		)

		const setCookie = Cookies.get(CookieKeys.ctOnboardingAgreementSlug)

		log.debug(`set redirect agreement slug to ${setCookie}`)

		router.push({
			pathname: `${
				process.env.NEXT_PUBLIC_API_URL
			}${MeemAPI.v1.AuthenticateWithTwitter.path()}`,
			query: {
				agreementId: chosenAgreement.id,
				jwt,
				returnUrl: window.location.toString()
			}
		})
	}, [router, chosenAgreement, jwt])

	const handleAuthSlack = useCallback(async () => {
		if (!chosenAgreement?.id || !jwt) {
			return
		}

		Cookies.set(
			CookieKeys.ctOnboardingAgreementSlug,
			chosenAgreement?.slug ?? ''
		)

		const setCookie = Cookies.get(CookieKeys.ctOnboardingAgreementSlug)

		log.debug(`set redirect agreement slug to ${setCookie}`)

		router.push({
			pathname: `${
				process.env.NEXT_PUBLIC_API_URL
			}${MeemAPI.v1.AuthenticateWithSlack.path()}`,
			query: {
				agreementId: chosenAgreement.id,
				jwt,
				returnUrl: window.location.toString()
			}
		})
	}, [router, chosenAgreement, jwt])

	const pageHeader = (
		<div className={meemTheme.pageHeaderExtension}>
			<Container>
				<div className={meemTheme.spacedRowCentered}>
					<Image
						className={meemTheme.copyIcon}
						src={`/${extensionIcon}`}
						fit={'contain'}
						width={360}
						height={80}
					/>
				</div>
			</Container>
		</div>
	)

	const stepOneAgreementName = (
		<Stepper.Step
			label="What is your community called?"
			description={
				onboardingStep === 0 ? (
					<>
						<Space h={8} />
						<TextInput
							radius="lg"
							size="md"
							disabled={
								chosenAgreement !== undefined ||
								isCreatingNewCommunity
							}
							value={newAgreementName ?? ''}
							onChange={(event: {
								target: {
									value: React.SetStateAction<string>
								}
							}) => {
								setNewAgreementName(event.target.value)
							}}
						/>
						<Space h={16} />

						<div className={meemTheme.row}>
							<Checkbox
								onChange={event =>
									setIsAgreementOnChain(
										event.currentTarget.checked
									)
								}
								checked={isAgreementOnChain}
							/>
							<Space w={8} />
							<Text className={meemTheme.tExtraSmall}>
								Create an on-chain community agreement to make
								your community portable.{' '}
								<span
									style={{
										textDecoration: 'underline',
										fontWeight: 'bold',
										color: colorBlue,
										cursor: 'pointer'
									}}
									onClick={() => {
										setIsMeemFaqModalOpen(true)
									}}
								>
									Learn more.
								</span>
							</Text>
						</div>

						{!isCreatingNewCommunity && (
							<>
								<Space h={16} />

								<Button
									className={meemTheme.buttonBlack}
									onClick={() => {
										createAgreement()
									}}
								>
									Next
								</Button>
							</>
						)}

						{isCreatingNewCommunity && (
							<>
								<Space h={24} />
								{isAgreementOnChain ? (
									<Text>{`Hang tight while we create an on-chain community agreement for you. This might take a minute or two, so please don’t close this window or navigate away.`}</Text>
								) : (
									<Text>{`Just a moment...`}</Text>
								)}

								<Space h={8} />
								<Progress
									value={activeStep * 25}
									animate
									radius="xl"
									size="xl"
								/>
							</>
						)}

						<Space h={16} />
					</>
				) : (
					<>
						<Space h={8} />

						<TextInput
							radius="lg"
							size="md"
							value={chosenAgreement?.name ?? ''}
							disabled
						/>
						<Space h={16} />
						{isAgreementOnChain && (
							<>
								<div className={meemTheme.row}>
									<Checkbox disabled checked={true} />
									<Space w={8} />
									<Text className={meemTheme.tExtraSmall}>
										Create an on-chain community agreement
										to make your community portable.{' '}
										<span
											style={{
												textDecoration: 'underline',
												fontWeight: 'bold',
												color: colorBlue,
												cursor: 'pointer'
											}}
											onClick={() => {
												setIsMeemFaqModalOpen(true)
											}}
										>
											Learn more.
										</span>
									</Text>
								</div>
								<Space h={16} />
							</>
						)}
					</>
				)
			}
		/>
	)

	const connectionGridItem = (
		name: string,
		icon: string,
		description: string,
		isEnabled: boolean,
		onClick: () => void
	) => (
		<>
			<div
				style={{ minWidth: 250 }}
				onClick={onClick}
				className={
					isEnabled
						? meemTheme.gridItemFlatSelected
						: meemTheme.gridItemFlat
				}
			>
				<div className={meemTheme.centeredRow}>
					<Image
						src={icon}
						width={24}
						height={24}
						style={{
							marginRight: 8
						}}
					/>
					<Text
						className={meemTheme.tSmallBold}
						style={{ color: isDarkTheme ? colorWhite : colorBlack }}
					>
						{name}
					</Text>
				</div>
				<Space h={16} />
				<Text className={meemTheme.tExtraSmallFaded}>
					{description}
				</Text>
			</div>
		</>
	)

	const stepTwoSelectPublishingAccount = (
		<Stepper.Step
			label="Please select the platform(s) where your community’s posts will be published."
			description={
				<>
					<Text
						className={meemTheme.tExtraSmall}
					>{`More publishing channels coming soon!`}</Text>
					{onboardingStep === 1 && (
						<>
							<Space h={16} />
							<div className={meemTheme.rowResponsive}>
								{connectionGridItem(
									'Twitter',
									'/connect-twitter.png',
									'You’ll need to log into Twitter to connect Community Tweets.',
									isTwitterOutputEnabled,
									() => {
										setIsTwitterOutputEnabled(
											!isTwitterOutputEnabled
										)
									}
								)}
								<Space w={16} h={16} />
								{connectionGridItem(
									'Add a Custom Webhook',
									'/connect-webhook.png',
									'You’ll be able to configure your webhook when setting up your publishing flows later.',
									isWebhookOutputEnabled,
									() => {
										setIsWebhookOutputEnabled(
											!isWebhookOutputEnabled
										)
									}
								)}
							</div>
							{isTwitterOutputEnabled && (
								<>
									<Space h={16} />
									<Button
										onClick={() => {
											handleAuthTwitter()

											analytics.track(
												'Community Tweets Output Connected',
												{
													communityId:
														chosenAgreement?.id,
													communityName:
														chosenAgreement?.name,
													outputType: 'Twitter'
												}
											)

											if (isWebhookOutputEnabled) {
												analytics.track(
													'Community Tweets Output Connected',
													{
														communityId:
															chosenAgreement?.id,
														communityName:
															chosenAgreement?.name,
														outputType: 'Webhook'
													}
												)
											}
										}}
										className={meemTheme.buttonBlack}
										leftIcon={
											<Image
												width={16}
												src={`/integration-twitter-white.png`}
											/>
										}
									>
										Connect Twitter
									</Button>
								</>
							)}
							{!isTwitterOutputEnabled &&
								isWebhookOutputEnabled && (
									<>
										<Space h={16} />
										<Button
											onClick={() => {
												setIsSkippingTwitterAuth(true)
												analytics.track(
													'Community Tweets Output Connected',
													{
														communityId:
															chosenAgreement?.id,
														communityName:
															chosenAgreement?.name,
														outputType: 'Webhook'
													}
												)
											}}
											className={meemTheme.buttonBlack}
										>
											Next
										</Button>
									</>
								)}
						</>
					)}
					{onboardingStep === 2 && (
						<>
							<Space h={16} />
							<div className={meemTheme.row}>
								<Button className={meemTheme.buttonWhite}>
									{isTwitterOutputEnabled
										? `Connected as ${twitterUsername}`
										: `Custom Webhook`}
								</Button>
							</div>
						</>
					)}

					<Space h={16} />
				</>
			}
		/>
	)

	const stepThreeSelectProposalAccounts = (
		<Stepper.Step
			label="Please select the platform(s) you’ll use to draft posts with Community Tweets."
			description={
				<>
					{
						<Text
							className={meemTheme.tExtraSmall}
						>{`More proposal channels coming soon!`}</Text>
					}
					{onboardingStep === 2 && (
						<>
							<Space h={16} />
							<div className={meemTheme.rowResponsive}>
								{connectionGridItem(
									'Discord',
									'/connect-discord.png',
									'You’ll need Discord permissions that allow you to add the Community Tweets bot to your server.',
									isDiscordInputEnabled,
									() => {
										setIsDiscordInputEnabled(
											!isDiscordInputEnabled
										)
									}
								)}
								<Space w={16} h={16} />
								{connectionGridItem(
									'Slack',
									'/connect-slack.png',
									'You’ll need Slack admin permissions that allow you to manage your workspace.',
									isSlackInputEnabled,
									() => {
										setIsSlackInputEnabled(
											!isSlackInputEnabled
										)
									}
								)}
							</div>
							{(isDiscordInputEnabled || isSlackInputEnabled) && (
								<>
									<Space h={16} />
									<Button
										onClick={() => {
											setHasOutputsBeenSelected(true)
										}}
										className={meemTheme.buttonBlack}
									>
										Next
									</Button>
								</>
							)}
						</>
					)}

					<Space h={16} />
				</>
			}
		/>
	)

	const stepFourInviteBot = (
		<Stepper.Step
			label={'Invite Community Tweets bot and activate'}
			description={
				<>
					<Text className={meemTheme.tExtraSmall}>
						{isDiscordInputEnabled || discordInfo
							? `Please invite the Community Tweets bot to manage your Discord server.`
							: onboardingStep < 4
							? 'Select Discord to use this functionality'
							: 'This step has been skipped'}
					</Text>

					{onboardingStep === 3 && (
						<>
							<Space h={8} />

							{(!discordInviteUrl || !botCode) && (
								<Loader variant="oval" color="cyan" />
							)}
							{discordInviteUrl && botCode && (
								<>
									<div className={meemTheme.row}>
										<Button
											leftIcon={
												<Image
													width={16}
													src={`/integration-discord-white.png`}
												/>
											}
											className={
												meemTheme.buttonDiscordBlue
											}
											onClick={() => {
												window.open(
													discordInviteUrl,
													'_blank'
												)

												analytics.track(
													'Community Tweets Input Connected',
													{
														communityId:
															chosenAgreement?.id,
														communityName:
															chosenAgreement?.name,
														inputType: 'Discord'
													}
												)
											}}
										>
											{`Invite Community Tweets Bot`}
										</Button>
									</div>
									<Space h={24} />

									<Text className={meemTheme.tExtraSmall}>
										Then type{' '}
										<span style={{ fontWeight: '600' }}>
											/activate
										</span>{' '}
										in any public channel of your Discord
										server and enter the code below:
									</Text>

									<Space h={8} />
									<Code
										style={{ cursor: 'pointer' }}
										onClick={() => {
											navigator.clipboard.writeText(
												`${botCode}`
											)
											showSuccessNotification(
												'Copied to clipboard',
												`The code was copied to your clipboard.`
											)
										}}
										block
									>{`${botCode}`}</Code>
									<Space h={16} />

									<div className={meemTheme.centeredRow}>
										<Loader
											variant="oval"
											color="cyan"
											size={24}
										/>
										<Space w={8} />
										<Text
											className={
												meemTheme.tExtraExtraSmall
											}
										>
											Waiting for activation...
										</Text>
									</div>

									<Space h={24} />
								</>
							)}
						</>
					)}
					{onboardingStep > 3 && discordInfo && (
						<>
							<>
								<Space h={16} />
								<div className={meemTheme.row}>
									<Button className={meemTheme.buttonWhite}>
										{`Bot added to ${discordInfo?.Discord?.name}`}
									</Button>
								</div>
								<Space h={16} />
							</>
						</>
					)}
				</>
			}
		/>
	)

	const stepFiveConnectSlack = (
		<Stepper.Step
			label={'Connect Slack'}
			description={
				<>
					<Text className={meemTheme.tExtraSmall}>
						{isSlackInputEnabled || slackInfo
							? `Please authorize Community Tweets to manage your Slack workspace.`
							: onboardingStep < 4
							? 'Select Slack to use this functionality'
							: 'This step has been skipped'}
					</Text>

					{onboardingStep === 4 && (
						<>
							<Space h={8} />
							<Button
								className={meemTheme.buttonBlack}
								onClick={() => {
									handleAuthSlack()
									analytics.track(
										'Community Tweets Input Connected',
										{
											communityId: chosenAgreement?.id,
											communityName:
												chosenAgreement?.name,
											inputType: 'Slack'
										}
									)
								}}
								leftIcon={<IconBrandSlack />}
							>
								{`Connect CommunityTweets`}
							</Button>
							<Space h={16} />
						</>
					)}
					{onboardingStep > 4 && slackInfo && (
						<>
							<Space h={8} />
							<div className={meemTheme.row}>
								<Button className={meemTheme.buttonWhite}>
									{`Connected to ${slackInfo?.Slack?.name}`}
								</Button>
							</div>
						</>
					)}
				</>
			}
		/>
	)

	const stepSixSetupComplete = (
		<Stepper.Step
			label={'Installation complete!'}
			description={
				<>
					{onboardingStep === 5 && (
						<>
							<Space h={8} />
							<div className={meemTheme.row}>
								<Button
									className={meemTheme.buttonDarkBlue}
									onClick={() => {
										router.push(
											`/${chosenAgreement?.slug}/e/communitytweets`
										)
									}}
								>
									{`Start using Community Tweets`}
								</Button>
							</div>
						</>
					)}
				</>
			}
		/>
	)

	return (
		<>
			{/* Page header */}
			{pageHeader}

			{/* Loading state */}
			{pageState === PageState.Loading && (
				<>
					<Space h={96} />
					<Center>
						<Loader variant="oval" color="cyan" />
					</Center>
				</>
			)}

			{pageState === PageState.Onboarding && (
				<>
					<Space h={32} />
					<Container>
						<div className={meemTheme.rowResponsive}>
							<div className={meemTheme.pageLeftWideColumn}>
								<Text className={meemTheme.tExtraSmallLabel}>
									SET UP COMMUNITY TWEETS
								</Text>
								<Space h={24} />
								<Stepper
									active={onboardingStep}
									breakpoint="sm"
									orientation="vertical"
								>
									{stepOneAgreementName}
									{stepTwoSelectPublishingAccount}
									{stepThreeSelectProposalAccounts}
									{stepFourInviteBot}
									{stepFiveConnectSlack}
									{stepSixSetupComplete}
								</Stepper>
							</div>
							<div
								className={meemTheme.pageRightNarrowColumnInner}
							>
								<div
									style={{
										padding: 24,
										borderRadius: 16,
										backgroundColor: isDarkTheme
											? colorBlack
											: colorAshLight
									}}
								>
									<Text className={meemTheme.tSmallBold}>
										How it works:
									</Text>
									<Space h={16} />

									<Text className={meemTheme.tExtraSmall}>
										1. Connect the bot and set up your
										publishing logic
									</Text>
									<Space h={16} />
									<Image src="/hiw1.png" />
									<Space h={24} />
									<Text className={meemTheme.tExtraSmall}>
										2. Draft tweets together on Discord or
										Slack
									</Text>
									<Space h={16} />
									<Image src="/hiw2.png" />
									<Space h={24} />

									<Text className={meemTheme.tExtraSmall}>
										3. Automatically post approved tweets
										from your community account
									</Text>
									<Space h={16} />
									<Image src="/hiw3.png" />
									<Space h={8} />
								</div>
							</div>
						</div>
					</Container>
				</>
			)}
			{pageState === PageState.PickCommunity && (
				<>
					<Space h={32} />
					<Center>
						<Text
							style={{ paddingLeft: 24, paddingRight: 24 }}
							className={meemTheme.tLargeBold}
						>
							{`Which community will use Community Tweets?`}
						</Text>
					</Center>
					<Space h={4} />
					<Center>
						<Text
							style={{ paddingLeft: 24, paddingRight: 24 }}
							className={meemTheme.tSmall}
						>
							{`Only showing communities where you are an admin`}
						</Text>
					</Center>
					<Space h={48} />

					<Center>
						<Grid className={meemTheme.gridResponsive800Width}>
							{myAgreements?.map(existingAgreement => (
								<Grid.Col
									xs={6}
									sm={6}
									md={6}
									lg={6}
									xl={6}
									key={existingAgreement.slug}
								>
									<div
										onClick={() => {
											chooseAgreementAndEnableExtension(
												existingAgreement
											)
										}}
									>
										<div
											key={existingAgreement.address}
											className={meemTheme.gridItem}
										>
											<div className={meemTheme.row}>
												{existingAgreement.image && (
													<>
														<Image
															className={
																meemTheme.imageAgreementLogo
															}
															style={{
																width: '56px',
																height: '56px'
															}}
															src={
																existingAgreement.image
															}
															radius={8}
															fit={'cover'}
														/>
														<Space w={24} />
													</>
												)}

												<div
													className={
														meemTheme.tEllipsis
													}
												>
													<Text
														style={{
															fontWeight: 500,
															fontSize: 18
														}}
													>
														{existingAgreement.name}
													</Text>

													<Space h={20} />
													<div
														className={
															meemTheme.row
														}
													>
														<Badge
															gradient={{
																from: isDarkTheme
																	? colorDarkerGrey
																	: '#DCDCDC',
																to: isDarkTheme
																	? colorDarkerGrey
																	: '#DCDCDC',
																deg: 35
															}}
															classNames={{
																inner: meemTheme.tBadgeText
															}}
															variant={'gradient'}
															leftSection={
																<>
																	<Group
																		style={{
																			color: isDarkTheme
																				? colorWhite
																				: colorBlack,
																			marginTop: 5
																		}}
																	/>
																</>
															}
														>
															{
																existingAgreement
																	.members
																	?.length
															}
														</Badge>
													</div>
												</div>
											</div>
											{(isEnablingExtension ||
												isExtensionsLoading) &&
												chosenAgreement &&
												chosenAgreement.slug ===
													existingAgreement.slug && (
													<>
														<Space h={8} />
														<Loader
															variant={'oval'}
															color={'cyan'}
														/>
													</>
												)}
										</div>
									</div>
								</Grid.Col>
							))}
							<Grid.Col
								xs={6}
								sm={6}
								md={6}
								lg={6}
								xl={6}
								key={'create-new-agreement'}
							>
								<div
									className={meemTheme.gridItemCenteredAsh}
									onClick={() => {
										setShouldShowCreateNewCommunity(true)
										setPageState(PageState.Onboarding)
									}}
								>
									<Space h={16} />
									<Center>
										<Text
											className={meemTheme.tMedium}
											style={{ color: 'black' }}
										>
											+ Launch a new community
										</Text>
									</Center>
									<Space h={16} />
								</div>
							</Grid.Col>
						</Grid>
					</Center>
				</>
			)}

			<Space h={60} />

			<MeemFAQModal
				isOpened={isMeemFaqModalOpen}
				onModalClosed={function (): void {
					setIsMeemFaqModalOpen(false)
				}}
			/>
		</>
	)
}
