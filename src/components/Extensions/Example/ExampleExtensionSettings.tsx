import {
	Container,
	Loader,
	Image,
	Text,
	Space,
	Center,
	Button,
	Divider,
	Switch
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useRouter } from 'next/router'
import React, { useContext, useState } from 'react'
import { ArrowLeft, Check } from 'tabler-icons-react'
import ClubContext from '../../ClubHome/ClubProvider'
import { colorGreen, useClubsTheme } from '../../Styles/ClubsTheme'

export const ExampleExtensionSettings: React.FC = () => {
	const router = useRouter()
	const { classes: clubsTheme } = useClubsTheme()
	const { club, isLoadingClub, error } = useContext(ClubContext)
	const [isSavingChanges, setIsSavingChanges] = useState(false)
	const [isDisablingExtension, setIsDisablingExtension] = useState(false)
	const [shouldDisplayDashboardWidget, setShouldDisplayDashboardWidget] =
		useState(false)
	const [isPrivateExtension, setIsPrivateExtension] = useState(false)

	/*
	TODO:
	Add your extension's name, which shows up as the page title.
	 */
	const extensionName = 'Example Extension'

	/*
	TODO
	Add your custom extension settings layout here.
	 */
	const customExtensionSettings = () => (
		<>
			<Space h={32} />
			<Text className={clubsTheme.tExtraSmallLabel}>CONFIGURATION</Text>
			<Space h={16} />
			This extension does not provide any additional settings.
			<Space h={8} />
		</>
	)

	/*
	TODO
	Add your custom extension permissions layout here. 
	 */
	const customExtensionPermissions = () => (
		<>This extension does not provide any permissions.</>
	)

	/*
	TODO
	Use this function to save any specific settings you have created for this extension and make any calls you need to external APIs.
	 */
	const saveCustomChanges = async () => {}

	/*
	Boilerplate area - please don't edit the below code!
	===============================================================
	 */

	const saveChanges = async () => {
		setIsSavingChanges(true)
		await saveCustomChanges()
		setIsSavingChanges(false)
	}

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

	const disableExtension = async () => {
		setIsDisablingExtension(true)
		setIsDisablingExtension(false)
	}

	return (
		<div>
			{club && club?.isCurrentUserClubAdmin && (
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

			{club && !club?.isCurrentUserClubAdmin && (
				<div>
					<div className={clubsTheme.pageHeader}>
						<div className={clubsTheme.spacedRowCentered}>
							<ArrowLeft
								className={clubsTheme.clickable}
								onClick={() => {
									navigateToAllExtensions()
								}}
							/>
							<Space w={24} />
							<Image
								radius={8}
								height={56}
								width={56}
								className={clubsTheme.imagePixelated}
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
						<Space h={16} />
						<div
							className={clubsTheme.spacedRow}
							style={{ marginBottom: 32 }}
						>
							<div>
								<Text className={clubsTheme.tExtraSmallLabel}>
									SETTINGS
								</Text>
								<Space h={4} />
								<div className={clubsTheme.centeredRow}>
									<Text className={clubsTheme.tLargeBold}>
										{extensionName}
									</Text>
								</div>
							</div>
							<Button
								disabled={isSavingChanges}
								loading={isSavingChanges}
								onClick={() => {
									saveChanges()
								}}
								className={clubsTheme.buttonBlack}
							>
								Save Changes
							</Button>
						</div>
						<Divider />
						<Space h={32} />
						<Text className={clubsTheme.tExtraSmallLabel}>
							DISPLAY SETTINGS
						</Text>

						<div>
							<Space h={16} />
							<div className={clubsTheme.spacedRowCentered}>
								<Switch
									color={'green'}
									label={'Display dashboard widget'}
									checked={shouldDisplayDashboardWidget}
									onChange={value => {
										if (value) {
											setShouldDisplayDashboardWidget(
												value.currentTarget.checked
											)
										}
									}}
								/>
							</div>
							<Space h={16} />
							<Divider />
						</div>
						<div>
							<Space h={4} />
							<div className={clubsTheme.spacedRowCentered}>
								<Switch
									color={'green'}
									label={
										'Hide widget if viewer is not a club member'
									}
									checked={isPrivateExtension}
									onChange={value => {
										if (value) {
											setIsPrivateExtension(
												value.currentTarget.checked
											)
										}
									}}
								/>
							</div>
							<Space h={16} />
							<Divider />
						</div>
						<Space h={16} />

						<Button
							disabled={isDisablingExtension}
							loading={isDisablingExtension}
							className={clubsTheme.buttonRed}
							onClick={disableExtension}
						>
							Disable extension
						</Button>

						{customExtensionSettings()}
						<Space h={32} />
						<Text className={clubsTheme.tExtraSmallLabel}>
							PERMISSIONS
						</Text>
						<Space h={16} />

						{customExtensionPermissions()}
						<Space h={48} />
						<Button
							disabled={isSavingChanges}
							loading={isSavingChanges}
							onClick={() => {
								saveChanges()
							}}
							className={clubsTheme.buttonBlack}
						>
							Save Changes
						</Button>
					</Container>
				</div>
			)}
			{isLoadingClub && (
				<>
					<Space h={32} />
					<Center>
						<Loader variant="oval" color="red" />
					</Center>
				</>
			)}
			{!isLoadingClub && error && (
				<>
					<Space h={32} />
					<Center>
						<Text className={clubsTheme.tSmall}>
							{`Error loading ${extensionName} settings!`}
						</Text>
					</Center>
				</>
			)}
		</div>
	)
}
