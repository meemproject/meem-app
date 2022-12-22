/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { Container, Space, Text } from '@mantine/core'
import React from 'react'
import { extensionFromSlug } from '../../../model/agreement/agreements'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import { useMeemTheme } from '../../Styles/MeemTheme'
import { ExtensionBlankSlate, extensionIsReady } from '../ExtensionBlankSlate'

export const ExampleExtensionHome: React.FC = () => {
	/*
	Use the meemTheme object to access agreements styles
	such as colors, fonts and layouts
	*/
	const { classes: meemTheme } = useMeemTheme()

	/*
	Access the agreement, loading and error states using AgreementContext.
	Look inside /pages/e/example/index.tsx for an example of how
	the AgreementProvider and AgreementContext is used to fetch a agreement
	where required.
	*/
	// const { agreement, isLoadingAgreement, error } = useAgreement()

	// Access your extension's data like so:
	//const agreementExtension = extensionFromSlug('example', agreement)

	/*
	NOTE: For UI development, we have disabled loading / error states for you. 
	Enable them again when you have real data you want to fetch from the extension.
	*/

	return (
		<>
			<Space h={64} />

			<Text className={meemTheme.tSmall}>
				This is the homepage for an example extension.
			</Text>

			{/* TODO: Use this logic below when your agreement has live data. */}
			{/* <ExtensionBlankSlate
				isLoadingAgreement
				agreement={agreement}
				error={error}
				extensionSlug={'discussions'}
			/>
			{extensionIsReady(
				isLoadingAgreement,
				agreement,
				agreementExtension
			) && (
				<>
					<Text className={meemTheme.tSmall}>
						This is the homepage for an example extension.
					</Text>
				</>
			)} */}
		</>
	)
}
