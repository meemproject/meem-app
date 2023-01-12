import { Button, Center, Space, Text } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { Agreement } from '../../../model/agreement/agreements'
import { CreateAgreementModal } from '../../Create/CreateAgreementModal'
import { colorBlack, useMeemTheme } from '../../Styles/MeemTheme'
interface IProps {
	agreement: Agreement
}

export const MeemCreateCommunityWidget: React.FC<IProps> = ({ agreement }) => {
	const { classes: meemTheme } = useMeemTheme()

	useEffect(() => {}, [agreement])

	const shouldShowWidget = agreement.isCurrentUserAgreementMember

	const [isCreationModalOpen, setIsCreationModalOpen] = useState(false)

	return (
		<div>
			{shouldShowWidget && (
				<>
					<div className={meemTheme.widgetMeem}>
						<Space h={16} />

						<Center>
							<Text
								className={meemTheme.tMediumBold}
								color={colorBlack}
							>
								{`Use Meem to power your community`}
							</Text>
						</Center>
						<Space h={16} />
						<Center>
							<Button
								className={meemTheme.buttonBlack}
								onClick={() => {
									setIsCreationModalOpen(true)
								}}
							>
								Connect my community
							</Button>
						</Center>
						<Space h={16} />
					</div>
				</>
			)}
			<CreateAgreementModal
				isOpened={isCreationModalOpen}
				onModalClosed={function (): void {
					setIsCreationModalOpen(false)
				}}
			/>
		</div>
	)
}
