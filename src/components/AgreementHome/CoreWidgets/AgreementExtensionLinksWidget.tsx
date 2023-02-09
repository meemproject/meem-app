import {
	Image,
	Text,
	Space,
	Grid,
	Center,
	useMantineColorScheme
} from '@mantine/core'
import { Settings } from 'iconoir-react'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { AgreementExtensions } from '../../../../generated/graphql'
import { Agreement } from '../../../model/agreement/agreements'
import { useMeemTheme } from '../../Styles/MeemTheme'
interface IProps {
	agreement: Agreement
}

export const AgreementExtensionLinksWidget: React.FC<IProps> = ({
	agreement
}) => {
	const { classes: meemTheme } = useMeemTheme()

	useEffect(() => {}, [agreement])

	const router = useRouter()

	const { colorScheme } = useMantineColorScheme()
	const isDarkTheme = colorScheme === 'dark'

	const extensionLink = (extension: AgreementExtensions) => (
		<div className={meemTheme.widgetLink} style={{ position: 'relative' }}>
			<div
				style={{ cursor: 'pointer' }}
				onClick={() => {
					window.open(extension.AgreementExtensionLinks[0].url)
				}}
			>
				<Center>
					<Image
						src={`/${
							isDarkTheme
								? `${(extension.Extension?.icon ?? '').replace(
										'.png',
										'-white.png'
								  )}`
								: extension.Extension?.icon
						}`}
						fit="contain"
						width={20}
					/>
				</Center>
				<Space h={8} />
				<Center>
					<Text className={meemTheme.tSmallBold}>
						{extension.Extension?.name}
					</Text>
				</Center>
			</div>

			{agreement.isCurrentUserAgreementAdmin && (
				<div style={{ position: 'absolute', top: 12, right: 12 }}>
					<Settings
						className={meemTheme.clickable}
						onClick={() => {
							router.push({
								pathname: `/${agreement.slug}/e/${extension.Extension?.slug}`
							})
						}}
					/>
				</div>
			)}
		</div>
	)

	return (
		<>
			{agreement.extensions && agreement.extensions.length > 0 && (
				<Grid>
					{agreement.extensions
						.filter(
							ext =>
								ext.AgreementExtensionLinks[0] &&
								ext.isSetupComplete &&
								ext.metadata.favoriteLinksVisible
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
