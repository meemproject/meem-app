import { Button, Center, Space, Text } from '@mantine/core'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { Club } from '../../../model/club/club'
import { useClubsTheme } from '../../Styles/ClubsTheme'
interface IProps {
	club: Club
}

export const ClubBlankSlateWidget: React.FC<IProps> = ({ club }) => {
	const { classes: clubsTheme } = useClubsTheme()
	const router = useRouter()

	useEffect(() => {}, [club])

	const shouldShowBlankSlate =
		!club.extensions ||
		club.extensions?.filter(ext => ext.AgreementExtensionWidgets.length > 0)
			?.length === 0

	return (
		<div>
			{shouldShowBlankSlate && (
				<>
					<>
						{club?.isCurrentUserClubAdmin && (
							<div className={clubsTheme.widgetMeem}>
								<Center>
									<Text className={clubsTheme.tLargeBold}>
										{`Let's get started`}
									</Text>
								</Center>
								<Space h={16} />
								<Center>
									<Text className={clubsTheme.tSmall}>
										{`There's nothing for your community members to do yet. Add your first extension to enable your members to talk, organize events and much more.`}
									</Text>
								</Center>
								<Space h={24} />
								<Center>
									<Button
										className={clubsTheme.buttonBlue}
										onClick={() => {
											router.push({
												pathname: `${club.slug}/admin`,
												query: { tab: 'apps' }
											})
										}}
									>
										+ Add an extension
									</Button>
								</Center>
							</div>
						)}
					</>
					<>
						{!club?.isCurrentUserClubAdmin && (
							<div className={clubsTheme.widgetLight}>
								<Center>
									<Text className={clubsTheme.tMediumBold}>
										Under construction
									</Text>
								</Center>
								<Space h={16} />
								<Center>
									<Text className={clubsTheme.tSmall}>
										This community does not have any content
										yet. Check back later!
									</Text>
								</Center>
							</div>
						)}
					</>
				</>
			)}
		</div>
	)
}
