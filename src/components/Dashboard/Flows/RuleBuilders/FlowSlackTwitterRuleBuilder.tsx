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
import {
	SubTwitterSubscription,
	SubSlackSubscription
} from '../../../../../generated/graphql'
import { SUB_TWITTER, SUB_SLACK } from '../../../../graphql/rules'
import { useAgreement } from '../../../Providers/AgreementProvider'
import { useMeemTheme } from '../../../Styles/MeemTheme'
import { ConnectedAccount, Rule } from '../Model/flows'
import { FlowRuleBuilderApproverEmojis } from '../RuleBuilderSections/Generic/FlowRuleBuilderApproverEmojis'
import { FlowRuleBuilderVotesCount } from '../RuleBuilderSections/Generic/FlowRuleBuilderVotesCount'
import { FlowSlackInputRBProposals } from '../RuleBuilderSections/SlackInput/FlowSlackInputRBProposals'
import { FlowSlackInputRBVetoes } from '../RuleBuilderSections/SlackInput/FlowSlackInputRBVetoes'
import { FlowTwitterOutputAutoReply } from '../RuleBuilderSections/TwitterOutput/FlowTwitterOutputAutoReply'
import { FlowRuleBuilderConnections } from './FlowRuleBuilderConnections'

export interface IProps {
	rule?: Rule
	input?: ConnectedAccount
	output?: ConnectedAccount
	isOpened: boolean
	onModalClosed: () => void
	onChangeConnectionsPressed: () => void
	onSave: (values: IOnSave) => void
}

export enum EmojiSelectType {
	Proposer = 'proposer',
	Approver = 'approver',
	Vetoer = 'vetoer'
}

export interface IFormValues
	extends Omit<
		MeemAPI.IRule,
		| 'proposerEmojis'
		| 'approverEmojis'
		| 'vetoerEmojis'
		| 'editorEmojis'
		| 'action'
		| 'ruleId'
		| 'isEnabled'
	> {}

export interface IOnSave extends IFormValues {
	proposerEmojis: MeemAPI.IEmoji[]
	approverEmojis: MeemAPI.IEmoji[]
	vetoerEmojis: MeemAPI.IEmoji[]
}

