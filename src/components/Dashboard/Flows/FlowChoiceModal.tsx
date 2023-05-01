import {
	Text,
	Space,
	Modal,
	Container,
	Button,
	Grid,
	Center
} from '@mantine/core'
// eslint-disable-next-line import/no-extraneous-dependencies
import { Cancel } from 'iconoir-react'
import React, { useState } from 'react'
import { useMeemTheme } from '../../Styles/MeemTheme'
import { CTInputOutputModal } from './Modals/CTInputOutputModal'
import { ConnectedAccount } from './Model/communityTweets'

interface IProps {
	isOpened: boolean
	onModalClosed: () => void
	connectedAccounts: ConnectedAccount[]
}

export const FlowChoiceModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed,
	connectedAccounts
}) => {
	const { classes: meemTheme } = useMeemTheme()

	const [isNewRuleModalOpen, setIsNewRuleModalOpen] = useState(false)

	const template = (
		category: string,
		title: string,
		description: string,
		onClick: () => void,
		isComingSoon: boolean
	) => (
		<Grid.Col xs={12} md={4} key={title}>
			<div className={meemTheme.gridItemFlowTemplate}>
				<Text className={meemTheme.tExtraSmallLabel}>{category}</Text>
				<Space h={24} />
				<Text className={meemTheme.tMediumBold}>{title}</Text>
				<Space h={8} />
				<Text className={meemTheme.tSmall} style={{ minHeight: 70 }}>
					{description}
				</Text>
				<Space h={32} />
				<Button
					onClick={onClick}
					className={
						isComingSoon
							? meemTheme.buttonGrey
							: meemTheme.buttonBlack
					}
				>
					{isComingSoon ? 'Learn More' : 'Continue'}
				</Button>
			</div>
		</Grid.Col>
	)

	const modalContents = (
		<div style={{ position: 'relative' }}>
			<Space h={32} />
			<Center>
				<Text className={meemTheme.tLargeBold}>Add New Flow</Text>
			</Center>
			<Space h={8} />
			<Center>
				<Text>
					To get started, choose a template below or opt to create
					custom logic.
				</Text>
			</Center>

			<Space h={48} />
			<Container>
				<Text className={meemTheme.tExtraSmallLabel}>AVAILABLE</Text>
				<Space h={16} />
				<Grid>
					{template(
						'📰 Community news'.toUpperCase(),
						'Discord Community Tweets',
						'Draft tweets on Discord and publish to Twitter',
						() => {},
						false
					)}
					{template(
						'📰 Community news'.toUpperCase(),
						'Slack Community Tweets',
						'Draft tweets on Slack and publish to Twitter',
						() => {},
						false
					)}
					{template(
						'✨ Custom'.toUpperCase(),
						'Custom Flow',
						'Choose your own inputs and outputs to build out custom publishing logic',
						() => {
							setIsNewRuleModalOpen(true)
							onModalClosed()
						},
						false
					)}
				</Grid>
				<Space h={24} />
				<Text className={meemTheme.tExtraSmallLabel}>COMING SOON</Text>
				<Space h={16} />
				<Grid>
					{template(
						'📚 Community libraries'.toUpperCase(),
						'Community Brain',
						'Ask AI what your community knows',
						() => {},
						true
					)}
					{template(
						'📰 Community news'.toUpperCase(),
						'Collaborative Newsletters',
						'Publish newsletters together as a community',
						() => {},
						true
					)}
					{template(
						'🛒 Community markets'.toUpperCase(),
						'Public Market Websites',
						'Grassroots local market website managed by your community',
						() => {},
						true
					)}
				</Grid>
				<Space h={48} />
			</Container>
			<Cancel
				style={{
					position: 'absolute',
					top: 8,
					right: 8,
					cursor: 'pointer'
				}}
				onClick={() => {
					onModalClosed()
				}}
			/>
		</div>
	)

	return (
		<>
			<Modal
				fullScreen
				padding={'lg'}
				classNames={{
					root: meemTheme.backgroundMeem,
					content: meemTheme.backgroundMeem
				}}
				withCloseButton={false}
				opened={isOpened}
				onClose={() => {
					onModalClosed()
				}}
			>
				{modalContents}
			</Modal>

			<CTInputOutputModal
				isOpened={isNewRuleModalOpen}
				connectedAccounts={connectedAccounts}
				onModalClosed={function (): void {
					setIsNewRuleModalOpen(false)
				}}
			/>
		</>
	)
}
