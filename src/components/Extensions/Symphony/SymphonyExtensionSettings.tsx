import { ApolloClient, useSubscription } from '@apollo/client'
import type { NormalizedCacheObject } from '@apollo/client'
import log from '@kengoldfarb/log'
import {
	Container,
	Text,
	Space,
	Center,
	Button,
	Image,
	Modal,
	Loader,
	useMantineColorScheme
} from '@mantine/core'
import { useAuth, useSDK } from '@meemproject/react'
import {
	createApolloClient,
	makeFetcher,
	makeRequest,
	MeemAPI
} from '@meemproject/sdk'
import { Emoji } from 'emoji-picker-react'
import { DeleteCircle } from 'iconoir-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import useSWR from 'swr'
import {
	SubDiscordSubscription,
	SubRulesSubscription,
	SubSlackSubscription,
	SubTwitterSubscription
} from '../../../../generated/graphql'
import { extensionFromSlug } from '../../../model/agreement/agreements'
import {
	showErrorNotification,
	showSuccessNotification
} from '../../../utils/notifications'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import {
	colorBlue,
	colorDarkBlue,
	colorWhite,
	useMeemTheme
} from '../../Styles/MeemTheme'
import { ExtensionBlankSlate, extensionIsReady } from '../ExtensionBlankSlate'
import { SUB_DISCORD, SUB_RULES, SUB_SLACK, SUB_TWITTER } from './symphony.gql'
import { IOnSave, SymphonyRuleBuilder } from './SymphonyRuleBuilder'
import { API } from './symphonyTypes.generated'

export enum SelectedConnection {
	Discord = 'discord',
	Twitter = 'twitter',
	Slack = 'slack'
}

