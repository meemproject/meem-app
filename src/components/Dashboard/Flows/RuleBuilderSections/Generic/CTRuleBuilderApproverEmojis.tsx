import { Text, Space, Button } from '@mantine/core'
import { Emoji } from 'emoji-picker-react'
// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react'
import { useMeemTheme } from '../../../../Styles/MeemTheme'

interface IProps {
	approverEmojis: string[]
	onApproverEmojisSet: (emojis: string[]) => void
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
							key={`approvalEmoji-${e}`}
							style={{
								display: 'flex',
								flexDirection: 'row',
								cursor: 'pointer'
							}}
							onClick={() => {
								onApproverEmojisSet(
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
					onAddEmojisPressed()
				}}
			>
				+ Add Emoji
			</Button>
			<Space h="lg" />
		</>
	)
}
