import { Text, Modal, Divider } from '@mantine/core'
import React from 'react'
import { toTitleCase } from '../../utils/strings'
import { useMeemTheme } from '../Styles/MeemTheme'

interface IProps {
	children?: React.ReactNode
	extensionSlug: string
	isOpened: boolean
	onModalClosed: () => void
}

export const ExtensionSettingsModal: React.FC<IProps> = ({
	children,
	extensionSlug,
	isOpened,
	onModalClosed
}) => {
	const { classes: meemTheme } = useMeemTheme()

	const extensionName = toTitleCase(extensionSlug.replaceAll('-', ' '))

	return (
		<Modal
			centered
			radius={16}
			overlayBlur={8}
			size={'60%'}
			padding={'lg'}
			opened={isOpened}
			title={
				<Text
					className={meemTheme.tMediumBold}
				>{`${extensionName} Settings`}</Text>
			}
			onClose={() => {
				onModalClosed()
			}}
		>
			<Divider />
			{children}
		</Modal>
	)
}
