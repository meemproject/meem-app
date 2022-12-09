import {
	Container,
	Loader,
	Image,
	Text,
	Space,
	Center,
	Button
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import { ArrowLeft, Check } from 'tabler-icons-react'
import ClubContext from '../../ClubHome/ClubProvider'
import { colorGreen, useClubsTheme } from '../../Styles/ClubsTheme'

export const ExampleExtensionSettings: React.FC = () => {
	const router = useRouter()

	const { classes: clubsTheme } = useClubsTheme()

	const { club, isLoadingClub, error } = useContext(ClubContext)

	const navigateToClubHome = () => {
		router.push({
			pathname: `/${club?.slug}`
		})
	}

	const navigateToAllExtensions = () => {
		router.push({
			pathname: `/${club?.slug}/admin`,
			query: { tab: 'extensions' }
		})
	}

	const saveChanges = async () => {}

	return (
		<div>
			{!club?.isCurrentUserClubAdmin && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>
							Sorry, you do not have permission to view this page.
							Contact the club owner for help.
						</Text>
					</Center>
				</Container>
			)}

			{club && (
				<div>
					<div className={clubsTheme.pageHeader}>
						<div className={clubsTheme.spacedRowCentered}>
							<Image
								width={56}
								height={56}
								radius={8}
								className={clubsTheme.imageClubLogo}
								src={club?.image}
							/>
							{/* <Text className={classes.headerClubName}>{clubName}</Text> */}
							<div
								className={clubsTheme.pageHeaderTitleContainer}
							>
								<Text className={clubsTheme.tLargeBold}>
									{club.name}
								</Text>
								<Space h={8} />
								<div className={clubsTheme.row}>
									<Text
										className={clubsTheme.tExtraSmallFaded}
									>{`${window.location.origin}/${club.slug}`}</Text>
									<Image
										className={clubsTheme.copyIcon}
										src="/copy.png"
										height={20}
										onClick={() => {
											navigator.clipboard.writeText(
												`${window.location.origin}/${club.slug}`
											)
											showNotification({
												radius: 'lg',
												title: 'Club URL copied',
												autoClose: 2000,
												color: colorGreen,
												icon: <Check />,

												message: `This club's URL was copied to your clipboard.`
											})
										}}
										width={20}
									/>
								</div>
							</div>
						</div>
						<a
							className={clubsTheme.pageHeaderExitButton}
							onClick={navigateToClubHome}
						>
							<Image src="/delete.png" width={24} height={24} />
						</a>
					</div>

					<Container>
						<div
							className={clubsTheme.centeredRow}
							style={{ marginLeft: 18, marginBottom: 24 }}
						>
							<ArrowLeft
								className={clubsTheme.clickable}
								onClick={() => {
									navigateToAllExtensions()
								}}
							/>
							<Space w={8} />
							<Text className={clubsTheme.tLargeBold}>
								Manage Extensions
							</Text>
						</div>

						<Space h={16} />
						<div
							className={clubsTheme.spacedRow}
							style={{ marginBottom: 32 }}
						>
							<div>
								<Text className={clubsTheme.tExtraSmallLabel}>
									Settings
								</Text>
								<Space h={4} />
								<div className={clubsTheme.centeredRow}>
									<Text className={clubsTheme.tLargeBold}>
										Example Extension
									</Text>
								</div>
							</div>
							<Button
								onClick={() => {
									saveChanges()
								}}
								className={clubsTheme.buttonBlack}
							>
								Save Changes
							</Button>
						</div>
					</Container>
				</div>
			)}
			{isLoadingClub && <Loader variant="oval" color="red" />}
			{!isLoadingClub && error && (
				<Text className={clubsTheme.tSmall}>
					Error loading this club!
				</Text>
			)}
		</div>
	)
}
