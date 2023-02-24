/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { Text } from '@mantine/core'
import { useSDK } from '@meemproject/react'
import React, { useState } from 'react'
import { extensionFromSlug } from '../../../model/agreement/agreements'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import { useMeemTheme } from '../../Styles/MeemTheme'
import { ExtensionBlankSlate, extensionIsReady } from '../ExtensionBlankSlate'

export const ExampleExtension: React.FC = () => {
	// Default extension settings / properties - leave these alone if possible!
	const { classes: meemTheme } = useMeemTheme()
	const { agreement, isLoadingAgreement } = useAgreement()
	const agreementExtension = extensionFromSlug('example', agreement)

	const [isSavingChanges, setIsSavingChanges] = useState(false)

	const { sdk } = useSDK()

	// Save any extension data you need using this function.
	const saveChanges = async () => {
		setIsSavingChanges(true)
		await sdk.agreementExtension.updateAgreementExtension({
			agreementId: agreement?.id ?? '',
			agreementExtensionId: agreementExtension?.id
			// View declaration for a full list of parameters...
		})
		setIsSavingChanges(false)
	}

	return (
		<div>
			{/* This is the loading state for the extension.  */}
			<ExtensionBlankSlate />

			{/* This is the 'ready state' for the extension. */}
			{extensionIsReady(
				isLoadingAgreement,
				agreement,
				agreementExtension
			) && (
				<>
					<div>
						{/* Add your extension code and layout here! */}
						<Text className={meemTheme.tSmall}>Hello Meem!</Text>
					</div>
				</>
			)}
		</div>
	)
}
