import {
	ApolloClient,
	// eslint-disable-next-line import/named
	NormalizedCacheObject,
	useSubscription
} from '@apollo/client'
import {
	Text,
	Space,
	Button,
	Modal,
	Select,
	MultiSelect,
	NumberInput,
	Switch,
	Center,
	Loader
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useAuth } from '@meemproject/react'
import { createApolloClient, makeFetcher } from '@meemproject/sdk'
import { Emoji } from 'emoji-picker-react'
import type { EmojiClickData } from 'emoji-picker-react'
import { WarningCircle } from 'iconoir-react'
import { uniq } from 'lodash'
import dynamic from 'next/dynamic'
import React, { useCallback, useEffect, useState } from 'react'
import useSWR from 'swr'
import {
	SubTwitterSubscription,
	SubSlackSubscription
} from '../../../../../generated/graphql'
import { useAgreement } from '../../../AgreementHome/AgreementProvider'
import { useMeemTheme, colorOrangeRed } from '../../../Styles/MeemTheme'
import { SymphonyConnection, SymphonyRule } from '../Model/symphony'
import { SUB_TWITTER, SUB_SLACK } from '../symphony.gql'
import { API } from '../symphonyTypes.generated'
import { SymphonyRuleBuilderConnections } from './SymphonyRuleBuilderConnections'

const EmojiPicker = dynamic(() => import('emoji-picker-react'), {
	ssr: false
})

