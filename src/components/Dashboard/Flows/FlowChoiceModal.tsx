import {
	Text,
	Space,
	Modal,
	Container,
	Button,
	Grid,
	Center,
	MantineProvider
} from '@mantine/core'
// eslint-disable-next-line import/no-extraneous-dependencies
import { MeemAPI } from '@meemproject/sdk'
import { Cancel } from 'iconoir-react'
import React, { useState } from 'react'
import { useMeemTheme } from '../../Styles/MeemTheme'
import { FlowInputOutputModal } from './Modals/FlowInputOutputModal'
import { ConnectedAccount } from './Model/flows'

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
	const [templateInputPlatform, setTemplateInputPlatform] = useState<
		MeemAPI.RuleIo | undefined
	>()
	const [templateOutputPlatform, setTemplateOutputPlatform] = useState<
		MeemAPI.RuleIo | undefined
	>()

	const ModalContents: React.FC = () => {
		const { classes: meemThemeLight } = useMeemTheme()

		const template = (
			category: string,
			title: string,
			description: string,
			onClick: () => void,
			isComingSoon: boolean
		) => (
			<Grid.Col xs={12} md={4} key={title}>
				<div className={meemThemeLight.gridItemFlowTemplate}>
					<Text className={meemThemeLight.tExtraSmallLabel}>
						{category}
					</Text>
					<Space h={24} />
					<Text className={meemThemeLight.tMediumBold}>{title}</Text>
					<Space h={8} />
					<Text
						className={meemThemeLight.tSmall}
						style={{ minHeight: 70 }}
					>
						{description}
					</Text>
					<Space h={32} />
					<Button
						onClick={onClick}
						className={
							isComingSoon
								? meemThemeLight.buttonGrey
								: meemThemeLight.buttonBlack
						}
					>
						{isComingSoon ? 'Learn More' : 'Continue'}
					</Button>
				</div>
			</Grid.Col>
		)

		return (
			<>
				<div style={{ position: 'relative' }}>
					<Space h={32} />
					<Center>
						<Text className={meemThemeLight.tLargeBold}>
							Add New Flow
						</Text>
					</Center>
					<Space h={8} />
					<Center>
						<Text>
							To get started, choose a template below or opt to
							create custom logic.
						</Text>
					</Center>

					<Space h={48} />
					<Container>
						<Text className={meemThemeLight.tExtraSmallLabel}>
							AVAILABLE
						</Text>
						<Space h={16} />
						<Grid>
							{template(
								'📰 Community news'.toUpperCase(),
								'Discord Community Tweets',
								'Draft tweets on Discord and publish to Twitter',
								() => {
									setTemplateInputPlatform(
										MeemAPI.RuleIo.Discord
									)
									setTemplateOutputPlatform(
										MeemAPI.RuleIo.Twitter
									)
									setIsNewRuleModalOpen(true)
									onModalClosed()
								},
								false
							)}
							{template(
								'📰 Community news'.toUpperCase(),
								'Slack Community Tweets',
								'Draft tweets on Slack and publish to Twitter',
								() => {
									setTemplateInputPlatform(
										MeemAPI.RuleIo.Slack
									)
									setTemplateOutputPlatform(
										MeemAPI.RuleIo.Twitter
									)
									setIsNewRuleModalOpen(true)
									onModalClosed()
								},
								false
							)}
							{template(
								'✨ Custom'.toUpperCase(),
								'Custom Flow',
								'Choose your own inputs and outputs to build out custom publishing logic',
								() => {
									setTemplateInputPlatform(undefined)
									setTemplateOutputPlatform(undefined)
									setIsNewRuleModalOpen(true)
									onModalClosed()
								},
								false
							)}
						</Grid>
						<Space h={24} />
						<Text className={meemThemeLight.tExtraSmallLabel}>
							COMING SOON
						</Text>
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
			</>
		)
	}

	return (
		<>
			<MantineProvider
				theme={{
					colorScheme: 'light',
					fontFamily: 'Inter, sans-serif'
				}}
			>
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
					<ModalContents />
				</Modal>
			</MantineProvider>
			<FlowInputOutputModal
				isOpened={isNewRuleModalOpen}
				connectedAccounts={connectedAccounts}
				templateInputPlatform={templateInputPlatform}
				templateOutputPlatform={templateOutputPlatform}
				onModalClosed={function (): void {
					setIsNewRuleModalOpen(false)
				}}
			/>
		</>
	)
}
