import { Button, Center, Space, Text } from '@mantine/core'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { Agreement } from '../../../model/agreement/agreements'
import { colorBlack, useMeemTheme } from '../../Styles/MeemTheme'
interface IProps {
	agreement: Agreement
}

export const AgreementBlankSlateWidget: React.FC<IProps> = ({ agreement }) => {
	const { classes: meemTheme } = useMeemTheme()
	const router = useRouter()

	useEffect(() => {}, [agreement])

	const shouldShowBlankSlate =
		!agreement.extensions ||
		agreement.extensions?.filter(
			ext => ext.AgreementExtensionWidgets.length > 0
		)?.length === 0

	return (
		<div>
			{shouldShowBlankSlate && (
				<>
					<>
						{agreement?.isCurrentUserAgreementAdmin && (
							<div className={meemTheme.widgetLight}>
								<Center>
									<Text
										className={meemTheme.tLargeBold}
										color={colorBlack}
									>
										{`Let's get started`}
									</Text>
								</Center>
								<Space h={16} />
								<Center>
									<Text
										className={meemTheme.tSmall}
										color={colorBlack}
									>
										{`There's nothing for your community members to do yet. Add your first extension to enable your members to talk, organize events and much more.`}
									</Text>
								</Center>
								<Space h={24} />
								<Center>
									<Button
										className={meemTheme.buttonAsh}
										onClick={() => {
											router.push({
												pathname: `${agreement.slug}/admin`,
												query: { tab: 'extensions' }
											})
										}}
									>
										+ Add an extension
									</Button>
								</Center>
							</div>
						)}
					</>
					<>
						{!agreement?.isCurrentUserAgreementAdmin && (
							<div className={meemTheme.widgetLight}>
								<Center>
									<Text className={meemTheme.tMediumBold}>
										Under construction
									</Text>
								</Center>
								<Space h={16} />
								<Center>
									<Text className={meemTheme.tSmall}>
										This community does not have any content
										yet. Check back later!
									</Text>
								</Center>
							</div>
						)}
					</>
				</>
			)}
		</div>
	)
}