export interface IProps {
	rule?: SymphonyRule
	input?: SymphonyConnection
	output?: SymphonyConnection
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
		API.IRule,
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

export const SymphonySlackTwitterRulesBuilder: React.FC<IProps> = ({
	rule,
	input,
	output,
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

	const { data: twitterData, loading: isLoadingTwitterData } =
		useSubscription<SubTwitterSubscription>(SUB_TWITTER, {
			variables: {
				agreementId: agreement?.id,
				twitterId: rule?.output?.id ?? output?.id ?? ''
			},
			skip: !symphonyClient || !agreement?.id || !isOpened || !output?.id,
			client: symphonyClient
		})

	const { data: channelsData, isLoading: isLoadingChannelsData } =
		useSWR<API.v1.GetSlackChannels.IResponseBody>(
			agreement?.id && jwt && input?.id
				? `${
						process.env.NEXT_PUBLIC_SYMPHONY_API_URL
				  }${API.v1.GetSlackChannels.path()}`
				: null,
			url => {
				return makeFetcher<
					API.v1.GetSlackChannels.IQueryParams,
					API.v1.GetSlackChannels.IRequestBody,
					API.v1.GetSlackChannels.IResponseBody
				>({
					method: API.v1.GetSlackChannels.method
				})(url, {
					jwt: jwt as string,
					agreementSlackId: input?.id ?? ''
				})
			},
			{
				shouldRetryOnError: false
			}
		)

	const form = useForm({
		initialValues: {
			publishType: API.PublishType.PublishImmediately,
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
				current.publishType === API.PublishType.Proposal &&
				val.length === 0
					? 'Proposer is required'
					: null,
			// approverRoles: val =>
			// 	val.length === 0 ? 'Approver is required' : null,
			proposalChannels: (val, current) =>
				current.publishType === API.PublishType.Proposal &&
				val.length === 0
					? 'Proposal Channels must be selected required'
					: null,
			votes: val => (val < 1 ? 'Votes must be at least 1' : null),
			proposalShareChannel: (val, current) =>
				current.publishType === API.PublishType.Proposal &&
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
				API.PublishType.PublishImmediately,
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
						{/* <Text className={meemTheme.tExtraSmallLabel}>RULE TYPE</Text>
			<Space h={4} />
			<Text className={meemTheme.tExtraSmall}>
				What rule type should we follow?
			</Text>
			<Space h={8} />
			<Select
				data={[
					{
						value: API.PublishType.PublishImmediately,
						label: 'Publish Immediately'
					},
					{
						value: API.PublishType.Proposal,
						label: 'Proposal Flow'
					}
				]}
				{...form.getInputProps('publishType')}
			/>
			<Space h={'lg'} /> */}

						<SymphonyRuleBuilderConnections
							input={rule?.input ?? input}
							output={rule?.output ?? output}
							onChangeConnectionsPressed={function (): void {
								onModalClosed()
							}}
						/>
						<Text className={meemTheme.tExtraSmallLabel}>
							CHANNELS
						</Text>
						<Space h={4} />

						<Text className={meemTheme.tExtraSmall}>
							{form.values.publishType ===
							API.PublishType.PublishImmediately
								? 'From what channels should we publish?'
								: 'In what channels can a proposal be submitted?'}
						</Text>

						{channelsData.channels && (
							<>
								<Space h={8} />
								<MultiSelect
									data={[
										...channelsData.channels.map(c => ({
											value: c.id,
											label: c.name
										}))
									]}
									{...form.getInputProps('proposalChannels')}
								/>
								{isProposalChannelGated && (
									<>
										<Space h={8} />
										<div
											style={{
												display: 'flex',
												flexDirection: 'row',
												alignItems: 'center'
											}}
										>
											<WarningCircle
												color={colorOrangeRed}
												height={16}
												width={16}
											/>
											<Space w={4} />
											<Text
												className={meemTheme.tBadgeText}
												style={{
													color: colorOrangeRed
												}}
											>
												Please ensure Symphony Bot has
												full access to channels in
												Discord
											</Text>
										</div>
									</>
								)}
							</>
						)}

						{form.values.publishType ===
							API.PublishType.Proposal && (
							<>
								<Space h={'lg'} />
								<Text className={meemTheme.tExtraSmallLabel}>
									PROPOSALS
								</Text>
								{/* <Space h={4} />
								<Text className={meemTheme.tExtraSmall}>
									Who can propose a post?
								</Text> */}
								{/* {rolesData?.roles && (
									<>
										<Space h={8} />

										<MultiSelect
											multiple
											data={rolesData.roles.map(c => ({
												value: c.id,
												label: c.name
											}))}
											{...form.getInputProps(
												'proposerRoles'
											)}
										/>
									</>
								)} */}
								<Space h={'lg'} />
								<Text className={meemTheme.tExtraSmall}>
									Which emojis will create a proposal?
								</Text>
								{proposerEmojis.length > 0 && (
									<>
										<div
											style={{
												display: 'flex',
												flexDirection: 'row',
												marginTop: 4
											}}
										>
											{proposerEmojis.map(e => (
												<div
													style={{
														display: 'flex',
														flexDirection: 'row'
													}}
													key={`proposerEmoji-${e}`}
													onClick={() => {
														setProposerEmojis(
															proposerEmojis.filter(
																pe => pe !== e
															)
														)
													}}
												>
													<Emoji
														unified={e}
														size={25}
													/>
													<Space w="xs" />
												</div>
											))}
										</div>
									</>
								)}
								<Space h={8} />
								<Button
									className={meemTheme.buttonWhite}
									onClick={() => {
										setEmojiSelectType(
											EmojiSelectType.Proposer
										)
										setIsEmojiPickerOpen(true)
									}}
								>
									+ Add emoji
								</Button>

								<Space h={'lg'} />
								<Text className={meemTheme.tExtraSmall}>
									{'How many proposal reactions?'}
								</Text>
								<Space h={8} />
								<NumberInput
									{...form.getInputProps('proposeVotes')}
								/>
							</>
						)}
						<Space h="lg" />

						<Text className={meemTheme.tExtraSmallLabel}>
							VOTES
						</Text>
						<Space h={4} />

						{/* <Text className={meemTheme.tExtraSmall}>
							Who can vote to approve new posts for publication?
						</Text>
						<Space h={8} />
						{rolesData.roles && (
							<MultiSelect
								multiple
								data={rolesData.roles.map(c => ({
									value: c.id,
									label: c.name
								}))}
								{...form.getInputProps('approverRoles')}
							/>
						)}
						<Space h="lg" /> */}
						<Text className={meemTheme.tExtraSmall}>
							Which emojis will count as affirmative votes?
						</Text>
						{approverEmojis.length > 0 && (
							<div
								style={{
									display: 'flex',
									flexDirection: 'row',
									marginTop: 4
								}}
							>
								{approverEmojis.map(e => (
									<div
										key={`approvalEmoji-${e}`}
										style={{
											display: 'flex',
											flexDirection: 'row',
											cursor: 'pointer'
										}}
										onClick={() => {
											setApproverEmojis(
												approverEmojis.filter(
													ae => ae !== e
												)
											)
										}}
									>
										<Emoji unified={e} size={25} />
										<Space w="xs" />
									</div>
								))}
							</div>
						)}
						<Space h={8} />
						<Button
							className={meemTheme.buttonWhite}
							onClick={() => {
								setEmojiSelectType(EmojiSelectType.Approver)
								setIsEmojiPickerOpen(true)
							}}
						>
							+ Add emoji
						</Button>
						<Space h="lg" />
						<Text className={meemTheme.tExtraSmall}>
							{
								"How many affirmative votes must a proposed post receive before it's approved?"
							}
						</Text>
						<Space h={8} />
						<NumberInput {...form.getInputProps('votes')} />
						{form.values.publishType ===
							API.PublishType.Proposal && (
							<>
								<Space h={'lg'} />
								<Text className={meemTheme.tExtraSmallLabel}>
									DISCORD CHANNEL FOR PROPOSALS
								</Text>
								<Space h={4} />
								<Text className={meemTheme.tExtraSmall}>
									What Discord channel will new proposals be
									shared in?
								</Text>
								{channelsData.channels && (
									<>
										<Space h={8} />

										<Select
											data={channelsData.channels.map(
												c => ({
													value: c.id,
													label: c.name
												})
											)}
											{...form.getInputProps(
												'proposalShareChannel'
											)}
										/>

										{isShareChannelGated && (
											<>
												<Space h={8} />
												<div
													style={{
														display: 'flex',
														flexDirection: 'row',
														alignItems: 'center'
													}}
												>
													<WarningCircle
														color={colorOrangeRed}
														height={16}
														width={16}
													/>
													<Space w={4} />
													<Text
														className={
															meemTheme.tBadgeText
														}
														style={{
															color: colorOrangeRed
														}}
													>
														Please ensure Symphony
														Bot has full access to
														channels in Discord
													</Text>
												</div>
											</>
										)}
									</>
								)}
							</>
						)}

						<Space h={'lg'} />
						<Text className={meemTheme.tExtraSmallLabel}>
							VETOES
						</Text>
						<Space h={4} />
						<Text className={meemTheme.tExtraSmall}>
							Can posts be vetoed?
						</Text>
						<Space h={8} />

						<Switch
							label="Yes, posts can be vetoed"
							{...form.getInputProps('canVeto', {
								type: 'checkbox'
							})}
						/>
						{form.values.canVeto && (
							<>
								<Space h={'lg'} />

								{/* <Text className={meemTheme.tExtraSmall}>
									Who can veto?
								</Text>
								<Space h={8} />
								{rolesData.roles && (
									<MultiSelect
										multiple
										data={rolesData.roles.map(c => ({
											value: c.id,
											label: c.name
										}))}
										{...form.getInputProps('vetoerRoles')}
									/>
								)}
								<Space h="lg" /> */}
								<Text className={meemTheme.tExtraSmall}>
									Which emojis will count as a veto?
								</Text>
								{vetoerEmojis.length > 0 && (
									<>
										<Space h="xs" />
										<div
											style={{
												display: 'flex',
												flexDirection: 'row'
											}}
										>
											{vetoerEmojis.map(e => (
												<div
													style={{
														display: 'flex',
														flexDirection: 'row'
													}}
													key={`vetoerEmoji-${e}`}
													onClick={() => {
														setVetoerEmojis(
															vetoerEmojis.filter(
																ve => ve !== e
															)
														)
													}}
												>
													<Emoji
														unified={e}
														size={25}
													/>
													<Space w="xs" />
												</div>
											))}
										</div>
									</>
								)}
								<Space h={8} />
								<Button
									className={meemTheme.buttonWhite}
									onClick={() => {
										setEmojiSelectType(
											EmojiSelectType.Vetoer
										)
										setIsEmojiPickerOpen(true)
									}}
								>
									+ Add emoji
								</Button>
								<Space h="lg" />
								<Text className={meemTheme.tExtraSmall}>
									{'How many vetoes are required?'}
								</Text>
								<Space h={8} />
								<NumberInput
									{...form.getInputProps('vetoVotes')}
								/>
							</>
						)}
						<Space h={'lg'} />
						<Text className={meemTheme.tExtraSmallLabel}>
							AUTO REPLY
						</Text>
						<Space h={4} />
						<Text className={meemTheme.tExtraSmall}>
							Would you like Symphony to reply to approved
							proposals with a link to the published tweet?
						</Text>
						<Space h={8} />
						<Switch
							label="Yes, reply with a link"
							{...form.getInputProps('shouldReply', {
								type: 'checkbox'
							})}
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
