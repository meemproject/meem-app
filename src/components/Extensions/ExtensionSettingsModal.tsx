import { Text, Modal, Divider, Space, Switch, Button } from '@mantine/core'
import { useSDK } from '@meemproject/react'
import { MeemAPI } from '@meemproject/sdk'
import React, { useEffect, useState } from 'react'
import { extensionFromSlug } from '../../model/agreement/agreements'
import { deslugify } from '../../utils/strings'
import { useAgreement } from '../AgreementHome/AgreementProvider'
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

	const sdk = useSDK()

	const { agreement } = useAgreement()

	const [isSavingChanges, setIsSavingChanges] = useState(false)
	const [isPrivateExtension, setIsPrivateExtension] = useState(false)

	const extensionName = deslugify(extensionSlug)
	const agreementExtension = extensionFromSlug(extensionSlug, agreement)

	const saveChanges = async () => {
		setIsSavingChanges(true)
		await sdk.sdk.agreementExtension.updateAgreementExtension({
			agreementId: agreement?.id ?? '',
			agreementExtensionId: agreementExtension?.id,
			isSetupComplete: true,
			widget: {
				visibility: isPrivateExtension
					? MeemAPI.AgreementExtensionVisibility.TokenHolders
					: MeemAPI.AgreementExtensionVisibility.Anyone
			}
		})
		setIsSavingChanges(false)
	}

	useEffect(() => {
		if (isOpened && agreementExtension) {
			if (
				agreementExtension.AgreementExtensionWidgets &&
				agreementExtension.AgreementExtensionWidgets.length > 0
			) {
				const widget = agreementExtension.AgreementExtensionWidgets[0]
				if (
					widget.visibility ===
					MeemAPI.AgreementExtensionVisibility.TokenHolders
				) {
					setIsPrivateExtension(true)
				}
			}
		}
	}, [agreementExtension, isOpened])

	const modalContent = (
		<>
			<Divider />
			<Space h={16} />

			<Text className={meemTheme.tExtraSmallLabel}>DISPLAY SETTINGS</Text>

			{/* <div>
				<Space h={16} />
				<div className={meemTheme.spacedRowCentered}>
					<Switch
						color={'green'}
						label={'Display dashboard widget'}
						checked={shouldDisplayDashboardWidget}
						onChange={value => {
							if (value) {
								setShouldDisplayDashboardWidget(
									value.currentTarget.checked
								)
							}
						}}
					/>
				</div>
				<Space h={16} />
				<Divider />
			</div> */}
			<div>
				<Space h={16} />
				<div className={meemTheme.spacedRowCentered}>
					<Switch
						color={'green'}
						label={
							'Hide widget if viewer is not a community member'
						}
						checked={isPrivateExtension}
						onChange={value => {
							if (value) {
								setIsPrivateExtension(
									value.currentTarget.checked
								)
							}
						}}
					/>
				</div>
				<Space h={16} />
				<Divider />
			</div>
			{children}
			<Space h={32} />
			<Button
				disabled={isSavingChanges}
				loading={isSavingChanges}
				onClick={() => {
					saveChanges()
				}}
				className={meemTheme.buttonBlack}
			>
				Save Changes
			</Button>
		</>
	)

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
					<Text
						className={meemTheme.tMediumBold}
					>{`${extensionName} Settings`}</Text>
				}
				onClose={() => {
					onModalClosed()
				}}
			>
				{modalContent}
			</Modal>
			<Modal
				className={meemTheme.visibleMobileOnly}
				fullScreen
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
				{modalContent}
			</Modal>
		</>
	)
}
