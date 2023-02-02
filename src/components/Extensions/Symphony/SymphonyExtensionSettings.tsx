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
	Stepper,
	useMantineColorScheme
} from '@mantine/core'
import { useAuth, useSDK } from '@meemproject/react'
import { makeFetcher, makeRequest } from '@meemproject/sdk'
import { Emoji } from 'emoji-picker-react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import { extensionFromSlug } from '../../../model/agreement/agreements'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import { colorBlue, colorDarkBlue, useMeemTheme } from '../../Styles/MeemTheme'
import { ExtensionBlankSlate, extensionIsReady } from '../ExtensionBlankSlate'
import { ExtensionPageHeader } from '../ExtensionPageHeader'
import { IOnSave, SymphonyRuleBuilder } from './SymphonyRuleBuilder'
import { API } from './symphonyTypes.generated'

export const SymphonyExtensionSettings: React.FC = () => {
	// Default extension settings / properties - leave these alone if possible!
	const { classes: meemTheme } = useMeemTheme()
	const { sdk } = useSDK()
	const { jwt } = useAuth()
	const { agreement, isLoadingAgreement } = useAgreement()
	const agreementExtension = extensionFromSlug('steward', agreement)
	const router = useRouter()

	const [isSavingChanges, setIsSavingChanges] = useState(false)
	const [activeStep, setActiveStep] = useState(0)
	const [twitterUsername, setTwitterUsername] = useState('')
	const [rules, setRules] = useState<API.IRule[]>([])
	const [selectedRule, setSelectedRule] = useState<API.IRule>()
	const [discordInfo, setDiscordInfo] = useState<
		| {
				icon: string | null
				name: string
		  }
		| undefined
	>()
	const [botCode, setBotCode] = useState<string | undefined>()
	const [hasFetchedData, setHasFetchedData] = useState(false)

	const [isRuleBuilderOpen, setIsRuleBuilderOpen] = useState(false)

	const { colorScheme } = useMantineColorScheme()
	const isDarkTheme = colorScheme === 'dark'

	const handleInviteBot = async () => {
		if (!agreement?.id || !jwt) {
			return
		}
		const { code, inviteUrl } =
			await makeRequest<API.v1.InviteDiscordBot.IDefinition>(
				`${
					process.env.NEXT_PUBLIC_STEWARD_API_URL
				}${API.v1.InviteDiscordBot.path()}`,
				{ query: { agreementId: agreement?.id, jwt } }
			)

		setBotCode(code)

		window.open(inviteUrl, '_blank')
	}

	const { data: channelsData } =
		useSWR<API.v1.GetDiscordChannels.IResponseBody>(
			agreement?.id && jwt
				? `${
						process.env.NEXT_PUBLIC_STEWARD_API_URL
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
			}
		)

	const { data: rolesData } = useSWR<API.v1.GetDiscordRoles.IResponseBody>(
		agreement?.id && jwt
			? `${
					process.env.NEXT_PUBLIC_STEWARD_API_URL
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
		}
	)

	// const { data: roles, mutateRoles } =
	// 	useSWR<MeemAPI.v1.GetDiscordRoles.IResponseBody>(
	// 		tokenId
	// 			? MeemAPI.v1.GetMeem.path({
	// 					tokenId
	// 			  })
	// 			: null,
	// 		makeFetcher({ method: MeemAPI.v1.GetMeem.method })
	// 	)

	const handleAuthTwitter = async () => {
		if (!agreement?.id || !jwt) {
			return
		}

		router.push({
			pathname: `${
				process.env.NEXT_PUBLIC_STEWARD_API_URL
			}${API.v1.GetTwitterAuthUrl.path()}`,
			query: {
				agreementId: agreement.id,
				jwt,
				returnUrl: window.location.href
			}
		})
	}

	/*
	TODO
	Use this function to save any specific settings you have created for this extension and make any calls you need to external APIs.
	 */
	const saveCustomChanges = async () => {
		await sdk.agreementExtension.updateAgreementExtension({
			agreementId: agreement?.id ?? '',
			isSetupComplete: true,
			agreementExtensionId: agreementExtension?.id
			// ---------------------------------------------
			// Include externalLink if you'd like to add or update
			// an external link to your community home page.
			// Setting this to null will remove an existing link.
			// ---------------------------------------------
			// externalLink: {
			// 	url: '',
			// 	label: ''
			// },
			// ---------------------------------------------
			// Store/update non-sensitive metadata for configuring your extension.
			// We also recommend versioning your extension so you can gracefully
			// handle any future updates to metadata schema
			// ---------------------------------------------
			// metadata: {
			// 	version: '1.0.0',
			// 	customProperty: 'boop'
			// }
		})
	}

	/*
	Boilerplate area - please don't edit the below code!
	===============================================================
	 */

	const saveChanges = async () => {
		setIsSavingChanges(true)
		await saveCustomChanges()
		setIsSavingChanges(false)
	}

	const handleRuleSave = async (values: IOnSave) => {
		if (!agreement?.id || !jwt) {
			return
		}

		await makeRequest<API.v1.SaveRules.IDefinition>(
			`${
				process.env.NEXT_PUBLIC_STEWARD_API_URL
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
							ruleId: selectedRule?.ruleId
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
				process.env.NEXT_PUBLIC_STEWARD_API_URL
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

	useEffect(() => {
		const gun = sdk.storage.getGunInstance()
		if (!agreement?.id || hasFetchedData || !gun) {
			return
		}
		log.debug(`getting gun data...`)
		gun?.get(`~${process.env.NEXT_PUBLIC_STEWARD_PUBLIC_KEY}`)
			.get(`${agreement.id}/services/twitter`)
			.once(data => {
				if (data) {
					setTwitterUsername(data.username)
					log.debug(`twitter username = ${data.username}`)
				}
			})
		gun.get(`~${process.env.NEXT_PUBLIC_STEWARD_PUBLIC_KEY}`)
			.get(`${agreement.id}/services/discord`)
			.once(data => {
				if (data) {
					setDiscordInfo(data)
					log.debug(`discord data found`)
				}
			})

		gun?.get(`~${process.env.NEXT_PUBLIC_STEWARD_PUBLIC_KEY}`)
			.get(`${agreement.id}/rules`)

			// @ts-ignore
			.open(data => {
				if (data) {
					const filteredRules: API.IRule[] = []
					if (typeof data === 'object') {
						Object.keys(data).forEach(id => {
							const rule: API.ISavedRule = data[id]

							if (
								rule &&
								rule.action === API.PublishAction.Tweet &&
								rule.isEnabled &&
								rule.ruleId &&
								rule.votes
							) {
								try {
									filteredRules.push({
										...rule,
										proposerRoles:
											rule.proposerRoles &&
											JSON.parse(rule.proposerRoles),
										proposerEmojis:
											rule.proposerEmojis &&
											JSON.parse(rule.proposerEmojis),
										approverRoles:
											rule.approverRoles &&
											JSON.parse(rule.approverRoles),
										vetoerEmojis:
											rule.approverEmojis &&
											JSON.parse(rule.vetoerEmojis),
										vetoerRoles:
											rule.approverRoles &&
											JSON.parse(rule.approverRoles),
										approverEmojis:
											rule.approverEmojis &&
											JSON.parse(rule.approverEmojis),
										proposalChannels:
											rule.proposalChannels &&
											JSON.parse(rule.proposalChannels)
									})
								} catch (e) {
									log.warn(e)
								}
							}
						})
					}

					setRules(filteredRules)
				}
			})

		setHasFetchedData(true)

		if (twitterUsername.length > 0 && activeStep === 0) {
			setActiveStep(1)
		}
	}, [
		agreement,
		sdk,
		hasFetchedData,
		discordInfo,
		twitterUsername,
		activeStep
	])

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
									handleAuthTwitter()
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
						<Image width={24} src={discordInfo?.icon} />
						<Space w={16} />
						<div>
							<Text
								className={meemTheme.tSmall}
							>{`Connected as ${discordInfo?.name}`}</Text>
							<Space h={4} />
							<Text
								onClick={() => {
									handleInviteBot()
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
							{botCode && (
								<>
									<Space h={4} />
									<Text>
										Activate with /activateSymphony{' '}
										{botCode}
									</Text>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	)

	const customExtensionPermissions = () => (
		<>
			{rolesData &&
				rules.map(rule => {
					const roleNames = rule.approverRoles.map(id => {
						const role = rolesData.roles.find(r => r.id === id)

						return role?.name ?? ''
					})
					return (
						<div
							key={`rule-${rule.ruleId}`}
							className={meemTheme.gridItem}
						>
							<div className={meemTheme.row}>
								<div>
									<Text
										className={meemTheme.tSmallBold}
									>{`Publish to Twitter when users with any of these roles: ${roleNames.join(
										', '
									)} react with ${
										rule.votes
									} of these emoji:`}</Text>
									<Space h="xs" />
									<div
										style={{
											display: 'flex',
											flexDirection: 'row'
										}}
									>
										{rule.approverEmojis.map(emojiCode => (
											<div
												key={`emoji-${rule.ruleId}-${emojiCode}`}
												style={{
													marginRight: '8px'
												}}
											>
												<Emoji unified={emojiCode} />
											</div>
										))}
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
											removeRule(rule.ruleId)
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

	const onboardingState = (
		<>
			<Space h={24} />
			<Text className={meemTheme.tExtraSmallLabel}>CONFIGURATION</Text>
			<Space h={24} />
			<Stepper active={activeStep} breakpoint="sm" orientation="vertical">
				<Stepper.Step
					label="Connect publishing account"
					description={
						<>
							<Text
								className={meemTheme.tExtraSmall}
							>{`Please connect the account where your community’s posts will be published.`}</Text>
							{activeStep === 0 && (
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
										<Space w={8} />
										<Button
											className={
												meemTheme.buttonYellowSolidBordered
											}
										>
											Add More Accounts
										</Button>
									</div>
								</>
							)}
							{activeStep === 1 && (
								<>
									<Space h={16} />
									<div className={meemTheme.row}>
										<Button
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
				></Stepper.Step>
				<Stepper.Step
					label="Invite Symphony bot"
					description={
						<>
							<Text
								className={meemTheme.tExtraSmall}
							>{`Please invite the Symphony bot to manage your Discord server.`}</Text>
							{activeStep === 1 && (
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
											className={meemTheme.buttonBlack}
										>
											{`Invite Symphony Bot`}
										</Button>
									</div>
								</>
							)}
						</>
					}
				></Stepper.Step>
			</Stepper>
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

			<Button
				disabled={isSavingChanges}
				loading={isSavingChanges}
				onClick={() => {
					saveChanges()
				}}
				className={meemTheme.buttonBlack}
			>
				Save Changes
			</Button>
		</>
	)

	return (
		<div>
			<ExtensionBlankSlate extensionSlug={'steward'} />
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
								<>
									<Space h={40} />
									<Loader variant={'oval'} color={'blue'} />
								</>
							)}
							{hasFetchedData && (
								<>
									<ExtensionPageHeader
										extensionSlug={'steward'}
									/>

									<Container>
										{twitterUsername.length > 0 &&
											discordInfo && <>{mainState}</>}

										{(twitterUsername.length === 0 ||
											!discordInfo) && (
											<>{onboardingState}</>
										)}
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
