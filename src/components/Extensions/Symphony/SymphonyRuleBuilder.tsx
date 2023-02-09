import {
	Text,
	Space,
	Button,
	Modal,
	Select,
	MultiSelect,
	NumberInput,
	Switch
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { Emoji } from 'emoji-picker-react'
import type { EmojiClickData } from 'emoji-picker-react'
import { WarningCircle } from 'iconoir-react'
import { uniq } from 'lodash'
import dynamic from 'next/dynamic'
import React, { useCallback, useEffect, useState } from 'react'
import { useMeemTheme, colorRed } from '../../Styles/MeemTheme'
import { API } from './symphonyTypes.generated'

const EmojiPicker = dynamic(() => import('emoji-picker-react'), {
	ssr: false
})

export interface IProps {
	channels?: API.IDiscordChannel[]
	roles?: API.IDiscordRole[]
	selectedRule?: API.IRule
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

export const SymphonyRuleBuilder: React.FC<IProps> = ({
	channels,
	roles,
	selectedRule,
	onSave
}) => {
	// Default extension settings / properties - leave these alone if possible!
	const { classes: meemTheme } = useMeemTheme()

	const form = useForm({
		initialValues: {
			publishType: API.PublishType.PublishImmediately,
			proposerRoles: selectedRule?.proposerRoles
				? Object.values(selectedRule.proposerRoles)
				: [],
			approverRoles: selectedRule?.approverRoles
				? Object.values(selectedRule.approverRoles)
				: [],
			vetoerRoles: selectedRule?.vetoerRoles
				? Object.values(selectedRule.vetoerRoles)
				: [],
			proposalChannels: selectedRule?.proposalChannels
				? Object.values(selectedRule.proposalChannels)
				: [],
			proposalShareChannel: selectedRule?.proposalShareChannel ?? '',
			votes: selectedRule?.votes ?? 1,
			vetoVotes: selectedRule?.vetoVotes ?? 1,
			proposeVotes: selectedRule?.proposeVotes ?? 1,
			shouldReply: selectedRule?.shouldReply ?? true,
			canVeto: selectedRule?.canVeto ?? false
		},
		validate: {
			proposerRoles: (val, current) =>
				current.publishType === API.PublishType.Proposal &&
				val.length === 0
					? 'Proposer is required'
					: null,
			approverRoles: val =>
				val.length === 0 ? 'Approver is required' : null,
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
		selectedRule?.approverEmojis
			? Object.values(selectedRule?.approverEmojis)
			: []
	)
	const [proposerEmojis, setProposerEmojis] = useState<string[]>(
		selectedRule?.proposerEmojis
			? Object.values(selectedRule?.proposerEmojis)
			: []
	)
	const [vetoerEmojis, setVetoerEmojis] = useState<string[]>(
		selectedRule?.vetoerEmojis
			? Object.values(selectedRule?.vetoerEmojis)
			: []
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
				selectedRule?.publishType ?? API.PublishType.PublishImmediately,
			proposerRoles: selectedRule?.proposerRoles,
			approverRoles: selectedRule?.approverRoles,
			proposalChannels: selectedRule?.proposalChannels,
			proposalShareChannel: selectedRule?.proposalShareChannel,
			votes: selectedRule?.votes,
			vetoVotes: selectedRule?.vetoVotes,
			proposeVotes: selectedRule?.proposeVotes,
			shouldReply: selectedRule?.shouldReply,
			canVeto: selectedRule?.canVeto
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedRule])

	let isProposalChannelGated = false

	if (
		channels &&
		form.values.proposalChannels &&
		form.values.proposalChannels.length > 0
	) {
		form.values.proposalChannels.forEach(c => {
			if (c === 'all') {
				isProposalChannelGated = true
			} else {
				const channel = channels.find(ch => ch.id === c)
				if (channel && (!channel.canSend || !channel.canView)) {
					isProposalChannelGated = true
				}
			}
		})
	}

	let isShareChannelGated = false

	if (channels && form.values.proposalShareChannel) {
		const channel = channels.find(
			ch => ch.id === form.values.proposalShareChannel
		)
		if (channel && (!channel.canSend || !channel.canView)) {
			isShareChannelGated = true
		}
	}

	return (
		<form onSubmit={form.onSubmit(values => handleFormSubmit(values))}>
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
			<Text className={meemTheme.tExtraSmallLabel}>CHANNELS</Text>
			<Space h={4} />

			<Text className={meemTheme.tExtraSmall}>
				{form.values.publishType === API.PublishType.PublishImmediately
					? 'From what channels should we publish?'
					: 'In what channels can a proposal be submitted?'}
			</Text>

			{channels && (
				<>
					<Space h={8} />
					<MultiSelect
						data={[
							{ value: 'all', label: 'All Channels' },
							...channels.map(c => ({
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
									color={colorRed}
									height={16}
									width={16}
								/>
								<Space w={4} />
								<Text
									className={meemTheme.tBadgeText}
									style={{
										color: colorRed
									}}
								>
									Please ensure Symphony Bot has full access
									to channels in Discord
								</Text>
							</div>
						</>
					)}
				</>
			)}

			{form.values.publishType === API.PublishType.Proposal && (
				<>
					<Space h={'lg'} />
					<Text className={meemTheme.tExtraSmallLabel}>
						PROPOSALS
					</Text>
					<Space h={4} />
					<Text className={meemTheme.tExtraSmall}>
						Who can propose a post?
					</Text>
					{roles && (
						<>
							<Space h={8} />

							<MultiSelect
								multiple
								data={roles.map(c => ({
									value: c.id,
									label: c.name
								}))}
								{...form.getInputProps('proposerRoles')}
							/>
						</>
					)}
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
										<Emoji unified={e} size={25} />
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
							setEmojiSelectType(EmojiSelectType.Proposer)
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
					<NumberInput {...form.getInputProps('proposeVotes')} />
				</>
			)}
			<Space h="lg" />

			<Text className={meemTheme.tExtraSmallLabel}>VOTES</Text>
			<Space h={4} />

			<Text className={meemTheme.tExtraSmall}>
				Who can vote to approve new posts for publication?
			</Text>
			<Space h={8} />
			{roles && (
				<MultiSelect
					multiple
					data={roles.map(c => ({
						value: c.id,
						label: c.name
					}))}
					{...form.getInputProps('approverRoles')}
				/>
			)}
			<Space h="lg" />
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
									approverEmojis.filter(ae => ae !== e)
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
			{form.values.publishType === API.PublishType.Proposal && (
				<>
					<Space h={'lg'} />
					<Text className={meemTheme.tExtraSmallLabel}>
						DISCORD CHANNEL FOR PROPOSALS
					</Text>
					<Space h={4} />
					<Text className={meemTheme.tExtraSmall}>
						What Discord channel will new proposals be shared in?
					</Text>
					{channels && (
						<>
							<Space h={8} />

							<Select
								data={channels.map(c => ({
									value: c.id,
									label: c.name
								}))}
								{...form.getInputProps('proposalShareChannel')}
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
											color={colorRed}
											height={16}
											width={16}
										/>
										<Space w={4} />
										<Text
											className={meemTheme.tBadgeText}
											style={{
												color: colorRed
											}}
										>
											Please ensure Symphony Bot has full
											access to channels in Discord
										</Text>
									</div>
								</>
							)}
						</>
					)}
				</>
			)}

			<Space h={'lg'} />
			<Text className={meemTheme.tExtraSmallLabel}>VETOES</Text>
			<Space h={4} />
			<Text className={meemTheme.tExtraSmall}>Can posts be vetoed?</Text>
			<Switch
				label="Yes, posts can be vetoed"
				{...form.getInputProps('canVeto', { type: 'checkbox' })}
			/>
			{form.values.canVeto && (
				<>
					<Space h={'lg'} />

					<Text className={meemTheme.tExtraSmall}>Who can veto?</Text>
					<Space h={8} />
					{roles && (
						<MultiSelect
							multiple
							data={roles.map(c => ({
								value: c.id,
								label: c.name
							}))}
							{...form.getInputProps('vetoerRoles')}
						/>
					)}
					<Space h="lg" />
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
										<Emoji unified={e} size={25} />
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
							setEmojiSelectType(EmojiSelectType.Vetoer)
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
					<NumberInput {...form.getInputProps('vetoVotes')} />
				</>
			)}
			<Space h={'lg'} />
			<Text className={meemTheme.tExtraSmallLabel}>AUTO REPLY</Text>
			<Space h={4} />
			<Text className={meemTheme.tExtraSmall}>
				Would you like Symphony to reply to approved proposals with a
				link to the published tweet?
			</Text>
			<Switch
				label="Yes, reply with a link"
				{...form.getInputProps('shouldReply', { type: 'checkbox' })}
			/>
			<Modal
				withCloseButton={false}
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
	)
}
