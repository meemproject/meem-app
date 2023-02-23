import { Space, Container, Loader, Center } from '@mantine/core'
import React from 'react'
import { AgreementExtensions } from '../../../generated/graphql'
import { Agreement } from '../../model/agreement/agreements'
import { useAgreement } from '../AgreementHome/AgreementProvider'

export const extensionIsReady = (
	isLoadingAgreement: boolean,
	agreement: Agreement | undefined,
	agreementExtension: AgreementExtensions | undefined
): boolean => {
	const isReady =
		!isLoadingAgreement &&
		agreement?.name !== undefined &&
		agreementExtension &&
		agreementExtension?.isInitialized
	return isReady ?? false
}

export const ExtensionBlankSlate: React.FC = () => {
	const { isLoadingAgreement } = useAgreement()

	return (
		<>
			{isLoadingAgreement && (
				<Container>
					<Space h={16} />
					<Center>
						<Loader color="cyan" variant="oval" />
					</Center>
				</Container>
			)}
		</>
	)
}
