import { Button, Center, Space, Text } from '@mantine/core'
import { MeemAPI } from '@meemproject/sdk'
import React, { useEffect, useState } from 'react'
import { Agreement } from '../../../model/agreement/agreements'
import { AddExtensionModal } from '../../Extensions/AddExtensionModal'
import { useMeemTheme } from '../../Styles/MeemTheme'
interface IProps {
	agreement: Agreement
}

export const AgreementAddExtensionsWidget: React.FC<IProps> = ({
	agreement
}) => {
	const { classes: meemTheme } = useMeemTheme()

	useEffect(() => {}, [agreement])

	const [isAddExtensionModalOpen, setIsAddExtensionModalOpen] =
		useState(false)

	// Total extensions, including links and other integrations
	const totalExtensions = agreement.extensions?.filter(ext =>
		agreement.isCurrentUserAgreementMember
			? ext
			: ext.AgreementExtensionWidgets &&
			  ext.AgreementExtensionWidgets.length > 0 &&
			  ext.AgreementExtensionWidgets[0].visibility ===
					MeemAPI.AgreementExtensionVisibility.Anyone
	).length

	return (
		<div>
			{agreement.isCurrentUserAgreementAdmin && (
				<>
					{/* No extensions at all */}
					{totalExtensions === 0 && (
						<div
							className={meemTheme.widgetExtension}
							style={{ padding: 32 }}
						>
							<Space h={16} />

							<Center>
								<Text className={meemTheme.tLargeBold}>
									Get started
								</Text>
							</Center>
							<Space h={16} />
							<Center>
								<Text className={meemTheme.tSmall}>
									Your community does not have any extensions
									yet. Extensions are apps you can add which
									enable functionality for your community,
									such as discussions, events and more.
								</Text>
							</Center>
							<Space h={32} />

							<Center>
								<Button
									className={meemTheme.buttonAsh}
									onClick={() => {
										setIsAddExtensionModalOpen(true)
									}}
								>
									+ Add Extension
								</Button>
							</Center>
							<Space h={24} />
						</div>
					)}

					{/* There's already at least one widget that has been set up  */}
					{/* {agreement.extensions &&
								totalExtensions &&
								totalExtensions > 0 && (
									<>
										<Space h={8} />
										<Center>
											<Text
												className={meemTheme.tSmall}
											></Text>
										</Center>
										<Center>
											<Button
												className={meemTheme.buttonGrey}
												onClick={() => {
													setIsAddExtensionModalOpen(
														true
													)
												}}
											>
												+ Add an extension
											</Button>
										</Center>
										<Space h={32} />
									</>
								)} */}
				</>
			)}

			<AddExtensionModal
				agreement={agreement}
				onModalClosed={() => {
					setIsAddExtensionModalOpen(false)
				}}
				isOpened={isAddExtensionModalOpen}
			/>
		</div>
	)
}
