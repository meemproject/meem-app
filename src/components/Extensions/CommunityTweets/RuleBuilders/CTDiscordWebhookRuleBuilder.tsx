import { useSubscription } from '@apollo/client'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { Text, Space, Button, Modal, Center, Loader } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useAuth, useMeemApollo } from '@meemproject/react'
import { makeFetcher, MeemAPI } from '@meemproject/sdk'
import { uniqBy } from 'lodash'
import React, { useCallback, useEffect, useState } from 'react'
import useSWR from 'swr'
import { SubDiscordSubscription } from '../../../../../generated/graphql'
import { useAgreement } from '../../../AgreementHome/AgreementProvider'
import { useMeemTheme } from '../../../Styles/MeemTheme'
import { SUB_DISCORD } from '../communityTweetsGql'
import { CTConnection, CTRule } from '../Model/communityTweets'
import { CTRuleBuilderConnections } from './CTRuleBuilderConnections'
import { CTDiscordInputRBEditors } from './RuleBuilderSections/DiscordInput/CTDiscordInputRBEditors'
import { CTDiscordInputRBProposals } from './RuleBuilderSections/DiscordInput/CTDiscordInputRBProposals'
import { CTRuleBuilderApproverEmojis } from './RuleBuilderSections/Generic/CTRuleBuilderApproverEmojis'
import { CTRuleBuilderVotesCount } from './RuleBuilderSections/Generic/CTRuleBuilderVotesCount'

export interface IProps {
	rule?: CTRule
	input?: CTConnection
	webhookUrl?: string
	privateKey?: string
	isOpened: boolean
	onModalClosed: () => void
	onSave: (values: IOnSave) => void
}

export enum EmojiSelectType {
	Proposer = 'proposer',
	Approver = 'approver',
	Editor = 'editor'
}

export interface IFormValues
	extends Omit<
		MeemAPI.IRule,
		| 'proposerEmojis'
		| 'approverEmojis'
		| 'editorEmojis'
		| 'vetoerEmojis'
		| 'action'
		| 'ruleId'
		| 'isEnabled'
	> {}

export interface IOnSave extends IFormValues {
	proposerEmojis: MeemAPI.IEmoji[]
	approverEmojis: MeemAPI.IEmoji[]
	editorEmojis?: MeemAPI.IEmoji[]
	vetoerEmojis: MeemAPI.IEmoji[]
}

