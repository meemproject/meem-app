import {
	Text,
	Space,
	Modal,
	Image,
	Divider,
	Grid,
	Center,
	MediaQuery
} from '@mantine/core'
// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react'
import { useGlobalStyles } from '../Styles/GlobalStyles'

interface IProps {
	isOpened: boolean
	onModalClosed: () => void
}

interface ConnectionMethod {
	id: string
	name: string
	icon: string
}

export const JoinClubsModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed
}) => {
	const { classes: styles } = useGlobalStyles()

	const methods: ConnectionMethod[] = [
		{
			id: 'walletconnect',
			name: 'WalletConnect',
			icon: 'connect-walletconnect.png'
		},
		{
			id: 'email',
			name: 'Email Address',
			icon: 'connect-email.png'
		},
		{
			id: 'discord',
			name: 'Discord',
			icon: 'connect-discord.png'
		},
		{
			id: 'twitter',
			name: 'Twitter',
			icon: 'connect-twitter.png'
		},
		{
			id: 'google',
			name: 'Google',
			icon: 'connect-google.png'
		}
	]

	return (
		<>
			<MediaQuery largerThan="md" styles={{ display: 'none' }}>
				<Modal
					centered
					radius={16}
					overlayBlur={8}
					padding={'sm'}
					fullScreen
					opened={isOpened}
					title={
						<Text className={styles.tModalTitle}>
							Connect to Clubs
						</Text>
					}
					onClose={() => {
						onModalClosed()
					}}
				>
					{methods.map(method => (
						<div key={method.id}>
							<div
								className={styles.connectMethodButtonSmall}
								key={method.id}
							>
								<Image
									src={method.icon}
									width={50}
									height={50}
								/>
								<Space w={16} />
								<Text className={styles.tBold}>
									{method.name}
								</Text>
							</div>
							<Space h={16} />
						</div>
					))}

					<Space h={24} />
				</Modal>
			</MediaQuery>
			<MediaQuery smallerThan="md" styles={{ display: 'none' }}>
				<Modal
					centered
					radius={16}
					overlayBlur={8}
					padding={'lg'}
					size={'47%'}
					opened={isOpened}
					title={
						<Text className={styles.tModalTitle}>
							Connect to Clubs
						</Text>
					}
					onClose={() => {
						onModalClosed()
					}}
				>
					<Divider />
					<Space h={24} />

					<Grid>
						{methods.map(method => (
							<Grid.Col md={6} lg={6} xl={4} key={method.id}>
								<div className={styles.connectMethodButton}>
									<Center>
										<div
											className={
												styles.connectMethodButtonContent
											}
										>
											<Image
												src={method.icon}
												height={50}
												fit={'contain'}
											/>
											<Space h={16} />
											<Text className={styles.tBold}>
												{method.name}
											</Text>
										</div>
									</Center>
								</div>
							</Grid.Col>
						))}
					</Grid>

					<Space h={24} />
				</Modal>
			</MediaQuery>
		</>
	)
}
