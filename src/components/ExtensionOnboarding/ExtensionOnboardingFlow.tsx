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
import { useWallet, useMeemApollo, useSDK } from '@meemproject/react'
import { MeemAPI } from '@meemproject/sdk'
import { Group, InfoEmpty } from 'iconoir-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import {
	GetExtensionsQuery,
	MyAgreementsSubscriptionSubscription
} from '../../../generated/graphql'
import { GET_EXTENSIONS, SUB_MY_AGREEMENTS } from '../../graphql/agreements'
import {
	Agreement,
	agreementSummaryFromDb,
	isJwtError
} from '../../model/agreement/agreements'
import { showErrorNotification } from '../../utils/notifications'
import { toTitleCase } from '../../utils/strings'
import { hostnameToChainId } from '../App'
import { CreateAgreementModal } from '../Create/CreateAgreementModal'
import { MeemFAQModal } from '../Header/MeemFAQModal'
import {
	colorBlack,
	colorBlue,
	colorDarkerGrey,
	colorWhite,
	useMeemTheme
} from '../Styles/MeemTheme'

interface IProps {
	extensionSlug: string
}

export const ExtensionOnboardingFlow: React.FC<IProps> = ({
	extensionSlug
}) => {
	const { classes: meemTheme } = useMeemTheme()
	const router = useRouter()
	const wallet = useWallet()
	const { anonClient, mutualMembersClient } = useMeemApollo()

	const { sdk } = useSDK()

	const { colorScheme } = useMantineColorScheme()
	const isDarkTheme = colorScheme === 'dark'

	const [isEnablingExtension, setIsEnablingExtension] = useState(false)
	const [shouldShowCreateNewCommunity, setShouldShowCreateNewCommunity] =
		useState(false)
	const [isCreatingNewCommunity, setIsCreatingNewCommunity] = useState(false)
	const [isMeemFaqModalOpen, setIsMeemFaqModalOpen] = useState(false)

	const [agreementName, setAgreementName] = useState('')
	const extensionName = toTitleCase(extensionSlug.replaceAll('-', ' '))
	const extensionIcon = `ext-${extensionSlug}.png`

	const {
		loading,
		data: agreementData,
		error
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

	useEffect(() => {
		if (isJwtError(error) || !wallet.isConnected) {
			router.push({
				pathname: '/authenticate',
				query: {
					return: encodeURIComponent(
						`/onboarding?ext=${extensionSlug}`
					)
				}
			})
		} else if (!loading && extensionSlug.length === 0) {
			router.push({
				pathname: '/'
			})
		}
	}, [error, extensionSlug, loading, router, wallet.isConnected])

	const agreements: Agreement[] = []

	agreementData?.Agreements.forEach(agr => {
		const possibleAgreement = agreementSummaryFromDb(
			agr,
			wallet.accounts[0]
		)

		if (possibleAgreement.name) {
			const alreadyAdded =
				agreements.filter(
					agreement => agreement.id === possibleAgreement.id
				).length > 0
			if (!alreadyAdded) {
				let extIsAlreadyEnabled = false
				possibleAgreement?.extensions?.forEach(ext => {
					if (ext.Extension?.slug === extensionSlug) {
						extIsAlreadyEnabled = true
					}
				})
				if (extIsAlreadyEnabled) {
					agreements.push(possibleAgreement)
				}
			}
		}
	})

	const enableExtensionAndRedirect = async (
		agreementSlug: string,
		agreementId: string,
		agreement?: Agreement
	) => {
		if (agreement) {
			// Agreement exists already. Let's see if it already has symphony enabled...
			let isExtensionEnabled = false
			agreement.extensions?.forEach(ext => {
				if (ext.Extension?.slug === extensionSlug) {
					isExtensionEnabled = true
				}
			})
			if (isExtensionEnabled) {
				log.debug(
					'extension already enabled for this community, redirecting'
				)
				router.push({
					pathname: `/${agreementSlug}/e/${extensionSlug}/settings`
				})
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
					agreementId,
					extensionId,
					isInitialized: true,
					widget: {
						visibility:
							MeemAPI.AgreementExtensionVisibility.TokenHolders
					}
				})
				router.push({
					pathname: `/${agreementSlug}/e/${extensionSlug}/settings`,
					query: { isOnboarding: true }
				})
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
	// const easterEgg = (
	// 	<>
	// 		{extensionSlug === 'symphony' && (
	// 			<>
	// 				<Space w={48} />
	// 				<div className={meemTheme.centeredRow}>
	// 					<audio controls>
	// 						<source src="/symphony.mp3" type="audio/mpeg" />
	// 						Your browser does not support the audio element.
	// 					</audio>

	// 					<Popover
	// 						width={200}
	// 						position="bottom"
	// 						withArrow
	// 						shadow="md"
	// 					>
	// 						<Popover.Target>
	// 							<Button className={meemTheme.buttonTransparent}>
	// 								<InfoEmpty color={'white'} />
	// 							</Button>
	// 						</Popover.Target>
	// 						<Popover.Dropdown>
	// 							<Text
	// 								className={meemTheme.tExtraExtraSmall}
	// 								style={{ maxWidth: 300 }}
	// 							>
	// 								Handel - Arrival of the Queen of Sheba,
	// 								performed by the Advent Chamber Orchestra,
	// 								November 2006 Roxanna Pavel Goldstein,
	// 								Musical Director; Elias Goldstein, Orchestra
	// 								Manager. License: CC-BY-SA
	// 							</Text>
	// 							<Space h={8} />
	// 							<Link
	// 								href={`https://commons.wikimedia.org/wiki/File:Handel_-_Arrival_of_the_Queen_of_Sheba.ogg`}
	// 							>
	// 								<Text
	// 									className={meemTheme.tExtraSmallBold}
	// 									style={{ cursor: 'pointer' }}
	// 								>
	// 									Source
	// 								</Text>
	// 							</Link>
	// 						</Popover.Dropdown>
	// 					</Popover>
	// 				</div>
	// 			</>
	// 		)}
	// 	</>
	// )

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

	return (
		<>
			{(loading || extensionsLoading || isEnablingExtension) && (
				<>
					<Space h={96} />
					<Center>
						<Loader variant="oval" color="cyan" />
					</Center>
				</>
			)}
			{!loading && !extensionsLoading && !isEnablingExtension && (
				<>{pageHeader}</>
			)}

			{!isEnablingExtension &&
				!extensionsLoading &&
				(agreements.length === 0 || shouldShowCreateNewCommunity) &&
				!loading && (
					<>
						<Space h={32} />
						<Container>
							<Text className={meemTheme.tExtraSmallLabel}>
								CONFIGURE EXTENSION
							</Text>
							<Space h={24} />
							<Stepper
								active={0}
								breakpoint="sm"
								orientation="vertical"
							>
								<Stepper.Step
									label="What is your community called?"
									description={
										<>
											<Text
												className={
													meemTheme.tExtraSmall
												}
											>
												We’ll create an on-chain
												community agreement so you can
												take your group’s roles and
												rules everywhere.{' '}
												<span
													style={{
														textDecoration:
															'underline',
														fontWeight: 'bold',
														color: colorBlue,
														cursor: 'pointer'
													}}
													onClick={() => {
														setIsMeemFaqModalOpen(
															true
														)
													}}
												>
													Learn more.
												</span>
											</Text>
											<Space h={16} />
											<TextInput
												radius="lg"
												size="md"
												value={agreementName ?? ''}
												onChange={(event: {
													target: {
														value: React.SetStateAction<string>
													}
												}) => {
													setAgreementName(
														event.target.value
													)
												}}
											/>
											<Space h={24} />
											<Button
												loading={isCreatingNewCommunity}
												disabled={
													isCreatingNewCommunity
												}
												className={
													meemTheme.buttonBlack
												}
												onClick={() => {
													setIsCreatingNewCommunity(
														true
													)
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
							</Stepper>
						</Container>
					</>
				)}
			{!isEnablingExtension &&
				!extensionsLoading &&
				agreements.length > 0 &&
				!shouldShowCreateNewCommunity &&
				!loading && (
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
								{agreements.map(agreement => (
									<Grid.Col
										xs={6}
										sm={6}
										md={6}
										lg={6}
										xl={6}
										key={agreement.address}
									>
										<div
											onClick={() => {
												enableExtensionAndRedirect(
													agreement.slug ?? '',
													agreement.id ?? '',
													agreement
												)
											}}
										>
											<div
												key={agreement.address}
												className={meemTheme.gridItem}
											>
												<div className={meemTheme.row}>
													{agreement.image && (
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
																	agreement.image
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
															{agreement.name}
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
																variant={
																	'gradient'
																}
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
																	agreement
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
										className={
											meemTheme.gridItemCenteredAsh
										}
										onClick={() => {
											setShouldShowCreateNewCommunity(
												true
											)
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
				quietModeAgreementName={agreementName}
				onModalClosed={function (slug, id): void {
					if (id && slug) {
						enableExtensionAndRedirect(slug, id)
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
