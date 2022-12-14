/* eslint-disable @typescript-eslint/naming-convention */
import { Container, Text, Image, Space, Loader, Center } from '@mantine/core'
import React from 'react'
import { useClub } from '../../ClubHome/ClubProvider'
import { useClubsTheme } from '../../Styles/ClubsTheme'

export const DiscussionSettings: React.FC = () => {
	const { classes: clubsTheme } = useClubsTheme()

	const { club, isLoadingClub, error } = useClub()

	return (
		<>
			{isLoadingClub && (
				<Container>
					<Space h={120} />
					<Center>
						<Loader color="red" variant="oval" />
					</Center>
				</Container>
			)}
			{!isLoadingClub && !error && !club?.name && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>Sorry, that club does not exist!</Text>
					</Center>
				</Container>
			)}
			{!isLoadingClub && error && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>
							There was an error loading this club. Please let us
							know!
						</Text>
					</Center>
				</Container>
			)}
			{!isLoadingClub && club?.name && (
				<>
					<Container>
						<Space h={48} />

						<Center>
							<Image
								className={clubsTheme.imagePixelated}
								height={100}
								width={100}
								src={club.image}
							/>
						</Center>

						<Space h={24} />
						<Center>
							<Text className={clubsTheme.tLargeBold}>
								{club.name}
							</Text>
						</Center>
						<Space h={8} />

						<Center>
							<Text className={clubsTheme.tMedium}>
								{club.description}
							</Text>
						</Center>
						<Space h={24} />

						<Center>
							<Text>Settings</Text>
						</Center>
					</Container>
				</>
			)}
		</>
	)
}
