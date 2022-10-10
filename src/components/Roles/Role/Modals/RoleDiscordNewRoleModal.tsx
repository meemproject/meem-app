// Disabled unused vars for dev purposes
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import log from '@kengoldfarb/log'
import {
	createStyles,
	Text,
	Space,
	Modal,
	Button,
	Center,
	Loader,
	Select,
	// Bug in mantine imports here
	// eslint-disable-next-line import/named
	SelectItemProps,
	Radio,
	TextInput,
	Checkbox
} from '@mantine/core'
import React, { forwardRef, useEffect, useState } from 'react'
import { Club, ClubRole } from '../../../../model/club/club'
import { useGlobalStyles } from '../../../Styles/GlobalStyles'

interface IProps {
	club: Club
	role: ClubRole
	isOpened: boolean
	onModalClosed: () => void
}

interface DiscordChannel {
	id: string
	name: string
}

export const RoleDiscordNewRoleModal: React.FC<IProps> = ({
	club,
	role,
	isOpened,
	onModalClosed
}) => {
	const { classes: styles } = useGlobalStyles()

	const [discordRoleName, setDiscordRoleName] = useState('')

	const [availableDiscordChannels, setAvailableDiscordChannels] =
		useState<DiscordChannel[]>()

	const [selectedDiscordChannels, setSelectedDiscordChannels] =
		useState<string[]>()

	const [isFetchingDiscordChannels, setIsFetchingDiscordChannels] =
		useState(true)

	const [isSavingChanges, setIsSavingChanges] = useState(false)

	useEffect(() => {
		async function fetchDiscordChannels() {
			setAvailableDiscordChannels([
				{
					id: 'general',
					name: 'General'
				},
				{
					id: 'random',
					name: 'Random'
				},
				{
					id: 'members',
					name: 'Members'
				}
			])
			setIsFetchingDiscordChannels(false)
		}

		if (isOpened && !availableDiscordChannels) {
			fetchDiscordChannels()
		}
	}, [availableDiscordChannels, isFetchingDiscordChannels, isOpened])

	const saveChanges = () => {
		setIsSavingChanges(true)
		log.debug(isSavingChanges)
	}

	return (
		<>
			<Modal
				centered
				closeOnClickOutside={false}
				closeOnEscape={false}
				withCloseButton={false}
				radius={16}
				overlayBlur={8}
				size={'50%'}
				padding={'sm'}
				opened={isOpened}
				title={
					<Text className={styles.tModalTitle}>
						Create New Discord Role
					</Text>
				}
				onClose={() => {
					onModalClosed()
				}}
			>
				{!availableDiscordChannels && isFetchingDiscordChannels && (
					<>
						<Center>
							<Loader />
						</Center>
					</>
				)}
				{!availableDiscordChannels && !isFetchingDiscordChannels && (
					<>
						<Center>
							<Text>
								Sorry - unable to load Discord channels. Try
								again later.
							</Text>
							<Space h={16} />
							<Button
								onClick={() => {
									onModalClosed()
								}}
								className={styles.buttonGrey}
							>
								Close
							</Button>
						</Center>
					</>
				)}
				{availableDiscordChannels && !isFetchingDiscordChannels && (
					<>
						<Space h={8} />
						<div className={styles.row}>
							<Text className={styles.tSectionTitleSmall}>
								DISCORD ROLE NAME
							</Text>
							<Space w={2} />
							<Text color={'red'}>*</Text>
						</div>
						<Space h={12} />
						<TextInput
							size={'lg'}
							radius={20}
							placeholder={'Enter Role Name'}
							classNames={{
								input: styles.fTextField
							}}
							value={discordRoleName}
							onChange={event => {
								if (event) {
									setDiscordRoleName(event.target.value)
								}
							}}
						/>
						<Space h={32} />

						<Text className={styles.tBold}>Channels to Gate</Text>
						<Space h={8} />

						<Checkbox.Group
							orientation="vertical"
							spacing={'xs'}
							value={selectedDiscordChannels}
							onChange={setSelectedDiscordChannels}
						>
							{availableDiscordChannels.map(channel => (
								<Checkbox
									key={channel.id}
									value={channel.id}
									label={channel.name}
								/>
							))}
						</Checkbox.Group>

						<Space h={32} />

						<div className={styles.row}>
							<Button
								disabled={isSavingChanges}
								loading={isSavingChanges}
								className={styles.buttonBlack}
								onClick={async () => {
									saveChanges()
								}}
							>
								{'Save Changes'}
							</Button>
							<Space w={8} />
							{!isSavingChanges && (
								<Button
									onClick={() => {
										setSelectedDiscordChannels([])
										onModalClosed()
									}}
									className={styles.buttonGrey}
								>
									Cancel
								</Button>
							)}
						</div>
					</>
				)}
			</Modal>
		</>
	)
}
