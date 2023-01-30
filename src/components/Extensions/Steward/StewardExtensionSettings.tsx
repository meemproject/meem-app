import log from '@kengoldfarb/log'
import {
	Container,
	Text,
	Space,
	Center,
	Button,
	Divider,
	Switch,
	Modal
} from '@mantine/core'
import { useAuth, useSDK } from '@meemproject/react'
import { makeFetcher, makeRequest } from '@meemproject/sdk'
import { Emoji } from 'emoji-picker-react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import { extensionFromSlug } from '../../../model/agreement/agreements'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import { useMeemTheme } from '../../Styles/MeemTheme'
import { ExtensionBlankSlate, extensionIsReady } from '../ExtensionBlankSlate'
import { ExtensionPageHeader } from '../ExtensionPageHeader'
import { IOnSave, StewardRuleBuilder } from './StewardRuleBuilder'
import { API } from './stewardTypes.generated'

export const StewardExtensionSettings: React.FC = () => {
	// Default extension settings / properties - leave these alone if possible!
	const { classes: meemTheme } = useMeemTheme()
	const { sdk } = useSDK()
	const { jwt } = useAuth()
	const { agreement, isLoadingAgreement } = useAgreement()
	const agreementExtension = extensionFromSlug('steward', agreement)
	const router = useRouter()

	const [isSavingChanges, setIsSavingChanges] = useState(false)
	const [twitterUsername, setTwitterUsername] = useState()
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
	const [isDisablingExtension, setIsDisablingExtension] = useState(false)
	const [shouldDisplayDashboardWidget, setShouldDisplayDashboardWidget] =
		useState(false)
	const [isPrivateExtension, setIsPrivateExtension] = useState(false)
	const [hasFetchedData, setHasFetchedData] = useState(false)

	const [isRuleBuilderOpen, setIsRuleBuilderOpen] = useState(false)

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
		gun?.get(`~${process.env.NEXT_PUBLIC_STEWARD_PUBLIC_KEY}`)
			.get(`${agreement.id}/services/twitter`)
			.once(data => {
				if (data) {
					setTwitterUsername(data.username)
				}
			})
		gun.get(`~${process.env.NEXT_PUBLIC_STEWARD_PUBLIC_KEY}`)
			.get(`${agreement.id}/services/discord`)
			.once(data => {
				if (data) {
					// setDiscordInfo(data)
					setDiscordInfo(data)
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
											JSON.parse(rule.approverEmojis),
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
	}, [agreement, sdk, hasFetchedData])

	/*
	TODO
	Add your custom extension settings layout here.
	 */
	const customExtensionSettings = () => (
		<>
			<Space h={40} />
			<Text className={meemTheme.tExtraSmallLabel}>CONFIGURATION</Text>
			<Space h={16} />
			{twitterUsername && <Text>Authenticated as {twitterUsername}</Text>}
			<Space h={16} />
			<Button onClick={handleAuthTwitter}>
				{twitterUsername
					? 'Re-Authenticate Twitter'
					: 'Authenticate Twitter'}
			</Button>
			<Space h={16} />
			{discordInfo && <Text>Discord bot activated!</Text>}
			{botCode && <Text>Activate with /activateSteward {botCode}</Text>}
			<Space h={16} />
			<Button onClick={handleInviteBot}>Invite Bot To Discord</Button>
			<Space h={8} />
		</>
	)

	/*
	TODO
	Add your custom extension permissions layout here.
	 */
	const customExtensionPermissions = () => (
		<>
			{rolesData &&
				rules.map(rule => {
					const roleNames = rule.approverRoles.map(id => {
						const role = rolesData.roles.find(r => r.id === id)

						return role?.name ?? ''
					})
					return (
						<div key={`rule-${rule.ruleId}`}>
							<Text>{`Publish to Twitter when users with any of these roles: ${roleNames.join(
								', '
							)} react with ${rule.votes} of these emoji:`}</Text>
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
							<div
								style={{
									display: 'flex',
									flexDirection: 'row'
								}}
							>
								<Button
									onClick={() => {
										setSelectedRule(rule)
										setIsRuleBuilderOpen(true)
									}}
								>
									Edit
								</Button>
								<Space w="xs" />
								<Button
									onClick={() => {
										removeRule(rule.ruleId)
									}}
								>
									Remove
								</Button>
							</div>
							<Space h="md" />
							<Divider size="sm" />
							<Space h="md" />
						</div>
					)
				})}
			<Button onClick={() => setIsRuleBuilderOpen(true)}>Add Rule</Button>
			<Modal
				withCloseButton={false}
				padding={8}
				overlayBlur={8}
				size={296}
				opened={isRuleBuilderOpen}
				onClose={() => {
					setSelectedRule(undefined)
					setIsRuleBuilderOpen(false)
				}}
			>
				<StewardRuleBuilder
					channels={channelsData?.channels}
					selectedRule={selectedRule}
					roles={rolesData?.roles}
					onSave={handleRuleSave}
				/>
			</Modal>
		</>
	)

	/*
	TODO
	Use this function to save any specific settings you have created for this extension and make any calls you need to external APIs.
	 */
	const saveCustomChanges = async () => {
		await sdk.agreementExtension.updateAgreementExtension({
			agreementId: agreement?.id ?? '',
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

	const disableExtension = async () => {
		setIsDisablingExtension(true)
		setIsDisablingExtension(false)
	}

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
							<ExtensionPageHeader extensionSlug={'steward'} />

							<Container>
								<div>
									<div
										className={meemTheme.spacedRowCentered}
									>
										<Switch
											color={'green'}
											label={'Display dashboard widget'}
											checked={
												shouldDisplayDashboardWidget
											}
											onChange={value => {
												if (value) {
													setShouldDisplayDashboardWidget(
														value.currentTarget
															.checked
													)
												}
											}}
										/>
									</div>
									<Space h={16} />
									<Divider />
								</div>
								<div>
									<Space h={4} />
									<div
										className={meemTheme.spacedRowCentered}
									>
										<Switch
											color={'green'}
											label={
												'Hide widget if viewer is not a community member'
											}
											checked={isPrivateExtension}
											onChange={value => {
												if (value) {
													setIsPrivateExtension(
														value.currentTarget
															.checked
													)
												}
											}}
										/>
									</div>
									<Space h={16} />
									<Divider />
								</div>
								<Space h={16} />

								<Button
									disabled={isDisablingExtension}
									loading={isDisablingExtension}
									className={meemTheme.buttonAsh}
									onClick={disableExtension}
								>
									Disable extension
								</Button>

								{customExtensionSettings()}
								<Space h={40} />
								<Text className={meemTheme.tExtraSmallLabel}>
									PERMISSIONS
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
							</Container>
						</div>
					)}
				</>
			)}
		</div>
	)
}
