import { Center, Container, Loader, Space, Text } from '@mantine/core'
import React from 'react'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import { useMeemTheme } from '../../Styles/MeemTheme'

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
	const { agreement, isLoadingAgreement, error } = useAgreement()

	return (
		<Container>
			<Space h={64} />

			{/* Agreement loaded state */}
			{agreement && (
				<Text className={meemTheme.tSmall}>
					{`This is the homepage for the example community extension`}
				</Text>
			)}
			{/* Agreement loading state */}
			{isLoadingAgreement && (
				<>
					<Center>
						<Loader variant="oval" color="blue" />
					</Center>
				</>
			)}

			{/* Agreement error state */}
			{!isLoadingAgreement && error && (
				<>
					<Center>
						<Text className={meemTheme.tSmall}>
							Error loading this extension!
						</Text>
					</Center>
				</>
			)}
		</Container>
	)
}
