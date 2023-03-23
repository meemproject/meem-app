import {
	ApolloClient,
	// eslint-disable-next-line import/named
	NormalizedCacheObject,
	useSubscription
} from '@apollo/client'
import { Text, Space, Button, Modal, Center, Loader } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useAuth } from '@meemproject/react'
import { createApolloClient, makeFetcher, MeemAPI } from '@meemproject/sdk'
import type { EmojiClickData } from 'emoji-picker-react'
import { uniq } from 'lodash'
import dynamic from 'next/dynamic'
import React, { useCallback, useEffect, useState } from 'react'
import useSWR from 'swr'
import { SubSlackSubscription } from '../../../../../generated/graphql'
import { useAgreement } from '../../../AgreementHome/AgreementProvider'
import { useMeemTheme } from '../../../Styles/MeemTheme'
import { SymphonyConnection, SymphonyRule } from '../Model/symphony'
import { SUB_SLACK } from '../symphony.gql'
import { SymphRuleBuilderApproverEmojis } from './RuleBuilderSections/Generic/SymphRuleBuilderApproverEmojis'
import { SymphRuleBuilderVotesCount } from './RuleBuilderSections/Generic/SymphRuleBuilderVotesCount'
import { SymphSlackInputRBProposals } from './RuleBuilderSections/SlackInput/SymphSlackInputRBProposals'
import { SymphSlackInputRBVetoes } from './RuleBuilderSections/SlackInput/SymphSlackInputRBVetoes'
import { SymphonyRuleBuilderConnections } from './SymphonyRuleBuilderConnections'

const EmojiPicker = dynamic(() => import('emoji-picker-react'), {
	ssr: false
})

export interface IProps {
	rule?: SymphonyRule
	input?: SymphonyConnection
	webhookUrl?: string
	webhookPrivateKey?: string
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

export const SymphonySlackWebhookRulesBuilder: React.FC<IProps> = ({
	rule,
	input,
	webhookUrl,
	webhookPrivateKey,
	isOpened,
	onModalClosed,
	onSave
}) => {
	// Default extension settings / properties - leave these alone if possible!
	const { classes: meemTheme } = useMeemTheme()

	const { agreement } = useAgreement()
	const { jwt } = useAuth()

	// GraphQL Subscriptions
	const [symphonyClient, setSymphonyClient] =
		useState<ApolloClient<NormalizedCacheObject>>()

	useEffect(() => {
		const c = createApolloClient({
			httpUrl: `https://${process.env.NEXT_PUBLIC_SYMPHONY_GQL_HOST}`,
			wsUri: `wss://${process.env.NEXT_PUBLIC_SYMPHONY_GQL_HOST}`
		})

		setSymphonyClient(c)
	}, [])

	const { data: slackData, loading: isLoadingSlackData } =
		useSubscription<SubSlackSubscription>(SUB_SLACK, {
			variables: {
				agreementId: agreement?.id,
				slackId: input?.id
			},
			skip:
				process.env.NEXT_PUBLIC_SYMPHONY_ENABLE_SLACK !== 'true' ||
				!symphonyClient ||
				!agreement?.id ||
				!isOpened ||
				!input?.id,
			client: symphonyClient
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

	const modalContents = (
		<>
			{(isLoadingChannelsData || isLoadingSlackData) && (
				<>
					<Space h={32} />
					<Center>
						<Loader variant={'oval'} color={'cyan'} />
					</Center>
					<Space h={32} />
				</>
			)}
			{slackData && channelsData && (
				<>
					<form
						onSubmit={form.onSubmit(values =>
							handleFormSubmit(values)
						)}
					>
						<SymphonyRuleBuilderConnections
							input={rule?.input ?? input}
							webhookUrl={webhookUrl}
							webhookPrivateKey={webhookPrivateKey}
							onChangeConnectionsPressed={function (): void {
								onModalClosed()
							}}
						/>

						<SymphSlackInputRBProposals
							form={form}
							channelsData={channelsData}
							isProposalChannelGated={isProposalChannelGated}
						/>

						<Text className={meemTheme.tExtraSmallLabel}>
							VOTES
						</Text>
						<Space h={4} />

						<SymphRuleBuilderApproverEmojis
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

						<SymphRuleBuilderVotesCount form={form} />

						<SymphSlackInputRBVetoes
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
					<Text className={meemTheme.tMediumBold}>Add New Flow</Text>
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
					<Text className={meemTheme.tMediumBold}>Add New Flow</Text>
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
