import { Button, Center, Divider, Space } from '@mantine/core'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { Club } from '../../../model/club/club'
import { PERMISSION_MANAGE_APPS } from '../../../model/identity/permissions'
import { useClubsTheme } from '../../Styles/ClubsTheme'
interface IProps {
	club: Club
}

export const ClubAddAppsWidget: React.FC<IProps> = ({ club }) => {
	const { classes: clubsTheme } = useClubsTheme()
	const router = useRouter()

	useEffect(() => {}, [club])

	return (
		<div>
			{club.isCurrentUserClubAdmin &&
				club.currentUserClubPermissions?.includes(
					PERMISSION_MANAGE_APPS
				) && (
					<>
						<Center>
							<Button
								className={clubsTheme.buttonGrey}
								onClick={() => {
									router.push({
										pathname: `${club.slug}/admin`,
										query: { tab: 'extensions' }
									})
								}}
							>
								+ Add more extensions
							</Button>
						</Center>
						<Space h={16} />

						<Center>
							<Button
								className={clubsTheme.buttonGrey}
								onClick={() => {
									router.push({
										pathname: `${club.slug}/admin`,
										query: { tab: 'links' }
									})
								}}
							>
								+ Add more links
							</Button>
						</Center>
						<Space h={32} />
						<Divider />
						<Space h={40} />
					</>
				)}
		</div>
	)
}
