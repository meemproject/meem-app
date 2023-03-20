import { Text, Space, NumberInput } from '@mantine/core'
// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react'
import { useMeemTheme } from '../../../../../Styles/MeemTheme'

interface IProps {
	form: any
}

export const SymphRuleBuilderVotesCount: React.FC<IProps> = ({ form }) => {
	const { classes: meemTheme } = useMeemTheme()

	return (
		<>
			<Text className={meemTheme.tExtraSmallBold}>
				{
					"How many affirmative votes must a proposed post receive before it's approved?"
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
			<NumberInput {...form.getInputProps('votes')} />

			<Space h={'lg'} />
		</>
	)
}
