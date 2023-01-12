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
			{agreement.extensions?.filter(
				ext => ext.AgreementExtensionWidgets.length > 0
			).length !== 0 && (
				<>
					{agreement.isCurrentUserAgreementAdmin && (
						<>
							<Space h={32} />

							<Center>
								<Button
									className={meemTheme.buttonGrey}
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
							<Space h={32} />
						</>
					)}

					{!agreement.isCurrentUserAgreementAdmin && (
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
			)}
		</div>
	)
}
