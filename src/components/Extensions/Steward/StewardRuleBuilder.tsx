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
import React, { useCallback, useState } from 'react'
import { useMeemTheme } from '../../Styles/MeemTheme'
import { API } from './stewardTypes.generated'

const EmojiPicker = dynamic(() => import('emoji-picker-react'), {
	ssr: false
})

export interface IProps {
	channels?: API.IDiscordChannel[]
	roles?: API.IDiscordRole[]
	selectedRule?: API.ISavedRule
	onSave: (values: IOnSave) => void
}

export enum EmojiSelectType {
	Proposer = 'proposer',
	Approver = 'approver'
}

export interface IFormValues
	extends Omit<API.IRule, 'proposerEmojis' | 'approverEmojis' | 'action'> {}

export interface IOnSave extends IFormValues {
	proposerEmojis: string[]
	approverEmojis: string[]
}

export const StewardRuleBuilder: React.FC<IProps> = ({
	channels,
	roles,
	selectedRule,
	onSave
}) => {
	// Default extension settings / properties - leave these alone if possible!
	const { classes: meemTheme } = useMeemTheme()
	console.log({ selectedRule })
	const form = useForm({
		initialValues: {
			publishType: API.PublishType.PublishImmediately,
			proposerRoles: selectedRule?.proposerRoles
				? Object.values(selectedRule.proposerRoles)
				: [],
			approverRoles: selectedRule?.approverRoles
				? Object.values(selectedRule.approverRoles)
				: [],
			proposalChannels: selectedRule?.proposalChannels
				? Object.values(selectedRule.proposalChannels)
				: [],
			proposalShareChannel: selectedRule?.proposalShareChannel ?? '',
			votes: selectedRule?.votes ?? 1,
			shouldReply: selectedRule?.shouldReply ?? true
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
	const [emojiSelectType, setEmojiSelectType] = useState<EmojiSelectType>(
		EmojiSelectType.Approver
	)
	const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)

	const handleEmojiClick = useCallback(
		async (emojiObject: EmojiClickData) => {
			if (emojiSelectType === EmojiSelectType.Proposer) {
				setProposerEmojis(
					uniq([...proposerEmojis, emojiObject.unified])
				)
			} else {
				setApproverEmojis(
					uniq([...approverEmojis, emojiObject.unified])
				)
			}
			setIsEmojiPickerOpen(false)
		},
		[emojiSelectType, approverEmojis, proposerEmojis]
	)

	const handleFormSubmit = async (values: IFormValues) => {
		onSave({
			...values,
			approverEmojis,
			proposerEmojis
		})
	}

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
			<Space h="md" />
			{form.values.publishType === API.PublishType.Proposal && (
				<>
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
							<>
								<Emoji
									key={`proposerEmoji-${e}`}
									unified={e}
									size={25}
								/>
								<Space w="xs" />
							</>
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
				</>
			)}
			<Text>Who can vote to approve new posts for publication?</Text>
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
							{...form.getInputProps('proposerChannel')}
						/>
					)}
				</>
			)}
			{/* {channels && (
				<MultiSelect
					label="Discord Channel"
					data={[
						{ value: 'all', label: 'All Channels' },
						...channels.map(c => ({
							value: c.id,
							label: c.name
						}))
					]}
					{...form.getInputProps('channel')}
				/>
			)} */}
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
					<div key={`approvalEmoji-${e}`}>
						<Emoji unified={e} size={25} />
						<Space w="xs" />
					</div>
				))}
			</div>

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
			<Text>
				Would you like Steward to reply to approved proposals with a
				link to the published tweet?
			</Text>
			<Switch
				label="Yes, reply with a link"
				defaultChecked
				{...form.getInputProps('shouldReply')}
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
