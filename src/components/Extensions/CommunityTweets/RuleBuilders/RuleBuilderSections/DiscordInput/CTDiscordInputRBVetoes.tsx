import {
	Text,
	Space,
	MultiSelect,
	Button,
	NumberInput,
	Switch
} from '@mantine/core'
import { MeemAPI } from '@meemproject/sdk'
import { Emoji } from 'emoji-picker-react'
// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react'
import { useMeemTheme } from '../../../../../Styles/MeemTheme'

interface IProps {
	form: any
	rolesData: MeemAPI.v1.GetDiscordRoles.IResponseBody
	vetoerEmojis: string[]
	onVetoerEmojisSet: (emojis: string[]) => void
	onAddEmojisPressed: () => void
}

export const CTDiscordInputRBVetoes: React.FC<IProps> = ({
	// eslint-disable-next-line @typescript-eslint/no-shadow
	form,
	rolesData,
	vetoerEmojis,
	onVetoerEmojisSet,
	onAddEmojisPressed
}) => {
	const { classes: meemTheme } = useMeemTheme()

	return (
		<>
			<Text className={meemTheme.tExtraSmallLabel}>VETOES</Text>
			<Space h={24} />
			<Text className={meemTheme.tExtraSmallBold}>
				Can proposals be vetoed?
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

					<Text className={meemTheme.tExtraSmallBold}>
						{'Who can veto a proposal?'}
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
							{...form.getInputProps('vetoerRoles')}
						/>
					)}
					<Space h="lg" />

					<Text className={meemTheme.tExtraSmallBold}>
						Which emojis will count as vetos?
					</Text>
					<Space h={4} />
					<Text
						className={meemTheme.tExtraSmallFaded}
						style={{ fontWeight: 500 }}
					>
						{'Please choose as many emojis as you want.'}
					</Text>

					{vetoerEmojis.length > 0 && (
						<>
							<Space h={4} />

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
											onVetoerEmojisSet(
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
							onAddEmojisPressed()
						}}
					>
						+ Add Emoji
					</Button>
					<Space h="lg" />
					<Text className={meemTheme.tExtraSmallBold}>
						{
							'How many vetoes must a proposed post receive before it’s rejected?'
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
					<NumberInput {...form.getInputProps('vetoVotes')} />
				</>
			)}
		</>
	)
}
