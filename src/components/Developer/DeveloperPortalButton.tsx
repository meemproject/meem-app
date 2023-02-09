import {
	Text,
	Space,
	Modal,
	Button,
	useMantineColorScheme
} from '@mantine/core'
import { Link } from 'iconoir-react'
import React, { useState } from 'react'
import {
	colorDarkerGrey,
	colorLightYellow,
	useMeemTheme
} from '../Styles/MeemTheme'

interface IProps {
	portalButtonText: string
	modalTitle: string
	modalText: string
	devDocsLink?: string
	githubLink?: string
}

export const DeveloperPortalButton: React.FC<IProps> = ({
	portalButtonText,
	modalTitle,
	modalText,
	devDocsLink,
	githubLink
}) => {
	const { classes: meemTheme } = useMeemTheme()

	const [isPortalModalOpen, setIsPortalModalOpen] = useState(false)

	const { colorScheme } = useMantineColorScheme()

	const isDarkTheme = colorScheme === 'dark'

	return (
		<>
			<Button
				className={meemTheme.buttonYellowSolidBordered}
				onClick={() => {
					setIsPortalModalOpen(true)
				}}
			>
				{portalButtonText}
			</Button>
			<Modal
				centered
				radius={16}
				overlayBlur={8}
				size={'60%'}
				padding={'lg'}
				opened={isPortalModalOpen}
				onClose={() => {
					setIsPortalModalOpen(false)
				}}
				title={
					<Text className={meemTheme.tExtraSmallLabel}>
						{`Developer Portal`.toUpperCase()}
					</Text>
				}
			>
				<Text
					className={meemTheme.tMediumBold}
					style={{ marginTop: -24 }}
				>
					{modalTitle}
				</Text>
				<Space h={24} />
				<div
					style={{
						backgroundColor: isDarkTheme
							? colorDarkerGrey
							: colorLightYellow,
						padding: 24,
						borderRadius: 16
					}}
				>
					<Text className={meemTheme.tSmall}>{modalText}</Text>
					{(devDocsLink || githubLink) && (
						<>
							<Space h={16} />
							<div className={meemTheme.row}>
								{devDocsLink && (
									<>
										<Button
											leftIcon={<Link />}
											className={meemTheme.buttonBlack}
											onClick={() => {
												window.open(devDocsLink)
											}}
										>
											Dev Docs
										</Button>
										<Space w={16} />
									</>
								)}
								{githubLink && (
									<>
										<Button
											leftIcon={<Link />}
											className={meemTheme.buttonBlack}
											onClick={() => {
												window.open(githubLink)
											}}
										>
											GitHub
										</Button>
									</>
								)}
							</div>
						</>
					)}
				</div>
			</Modal>
		</>
	)
}
