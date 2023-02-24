import log from '@kengoldfarb/log'
import {
	Accordion,
	Space,
	Text,
	Image,
	useMantineColorScheme
} from '@mantine/core'
import { Settings } from 'iconoir-react'
import Cookies from 'js-cookie'
import React from 'react'
import { deslugify } from '../../utils/strings'
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

	const extensionName = deslugify(extensionSlug)

	const accordionCookie = `${agreement?.slug}-${extensionSlug}-accordion`
	const value = Cookies.get(accordionCookie) ?? '1'

	return (
		<>
			<div className={meemTheme.widgetExtension}>
				<Accordion
					defaultValue={value}
					radius="md"
					className={meemTheme.widgetAccordion}
					classNames={{
						panel: meemTheme.widgetAccordionBackground,
						control: meemTheme.widgetAccordionBackground
					}}
					onChange={newValue => {
						const position = newValue === null ? '0' : '1'
						log.debug(`onChange pos = ${position}`)

						Cookies.set(accordionCookie, position)
					}}
					chevronPosition="left"
					variant="filled"
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
