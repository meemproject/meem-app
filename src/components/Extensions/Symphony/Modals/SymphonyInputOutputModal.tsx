import { Space, Center, Image, Container, Modal, Text } from '@mantine/core'
import { DeleteCircle } from 'iconoir-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { useAgreement } from '../../../AgreementHome/AgreementProvider'
import { colorWhite, useMeemTheme } from '../../../Styles/MeemTheme'
import { SymphonyConnection } from '../Model/symphony'
import { SymphonyExtension } from '../SymphonyExtension'

interface IProps {
	isOpened: boolean
	onModalClosed: () => void
}

export const SymphonyInputOutputModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed
}) => {
	// General params
	const { classes: meemTheme } = useMeemTheme()
	const { agreement } = useAgreement()

	const [inputs, setInputs] = useState<SymphonyConnection[]>([])

	const [outputs, setOutputs] = useState<SymphonyConnection[]>([])

	const modalContents = <></>

	return (
		<>
			<Modal
				className={meemTheme.visibleDesktopOnly}
				centered
				radius={16}
				overlayBlur={8}
				size={'60%'}
				padding={'lg'}
				opened={isOpened}
				title={
					<Text className={meemTheme.tMediumBold}>Add New Rule</Text>
				}
				onClose={() => {
					onModalClosed()
				}}
			>
				{modalContents}
			</Modal>
			<Modal
				className={meemTheme.visibleMobileOnly}
				fullScreen
				padding={'lg'}
				opened={isOpened}
				title={
					<Text className={meemTheme.tMediumBold}>Add New Rule</Text>
				}
				onClose={() => {
					onModalClosed()
				}}
			>
				{modalContents}
			</Modal>
		</>
	)
}
