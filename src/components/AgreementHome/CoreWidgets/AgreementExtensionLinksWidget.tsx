import { Image, Text, Space, Grid, Center } from '@mantine/core'
import React, { useEffect } from 'react'
import { AgreementExtensions } from '../../../../generated/graphql'
import { Agreement } from '../../../model/agreement/agreements'
import { useMeemTheme } from '../../Styles/AgreementsTheme'
interface IProps {
	agreement: Agreement
}

export const AgreementExtensionLinksWidget: React.FC<IProps> = ({
	agreement
}) => {
	const { classes: meemTheme } = useMeemTheme()

	useEffect(() => {}, [agreement])

	const extensionLink = (extension: AgreementExtensions) => (
		<div
			className={meemTheme.widgetLight}
			style={{ cursor: 'pointer' }}
			onClick={() => {
				window.open(extension.AgreementExtensionLinks[0].url)
			}}
		>
			<Center>
				<Image
					src={extension.Extension?.icon}
					fit="contain"
					width={24}
					height={24}
				/>
			</Center>
			<Space h={8} />
			<Center>
				<Text className={meemTheme.tSmallBold}>
					{extension.Extension?.name}
				</Text>
			</Center>
		</div>
	)

	return (
		<>
			{/* TODO: show all links, not just the first one... */}
			{agreement.extensions && agreement.extensions.length > 0 && (
				<Grid>
					{agreement.extensions
						.filter(
							ext =>
								ext.AgreementExtensionLinks[0] &&
								ext.AgreementExtensionLinks[0].url
						)
						.map(extension => (
							<Grid.Col
								xs={6}
								sm={6}
								md={6}
								lg={6}
								xl={6}
								key={extension.Extension?.name ?? ''}
							>
								{extensionLink(extension)}
							</Grid.Col>
						))}
				</Grid>
			)}
		</>
	)
}
