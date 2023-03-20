import { Text, Space, MultiSelect } from '@mantine/core'
import { WarningCircle } from 'iconoir-react'
// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react'
import { colorOrangeRed, useMeemTheme } from '../../../../../Styles/MeemTheme'
import { API } from '../../../symphonyTypes.generated'

interface IProps {
	form: any
	channelsData: API.v1.GetSlackChannels.IResponseBody
	//rolesData: API.v1.GetDiscordRoles.IResponseBody
	isProposalChannelGated: boolean
}

export const SymphSlackInputRBProposals: React.FC<IProps> = ({
	// eslint-disable-next-line @typescript-eslint/no-shadow
	form,
	channelsData,
	//rolesData,
	isProposalChannelGated
}) => {
	const { classes: meemTheme } = useMeemTheme()

	return (
		<>
			<Text className={meemTheme.tExtraSmallLabel}>PROPOSALS</Text>
			<Space h={24} />

			<Text className={meemTheme.tExtraSmallBold}>
				{'What channel will new proposals be shared in?'}
			</Text>
			<Space h={4} />
			<Text
				className={meemTheme.tExtraSmallFaded}
				style={{ fontWeight: 500 }}
			>
				{'Please choose one channel'}
			</Text>

			{channelsData.channels && (
				<>
					<Space h={12} />
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
									Please ensure Symphony Bot has full access
									to channels in Discord
								</Text>
							</div>
						</>
					)}
				</>
			)}

			<Space h="lg" />

			<Text className={meemTheme.tExtraSmallBold}>
				{'Who can vote to approve new posts for publishing?'}
			</Text>
			<Space h={4} />
			<Text
				className={meemTheme.tExtraSmallFaded}
				style={{ fontWeight: 500 }}
			>
				{'Please choose as many Discord roles as you want.'}
			</Text>
			{/* <Space h={12} />

			{rolesData.roles && (
				<MultiSelect
					multiple
					data={rolesData.roles.map(c => ({
						value: c.id,
						label: c.name
					}))}
					{...form.getInputProps('approverRoles')}
				/>
			)} */}
			<Space h="lg" />
		</>
	)
}
