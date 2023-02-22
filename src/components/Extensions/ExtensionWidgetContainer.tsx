import {
	Accordion,
	Space,
	Text,
	Image,
	useMantineColorScheme
} from '@mantine/core'
import { Settings } from 'iconoir-react'
import React from 'react'
import { toTitleCase } from '../../utils/strings'
import { useAgreement } from '../AgreementHome/AgreementProvider'
import { colorDarkerGrey, useMeemTheme } from '../Styles/MeemTheme'

interface IProps {
	children: React.ReactNode
	extensionSlug: string
	onSettingsOpened: () => void
}

export const ExtensionWidgetContainer: React.FC<IProps> = ({
	children,
	extensionSlug,
	onSettingsOpened
}) => {
	const { classes: meemTheme } = useMeemTheme()
	const { colorScheme } = useMantineColorScheme()
	const isDarkTheme = colorScheme === 'dark'

	const { agreement } = useAgreement()

	const extensionName = toTitleCase(extensionSlug.replaceAll('-', ' '))

	return (
		<>
			<div className={meemTheme.widgetExtension}>
				<Accordion
					radius="md"
					className={meemTheme.widgetAccordion}
					classNames={{
						panel: meemTheme.widgetAccordionBackground,
						control: meemTheme.widgetAccordionBackground
					}}
					chevronPosition="left"
					variant="filled"
					defaultValue="1"
				>
					<Accordion.Item
						value="1"
						style={{
							backgroundColor: isDarkTheme
								? colorDarkerGrey
								: 'white'
						}}
					>
						<div className={meemTheme.centeredRow}>
							<Accordion.Control>
								<div className={meemTheme.centeredRow}>
									<Image
										src={
											isDarkTheme
												? `/integration-${extensionSlug}-white.png`
												: `/integration-${extensionSlug}.png`
										}
										width={24}
										height={24}
									/>
									<Space w={16} />
									<Text className={meemTheme.tMediumBold}>
										{extensionName}
									</Text>
								</div>
							</Accordion.Control>
							{agreement?.isCurrentUserAgreementAdmin && (
								<Settings
									className={meemTheme.clickable}
									onClick={() => {
										onSettingsOpened()
									}}
								/>
							)}
							<Space w={16} />
						</div>

						<Accordion.Panel>{children}</Accordion.Panel>
					</Accordion.Item>
				</Accordion>
			</div>
		</>
	)
}
