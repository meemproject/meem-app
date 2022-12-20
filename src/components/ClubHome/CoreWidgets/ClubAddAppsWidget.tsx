import { Button, Center, Space } from '@mantine/core'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { Club } from '../../../model/club/club'
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
				club.extensions?.filter(
					ext => ext.AgreementExtensionWidgets.length > 0
				).length !== 0 && (
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
								+ Add an extension
							</Button>
						</Center>
						<Space h={32} />
					</>
				)}
		</div>
	)
}
