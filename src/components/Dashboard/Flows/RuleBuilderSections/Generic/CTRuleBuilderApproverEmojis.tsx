import { Text, Space, Button } from '@mantine/core'
import { MeemAPI } from '@meemproject/sdk'
import { Emoji } from 'emoji-picker-react'
// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react'
import { useMeemTheme } from '../../../../Styles/MeemTheme'

interface IProps {
	approverEmojis: MeemAPI.IEmoji[]
	onApproverEmojisSet: (emojis: MeemAPI.IEmoji[]) => void
	onAddEmojisPressed: () => void
}

export const CTRuleBuilderApproverEmojis: React.FC<IProps> = ({
	approverEmojis,
	onApproverEmojisSet,
	onAddEmojisPressed
}) => {
	const { classes: meemTheme } = useMeemTheme()

	return (
		<>
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
							key={`approvalEmoji-${e.id}`}
							style={{
								display: 'flex',
								flexDirection: 'row',
								cursor: 'pointer'
							}}
							onClick={() => {
								onApproverEmojisSet(
									approverEmojis.filter(ae => ae.id !== e.id)
								)
							}}
						>
							{e.unified && e.unified.length > 0 && (
								<Emoji unified={e.unified} size={25} />
							)}
							{e.url && (
								<img
									src={e.url}
									alt={e.name}
									style={{ width: 25, height: 25 }}
								/>
							)}

							<Space w="xs" />
						</div>
					))}
				</div>
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
		</>
	)
}
