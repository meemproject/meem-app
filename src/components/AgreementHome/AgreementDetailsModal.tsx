import {
	Text,
	Space,
	Modal,
	Center,
	Image,
	Button,
	Collapse
} from '@mantine/core'
import React, { useState } from 'react'
import { Agreement } from '../../model/agreement/agreements'
import { showSuccessNotification } from '../../utils/notifications'
import { hostnameToChainId } from '../App'
import { useMeemTheme } from '../Styles/MeemTheme'

interface IProps {
	agreement?: Agreement
	isOpened: boolean
	onModalClosed: () => void
}

export const AgreementDetailsModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed,
	agreement
}) => {
	const { classes: meemTheme } = useMeemTheme()

	const [isAgreementDataVisible, setIsAgreementDataVisible] = useState(false)

	return (
		<>
			<Modal
				centered
				withCloseButton={true}
				closeOnClickOutside={true}
				closeOnEscape={false}
				overlayBlur={8}
				color={'black'}
				radius={16}
				size={isAgreementDataVisible ? '70%' : 'lg'}
				padding={'sm'}
				opened={isOpened}
				onClose={() => {
					onModalClosed()
				}}
			>
				<Center>
					<Text
						className={meemTheme.tMediumBold}
						style={{ marginTop: -32 }}
					>
						{agreement?.name}
					</Text>
				</Center>
				<Space h={24} />
				<Center>
					<Text className={meemTheme.tExtraSmallLabel}>
						Agreement Contract Address
					</Text>
				</Center>
				<Space h={8} />
				<Center>
					<div className={meemTheme.row}>
						<Text>{agreement?.address ?? ''}</Text>
						<Space w={4} />
						<Image
							className={meemTheme.copyIcon}
							src="/copy.png"
							height={20}
							onClick={() => {
								navigator.clipboard.writeText(
									`${agreement?.address}`
								)
								showSuccessNotification(
									'Community agreement contract address copied!',
									`This community's agreement contract address was copied to your clipboard.`
								)
							}}
							width={20}
						/>
					</div>
				</Center>
				<Space h={24} />
				<Center>
					<Text className={meemTheme.tExtraSmallLabel}>Chain ID</Text>
				</Center>
				<Space h={8} />
				<Center>
					<div className={meemTheme.row}>
						<Text>
							{hostnameToChainId(window?.location.hostname)}
						</Text>
						<Space w={4} />
						<Image
							className={meemTheme.copyIcon}
							src="/copy.png"
							height={20}
							onClick={() => {
								navigator.clipboard.writeText(
									`${hostnameToChainId(
										window?.location.hostname
									)}`
								)
								showSuccessNotification(
									'Chain ID copied!',
									`This community's agreement contract chain ID was copied to your clipboard.`
								)
							}}
							width={20}
						/>
					</div>
				</Center>
				<Space h={24} />
				<Center>
					<Text className={meemTheme.tExtraSmallLabel}>
						Agreement data
					</Text>
				</Center>
				<Space h={8} />
				<Center>
					<Button
						className={meemTheme.buttonWhite}
						onClick={() => setIsAgreementDataVisible(o => !o)}
					>
						{isAgreementDataVisible ? `Hide data` : `Show data`}
					</Button>
				</Center>

				<Collapse in={isAgreementDataVisible}>
					<div className={meemTheme.row}>
						<Text className={meemTheme.tExtraExtraSmall}>
							<pre style={{ maxWidth: 400 }}>
								{JSON.stringify(
									agreement?.rawAgreement,
									undefined,
									2
								)}
							</pre>
						</Text>
					</div>
				</Collapse>

				<Space h={16} />
			</Modal>
		</>
	)
}