export const SymphonyExtensionSettings: React.FC = () => {
	// Default extension settings / properties - leave these alone if possible!
	const { classes: meemTheme } = useMeemTheme()
	const { sdk } = useSDK()
	const { jwt } = useAuth()
	const { agreement, isLoadingAgreement } = useAgreement()
	const agreementExtension = extensionFromSlug('symphony', agreement)
	const router = useRouter()
	const isInOnboardingMode = router.query.isOnboarding === 'true'

	const [selectedRule, setSelectedRule] =
		useState<SubRulesSubscription['Rules'][0]>()
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selectedConnection, setSelectedConnection] =
		useState<SelectedConnection>()

	const [isRuleBuilderOpen, setIsRuleBuilderOpen] = useState(false)

	const { colorScheme } = useMantineColorScheme()
	const isDarkTheme = colorScheme === 'dark'

	const [botCode, setBotCode] = useState<string>('')
	const handleInviteBot = useCallback(async () => {
		if (!agreement?.id || !jwt) {
			return
		}
		const { code, inviteUrl } =
			await makeRequest<API.v1.InviteDiscordBot.IDefinition>(
				`${
					process.env.NEXT_PUBLIC_SYMPHONY_API_URL
				}${API.v1.InviteDiscordBot.path()}`,
				{ query: { agreementId: agreement?.id, jwt } }
			)

		setBotCode(code)

		window.open(inviteUrl, '_blank')
	}, [agreement, jwt])

	const [symphonyClient, setSymphonyClient] =
		useState<ApolloClient<NormalizedCacheObject>>()

	useEffect(() => {
		const c = createApolloClient({
			httpUrl: `https://${process.env.NEXT_PUBLIC_SYMPHONY_GQL_HOST}`,
			wsUri: `wss://${process.env.NEXT_PUBLIC_SYMPHONY_GQL_HOST}`
		})

		setSymphonyClient(c)
	}, [])

	const { data: twitterData } = useSubscription<SubTwitterSubscription>(
		SUB_TWITTER,
		{
			variables: {
				agreementId: agreement?.id
			},
			skip: !symphonyClient || !agreement?.id,
			client: symphonyClient
		}
	)

	const { data: discordData } = useSubscription<SubDiscordSubscription>(
		SUB_DISCORD,
		{
			variables: {
				agreementId: agreement?.id
			},
			skip: !symphonyClient || !agreement?.id,
			client: symphonyClient
		}
	)

	const { data: slackData } = useSubscription<SubSlackSubscription>(
		SUB_SLACK,
		{
			variables: {
				agreementId: agreement?.id
			},
			skip:
				process.env.NEXT_PUBLIC_SYMPHONY_ENABLE_SLACK !== 'true' ||
				!symphonyClient ||
				!agreement?.id,
			client: symphonyClient
		}
	)

	const { data: rulesData } = useSubscription<SubRulesSubscription>(
		SUB_RULES,
		{
			variables: {
				agreementId: agreement?.id
			},
			skip: !symphonyClient || !agreement?.id,
			client: symphonyClient
		}
	)

	// console.log({ twitterData, discordData, slackData, rulesData })

	const { data: channelsData } =
		useSWR<API.v1.GetDiscordChannels.IResponseBody>(
			agreement?.id && jwt
				? `${
						process.env.NEXT_PUBLIC_SYMPHONY_API_URL
				  }${API.v1.GetDiscordChannels.path()}`
				: null,
			url => {
				return makeFetcher<
					API.v1.GetDiscordChannels.IQueryParams,
					API.v1.GetDiscordChannels.IRequestBody,
					API.v1.GetDiscordChannels.IResponseBody
				>({
					method: API.v1.GetDiscordChannels.method
				})(url, {
					jwt: jwt as string,
					agreementId: agreement?.id as string
				})
			},
			{
				shouldRetryOnError: false
			}
		)

	const { data: rolesData } = useSWR<API.v1.GetDiscordRoles.IResponseBody>(
		agreement?.id && jwt
			? `${
					process.env.NEXT_PUBLIC_SYMPHONY_API_URL
			  }${API.v1.GetDiscordRoles.path()}`
			: null,
		url => {
			return makeFetcher<
				API.v1.GetDiscordRoles.IQueryParams,
				API.v1.GetDiscordRoles.IRequestBody,
				API.v1.GetDiscordRoles.IResponseBody
			>({
				method: API.v1.GetDiscordRoles.method
			})(url, {
				jwt: jwt as string,
				agreementId: agreement?.id as string
			})
		},
		{
			shouldRetryOnError: false
		}
	)

	const handleAuthTwitter = useCallback(async () => {
		if (!agreement?.id || !jwt) {
			return
		}

		router.push({
			pathname: `${
				process.env.NEXT_PUBLIC_SYMPHONY_API_URL
			}${API.v1.AuthenticateWithTwitter.path()}`,
			query: {
				agreementId: agreement.id,
				jwt,
				returnUrl: window.location.toString()
			}
		})
	}, [router, agreement, jwt])

	const handleAuthSlack = useCallback(async () => {
		if (!agreement?.id || !jwt) {
			return
		}

		router.push({
			pathname: `${
				process.env.NEXT_PUBLIC_SYMPHONY_API_URL
			}${API.v1.AuthenticateWithSlack.path()}`,
			query: {
				agreementId: agreement.id,
				jwt,
				returnUrl: window.location.toString()
			}
		})
	}, [router, agreement, jwt])

	const handleReauthenticate = useCallback(async () => {
		switch (selectedConnection) {
			case SelectedConnection.Discord:
				handleInviteBot()
				break

			case SelectedConnection.Twitter:
				handleAuthTwitter()
				break

			case SelectedConnection.Slack:
				handleAuthSlack()
				break

			default:
				log.warn(
					`No matching selectedConnection for ${selectedConnection}`
				)
				break
		}
	}, [
		selectedConnection,
		handleAuthTwitter,
		handleInviteBot,
		handleAuthSlack
	])

	const handleDisconnect = useCallback(async () => {
		if (!jwt || !agreement?.id) {
			return
		}
		try {
			switch (selectedConnection) {
				case SelectedConnection.Discord:
					await makeRequest<API.v1.DisconnectDiscord.IDefinition>(
						`${
							process.env.NEXT_PUBLIC_SYMPHONY_API_URL
						}${API.v1.DisconnectDiscord.path()}`,
						{
							method: API.v1.DisconnectDiscord.method,
							body: {
								jwt,
								agreementId: agreement?.id
							}
						}
					)
					showSuccessNotification(
						'Discord Disconnected',
						'Discord has been disconnected'
					)
					setIsModalOpen(false)
					break

				case SelectedConnection.Twitter:
					await makeRequest<API.v1.DisconnectTwitter.IDefinition>(
						`${
							process.env.NEXT_PUBLIC_SYMPHONY_API_URL
						}${API.v1.DisconnectTwitter.path()}`,
						{
							method: API.v1.DisconnectTwitter.method,
							body: {
								jwt,
								agreementId: agreement?.id
							}
						}
					)
					showSuccessNotification(
						'Twitter Disconnected',
						'Twitter has been disconnected'
					)
					setIsModalOpen(false)
					break

				default:
					log.warn('Invalid case for handleDisconnect')
					break
			}
		} catch (e) {
			showErrorNotification('Something went wrong', 'Please try again ')
		}
	}, [selectedConnection, agreement, jwt])

	const saveCustomChanges = async () => {
		await sdk.agreementExtension.updateAgreementExtension({
			agreementId: agreement?.id ?? '',
			isSetupComplete: true,
			agreementExtensionId: agreementExtension?.id,
			widget: {
				isEnabled: true,
				visibility: MeemAPI.AgreementExtensionVisibility.TokenHolders
			}
		})
	}

	const handleRuleSave = async (values: IOnSave) => {
		if (!agreement?.id || !jwt) {
			return
		}

		await makeRequest<API.v1.SaveRules.IDefinition>(
			`${
				process.env.NEXT_PUBLIC_SYMPHONY_API_URL
			}${API.v1.SaveRules.path()}`,
			{
				method: API.v1.SaveRules.method,
				body: {
					jwt,
					agreementId: agreement.id,
					rules: [
						{
							...values,
							action: API.PublishAction.Tweet,
							isEnabled: true,
							ruleId: selectedRule?.id
						}
					]
				}
			}
		)

		// If extension is not yet marked as 'setup complete', set as complete
		if (!agreementExtension?.isSetupComplete) {
			saveCustomChanges()
		}

		setSelectedRule(undefined)
		setIsRuleBuilderOpen(false)
	}

	const removeRule = async (ruleId: string) => {
		if (!agreement?.id || !jwt) {
			log.warn('Invalid agreement or jwt')
			return
		}

		await makeRequest<API.v1.RemoveRules.IDefinition>(
			`${
				process.env.NEXT_PUBLIC_SYMPHONY_API_URL
			}${API.v1.RemoveRules.path()}`,
			{
				method: API.v1.RemoveRules.method,
				body: {
					jwt,
					agreementId: agreement.id,
					ruleIds: [ruleId]
				}
			}
		)
	}

	const twitterUsername =
		twitterData?.Twitters[0] && twitterData?.Twitters[0].username
	const rules = rulesData?.Rules
	const discordInfo = discordData?.Discords[0]
	const slackInfo = slackData?.Slacks[0]
	const hasFetchedData =
		!!twitterData &&
		!!rulesData &&
		!!discordData &&
		(process.env.NEXT_PUBLIC_SYMPHONY_ENABLE_SLACK !== 'true' ||
			!!slackData)

	const customExtensionSettings = () => (
		<>
			<Space h={24} />

			<div className={meemTheme.row}>
				<div>
					<Text className={meemTheme.tExtraSmallLabel}>
						TWITTER ACCOUNT
					</Text>
					<Space h={16} />
					<div className={meemTheme.centeredRow}>
						<Image
							width={24}
							src={
								isDarkTheme
									? `/integration-twitter-white.png`
									: `/integration-twitter.png`
							}
						/>
						<Space w={16} />
						<div>
							<Text
								className={meemTheme.tSmall}
							>{`Connected as ${twitterUsername}`}</Text>
							<Space h={4} />
							<Text
								onClick={() => {
									setSelectedConnection(
										SelectedConnection.Twitter
									)
									setIsModalOpen(true)
								}}
								className={meemTheme.tSmallBold}
								style={{
									cursor: 'pointer',
									color: isDarkTheme
										? colorBlue
										: colorDarkBlue
								}}
							>
								Manage Connection
							</Text>
						</div>
					</div>
				</div>
				<Space w={64} />
				<div>
					<Text className={meemTheme.tExtraSmallLabel}>
						DISCORD SERVER
					</Text>
					<Space h={16} />
					<div className={meemTheme.centeredRow}>
						{discordInfo?.icon && (
							<>
								<Image width={24} src={discordInfo?.icon} />
								<Space w={16} />
							</>
						)}

						<div>
							<Text
								className={meemTheme.tSmall}
							>{`Connected as ${discordInfo?.name}`}</Text>
							<Space h={4} />
							<Text
								onClick={() => {
									setSelectedConnection(
										SelectedConnection.Discord
									)
									setIsModalOpen(true)
								}}
								className={meemTheme.tSmallBold}
								style={{
									cursor: 'pointer',
									color: isDarkTheme
										? colorBlue
										: colorDarkBlue
								}}
							>
								Manage Connection
							</Text>
						</div>
					</div>
				</div>
				{process.env.NEXT_PUBLIC_SYMPHONY_ENABLE_SLACK === 'true' && (
					<>
						<Space w={64} />
						<div>
							<Text className={meemTheme.tExtraSmallLabel}>
								SLACK SERVER
							</Text>
							<Space h={16} />
							<div className={meemTheme.centeredRow}>
								{slackInfo?.icon && (
									<>
										<Image
											width={24}
											src={slackInfo?.icon}
										/>
										<Space w={16} />
									</>
								)}

								<div>
									<Text
										className={meemTheme.tSmall}
									>{`Connected as ${slackInfo?.name}`}</Text>
									<Space h={4} />
									<Text
										onClick={() => {
											setSelectedConnection(
												SelectedConnection.Slack
											)
											setIsModalOpen(true)
										}}
										className={meemTheme.tSmallBold}
										style={{
											cursor: 'pointer',
											color: isDarkTheme
												? colorBlue
												: colorDarkBlue
										}}
									>
										Manage Connection
									</Text>
								</div>
							</div>
						</div>
					</>
				)}
			</div>
			<Modal
				opened={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title={'Manage Connection'}
			>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-around'
					}}
				>
					<Button onClick={handleReauthenticate}>
						Reauthenticate
					</Button>
					<Button onClick={handleDisconnect}>Disconnect</Button>
				</div>
			</Modal>
		</>
	)

	const customExtensionPermissions = () => (
		<>
			{rolesData &&
				rules &&
				rules.map(rule => {
					const roleNames = rule.definition.approverRoles.map(
						(id: string) => {
							const role = rolesData.roles.find(r => r.id === id)

							return role?.name ?? ''
						}
					)
					return (
						<div
							key={`rule-${rule.definition.ruleId}`}
							className={meemTheme.gridItem}
							style={{ marginBottom: 16 }}
						>
							<div className={meemTheme.row}>
								<div>
									<Text
										className={meemTheme.tSmallBold}
									>{`Publish to Twitter when users with any of these roles: ${roleNames.join(
										', '
									)} react with ${
										rule.definition.votes
									} of these emoji:`}</Text>
									<Space h="xs" />
									<div
										style={{
											display: 'flex',
											flexDirection: 'row'
										}}
									>
										{rule.definition.approverEmojis.map(
											(emojiCode: string) => (
												<div
													key={`emoji-${rule.id}-${emojiCode}`}
													style={{
														marginRight: '8px'
													}}
												>
													<Emoji
														unified={emojiCode}
													/>
												</div>
											)
										)}
									</div>
									<Space h="xs" />
								</div>
								<Space w={24} />
								<div>
									<Button
										className={meemTheme.buttonWhite}
										onClick={() => {
											setSelectedRule(rule)
											setIsRuleBuilderOpen(true)
										}}
									>
										Edit
									</Button>
									<Space h={8} />
									<Button
										className={meemTheme.buttonRedBordered}
										onClick={() => {
											removeRule(rule.id)
										}}
									>
										Remove
									</Button>
								</div>
							</div>
						</div>
					)
				})}
			{rolesData && <Space h={16} />}
			<Button
				className={meemTheme.buttonWhite}
				onClick={() => setIsRuleBuilderOpen(true)}
			>
				+ Add Rule
			</Button>
			<Modal
				title={
					<Text className={meemTheme.tMediumBold}>Add New Rule</Text>
				}
				padding={24}
				overlayBlur={8}
				radius={16}
				size={'lg'}
				opened={isRuleBuilderOpen}
				onClose={() => {
					setSelectedRule(undefined)
					setIsRuleBuilderOpen(false)
				}}
			>
				<SymphonyRuleBuilder
					channels={channelsData?.channels}
					selectedRule={selectedRule}
					roles={rolesData?.roles}
					onSave={handleRuleSave}
				/>
			</Modal>
		</>
	)

	const mainState = (
		<>
			{customExtensionSettings()}
			<Space h={40} />
			<Text className={meemTheme.tExtraSmallLabel}>PERMISSIONS</Text>
			<Space h={4} />
			<Text className={meemTheme.tExtraSmall}>
				{`Add logic to dictate how new posts will be proposed and published, as well as which community members will manage each part of the process. `}
			</Text>
			<Space h={16} />

			{customExtensionPermissions()}
			<Space h={48} />
		</>
	)

	const pageHeader = (
		<>
			<div
				className={meemTheme.pageHeaderExtension}
				style={{ position: 'relative' }}
			>
				<Space h={8} />
				<Center>
					<Image
						className={meemTheme.copyIcon}
						src={`/ext-symphony.png`}
						fit={'contain'}
						width={180}
						height={40}
					/>
				</Center>

				<Space h={8} />
				<div
					style={{
						position: 'absolute',
						top: 50,
						right: 48
					}}
				>
					<Link href={`/${agreement?.slug}`} legacyBehavior>
						<DeleteCircle
							className={meemTheme.clickable}
							width={24}
							height={24}
							color={colorWhite}
						/>
					</Link>
				</div>
			</div>
		</>
	)

	const pageHeaderOnboarding = (
		<>
			<div className={meemTheme.widgetMeemFlat}>
				<Space h={24} />

				<Center>
					<Text className={meemTheme.tLargeBold}>
						Publishing is just one of the many things communities
						can do together on meem.
					</Text>
				</Center>
				<Space h={24} />
				<Center>
					<Text className={meemTheme.tMedium}>
						Tap below to customize your community page and browse
						our other extensions.
					</Text>
				</Center>
				<Space h={36} />
				<Center>
					<Link href={`/${agreement?.slug}`} legacyBehavior>
						<Button className={meemTheme.buttonBlack}>
							Explore meem
						</Button>
					</Link>
				</Center>
				<Space h={24} />
			</div>
			<Space h={32} />
			<Container>
				<div className={meemTheme.centeredRow}>
					<Image
						height={24}
						width={24}
						src={'/integration-symphony.png'}
					/>
					<Space w={16} />
					<Text className={meemTheme.tLargeBold}>
						Symphony Settings
					</Text>
				</div>
			</Container>
			<Space h={32} />
		</>
	)

	return (
		<div>
			<ExtensionBlankSlate extensionSlug={'symphony'} />
			{extensionIsReady(
				isLoadingAgreement,
				agreement,
				agreementExtension
			) && (
				<>
					{!agreement?.isCurrentUserAgreementAdmin && (
						<Container>
							<Space h={120} />
							<Center>
								<Text>
									Sorry, you do not have permission to view
									this page. Contact the community owner for
									help.
								</Text>
							</Center>
						</Container>
					)}

					{agreement?.isCurrentUserAgreementAdmin && (
						<div>
							{!hasFetchedData && (
								<Container>
									<Space h={120} />
									<Center>
										<Loader color="cyan" variant="oval" />
									</Center>
								</Container>
							)}
							{hasFetchedData && (
								<>
									{/* buckle up...  */}
									{isInOnboardingMode && (
										<>{pageHeaderOnboarding}</>
									)}
									{!isInOnboardingMode && <>{pageHeader}</>}

									<Container>
										<>{mainState}</>
									</Container>
								</>
							)}
						</div>
					)}
				</>
			)}
		</div>
	)
}
