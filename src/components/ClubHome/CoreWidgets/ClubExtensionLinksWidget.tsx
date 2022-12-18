import { Image, Text, Space, Grid, Center } from '@mantine/core'
import React, { useEffect } from 'react'
import { AgreementExtensions } from '../../../../generated/graphql'
import { Club } from '../../../model/club/club'
import { useClubsTheme } from '../../Styles/ClubsTheme'
interface IProps {
	club: Club
}

export const ClubExtensionLinksWidget: React.FC<IProps> = ({ club }) => {
	const { classes: clubsTheme } = useClubsTheme()

	useEffect(() => {}, [club])

	const extensionLink = (extension: AgreementExtensions) => (
		<div
			className={clubsTheme.widgetLight}
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
				<Text className={clubsTheme.tSmallBold}>
					{extension.Extension?.name}
				</Text>
			</Center>
		</div>
	)

	return (
		<>
			{/* TODO: show all links, not just the first one... */}
			{club.extensions && club.extensions.length > 0 && (
				<Grid>
					{club.extensions
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