export const CTDiscordWebhookRulesBuilder: React.FC<IProps> = ({
	rule,
	input,
	webhookUrl,
	privateKey,
	isOpened,
	onModalClosed,
	onSave
}) => {
	// Default extension settings / properties - leave these alone if possible!
	const { classes: meemTheme } = useMeemTheme()

	const { agreement } = useAgreement()
	const { jwt } = useAuth()

	// GraphQL Subscriptions
	const { mutualMembersClient } = useMeemApollo()

	const { data: discordData, loading: loadingDiscordData } =
		useSubscription<SubDiscordSubscription>(SUB_DISCORD, {
			variables: {
				agreementId: agreement?.id,
				discordId: rule?.input?.id ?? input?.id ?? ''
			},
			skip: !mutualMembersClient || !agreement?.id || !isOpened,
			client: mutualMembersClient
		})

	const { data: channelsData, isLoading: loadingChannelsData } =
		useSWR<MeemAPI.v1.GetDiscordChannels.IResponseBody>(
			agreement?.id && jwt
				? `${
						process.env.NEXT_PUBLIC_API_URL
				  }${MeemAPI.v1.GetDiscordChannels.path()}`
				: null,
			url => {
				return makeFetcher<
					MeemAPI.v1.GetDiscordChannels.IQueryParams,
					MeemAPI.v1.GetDiscordChannels.IRequestBody,
					MeemAPI.v1.GetDiscordChannels.IResponseBody
				>({
					method: MeemAPI.v1.GetDiscordChannels.method
				})(url, {
					agreementDiscordId: rule?.input?.id ?? input?.id ?? ''
				})
			},
			{
				shouldRetryOnError: false
			}
		)

	const { data: emojisData } =
		useSWR<MeemAPI.v1.GetDiscordEmojis.IResponseBody>(
			agreement?.id && jwt && (rule?.input?.id ?? input?.id)
				? `${
						process.env.NEXT_PUBLIC_API_URL
				  }${MeemAPI.v1.GetDiscordEmojis.path()}`
				: null,
			url => {
				return makeFetcher<
					MeemAPI.v1.GetDiscordEmojis.IQueryParams,
					MeemAPI.v1.GetDiscordEmojis.IRequestBody,
					MeemAPI.v1.GetDiscordEmojis.IResponseBody
				>({
					method: MeemAPI.v1.GetDiscordEmojis.method
				})(url, {
					agreementDiscordId: rule?.input?.id ?? input?.id ?? ''
				})
			},
			{
				shouldRetryOnError: false
			}
		)

	const { data: rolesData, isLoading: loadingRolesData } =
		useSWR<MeemAPI.v1.GetDiscordRoles.IResponseBody>(
			agreement?.id && jwt
				? `${
						process.env.NEXT_PUBLIC_API_URL
				  }${MeemAPI.v1.GetDiscordRoles.path()}`
				: null,
			url => {
				return makeFetcher<
					MeemAPI.v1.GetDiscordRoles.IQueryParams,
					MeemAPI.v1.GetDiscordRoles.IRequestBody,
					MeemAPI.v1.GetDiscordRoles.IResponseBody
				>({
					method: MeemAPI.v1.GetDiscordRoles.method
				})(url, {
					agreementDiscordId: rule?.input?.id ?? input?.id ?? ''
				})
			},
			{
				shouldRetryOnError: false
			}
		)

	const form = useForm({
		initialValues: {
			publishType: MeemAPI.PublishType.PublishImmediately,
			proposerRoles: rule?.definition.proposerRoles ?? [],
			approverRoles: rule?.definition.approverRoles ?? [],
			editorRoles: rule?.definition.editorRoles ?? [],
			proposalChannels: rule?.definition.proposalChannels ?? [],
			proposalShareChannel: rule?.definition.proposalShareChannel ?? '',
			votes: rule?.definition.votes ?? 1,
			editorVotes: rule?.definition.editorVotes ?? 1,
			proposeVotes: rule?.definition.proposeVotes ?? 1,
			shouldReply: rule?.definition.shouldReply ?? true,
			// Required to support IRule
			vetoerRoles: [],
			vetoVotes: 0,
			canVeto: false
		},
		validate: {
			proposerRoles: (val, current) =>
				current.publishType === MeemAPI.PublishType.Proposal &&
				val.length === 0
					? 'Proposer is required'
					: null,
			approverRoles: val =>
				val.length === 0 ? 'Approver is required' : null,
			proposalChannels: (val, current) =>
				current.publishType === MeemAPI.PublishType.Proposal &&
				val.length === 0
					? 'Proposal Channels must be selected required'
					: null,
			votes: val => (val < 1 ? 'Votes must be at least 1' : null),
			proposalShareChannel: (val, current) =>
				current.publishType === MeemAPI.PublishType.Proposal &&
				val &&
				val.length === 0
					? 'Proposer channel is required'
					: null
		}
	})

	const [approverEmojis, setApproverEmojis] = useState<MeemAPI.IEmoji[]>(
		rule?.definition.approverEmojis && rule?.definition.approverEmojis[0]
			? typeof rule?.definition.approverEmojis[0] === 'string'
				? (rule?.definition.approverEmojis.map(e => ({
						id: e,
						name: e,
						unified: e,
						type: MeemAPI.EmojiType.Unified
				  })) as MeemAPI.IEmoji[])
				: (rule?.definition.approverEmojis as MeemAPI.IEmoji[])
			: []
	)
	const [proposerEmojis, setProposerEmojis] = useState<MeemAPI.IEmoji[]>(
		rule?.definition.proposerEmojis && rule?.definition.proposerEmojis[0]
			? typeof rule?.definition.proposerEmojis[0] === 'string'
				? (rule?.definition.proposerEmojis.map(e => ({
						id: e,
						name: e,
						unified: e,
						type: MeemAPI.EmojiType.Unified
				  })) as MeemAPI.IEmoji[])
				: (rule?.definition.proposerEmojis as MeemAPI.IEmoji[])
			: []
	)
	const [editorEmojis, setEditorEmojis] = useState<MeemAPI.IEmoji[]>(
		rule?.definition.editorEmojis && rule?.definition.editorEmojis[0]
			? typeof rule?.definition.editorEmojis[0] === 'string'
				? (rule?.definition.editorEmojis.map(e => ({
						id: e,
						name: e,
						unified: e,
						type: MeemAPI.EmojiType.Unified
				  })) as MeemAPI.IEmoji[])
				: (rule?.definition.editorEmojis as MeemAPI.IEmoji[])
			: []
	)
	const [emojiSelectType, setEmojiSelectType] = useState<EmojiSelectType>(
		EmojiSelectType.Approver
	)
	const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)

	const handleEmojiClick = useCallback(
		async (emojiObject: {
			id: string
			keywords: string[]
			name: string
			src?: string
			unified?: string
			native?: string
			shortcodes: string
		}) => {
			switch (emojiSelectType) {
				case EmojiSelectType.Approver:
					setApproverEmojis(
						uniqBy(
							[
								...approverEmojis,
								{
									...emojiObject,
									url: emojiObject.src,
									type: emojiObject.unified
										? MeemAPI.EmojiType.Unified
										: MeemAPI.EmojiType.Discord
								}
							],
							a => a.id
						)
					)
					break

				case EmojiSelectType.Proposer:
					setProposerEmojis(
						uniqBy(
							[
								...proposerEmojis,
								{
									...emojiObject,
									url: emojiObject.src,
									type: emojiObject.unified
										? MeemAPI.EmojiType.Unified
										: MeemAPI.EmojiType.Discord
								}
							],
							a => a.id
						)
					)
					break

				case EmojiSelectType.Editor:
					setEditorEmojis(
						uniqBy(
							[
								...editorEmojis,
								{
									...emojiObject,
									url: emojiObject.src,
									type: emojiObject.unified
										? MeemAPI.EmojiType.Unified
										: MeemAPI.EmojiType.Discord
								}
							],
							a => a.id
						)
					)
					break
			}
			setIsEmojiPickerOpen(false)
		},
		[emojiSelectType, approverEmojis, proposerEmojis, editorEmojis]
	)

	const handleFormSubmit = async (values: IFormValues) => {
		onSave({
			...values,
			approverEmojis,
			editorEmojis,
			proposerEmojis,
			vetoerEmojis: []
		})
	}

	useEffect(() => {
		form.setValues({
			publishType:
				rule?.definition.publishType ??
				MeemAPI.PublishType.PublishImmediately,
			proposerRoles: rule?.definition.proposerRoles,
			approverRoles: rule?.definition.approverRoles,
			editorRoles: rule?.definition.editorRoles,
			proposalChannels: rule?.definition.proposalChannels,
			proposalShareChannel: rule?.definition.proposalShareChannel,
			votes: rule?.definition.votes,
			editorVotes: rule?.definition.editorVotes,
			proposeVotes: rule?.definition.proposeVotes,
			shouldReply: rule?.definition.shouldReply
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [rule])

	let isProposalChannelGated = false

	if (
		discordData?.AgreementDiscords[0] &&
		form.values.proposalChannels &&
		form.values.proposalChannels.length > 0
	) {
		form.values.proposalChannels.forEach((c: string) => {
			const channel = channelsData?.channels?.find(ch => ch.id === c)
			if (channel && (!channel.canSend || !channel.canView)) {
				isProposalChannelGated = true
			}
		})
	}

	const modalContents = (
		<>
			{(loadingChannelsData ||
				loadingDiscordData ||
				loadingRolesData) && (
				<>
					<Space h={32} />
					<Center>
						<Loader variant={'oval'} color={'cyan'} />
					</Center>
					<Space h={32} />
				</>
			)}
			{discordData && channelsData && rolesData && (
				<>
					<form
						onSubmit={form.onSubmit(values =>
							handleFormSubmit(values)
						)}
					>
						<CTRuleBuilderConnections
							input={rule?.input ?? input}
							webhookUrl={webhookUrl}
							webhookPrivateKey={privateKey}
							existingRule={rule !== undefined}
							onChangeConnectionsPressed={function (): void {
								onModalClosed()
							}}
						/>

						<CTDiscordInputRBProposals
							form={form}
							channelsData={channelsData}
							rolesData={rolesData}
							isProposalChannelGated={isProposalChannelGated}
						/>

						<CTRuleBuilderApproverEmojis
							approverEmojis={approverEmojis}
							onApproverEmojisSet={emojis => {
								setApproverEmojis(emojis)
							}}
							onAddEmojisPressed={function (): void {
								setEmojiSelectType(EmojiSelectType.Approver)
								setIsEmojiPickerOpen(true)
							}}
						/>

						<CTRuleBuilderVotesCount form={form} />

						<CTDiscordInputRBEditors
							form={form}
							rolesData={rolesData}
							editorEmojis={editorEmojis}
							onEditorEmojisSet={emojis => {
								setEditorEmojis(emojis)
							}}
							onAddEmojisPressed={() => {
								setEmojiSelectType(EmojiSelectType.Editor)
								setIsEmojiPickerOpen(true)
							}}
						/>

						<Modal
							withCloseButton={true}
							closeOnClickOutside={false}
							padding={8}
							overlayBlur={8}
							size={366}
							opened={isEmojiPickerOpen}
							onClose={() => setIsEmojiPickerOpen(false)}
						>
							<Picker
								data={data}
								onEmojiSelect={handleEmojiClick}
								custom={[
									{
										id: 'discord',
										name: `${discordData?.AgreementDiscords[0].Discord?.name}`,
										emojis: emojisData.emojis.map(e => ({
											id: e.id,
											name: e.name,
											keywords: [e.name],
											// @ts-ignore
											skins: [{ src: e.url }]
										}))
									}
								]}
							/>
						</Modal>
						<Space h={'lg'} />
						<Button className={meemTheme.buttonBlack} type="submit">
							Save
						</Button>
					</form>
				</>
			)}
		</>
	)

	return (
		<>
			<Modal
				className={meemTheme.visibleDesktopOnly}
				centered
				radius={16}
				overlayBlur={8}
				size={'60%'}
				padding={'lg'}
				opened={isOpened}
				title={
					<Text className={meemTheme.tMediumBold}>
						{rule ? 'Edit Flow' : 'Add New Flow'}
					</Text>
				}
				onClose={() => {
					onModalClosed()
				}}
			>
				{modalContents}
			</Modal>
			<Modal
				className={meemTheme.visibleMobileOnly}
				fullScreen
				padding={'lg'}
				opened={isOpened}
				title={
					<Text className={meemTheme.tMediumBold}>
						{rule ? 'Edit Flow' : 'Add New Flow'}
					</Text>
				}
				onClose={() => {
					onModalClosed()
				}}
			>
				{modalContents}
			</Modal>
		</>
	)
}
