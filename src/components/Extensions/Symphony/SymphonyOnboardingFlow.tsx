/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
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
	Popover
} from '@mantine/core'
import {
	useWallet,
	useMeemApollo,
	useSDK,
	LoginState
} from '@meemproject/react'
import { MeemAPI } from '@meemproject/sdk'
import { Group, InfoEmpty } from 'iconoir-react'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import {
	GetExtensionsQuery,
	MyAgreementsSubscriptionSubscription
} from '../../../../generated/graphql'
import { GET_EXTENSIONS, SUB_MY_AGREEMENTS } from '../../../graphql/agreements'
import {
	Agreement,
	agreementSummaryFromDb,
	isJwtError
} from '../../../model/agreement/agreements'
import { CookieKeys } from '../../../utils/cookies'
import { showErrorNotification } from '../../../utils/notifications'
import { toTitleCase } from '../../../utils/strings'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import { hostnameToChainId } from '../../App'
import { CreateAgreementModal } from '../../Create/CreateAgreementModal'
import { MeemFAQModal } from '../../Header/MeemFAQModal'
import {
	colorBlack,
	colorBlue,
	colorDarkerGrey,
	colorWhite,
	useMeemTheme
} from '../../Styles/MeemTheme'

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
	const { colorScheme } = useMantineColorScheme()
	const isDarkTheme = colorScheme === 'dark'

	// Agreement / network
	const { anonClient, mutualMembersClient } = useMeemApollo()
	const [newAgreementName, setNewAgreementName] = useState('')
	const myAgreements: Agreement[] = []
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
	const [isCreatingNewCommunity, setIsCreatingNewCommunity] = useState(false)
	const [isMeemFaqModalOpen, setIsMeemFaqModalOpen] = useState(false)

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

	// Parse my existing agreements
	myAgreementsData?.Agreements.forEach(agr => {
		const possibleAgreement = agreementSummaryFromDb(
			agr,
			wallet.accounts[0]
		)

		if (possibleAgreement.name) {
			const alreadyAdded =
				myAgreements.filter(
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
					myAgreements.push(possibleAgreement)
				}
			}
		}
	})

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

	// Handle page state changes
	useEffect(() => {
		// Set page state
		if (isLoadingMyAgreements || isEnablingExtension || extensionsLoading) {
			setPageState(PageState.Loading)
			log.debug(`set page state = loading`)
		} else if (myAgreementsError) {
			setPageState(PageState.Error)
			log.debug('set page state = error')
		} else if (
			!isLoadingMyAgreements &&
			!myAgreementsError &&
			myAgreements.length === 0
		) {
			setPageState(PageState.Onboarding)
			log.debug('set page state = onboarding')
		} else if (
			!isLoadingMyAgreements &&
			!myAgreementsError &&
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
			if (!chosenAgreement) {
				setOnboardingStep(0)
			}
		}
	}, [
		isEnablingExtension,
		isLoadingMyAgreements,
		myAgreements.length,
		myAgreementsError,
		extensionsLoading,
		pageState,
		chosenAgreement
	])

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
			} catch (e) {
				log.debug(e)
				showErrorNotification(
					'Oops!',
					`There was an error enabling ${extensionName} on this community. Contact us using the top-right link on this page.`
				)
			}
		} else {
			log.debug('no matching extensions to enable...')
			showErrorNotification(
				'Oops!',
				`There was an error enabling ${extensionName} on this community. Contact us using the top-right link on this page.`
			)
		}
	}

	const pageHeader = (
		<div className={meemTheme.pageHeaderExtension}>
			<Container>
				<div className={meemTheme.spacedRowCentered}>
					<Image
						className={meemTheme.copyIcon}
						src={`/${extensionIcon}`}
						width={220}
					/>
				</div>
			</Container>
		</div>
	)

	const stepOneAgreementName = (
		<>
			<Stepper.Step
				label="What is your community called?"
				description={
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
						<Button
							loading={isCreatingNewCommunity}
							disabled={isCreatingNewCommunity}
							className={meemTheme.buttonBlack}
							onClick={() => {
								setIsCreatingNewCommunity(true)
							}}
						>
							Next
						</Button>
						{isCreatingNewCommunity && (
							<>
								<Space h={16} />
								<Text>{`Hang tight while we create an on-chain community agreement for you. This might take a minute, so please don’t close this window or navigate away.`}</Text>
							</>
						)}

						<Space h={16} />
					</>
				}
			></Stepper.Step>
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
							{myAgreements.map(existingAgreement => (
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

			<CreateAgreementModal
				isOpened={isCreatingNewCommunity}
				quietMode={true}
				quietModeAgreementName={newAgreementName}
				onModalClosed={function (agreement): void {
					if (agreement) {
						chooseAgreementAndEnableExtension(agreement)
					} else {
						setIsCreatingNewCommunity(false)
					}
				}}
			/>

			<MeemFAQModal
				isOpened={isMeemFaqModalOpen}
				onModalClosed={function (): void {
					setIsMeemFaqModalOpen(false)
				}}
			/>
		</>
	)
}
