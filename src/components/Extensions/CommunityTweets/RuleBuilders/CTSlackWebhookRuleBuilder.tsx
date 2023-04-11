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
import { SubSlackSubscription } from '../../../../../generated/graphql'
import { useAgreement } from '../../../AgreementHome/AgreementProvider'
import { useMeemTheme } from '../../../Styles/MeemTheme'
import { SUB_SLACK } from '../communityTweetsGql'
import { CTConnection, CTRule } from '../Model/communityTweets'
import { CTRuleBuilderConnections } from './CTRuleBuilderConnections'
import { CTRuleBuilderApproverEmojis } from './RuleBuilderSections/Generic/CTRuleBuilderApproverEmojis'
import { CTRuleBuilderVotesCount } from './RuleBuilderSections/Generic/CTRuleBuilderVotesCount'
import { CTSlackInputRBProposals } from './RuleBuilderSections/SlackInput/CTSlackInputRBProposals'
import { CTSlackInputRBVetoes } from './RuleBuilderSections/SlackInput/CTSlackInputRBVetoes'

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
	Vetoer = 'vetoer'
}

export interface IFormValues
	extends Omit<
		MeemAPI.IRule,
		| 'proposerEmojis'
		| 'approverEmojis'
		| 'vetoerEmojis'
		| 'action'
		| 'ruleId'
		| 'isEnabled'
	> {}

export interface IOnSave extends IFormValues {
	proposerEmojis: string[]
	approverEmojis: string[]
	vetoerEmojis: string[]
}

export const CTSlackWebhookRulesBuilder: React.FC<IProps> = ({
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

	const [approverEmojis, setApproverEmojis] = useState<string[]>(
		rule?.definition.approverEmojis ?? []
	)
	const [proposerEmojis, setProposerEmojis] = useState<string[]>(
		rule?.definition.proposerEmojis ?? []
	)
	const [vetoerEmojis, setVetoerEmojis] = useState<string[]>(
		rule?.definition.vetoerEmojis ?? []
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

				case EmojiSelectType.Vetoer:
					setVetoerEmojis(
						uniq([...vetoerEmojis, emojiObject.unified])
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
			votes: rule?.definition.votes,
			vetoVotes: rule?.definition.vetoVotes,
			proposeVotes: rule?.definition.proposeVotes,
			shouldReply: rule?.definition.shouldReply,
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
	const isLoading = isLoadingChannelsData || isLoadingSlackData
	const hasAllRequiredData = !isLoading && slackData && channelsData
	const isMissingRequiredData = !isLoading && (!slackData || !channelsData)

	const modalContents = (
		<>
			{isLoading && (
				<>
					<Space h={32} />
					<Center>
						<Loader variant={'oval'} color={'cyan'} />
					</Center>
					<Space h={32} />
				</>
			)}
			{isMissingRequiredData && (
				<>
					<Space h={32} />
					<Center>
						<Text className={meemTheme.tSmallBold}>
							Unable to retrieve data
						</Text>
					</Center>
					<Space h={8} />
					<Center>
						<Text className={meemTheme.tSmall}>
							{!slackData &&
								'Slack workspace data was not found.'}{' '}
							{!slackData && 'Slack channel data was not found.'}{' '}
							{
								'Contact us using the button in the top right of this page.'
							}
						</Text>
					</Center>
					<Space h={32} />
				</>
			)}
			{hasAllRequiredData && (
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

						<CTSlackInputRBProposals
							form={form}
							channelsData={channelsData}
							isProposalChannelGated={isProposalChannelGated}
						/>

						<Text className={meemTheme.tExtraSmallLabel}>
							VOTES
						</Text>
						<Space h={4} />

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

						<CTSlackInputRBVetoes
							form={form}
							vetoerEmojis={vetoerEmojis}
							onVetoerEmojisSet={function (
								emojis: string[]
							): void {
								setVetoerEmojis(emojis)
							}}
							onAddEmojisPressed={function (): void {
								setEmojiSelectType(EmojiSelectType.Vetoer)
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
