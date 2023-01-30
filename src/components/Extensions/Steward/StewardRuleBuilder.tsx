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
import { uniq } from 'lodash'
import dynamic from 'next/dynamic'
import React, { useCallback, useEffect, useState } from 'react'
// import { useMeemTheme } from '../../Styles/MeemTheme'
import { API } from './stewardTypes.generated'

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

export const StewardRuleBuilder: React.FC<IProps> = ({
	channels,
	roles,
	selectedRule,
	onSave
}) => {
	// Default extension settings / properties - leave these alone if possible!
	// const { classes: meemTheme } = useMeemTheme()

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
			proposalChannels: val =>
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
	}, [selectedRule])

	console.log(form.values)

	return (
		<form onSubmit={form.onSubmit(values => handleFormSubmit(values))}>
			<Text>What rule type should we follow?</Text>
			<Space h="xs" />
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
			<Space h="md" />
			<Text>
				{form.values.publishType === API.PublishType.PublishImmediately
					? 'From what channels should we publish?'
					: 'In what channels can a proposal be submitted?'}
			</Text>
			<Space h="xs" />
			{channels && (
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
			)}

			{form.values.publishType === API.PublishType.Proposal && (
				<>
					<Space h="md" />
					<Text>Who can propose a new post?</Text>
					<Space h="xs" />
					{roles && (
						<MultiSelect
							multiple
							data={roles.map(c => ({
								value: c.id,
								label: c.name
							}))}
							{...form.getInputProps('proposerRoles')}
						/>
					)}
					<Space h="md" />
					<Text>Which emojis will create a proposal?</Text>
					<Space h="xs" />
					<div
						style={{
							display: 'flex',
							flexDirection: 'row'
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
										proposerEmojis.filter(pe => pe !== e)
									)
								}}
							>
								<Emoji unified={e} size={25} />
								<Space w="xs" />
							</div>
						))}
					</div>
					<Space h="xs" />
					<Button
						onClick={() => {
							setEmojiSelectType(EmojiSelectType.Proposer)
							setIsEmojiPickerOpen(true)
						}}
					>
						Add emoji
					</Button>

					<Space h="md" />
					<Text>{'How many proposal reactions?'}</Text>
					<Space h="xs" />
					<NumberInput {...form.getInputProps('proposeVotes')} />
					<Space h="md" />
					<Text>
						Who can vote to approve new posts for publication?
					</Text>
					<Space h="xs" />
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
				</>
			)}
			<Space h="md" />
			<Text>Which emojis will count as affirmative votes?</Text>
			<Space h="xs" />
			<div
				style={{
					display: 'flex',
					flexDirection: 'row'
				}}
			>
				{approverEmojis.map(e => (
					<div
						key={`approvalEmoji-${e}`}
						style={{
							display: 'flex',
							flexDirection: 'row'
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
			<Space h="xs" />
			<Button
				onClick={() => {
					setEmojiSelectType(EmojiSelectType.Approver)
					setIsEmojiPickerOpen(true)
				}}
			>
				Add emoji
			</Button>
			<Space h="md" />
			<Text>
				{
					"How many affirmative votes must a proposed post receive before it's approved?"
				}
			</Text>
			<Space h="xs" />
			<NumberInput {...form.getInputProps('votes')} />
			<Space h="md" />
			{form.values.publishType === API.PublishType.Proposal && (
				<>
					<Text>
						What Discord channel will new proposals be shared in?
					</Text>
					<Space h="xs" />
					{channels && (
						<Select
							data={channels.map(c => ({
								value: c.id,
								label: c.name
							}))}
							{...form.getInputProps('proposalShareChannel')}
						/>
					)}
				</>
			)}

			<Space h="md" />
			<Text>Can posts be vetoed?</Text>
			<Switch
				label="Yes, posts can be vetoed"
				{...form.getInputProps('canVeto', { type: 'checkbox' })}
			/>
			<Space h="md" />
			{form.values.canVeto && (
				<>
					<Text>Who can veto?</Text>
					<Space h="xs" />
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
					<Space h="md" />
					<Text>Which emojis will count as a veto?</Text>
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
								key={`approvalEmoji-${e}`}
								onClick={() => {
									setVetoerEmojis(
										vetoerEmojis.filter(ve => ve !== e)
									)
								}}
							>
								<Emoji unified={e} size={25} />
								<Space w="xs" />
							</div>
						))}
					</div>
					<Space h="xs" />
					<Button
						onClick={() => {
							setEmojiSelectType(EmojiSelectType.Vetoer)
							setIsEmojiPickerOpen(true)
						}}
					>
						Add emoji
					</Button>
					<Space h="md" />
					<Text>{'How many vetoes are required?'}</Text>
					<Space h="xs" />
					<NumberInput {...form.getInputProps('vetoVotes')} />
				</>
			)}
			<Space h="md" />
			<Text>
				Would you like Steward to reply to approved proposals with a
				link to the published tweet?
			</Text>
			<Switch
				label="Yes, reply with a link"
				{...form.getInputProps('shouldReply', { type: 'checkbox' })}
			/>
			<Modal
				opened={isEmojiPickerOpen}
				onClose={() => setIsEmojiPickerOpen(false)}
			>
				<EmojiPicker onEmojiClick={handleEmojiClick} />
			</Modal>
			<Space h="md" />
			<Button type="submit">Save</Button>
		</form>
	)
}
