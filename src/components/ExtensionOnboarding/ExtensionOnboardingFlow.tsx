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
	TextInput
} from '@mantine/core'
import { useWallet, useMeemApollo, useSDK } from '@meemproject/react'
import { Group } from 'iconoir-react'
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
	agreementSummaryFromDb
} from '../../model/agreement/agreements'
import { showErrorNotification } from '../../utils/notifications'
import { toTitleCase } from '../../utils/strings'
import { hostnameToChainId } from '../App'
import { CreateAgreementModal } from '../Create/CreateAgreementModal'
import {
	colorBlack,
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
		if (
			error?.graphQLErrors &&
			error.graphQLErrors.length > 0 &&
			error.graphQLErrors[0].extensions.code === 'invalid-jwt'
		) {
			router.push({
				pathname: '/authenticate',
				query: {
					return: `/onboarding?ext=${extensionSlug}`
				}
			})
		} else if (!loading && extensionSlug.length === 0) {
			router.push({
				pathname: '/'
			})
		}
	}, [error, extensionSlug, loading, router])

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
		agreementId: string
	) => {
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
						`There was an error enabling ${extensionName} on this community. Please let us know!`
					)
					return
				}

				await sdk.agreementExtension.createAgreementExtension({
					agreementId,
					extensionId,
					isInitialized: true
				})
				router.push({
					pathname: `/${agreementSlug}/e/${extensionSlug}/settings`
				})
			} catch (e) {
				if ((e as any).toString().includes('EXTENSION_ALREADY_ADDED')) {
					router.push({
						pathname: `/${agreementSlug}/e/${extensionSlug}/settings`
					})
				} else {
					log.debug(e)
					showErrorNotification(
						'Oops!',
						`There was an error enabling ${extensionName} on this community. Please let us know!`
					)
				}
			}
		} else {
			log.debug('no matching extensions to enable...')
			showErrorNotification(
				'Oops!',
				`There was an error enabling ${extensionName} on this community. Please let us know!`
			)
		}
	}

	const pageHeader = (
		<>
			<div className={meemTheme.pageHeaderExtension}>
				<Space h={8} />
				<Center>
					<Image
						className={meemTheme.copyIcon}
						src={`/${extensionIcon}`}
						width={220}
					/>
				</Center>

				<Space h={8} />
			</div>
		</>
	)

	const pageFooter = (
		<>
			<Space h={108} />
			<Center>
				<Center>
					<audio controls>
						<source src="/symphony.mp3" type="audio/mpeg" />
						Your browser does not support the audio element.
					</audio>
				</Center>
			</Center>
			<Space h={8} />
			<Center>
				<Text
					className={meemTheme.tExtraExtraSmall}
					style={{ maxWidth: 300 }}
				>
					Handel - Arrival of the Queen of Sheba, performed by the
					Advent Chamber Orchestra, November 2006 Roxanna Pavel
					Goldstein, Musical Director; Elias Goldstein, Orchestra
					Manager. License: CC-BY-SA
				</Text>
			</Center>
			<Space h={8} />
			<Center>
				<Link
					href={`https://commons.wikimedia.org/wiki/File:Handel_-_Arrival_of_the_Queen_of_Sheba.ogg`}
				>
					<Text
						className={meemTheme.tExtraSmallBold}
						style={{ cursor: 'pointer' }}
					>
						Source
					</Text>
				</Link>
			</Center>
		</>
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
			{!isEnablingExtension &&
				!extensionsLoading &&
				(agreements.length === 0 || shouldShowCreateNewCommunity) &&
				!loading && (
					<>
						{pageHeader}
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
											>{`Please choose a name for your community that will use ${extensionName}.`}</Text>
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
													<Text>{`This might take a moment. While you wait, settle in and listen below... 🎻`}</Text>
												</>
											)}

											<Space h={16} />
										</>
									}
								></Stepper.Step>
							</Stepper>
						</Container>
						{pageFooter}
						<Space h={48} />
					</>
				)}
			{!isEnablingExtension &&
				!extensionsLoading &&
				agreements.length > 0 &&
				!shouldShowCreateNewCommunity &&
				!loading && (
					<>
						{pageHeader}
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
													agreement.id ?? ''
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

						{extensionSlug === 'symphony' && pageFooter}

						<Space h={60} />
					</>
				)}
			<CreateAgreementModal
				isOpened={isCreatingNewCommunity}
				quietMode
				quietModeAgreementName={agreementName}
				onModalClosed={function (slug, id): void {
					if (id && slug) {
						enableExtensionAndRedirect(slug, id)
					} else {
						setIsCreatingNewCommunity(false)
					}
				}}
			/>
		</>
	)
}