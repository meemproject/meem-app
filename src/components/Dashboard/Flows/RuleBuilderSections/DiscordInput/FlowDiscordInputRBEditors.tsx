import {
	Text,
	Space,
	MultiSelect,
	Button,
	NumberInput,
	Radio,
	Stack
} from '@mantine/core'
import { MeemAPI } from '@meemproject/sdk'
import { Emoji } from 'emoji-picker-react'
// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react'
import { useMeemTheme } from '../../../../Styles/MeemTheme'

interface IProps {
	form: any
	rolesData: MeemAPI.v1.GetDiscordRoles.IResponseBody
	editorEmojis: MeemAPI.IEmoji[]
	onEditorEmojisSet: (emojis: MeemAPI.IEmoji[]) => void
	onAddEmojisPressed: () => void
}

export const FlowDiscordInputRBEditors: React.FC<IProps> = ({
	// eslint-disable-next-line @typescript-eslint/no-shadow
	form,
	rolesData,
	editorEmojis,
	onEditorEmojisSet,
	onAddEmojisPressed
}) => {
	const { classes: meemTheme } = useMeemTheme()

	return (
		<>
			<Text className={meemTheme.tExtraSmallBold}>
				When are posts published?
			</Text>
			<Space h={8} />

			<Radio.Group
				size="sm"
				color="dark"
				value={form.values.publishType}
				onChange={(value: any) => {
					form.setFieldValue('publishType', value)
				}}
				required
			>
				<Stack>
					<Radio
						value={MeemAPI.PublishType.PublishImmediately}
						label="Posts are automatically published when they’ve received enough votes"
					/>
					<Radio
						value={MeemAPI.PublishType.PublishAfterApproval}
						label="Posts require editor approval before publishing"
					/>
					<Radio
						value={
							MeemAPI.PublishType
								.PublishImmediatelyOrEditorApproval
						}
						label="Posts are published when they’ve received enough votes OR have received editor approval"
					/>
				</Stack>
			</Radio.Group>

			{(form.values.publishType ===
				MeemAPI.PublishType.PublishAfterApproval ||
				form.values.publishType ===
					MeemAPI.PublishType.PublishImmediatelyOrEditorApproval) && (
				<>
					<Space h={'lg'} />
					<Text className={meemTheme.tExtraSmallLabel}>
						EDITOR APPROVAL
					</Text>
					<Space h={24} />
					<Text className={meemTheme.tExtraSmallBold}>
						{'Who must approve new posts for publishing?'}
					</Text>
					<Space h={4} />
					<Text
						className={meemTheme.tExtraSmallFaded}
						style={{ fontWeight: 500 }}
					>
						{'Please choose as many Discord roles as you want.'}
					</Text>
					<Space h={12} />
					{rolesData.roles && (
						<MultiSelect
							multiple
							data={rolesData.roles.map(c => ({
								value: c.id,
								label: c.name
							}))}
							{...form.getInputProps('editorRoles')}
						/>
					)}
					<Space h="lg" />

					<Text className={meemTheme.tExtraSmallBold}>
						Which emojis will count as affirmative votes?
					</Text>
					<Space h={4} />
					<Text
						className={meemTheme.tExtraSmallFaded}
						style={{ fontWeight: 500 }}
					>
						{'Please choose as many emojis as you want.'}
					</Text>

					{editorEmojis.length > 0 && (
						<>
							<Space h={4} />

							<div
								style={{
									display: 'flex',
									flexDirection: 'row'
								}}
							>
								{editorEmojis.map(e => (
									<div
										style={{
											display: 'flex',
											flexDirection: 'row'
										}}
										key={`editorEmoji-${e.id}`}
										onClick={() => {
											onEditorEmojisSet(
												editorEmojis.filter(
													ve => ve.id !== e.id
												)
											)
										}}
									>
										{e.unified && e.unified.length > 0 && (
											<Emoji
												unified={e.unified}
												size={25}
											/>
										)}
										{e.url && (
											<img
												src={e.url}
												alt={e.name}
												style={{
													width: 25,
													height: 25
												}}
											/>
										)}
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
							onAddEmojisPressed()
						}}
					>
						+ Add Emoji
					</Button>
					<Space h="lg" />
					<Text className={meemTheme.tExtraSmallBold}>
						{
							'How many affirmative votes must a proposed post receive before it’s approved for publishing?'
						}
					</Text>
					<Space h={4} />
					<Text
						className={meemTheme.tExtraSmallFaded}
						style={{ fontWeight: 500 }}
					>
						{'Please enter a number greater than 0 below.'}
					</Text>

					<Space h={12} />
					<NumberInput
						{...form.getInputProps('editorVotes')}
						defaultValue={1}
					/>
				</>
			)}
		</>
	)
}
