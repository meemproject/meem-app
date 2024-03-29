import { useSubscription } from '@apollo/client'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import {
	Text,
	Space,
	Button,
	Modal,
	Center,
	Loader,
	Container,
	Checkbox
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useAuth, useMeemApollo } from '@meemproject/react'
import { makeFetcher, MeemAPI } from '@meemproject/sdk'
import { Cancel } from 'iconoir-react'
import { uniqBy } from 'lodash'
import React, { useCallback, useEffect, useState } from 'react'
import useSWR from 'swr'
import { SubDiscordSubscription } from '../../../../../generated/graphql'
import { SUB_DISCORD } from '../../../../graphql/rules'
import { useAgreement } from '../../../Providers/AgreementProvider'
import { useMeemTheme } from '../../../Styles/MeemTheme'
import { ConnectedAccount, Rule } from '../Model/flows'
import { FlowDiscordInputRBEditors } from '../RuleBuilderSections/DiscordInput/FlowDiscordInputRBEditors'
import { FlowDiscordInputRBProposals } from '../RuleBuilderSections/DiscordInput/FlowDiscordInputRBProposals'
import { FlowRuleBuilderApproverEmojis } from '../RuleBuilderSections/Generic/FlowRuleBuilderApproverEmojis'
import { FlowRuleBuilderVotesCount } from '../RuleBuilderSections/Generic/FlowRuleBuilderVotesCount'
import { FlowRuleBuilderConnections } from './FlowRuleBuilderConnections'

export interface IProps {
	rule?: Rule
	input?: ConnectedAccount
	webhookUrl?: string
	privateKey?: string
	isOpened: boolean
	onModalClosed: () => void
	onChangeConnectionsPressed: () => void
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

export const FlowDiscordWebhookRulesBuilder: React.FC<IProps> = ({
	rule,
	input,
	webhookUrl,
	privateKey,
	isOpened,
	onModalClosed,
	onChangeConnectionsPressed,
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
			shouldReplyPrivately:
				rule?.definition.shouldReplyPrivately ?? false,
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
			? rule?.definition.approverEmojis
			: []
	)
	const [proposerEmojis, setProposerEmojis] = useState<MeemAPI.IEmoji[]>(
		rule?.definition.proposerEmojis && rule?.definition.proposerEmojis[0]
			? rule?.definition.proposerEmojis
			: []
	)
	const [editorEmojis, setEditorEmojis] = useState<MeemAPI.IEmoji[]>(
		rule?.definition.editorEmojis && rule?.definition.editorEmojis[0]
			? rule?.definition.editorEmojis
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
			shouldReply: rule?.definition.shouldReply,
			shouldReplyPrivately: rule?.definition.shouldReplyPrivately
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
		<div style={{ position: 'relative' }}>
			<Space h={32} />
			<Center>
				<Text className={meemTheme.tLargeBold}>Add New Flow</Text>
			</Center>
			<Space h={8} />
			<Center>
				<Text>
					Customize the logic below to create a new publishing flow
					for your community.
				</Text>
			</Center>

			<Space h={48} />
			<Container size={'sm'}>
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
							<FlowRuleBuilderConnections
								input={rule?.input ?? input}
								webhookUrl={webhookUrl}
								webhookPrivateKey={privateKey}
								existingRule={rule !== undefined}
								onChangeConnectionsPressed={function (): void {
									onModalClosed()
									onChangeConnectionsPressed()
								}}
							/>

							<FlowDiscordInputRBProposals
								form={form}
								channelsData={channelsData}
								rolesData={rolesData}
								isProposalChannelGated={isProposalChannelGated}
							/>

							<FlowRuleBuilderApproverEmojis
								approverEmojis={approverEmojis}
								onApproverEmojisSet={emojis => {
									setApproverEmojis(emojis)
								}}
								onAddEmojisPressed={function (): void {
									setEmojiSelectType(EmojiSelectType.Approver)
									setIsEmojiPickerOpen(true)
								}}
							/>

							<FlowRuleBuilderVotesCount form={form} />

							<FlowDiscordInputRBEditors
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

							<Space h={32} />

							<Checkbox
								label="Make the bot replies private"
								{...form.getInputProps('shouldReplyPrivately')}
							/>

							<Modal
								withCloseButton={true}
								closeOnClickOutside={false}
								padding={8}
								overlayProps={{ blur: 8 }}
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
											emojis: emojisData?.emojis.map(
												e => ({
													id: e.id,
													name: e.name,
													keywords: [e.name],
													// @ts-ignore
													skins: [{ src: e.url }]
												})
											)
										}
									]}
								/>
							</Modal>
							<Space h={'lg'} />
							<Button
								className={meemTheme.buttonBlack}
								type="submit"
							>
								Save
							</Button>
						</form>
					</>
				)}
			</Container>
			<Space h={48} />
			<Cancel
				style={{
					position: 'absolute',
					top: 8,
					right: 8,
					cursor: 'pointer'
				}}
				onClick={() => {
					onModalClosed()
				}}
			/>
		</div>
	)

	return (
		<>
			<Modal
				fullScreen
				padding={'lg'}
				classNames={{
					root: meemTheme.backgroundMeem,
					content: meemTheme.backgroundMeem
				}}
				transitionProps={{ transition: 'pop', duration: 0 }}
				withCloseButton={false}
				opened={isOpened}
				onClose={() => {
					onModalClosed()
				}}
			>
				{modalContents}
			</Modal>
		</>
	)
}
