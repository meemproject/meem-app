import { Text, Space, Switch } from '@mantine/core'
// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react'
import { useMeemTheme } from '../../../../Styles/MeemTheme'

interface IProps {
	form: any
}

export const FlowTwitterOutputAutoReply: React.FC<IProps> = ({
	// eslint-disable-next-line @typescript-eslint/no-shadow
	form
}) => {
	const { classes: meemTheme } = useMeemTheme()

	return (
		<>
			<Space h={32} />

			<Text className={meemTheme.tExtraSmallLabel}>PUBLISHING</Text>
			<Space h={24} />
			<Text className={meemTheme.tExtraSmallBold}>
				Would you like Community Tweets to reply to approved proposals
				with a link to the published tweet?
			</Text>
			<Space h={8} />
			<Switch
				label="Yes, reply with a link"
				{...form.getInputProps('shouldReply', {
					type: 'checkbox'
				})}
			/>
		</>
	)
}
