import { useSubscription } from '@apollo/client'
import {
	Center,
	Space,
	Text,
	Button,
	Container,
	Loader,
	Image,
	Grid
} from '@mantine/core'
import { useAuth, useMeemApollo, useWallet } from '@meemproject/react'
import { MeemAPI } from '@meemproject/sdk'
import { CheckCircle } from 'iconoir-react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import {
	SubDiscordsSubscription,
	SubTwittersSubscription,
	SubSlacksSubscription
} from '../../../generated/graphql'
import { SUB_DISCORDS, SUB_TWITTERS, SUB_SLACKS } from '../../graphql/rules'
import { isJwtError } from '../../model/agreement/agreements'
import { CookieKeys } from '../../utils/cookies'
import { FlowDiscordConnectionModal } from '../Dashboard/Flows/Modals/FlowDiscordConnectionModal'
import { useAgreement } from '../Providers/AgreementProvider'
import { colorGreen, useMeemTheme } from '../Styles/MeemTheme'

export function OnboardingConnectAccount() {
	const router = useRouter()

	const { classes: meemTheme } = useMeemTheme()

	const wallet = useWallet()

	const { jwt } = useAuth()

	const authIfNecessary = () => {
		Cookies.set(CookieKeys.authRedirectUrl, window.location.toString())
		router.push('/authenticate')
	}

	const { agreement, isLoadingAgreement, error } = useAgreement()

	const [isFetchingConnections, setIsFetchingConnections] = useState(false)
	const [hasFetchedConnections, setHasFetchedConnections] = useState(false)
	const [hasConnectedDiscord, setHasConnectedDiscord] = useState(false)
	const [hasConnectedSlack, setHasConnectedSlack] = useState(false)
	const [hasConnectedTwitter, setHasConnectedTwitter] = useState(false)

	const { mutualMembersClient } = useMeemApollo()

	const {
		data: discordConnectionData,
		loading: isFetchingDiscordConnections
	} = useSubscription<SubDiscordsSubscription>(SUB_DISCORDS, {
		variables: {
			agreementId: agreement?.id
		},
		skip: !mutualMembersClient || !agreement?.id,
		client: mutualMembersClient
	})

	const {
		data: twitterConnectionData,
		loading: isFetchingTwitterConnections
	} = useSubscription<SubTwittersSubscription>(SUB_TWITTERS, {
		variables: {
			agreementId: agreement?.id
		},
		skip: !mutualMembersClient || !agreement?.id,
		client: mutualMembersClient
	})

	const { data: slackConnectionData, loading: isFetchingSlackConnections } =
		useSubscription<SubSlacksSubscription>(SUB_SLACKS, {
			variables: {
				agreementId: agreement?.id
			},
			skip: !mutualMembersClient || !agreement?.id,
			client: mutualMembersClient
		})

	// Parse connections from subscription
	useEffect(() => {
		if (
			discordConnectionData &&
			twitterConnectionData &&
			slackConnectionData
		) {
			if (discordConnectionData.AgreementDiscords.length > 0) {
				setHasConnectedDiscord(true)
			}

			if (slackConnectionData.AgreementSlacks.length > 0) {
				setHasConnectedSlack(true)
			}

			if (twitterConnectionData.AgreementTwitters.length > 0) {
				setHasConnectedTwitter(true)
			}

			setHasFetchedConnections(true)
			setIsFetchingConnections(false)
		}
	}, [
		discordConnectionData,
		hasFetchedConnections,
		isFetchingConnections,
		slackConnectionData,
		twitterConnectionData
	])

	const [isConnectDiscordModalOpen, setIsConnectDiscordModalOpen] =
		useState(false)

	//Handle authentication for different services
	const handleAuthTwitter = useCallback(async () => {
		if (!agreement?.id || !jwt) {
			return
		}

		router.push({
			pathname: `${
				process.env.NEXT_PUBLIC_API_URL
			}${MeemAPI.v1.AuthenticateWithTwitter.path()}`,
			query: {
				agreementId: agreement.id,
				jwt,
				returnUrl: window.location.toString()
			}
		})
	}, [router, agreement, jwt])

	const handleAuthSlack = useCallback(async () => {
		if (!agreement?.id || !jwt) {
			return
		}

		router.push({
			pathname: `${
				process.env.NEXT_PUBLIC_API_URL
			}${MeemAPI.v1.AuthenticateWithSlack.path()}`,
			query: {
				agreementId: agreement.id,
				jwt,
				returnUrl: window.location.toString()
			}
		})
	}, [router, agreement, jwt])

	const isLoading =
		isLoadingAgreement ||
		isFetchingConnections ||
		isFetchingDiscordConnections ||
		isFetchingSlackConnections ||
		isFetchingTwitterConnections

	const connectionItem = (
		icon: string,
		name: string,
		description: string,
		onClick: () => void,
		showCheck: boolean
	) => (
		<Grid.Col xs={12} md={4} key={name}>
			<div
				className={meemTheme.gridItemFlat}
				onClick={onClick}
				style={{ minHeight: 170, padding: 24, position: 'relative' }}
			>
				<div className={meemTheme.centeredRow}>
					<Image src={icon} width={24} height={24} />
					<Space w={16} />
					<Text className={meemTheme.tLargeBold}>{name}</Text>
				</div>
				<Space h={16} />
				<Text className={meemTheme.tSmall} style={{ opacity: 0.7 }}>
					{description}
				</Text>
				{showCheck && (
					<CheckCircle
						style={{
							color: colorGreen,
							position: 'absolute',
							top: 16,
							right: 16
						}}
					/>
				)}
			</div>
		</Grid.Col>
	)

	return (
		<div className={meemTheme.backgroundMeem}>
			{isLoading && (
				<>
					<Space h={120} />
					<Center>
						<Loader />
					</Center>
					<Space h={256} />
				</>
			)}
			{!isLoading && !agreement?.name && (
				<>
					<Space h={120} />
					<Center>
						<Text>
							Sorry, we were unable to find that community. Check
							your spelling and try again.
						</Text>
					</Center>
					<Space h={256} />
				</>
			)}
			{!isLoading && agreement && (
				<>
					<Container>
						<Space h={64} />
						<Center>
							<Text className={meemTheme.tLargeBold}>
								Please connect at least one account below.
							</Text>
						</Center>
						<Space h={24} />
						<Center>
							<Text className={meemTheme.tSmall}>
								You’ll be able to connect additional accounts
								later.
							</Text>
						</Center>
						<Space h={48} />
						<Grid>
							{connectionItem(
								'/connect-discord.png',
								'Discord',
								'You’ll need Discord permissions that allow you to add our bot to your server.',
								() => {
									setIsConnectDiscordModalOpen(true)
								},
								hasConnectedDiscord
							)}
							{connectionItem(
								'/connect-slack.png',
								'Slack',
								'You’ll need Slack admin permissions that allow you to manage your workspace.',
								() => {
									handleAuthSlack()
								},
								hasConnectedSlack
							)}
							{connectionItem(
								'/connect-twitter.png',
								'Twitter',
								'You’ll need access to your community’s account.',
								() => {
									handleAuthTwitter()
								},
								hasConnectedTwitter
							)}
						</Grid>
						<Space h={48} />
						{(hasConnectedDiscord ||
							hasConnectedSlack ||
							hasConnectedTwitter) && (
							<Center>
								<Button
									size={'lg'}
									onClick={() => {
										if (
											!wallet.isConnected ||
											isJwtError(error)
										) {
											authIfNecessary()
											return
										}
										router.push(`/${agreement?.slug}`)
									}}
									className={meemTheme.buttonBlack}
								>
									Next
								</Button>
							</Center>
						)}
						<Space h={128} />
					</Container>
					<FlowDiscordConnectionModal
						isOpened={isConnectDiscordModalOpen}
						onModalClosed={function (): void {
							setIsConnectDiscordModalOpen(false)
						}}
					/>
				</>
			)}
		</div>
	)
}
