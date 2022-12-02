import { Image, Text, Space, Grid, Center } from '@mantine/core'
import React, { useEffect } from 'react'
import { Club, Extension } from '../../../model/club/club'
import { useClubsTheme } from '../../Styles/ClubsTheme'
interface IProps {
	club: Club
}

export const ClubExtensionLinksWidget: React.FC<IProps> = ({ club }) => {
	const { classes: clubsTheme } = useClubsTheme()

	useEffect(() => {}, [club])

	const extensionLink = (extension: Extension) => (
		<div
			className={clubsTheme.widgetLight}
			style={{ cursor: 'pointer' }}
			onClick={() => {
				window.open(extension.url)
			}}
		>
			<Center>
				<Image
					src={extension.icon}
					fit="contain"
					width={24}
					height={24}
				/>
			</Center>
			<Space h={8} />
			<Center>
				<Text className={clubsTheme.tSmallBold}>{extension.name}</Text>
			</Center>
		</div>
	)

	// TODO:
	// Will need to only show pinned extensions here, so make sure to add that to the filter when it's
	// available in the API

	return (
		<div>
			{/* Show all extensions with links for club members */}
			{club.isCurrentUserClubMember &&
				club.allExtensions &&
				club.allExtensions.length > 0 && (
					<Grid>
						{club.allExtensions
							.filter(ext => ext.url)
							.map(extension => (
								<Grid.Col
									xs={6}
									sm={6}
									md={6}
									lg={6}
									xl={6}
									key={extension.name}
								>
									{extensionLink(extension)}
								</Grid.Col>
							))}
					</Grid>
				)}

			{/* Show only public extensions with links for visitors */}
			{club.isCurrentUserClubMember &&
				club.publicExtensions &&
				club.publicExtensions.length > 0 && (
					<Grid>
						{club.publicExtensions
							.filter(ext => ext.url)
							.map(extension => (
								<Grid.Col
									xs={6}
									sm={6}
									md={6}
									lg={6}
									xl={6}
									key={extension.name}
								>
									{extensionLink(extension)}
								</Grid.Col>
							))}
					</Grid>
				)}
		</div>
	)
}
