import { Button, Center, Space } from '@mantine/core'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { Agreement } from '../../../model/agreement/agreements'
import { useMeemTheme } from '../../Styles/MeemTheme'
interface IProps {
	agreement: Agreement
}

export const AgreementAddAppsWidget: React.FC<IProps> = ({ agreement }) => {
	const { classes: meemTheme } = useMeemTheme()
	const router = useRouter()

	useEffect(() => {}, [agreement])

	return (
		<div>
			{agreement.isCurrentUserAgreementAdmin &&
				agreement.extensions?.filter(
					ext => ext.AgreementExtensionWidgets.length > 0
				).length !== 0 && (
					<>
						<Space h={24} />

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
		</div>
	)
}
