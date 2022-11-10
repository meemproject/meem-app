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
	Radio
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

interface DiscordRole extends SelectItemProps {
	value: string
	label: string
	memberCount: number
}

export const RoleDiscordSyncModal: React.FC<IProps> = ({
	club,
	role,
	isOpened,
	onModalClosed
}) => {
	const { classes: design } = useGlobalStyles()

	const [discordRoles, setDiscordRoles] = useState<DiscordRole[]>()

	const [selectedDiscordRole, setSelectedDiscordRole] =
		useState<DiscordRole>()

	const [isFetchingDiscordRoles, setIsFetchingDiscordRoles] = useState(true)

	const [selectedRemoveRoleOption, setSelectedRemoveRoleOption] =
		useState('dont-remove')

	const [isSavingChanges, setIsSavingChanges] = useState(false)

	useEffect(() => {
		async function fetchDiscordRoles() {
			setDiscordRoles([
				{
					value: 'role1',
					label: 'Insider',
					memberCount: 3
				},
				{
					value: 'role2',
					label: 'Member',
					memberCount: 10
				},
				{
					value: 'role3',
					label: 'Guest',
					memberCount: 5
				}
			])
			setIsFetchingDiscordRoles(false)
		}

		if (isOpened && !discordRoles) {
			fetchDiscordRoles()
		}
	}, [discordRoles, isFetchingDiscordRoles, isOpened])

	const saveChanges = () => {
		setIsSavingChanges(true)
		log.debug(isSavingChanges)
		log.debug(selectedDiscordRole)
	}

	// eslint-disable-next-line react/display-name
	const SelectItem = forwardRef<HTMLDivElement, DiscordRole>(
		({ label, value, memberCount, ...others }: DiscordRole, ref) => (
			<div ref={ref} {...others} key={value}>
				<div className={design.spacedRow}>
					<Text>{label}</Text>
					<Text>{`${memberCount} members`}</Text>
				</div>
			</div>
		)
	)

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
					<Text className={design.tMediumBold}>
						Sync Existing Discord Role
					</Text>
				}
				onClose={() => {
					onModalClosed()
				}}
			>
				{!discordRoles && isFetchingDiscordRoles && (
					<>
						<Center>
							<Loader />
						</Center>
					</>
				)}
				{!discordRoles && !isFetchingDiscordRoles && (
					<>
						<Center>
							<Text>
								Sorry - unable to load Discord Roles. Try again
								later.
							</Text>
							<Space h={16} />
							<Button
								onClick={() => {
									onModalClosed()
								}}
								className={design.buttonGrey}
							>
								Close
							</Button>
						</Center>
					</>
				)}
				{discordRoles && !isFetchingDiscordRoles && (
					<>
						<Select
							placeholder="Select a role"
							itemComponent={SelectItem}
							size={'md'}
							onChange={value => {
								if (value != null && discordRoles) {
									discordRoles.forEach(dRole => {
										if (dRole.value === value) {
											setSelectedDiscordRole(dRole)
										}
									})
								}
							}}
							data={discordRoles ?? []}
						/>
						<Space h={32} />
						<Text>
							Remove this Discord role unauthenticated users?
						</Text>
						<Space h={8} />
						<Radio.Group
							classNames={{ label: design.fRadio }}
							orientation="vertical"
							spacing={10}
							size="md"
							color="dark"
							value={selectedRemoveRoleOption}
							onChange={(value: any) => {
								setSelectedRemoveRoleOption(value)
							}}
							required
						>
							<Radio
								value="dont-remove"
								label="No, don't remove"
							/>
							<Radio
								value="remove"
								label="Yes, remove immediately"
							/>
							<Radio
								value="remove-7-days"
								label="Yes, remove in 7 days"
							/>
						</Radio.Group>
						<Space h={32} />

						<div className={design.row}>
							<Button
								className={design.buttonBlack}
								onClick={async () => {
									saveChanges()
								}}
							>
								{'Save Changes'}
							</Button>
							<Space w={8} />
							<Button
								onClick={() => {
									onModalClosed()
								}}
								className={design.buttonGrey}
							>
								Cancel
							</Button>
						</div>
					</>
				)}
			</Modal>
		</>
	)
}
