/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import { ApolloClient, useQuery, useSubscription } from '@apollo/client'
import type { NormalizedCacheObject } from '@apollo/client'
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
	Popover,
	Code,
	Progress
} from '@mantine/core'
import {
	useWallet,
	useMeemApollo,
	useSDK,
	LoginState,
	useAuth
} from '@meemproject/react'
import { createApolloClient, makeRequest, MeemAPI } from '@meemproject/sdk'
import { Group, InfoEmpty } from 'iconoir-react'
import Cookies from 'js-cookie'
import Link from 'next/link'
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
import {
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
import { toTitleCase } from '../../../utils/strings'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import { hostnameToChainId } from '../../App'
import { CreateAgreementModal } from '../../Create/CreateAgreementModal'
import { MeemFAQModal } from '../../Header/MeemFAQModal'
import {
	colorBlack,
	colorBlue,
	colorDarkerGrey,
	colorGreen,
	colorWhite,
	useMeemTheme
} from '../../Styles/MeemTheme'
import { SUB_DISCORD, SUB_SLACK, SUB_TWITTER } from './symphony.gql'
import { API } from './symphonyTypes.generated'

enum PageState {
	Loading,
	Error,
	PickCommunity,
	Onboarding,
	SetupComplete
}

export const SymphonyOnboardingFlow: React.FC = () => {
	// General imports
	const { classes: meemTheme } = useMeemTheme()
	const router = useRouter()
	const wallet = useWallet()
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
	const extensionSlug = 'symphony'
	const extensionName = toTitleCase('symphony'.replaceAll('-', ' '))
	const extensionIcon = `ext-symphony.png`

	// Page state
	const [pageState, setPageState] = useState<PageState>(PageState.Loading)
	const [onboardingStep, setOnboardingStep] = useState(0)
	const [isEnablingExtension, setIsEnablingExtension] = useState(false)
	const [shouldShowCreateNewCommunity, setShouldShowCreateNewCommunity] =
		useState(false)
	const [isMeemFaqModalOpen, setIsMeemFaqModalOpen] = useState(false)
	const [isWaitingForStateChangeDelay, setIsWaitingForStateChangeDelay] =
		useState(false)

	// Agreement creation
	const [isCreatingNewCommunity, setIsCreatingNewCommunity] = useState(false)
	const [activeStep, setActiveStep] = useState(1)

	// Bot code data
	const [botCode, setBotCode] = useState<string | undefined>()
	const [shouldActivateBot, setShouldActivateBot] = useState(false)

	// Subscriptions
	const {
		loading: isLoadingMyAgreements,
		data: myAgreementsData,
		error: myAgreementsError
	} = useSubscription<MyAgreementsSubscriptionSubscription>(
		SUB_MY_AGREEMENTS,
		{
			variables: {
				chainId:
					wallet.chainId ??
					hostnameToChainId(
						global.window ? global.window.location.host : ''
					),
				walletAddress:
					wallet.accounts &&
					wallet.accounts[0] &&
					wallet.accounts[0].toLowerCase()
			},
			client: mutualMembersClient
		}
	)

	const { loading: extensionsLoading, data: availableExtensionsData } =
		useQuery<GetExtensionsQuery>(GET_EXTENSIONS, {
			client: anonClient
		})

	const [symphonyClient, setSymphonyClient] =
		useState<ApolloClient<NormalizedCacheObject>>()

	useEffect(() => {
		const c = createApolloClient({
			httpUrl: `https://${process.env.NEXT_PUBLIC_SYMPHONY_GQL_HOST}`,
			wsUri: `wss://${process.env.NEXT_PUBLIC_SYMPHONY_GQL_HOST}`
		})

		setSymphonyClient(c)
	}, [])

	const { data: twitterData, loading: twitterDataLoading } =
		useSubscription<SubTwitterSubscription>(SUB_TWITTER, {
			variables: {
				agreementId: chosenAgreement?.id
			},
			skip: !symphonyClient || !chosenAgreement?.id,
			client: symphonyClient
		})

	const { data: discordData, loading: discordInfoLoading } =
		useSubscription<SubDiscordSubscription>(SUB_DISCORD, {
			variables: {
				agreementId: chosenAgreement?.id
			},
			skip: !symphonyClient || !chosenAgreement?.id,
			client: symphonyClient
		})

	const { data: slackData, loading: slackInfoLoading } =
		useSubscription<SubSlackSubscription>(SUB_SLACK, {
			variables: {
				agreementId: chosenAgreement?.id
			},
			skip:
				process.env.NEXT_PUBLIC_SYMPHONY_ENABLE_SLACK !== 'true' ||
				!symphonyClient ||
				!chosenAgreement?.id,
			client: symphonyClient
		})

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
			client: anonClient,
			skip: !isCreatingNewCommunity || transactionIds.length === 0
		})

	useEffect(() => {
		if (!myAgreements && myAgreementsData) {
			// Parse my existing agreements
			const agrs: Agreement[] = []
			myAgreementsData?.Agreements.forEach(agr => {
				const possibleAgreement = agreementSummaryFromDb(
					agr,
					wallet.accounts[0]
				)

				if (possibleAgreement.name) {
					const alreadyAdded =
						agrs.filter(
							existingAgreement =>
								existingAgreement.id === possibleAgreement.id
						).length > 0
					if (!alreadyAdded) {
						let extIsAlreadyEnabled = false
						possibleAgreement?.extensions?.forEach(ext => {
							if (ext.Extension?.slug === extensionSlug) {
								extIsAlreadyEnabled = true
							}
						})
						if (extIsAlreadyEnabled) {
							agrs.push(possibleAgreement)
						}
					}
				}
			})
			setMyAgreements(agrs)
		}
	}, [myAgreements, myAgreementsData, wallet.accounts])

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
		let agreementNameExists = false
		if (anonClient) {
			const agreementCollisions = await anonClient.query({
				query: GET_AGREEMENT_EXISTS,
				variables: {
					slug: newAgreementName
						.toString()
						.replaceAll(' ', '-')
						.toLowerCase(),
					chainId: hostnameToChainId(
						global.window ? global.window.location.host : ''
					)
				}
			})

			if (agreementCollisions.data.Agreements.length > 0) {
				agreementNameExists = true
			}
		}

		if (agreementNameExists) {
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
			setIsCreatingNewCommunity(false)
		}
	}

	// Authentication check
	useEffect(() => {
		if (
			isJwtError(myAgreementsError) ||
			wallet.loginState === LoginState.NotLoggedIn
		) {
			Cookies.set(CookieKeys.authRedirectUrl, `/onboard/symphony`)
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

	// Intregrations data
	const twitterUsername =
		twitterData?.Twitters[0] && twitterData?.Twitters[0].username
	const discordInfo = discordData?.Discords[0]
	const discordHasName =
		discordInfo && discordData?.Discords[0]?.name !== undefined
	const slackInfo = slackData?.Slacks[0]

	const isConnectionEstablished =
		!!twitterData?.Twitters[0] &&
		!!twitterData?.Twitters[0].username &&
		!!discordData?.Discords[0] &&
		typeof discordData?.Discords[0].name === 'string'

	// Handle page state changes
	useEffect(() => {
		// Prevent page state flickering when several variables update simultaneously

		const twitterAuthRedirectAgreementSlug = Cookies.get(
			CookieKeys.symphonyOnboardingAgreementSlug
		)

		// Set page state
		if (
			isLoadingMyAgreements ||
			isCreatingNewCommunity ||
			extensionsLoading ||
			twitterDataLoading ||
			discordInfoLoading ||
			slackInfoLoading ||
			(!chosenAgreement && twitterAuthRedirectAgreementSlug)
		) {
			setPageState(PageState.Loading)
			log.debug(`set page state = loading`)
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
		} else if (chosenAgreement && isConnectionEstablished) {
			setPageState(PageState.SetupComplete)
			log.debug(`set page state = setup complete`)
		} else if (chosenAgreement && !isConnectionEstablished) {
			setPageState(PageState.Onboarding)
			log.debug('set page state = onboarding')
		}

		// Set onboarding step
		if (pageState === PageState.Onboarding) {
			if (!chosenAgreement || isEnablingExtension) {
				setOnboardingStep(0)
			} else if (chosenAgreement) {
				if (!twitterUsername && !discordInfo) {
					setOnboardingStep(1)
				} else if (twitterUsername && !discordInfo) {
					if (!shouldActivateBot) {
						setOnboardingStep(2)
					} else {
						setOnboardingStep(3)
					}
				} else if (twitterUsername && discordInfo) {
					if (botCode) {
						setOnboardingStep(3)
					} else {
						setOnboardingStep(2)
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
					setChosenAgreement(agr)
					Cookies.remove(CookieKeys.symphonyOnboardingAgreementSlug)
				}
			})
		}
	}, [
		isEnablingExtension,
		isLoadingMyAgreements,
		myAgreements?.length,
		myAgreementsError,
		extensionsLoading,
		pageState,
		chosenAgreement,
		twitterUsername,
		discordInfo,
		shouldActivateBot,
		myAgreements,
		slackInfo,
		router,
		twitterDataLoading,
		discordInfoLoading,
		slackInfoLoading,
		botCode,
		discordHasName,
		isWaitingForStateChangeDelay,
		isConnectionEstablished,
		shouldShowCreateNewCommunity,
		isCreatingNewCommunity
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
	}, [transactionState, setActiveStep, transactions, router, wallet.accounts])

	const chooseAgreementAndEnableExtension = async (chosen?: Agreement) => {
		if (chosen) {
			// Agreement exists already. Let's see if it already has symphony enabled...
			let isExtensionEnabled = false
			chosen.extensions?.forEach(ext => {
				if (ext.Extension?.slug === extensionSlug) {
					isExtensionEnabled = true
				}
			})
			if (isExtensionEnabled) {
				log.debug('extension already enabled for this community')
				setChosenAgreement(chosen)
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

				await sdk.agreementExtension.createAgreementExtension({
					agreementId: chosen?.id ?? '',
					extensionId,
					isInitialized: true,
					widget: {
						visibility:
							MeemAPI.AgreementExtensionVisibility.TokenHolders
					}
				})
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
	}

	const handleInviteBot = useCallback(async () => {
		if (!chosenAgreement?.id || !jwt) {
			return
		}
		const { code, inviteUrl } =
			await makeRequest<API.v1.InviteDiscordBot.IDefinition>(
				`${
					process.env.NEXT_PUBLIC_SYMPHONY_API_URL
				}${API.v1.InviteDiscordBot.path()}`,
				{ query: { agreementId: chosenAgreement?.id, jwt } }
			)

		setBotCode(code)

		window.open(inviteUrl, '_blank')
	}, [chosenAgreement, jwt])

	const handleAuthTwitter = useCallback(async () => {
		if (!chosenAgreement?.id || !jwt) {
			return
		}

		Cookies.set(
			CookieKeys.symphonyOnboardingAgreementSlug,
			chosenAgreement?.slug ?? ''
		)

		const setCookie = Cookies.get(
			CookieKeys.symphonyOnboardingAgreementSlug
		)

		log.debug(`set redirect agreement slug to ${setCookie}`)

		router.push({
			pathname: `${
				process.env.NEXT_PUBLIC_SYMPHONY_API_URL
			}${API.v1.AuthenticateWithTwitter.path()}`,
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

		router.push({
			pathname: `${
				process.env.NEXT_PUBLIC_SYMPHONY_API_URL
			}${API.v1.AuthenticateWithSlack.path()}`,
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
						width={180}
						height={40}
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
						<Text className={meemTheme.tExtraSmall}>
							We’ll create an on-chain community agreement so you
							can take your group’s roles and rules everywhere.{' '}
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
						<Space h={16} />
						<TextInput
							radius="lg"
							size="md"
							value={newAgreementName ?? ''}
							onChange={(event: {
								target: {
									value: React.SetStateAction<string>
								}
							}) => {
								setNewAgreementName(event.target.value)
							}}
						/>
						<Space h={24} />
						{!isCreatingNewCommunity && (
							<Button
								className={meemTheme.buttonBlack}
								onClick={() => {
									createAgreement()
								}}
							>
								Next
							</Button>
						)}

						{isCreatingNewCommunity && (
							<>
								<Text>{`Hang tight while we create an on-chain community agreement for you. This might take a minute or two, so please don’t close this window or navigate away.`}</Text>
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
						<TextInput
							radius="lg"
							size="md"
							value={chosenAgreement?.name ?? ''}
							disabled
						/>
						<Space h={16} />
					</>
				)
			}
		/>
	)

	const stepTwoConnectPublishingAccount = (
		<Stepper.Step
			label="Connect publishing account"
			description={
				<>
					<Text
						className={meemTheme.tExtraSmall}
					>{`Please connect the account where your community’s posts will be published.`}</Text>
					{onboardingStep === 1 && (
						<>
							<Space h={16} />
							<div className={meemTheme.row}>
								<Button
									onClick={() => {
										handleAuthTwitter()
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
								{/* <Space w={8} />
							<Button
								className={
									meemTheme.buttonYellowSolidBordered
								}
								onClick={() => {}}
							>
								Add More Accounts
							</Button> */}
							</div>
						</>
					)}
					{onboardingStep === 2 && (
						<>
							<Space h={16} />
							<div className={meemTheme.row}>
								<Button
									onClick={() => {
										handleAuthTwitter()
									}}
									className={meemTheme.buttonWhite}
								>
									{`Connected as ${twitterUsername}`}
								</Button>
							</div>
						</>
					)}
					<Space h={16} />
				</>
			}
		/>
	)

	const stepThreeInviteBot = (
		<Stepper.Step
			label="Invite Symphony bot"
			description={
				<>
					<Text className={meemTheme.tExtraSmall}>
						{onboardingStep === 3
							? `You've invited the Symphony bot to your Discord server.`
							: `Please invite the Symphony bot to manage your Discord server.`}
					</Text>
					{onboardingStep === 2 && (
						<>
							<Space h={16} />
							<div className={meemTheme.row}>
								<Button
									leftIcon={
										<Image
											width={16}
											src={`/integration-discord-white.png`}
										/>
									}
									className={meemTheme.buttonDiscordBlue}
									onClick={() => {
										handleInviteBot()
									}}
								>
									{`Invite Symphony Bot`}
								</Button>
							</div>
							<Space h={16} />

							{botCode && (
								<>
									<div className={meemTheme.row}>
										<Button
											className={meemTheme.buttonBlack}
											onClick={() => {
												setShouldActivateBot(true)
											}}
										>
											{`Next`}
										</Button>
									</div>
									<Space h={16} />
								</>
							)}
						</>
					)}
				</>
			}
		/>
	)

	const stepFourActivateDiscordBot = (
		<Stepper.Step
			label="Activate Symphony"
			description={
				<>
					<Text className={meemTheme.tExtraSmall}>
						Type{' '}
						<span style={{ fontWeight: '600' }}>/activate</span> in
						any public channel of your Discord server, then enter
						the code below:
					</Text>
					{onboardingStep === 3 && (
						<>
							<Space h={16} />
							<Code
								style={{ cursor: 'pointer' }}
								onClick={() => {
									navigator.clipboard.writeText(`${botCode}`)
									showSuccessNotification(
										'Copied to clipboard',
										`The code was copied to your clipboard.`
									)
								}}
								block
							>{`${botCode}`}</Code>
							<Space h={16} />

							<div className={meemTheme.centeredRow}>
								<Loader variant="oval" color="cyan" size={24} />
								<Space w={8} />
								<Text className={meemTheme.tExtraExtraSmall}>
									Waiting for activation...
								</Text>
							</div>
						</>
					)}
				</>
			}
		></Stepper.Step>
	)

	const setupCompleteState = (
		<>
			<Space h={48} />
			<Center>
				<Text className={meemTheme.tLargeBold} color={colorGreen}>
					Installation Complete!
				</Text>
			</Center>
			<Space h={24} />
			<Center>
				<Text>
					Add your first proposal rule to start publishing with
					Symphony.
				</Text>
			</Center>
			<Space h={36} />

			<Center>
				<Button
					className={meemTheme.buttonBlack}
					onClick={() => {
						router.push(
							`/${chosenAgreement?.slug}/e/symphony/settings?isOnboarding=true`
						)
					}}
				>
					Manage Symphony
				</Button>
			</Center>
		</>
	)

	return (
		<>
			{/* Loading state */}
			{pageState === PageState.Loading && (
				<>
					<Space h={96} />
					<Center>
						<Loader variant="oval" color="cyan" />
					</Center>
				</>
			)}

			{/* Page header */}
			{pageState !== PageState.Loading && <>{pageHeader}</>}

			{pageState === PageState.SetupComplete && <>{setupCompleteState}</>}

			{pageState === PageState.Onboarding && (
				<>
					<Space h={32} />
					<Container>
						<Text className={meemTheme.tExtraSmallLabel}>
							CONFIGURE EXTENSION
						</Text>
						<Space h={24} />
						<Stepper
							active={onboardingStep}
							breakpoint="sm"
							orientation="vertical"
						>
							{stepOneAgreementName}
							{stepTwoConnectPublishingAccount}
							{stepThreeInviteBot}
							{stepFourActivateDiscordBot}
						</Stepper>
					</Container>
				</>
			)}
			{pageState === PageState.PickCommunity && (
				<>
					<Space h={32} />
					<Center>
						<Text className={meemTheme.tLargeBold}>
							{`Which community will use ${extensionName}?`}
						</Text>
					</Center>
					<Space h={48} />

					<Center>
						<Grid style={{ maxWidth: 800 }}>
							{myAgreements?.map(existingAgreement => (
								<Grid.Col
									xs={6}
									sm={6}
									md={6}
									lg={6}
									xl={6}
									key={existingAgreement.address}
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
												extensionsLoading) &&
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