export const FlowSlackTwitterRulesBuilder: React.FC<IProps> = ({
	rule,
	input,
	output,
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

	const { data: slackData, loading: isLoadingSlackData } =
		useSubscription<SubSlackSubscription>(SUB_SLACK, {
			variables: {
				agreementId: agreement?.id,
				slackId: input?.id
			},
			skip:
				process.env.NEXT_PUBLIC_SYMPHONY_ENABLE_SLACK !== 'true' ||
				!mutualMembersClient ||
				!agreement?.id ||
				!isOpened ||
				!input?.id,
			client: mutualMembersClient
		})

	const { data: twitterData, loading: isLoadingTwitterData } =
		useSubscription<SubTwitterSubscription>(SUB_TWITTER, {
			variables: {
				agreementId: agreement?.id,
				twitterId: rule?.output?.id ?? output?.id ?? ''
			},
			skip:
				!mutualMembersClient ||
				!agreement?.id ||
				!isOpened ||
				!output?.id,
			client: mutualMembersClient
		})

	const { data: channelsData, isLoading: isLoadingChannelsData } =
		useSWR<MeemAPI.v1.GetSlackChannels.IResponseBody>(
			agreement?.id && jwt && input?.id
				? `${
						process.env.NEXT_PUBLIC_API_URL
				  }${MeemAPI.v1.GetSlackChannels.path()}`
				: null,
			url => {
				return makeFetcher<
					MeemAPI.v1.GetSlackChannels.IQueryParams,
					MeemAPI.v1.GetSlackChannels.IRequestBody,
					MeemAPI.v1.GetSlackChannels.IResponseBody
				>({
					method: MeemAPI.v1.GetSlackChannels.method
				})(url, {
					agreementSlackId: rule?.input?.id ?? input?.id ?? ''
				})
			},
			{
				shouldRetryOnError: false
			}
		)

	const { data: emojisData } =
		useSWR<MeemAPI.v1.GetSlackEmojis.IResponseBody>(
			agreement?.id && jwt && (rule?.input?.id ?? input?.id)
				? `${
						process.env.NEXT_PUBLIC_API_URL
				  }${MeemAPI.v1.GetSlackEmojis.path()}`
				: null,
			url => {
				return makeFetcher<
					MeemAPI.v1.GetSlackEmojis.IQueryParams,
					MeemAPI.v1.GetSlackEmojis.IRequestBody,
					MeemAPI.v1.GetSlackEmojis.IResponseBody
				>({
					method: MeemAPI.v1.GetSlackEmojis.method
				})(url, {
					agreementSlackId: rule?.input?.id ?? input?.id ?? ''
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
			vetoerRoles: rule?.definition.vetoerRoles ?? [],
			proposalChannels: rule?.definition.proposalChannels ?? [],
			proposalShareChannel: rule?.definition.proposalShareChannel ?? '',
			votes: rule?.definition.votes ?? 1,
			vetoVotes: rule?.definition.vetoVotes ?? 1,
			proposeVotes: rule?.definition.proposeVotes ?? 1,
			shouldReply: rule?.definition.shouldReply ?? true,
			shouldReplyPrivately:
				rule?.definition.shouldReplyPrivately ?? false,
			canVeto: rule?.definition.canVeto ?? false
		},
		validate: {
			proposerRoles: (val, current) =>
				current.publishType === MeemAPI.PublishType.Proposal &&
				val.length === 0
					? 'Proposer is required'
					: null,
			// approverRoles: val =>
			// 	val.length === 0 ? 'Approver is required' : null,
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
	const [vetoerEmojis, setVetoerEmojis] = useState<MeemAPI.IEmoji[]>(
		rule?.definition.vetoerEmojis && rule?.definition.vetoerEmojis[0]
			? rule?.definition.vetoerEmojis
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
							e => e.id
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
							e => e.id
						)
					)
					break

				case EmojiSelectType.Vetoer:
					setVetoerEmojis(
						uniqBy(
							[
								...vetoerEmojis,
								{
									...emojiObject,
									url: emojiObject.src,
									type: emojiObject.unified
										? MeemAPI.EmojiType.Unified
										: MeemAPI.EmojiType.Discord
								}
							],
							e => e.id
						)
					)
					break
			}
			setIsEmojiPickerOpen(false)
		},
		[emojiSelectType, approverEmojis, proposerEmojis, vetoerEmojis]
	)

	const handleFormSubmit = async (values: IFormValues) => {
		onSave({
			...values,
			approverEmojis,
			vetoerEmojis,
			proposerEmojis
		})
	}

	useEffect(() => {
		form.setValues({
			publishType:
				rule?.definition.publishType ??
				MeemAPI.PublishType.PublishImmediately,
			proposerRoles: rule?.definition.proposerRoles,
			approverRoles: rule?.definition.approverRoles,
			proposalChannels: rule?.definition.proposalChannels,
			proposalShareChannel: rule?.definition.proposalShareChannel,
			votes: rule?.definition.votes ?? 1,
			vetoVotes: rule?.definition.vetoVotes,
			proposeVotes: rule?.definition.proposeVotes,
			shouldReply: rule?.definition.shouldReply,
			shouldReplyPrivately: rule?.definition.shouldReplyPrivately,
			canVeto: rule?.definition.canVeto
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [rule])

	const isProposalChannelGated = false

	// if (
	// 	slackData?.AgreementSlacks[0] &&
	// 	form.values.proposalChannels &&
	// 	form.values.proposalChannels.length > 0
	// ) {
	// 	form.values.proposalChannels.forEach((c: string) => {
	// 		const channel = channelsData.channels?.find(ch => ch.id === c)
	// 		if (channel && (!channel.canSend || !channel.canView)) {
	// 			isProposalChannelGated = true
	// 		}
	// 	})
	// }

	// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
	const isShareChannelGated = false

	// if (channelsData?.channels && form.values.proposalShareChannel) {
	// 	const channel = channelsData.channels.find(
	// 		ch => ch.id === form.values.proposalShareChannel
	// 	)
	// 	if (channel && (!channel.canSend || !channel.canView)) {
	// 		isShareChannelGated = true
	// 	}
	// }

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
				{(isLoadingChannelsData ||
					isLoadingSlackData ||
					isLoadingTwitterData) && (
					<>
						<Space h={32} />
						<Center>
							<Loader variant={'oval'} color={'cyan'} />
						</Center>
						<Space h={32} />
					</>
				)}
				{slackData && channelsData && twitterData && (
					<>
						<form
							onSubmit={form.onSubmit(values =>
								handleFormSubmit(values)
							)}
						>
							<FlowRuleBuilderConnections
								input={rule?.input ?? input}
								output={rule?.output ?? output}
								existingRule={rule !== undefined}
								onChangeConnectionsPressed={function (): void {
									onChangeConnectionsPressed()
									onModalClosed()
								}}
							/>

							<FlowSlackInputRBProposals
								form={form}
								channelsData={channelsData}
								isProposalChannelGated={isProposalChannelGated}
							/>

							<Text className={meemTheme.tExtraSmallLabel}>
								VOTES
							</Text>
							<Space h={4} />

							<FlowRuleBuilderApproverEmojis
								approverEmojis={approverEmojis}
								onApproverEmojisSet={emojis => {
									setApproverEmojis(emojis)
								}}
								onAddEmojisPressed={() => {
									setEmojiSelectType(EmojiSelectType.Approver)
									setIsEmojiPickerOpen(true)
								}}
							/>

							<FlowRuleBuilderVotesCount form={form} />

							<FlowSlackInputRBVetoes
								form={form}
								vetoerEmojis={vetoerEmojis}
								onVetoerEmojisSet={emojis => {
									setVetoerEmojis(emojis)
								}}
								onAddEmojisPressed={() => {
									setEmojiSelectType(EmojiSelectType.Vetoer)
									setIsEmojiPickerOpen(true)
								}}
							/>

							<FlowTwitterOutputAutoReply form={form} />

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
											name: `${slackData?.AgreementSlacks[0].Slack?.name}`,
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
