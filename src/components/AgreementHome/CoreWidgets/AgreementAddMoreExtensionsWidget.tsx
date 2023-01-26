import { Button, Center, Space, Text } from '@mantine/core'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { Agreement } from '../../../model/agreement/agreements'
import { useMeemTheme } from '../../Styles/MeemTheme'
interface IProps {
	agreement: Agreement
}

export const AgreementAddMoreExtensionsWidget: React.FC<IProps> = ({
	agreement
}) => {
	const { classes: meemTheme } = useMeemTheme()
	const router = useRouter()

	useEffect(() => {}, [agreement])

	return (
		<div>
			{agreement.isLaunched && (
				<>
					{agreement.isCurrentUserAgreementAdmin && (
						<>
							{agreement.extensions?.filter(
								ext => ext.AgreementExtensionWidgets.length > 0
							).length === 0 && (
								<div className={meemTheme.widgetLight}>
									<Center>
										<Text className={meemTheme.tLargeBold}>
											Get started
										</Text>
									</Center>
									<Space h={16} />
									<Center>
										<Text className={meemTheme.tSmall}>
											Your community does not have any
											extensions yet. Extensions are apps
											you can add which enable
											functionality for your community,
											such as discussions, events and
											more.
										</Text>
									</Center>
									<Space h={32} />

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
											+ Add your first extension
										</Button>
									</Center>
									<Space h={8} />
								</div>
							)}

							{agreement.extensions &&
								agreement.extensions?.filter(
									ext =>
										ext.AgreementExtensionWidgets.length > 0
								).length > 0 && (
									<>
										<Space h={32} />

										<Center>
											<Button
												className={meemTheme.buttonGrey}
												onClick={() => {
													router.push({
														pathname: `${agreement.slug}/admin`,
														query: {
															tab: 'extensions'
														}
													})
												}}
											>
												+ Add an extension
											</Button>
										</Center>
										<Space h={32} />
									</>
								)}
						</>
					)}

					{!agreement.isCurrentUserAgreementAdmin && (
						<>
							{agreement.extensions?.filter(
								ext => ext.AgreementExtensionWidgets.length > 0
							).length === 0 && (
								<div className={meemTheme.widgetLight}>
									<Center>
										<Text className={meemTheme.tMediumBold}>
											Under construction
										</Text>
									</Center>
									<Space h={16} />
									<Center>
										<Text className={meemTheme.tSmall}>
											This community does not have any
											content yet. Check back later!
										</Text>
									</Center>
								</div>
							)}
						</>
					)}
				</>
			)}
		</div>
	)
}
