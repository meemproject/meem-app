import { useSubscription } from '@apollo/client'
import { Text, Space, Button, Modal, Center, Loader } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useAuth, useMeemApollo } from '@meemproject/react'
import { makeFetcher, MeemAPI } from '@meemproject/sdk'
import type { EmojiClickData } from 'emoji-picker-react'
import { uniq } from 'lodash'
import dynamic from 'next/dynamic'
import React, { useCallback, useEffect, useState } from 'react'
import useSWR from 'swr'
import { SubDiscordSubscription } from '../../../../../generated/graphql'
import { SUB_DISCORD } from '../../../../graphql/rules'
import { useAgreement } from '../../../Providers/AgreementProvider'
import { useMeemTheme } from '../../../Styles/MeemTheme'
import { CTConnection, CTRule } from '../Model/communityTweets'
import { CTDiscordInputRBEditors } from '../RuleBuilderSections/DiscordInput/CTDiscordInputRBEditors'
import { CTDiscordInputRBProposals } from '../RuleBuilderSections/DiscordInput/CTDiscordInputRBProposals'
import { CTRuleBuilderApproverEmojis } from '../RuleBuilderSections/Generic/CTRuleBuilderApproverEmojis'
import { CTRuleBuilderVotesCount } from '../RuleBuilderSections/Generic/CTRuleBuilderVotesCount'
import { CTRuleBuilderConnections } from './CTRuleBuilderConnections'

const EmojiPicker = dynamic(() => import('emoji-picker-react'), {
	ssr: false
})

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
	proposerEmojis: string[]
	approverEmojis: string[]
	editorEmojis: string[]
	vetoerEmojis: string[]
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

	const [approverEmojis, setApproverEmojis] = useState<string[]>(
		rule?.definition.approverEmojis ?? []
	)
	const [proposerEmojis, setProposerEmojis] = useState<string[]>(
		rule?.definition.proposerEmojis ?? []
	)
	const [editorEmojis, setEditorEmojis] = useState<string[]>(
		rule?.definition.editorEmojis ?? []
	)
	const [emojiSelectType, setEmojiSelectType] = useState<EmojiSelectType>(
		EmojiSelectType.Approver
	)
	const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)

	const handleEmojiClick = useCallback(
		async (emojiObject: EmojiClickData) => {
			switch (emojiSelectType) {
				case EmojiSelectType.Approver:
					setApproverEmojis(
						uniq([...approverEmojis, emojiObject.unified])
					)
					break

				case EmojiSelectType.Proposer:
					setProposerEmojis(
						uniq([...proposerEmojis, emojiObject.unified])
					)
					break

				case EmojiSelectType.Editor:
					setEditorEmojis(
						uniq([...editorEmojis, emojiObject.unified])
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
			const channel = channelsData.channels?.find(ch => ch.id === c)
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
							onApproverEmojisSet={function (
								emojis: string[]
							): void {
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
							onEditorEmojisSet={function (
								emojis: string[]
							): void {
								setEditorEmojis(emojis)
							}}
							onAddEmojisPressed={function (): void {
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
							<EmojiPicker onEmojiClick={handleEmojiClick} />
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
