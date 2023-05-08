import { useQuery } from '@apollo/client'
import {
	Center,
	Space,
	Text,
	Button,
	Grid,
	Container,
	Loader
} from '@mantine/core'
import { useMeemApollo, useWallet } from '@meemproject/react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { MyAgreementsQueryQuery } from '../../../generated/graphql'
import { GET_MY_AGREEMENTS } from '../../graphql/agreements'
import { isJwtError } from '../../model/agreement/agreements'
import { CookieKeys } from '../../utils/cookies'
import { CreateAgreementModal } from '../Create/CreateAgreementModal'
import { useMeemTheme } from '../Styles/MeemTheme'

export function HomeComponent() {
	const router = useRouter()

	const { classes: meemTheme } = useMeemTheme()

	const wallet = useWallet()

	const { mutualMembersClient } = useMeemApollo()

	const {
		data: communitiesData,
		loading,
		error
	} = useQuery<MyAgreementsQueryQuery>(GET_MY_AGREEMENTS, {
		variables: {
			walletAddress: wallet.isConnected ? wallet.accounts[0] : '',
			chainId: process.env.NEXT_PUBLIC_CHAIN_ID
		},
		skip: !mutualMembersClient,
		client: mutualMembersClient
	})

	const [isCreateAgreementModalOpen, setIsCreateAgreementModalOpen] =
		useState(false)

	useEffect(() => {
		if (
			!loading &&
			communitiesData &&
			communitiesData.Agreements.length > 0
		) {
			router.push({
				pathname: `/${communitiesData.Agreements[0].slug}`
			})
		}
	}, [communitiesData, loading, router])

	const toolItem = (
		title: string,
		description: string,
		onClick: () => void
	) => (
		<Grid.Col xs={12} md={4} key={title}>
			<div className={meemTheme.gridItemFlowTemplate}>
				<Text className={meemTheme.tMediumBold}>{title}</Text>
				<Space h={8} />
				<Text
					className={meemTheme.tExtraSmall}
					style={{ minHeight: 50 }}
				>
					{description}
				</Text>
				<Space h={8} />
				<Button className={meemTheme.buttonDarkGrey} onClick={onClick}>
					Launch
				</Button>
			</div>
		</Grid.Col>
	)

	const authIfNecessary = () => {
		Cookies.set(CookieKeys.authRedirectUrl, window.location.toString())
		router.push('/authenticate')
	}

	return (
		<div className={meemTheme.backgroundMeem}>
			{(loading ||
				(communitiesData &&
					communitiesData?.Agreements?.length > 0)) && (
				<>
					<Space h={120} />
					<Center>
						<Loader />
					</Center>
					<Space h={600} />
				</>
			)}
			{!loading &&
				(!communitiesData ||
					(communitiesData &&
						communitiesData.Agreements.length === 0)) && (
					<>
						<Space h={96} />
						<Center>
							<Text
								className={meemTheme.tLargeBold}
							>{`Meem is a collective of communities building`}</Text>
						</Center>
						<Center>
							<Text className={meemTheme.tLargeBold}>
								{`the tools we
					wish we had.`}
							</Text>
						</Center>
						<Space h={32} />
						<Center>
							<Button
								onClick={() => {
									if (
										!wallet.isConnected ||
										isJwtError(error)
									) {
										authIfNecessary()
										return
									}
									setIsCreateAgreementModalOpen(true)
								}}
								className={meemTheme.buttonBlack}
								size={'md'}
							>
								Connect My Community
							</Button>
						</Center>
						<Space h={96} />
						<Center>
							<Text className={meemTheme.tExtraSmallLabel}>
								{'Our Tools'.toUpperCase()}
							</Text>
						</Center>
						<Space h={24} />
						<Container>
							<Grid>
								{toolItem(
									'📰 Community News',
									'Manage what gets reported and published.',
									() => {
										if (
											!wallet.isConnected ||
											isJwtError(error)
										) {
											authIfNecessary()
											return
										}
										setIsCreateAgreementModalOpen(true)
									}
								)}
								{toolItem(
									'📚 Community Libraries',
									'Curate media and links together.',
									() => {
										if (
											!wallet.isConnected ||
											isJwtError(error)
										) {
											authIfNecessary()
											return
										}
										setIsCreateAgreementModalOpen(true)
									}
								)}
								{toolItem(
									'🛒 Community Markets',
									'Support local market vendors.',
									() => {
										if (
											!wallet.isConnected ||
											isJwtError(error)
										) {
											authIfNecessary()
											return
										}
										setIsCreateAgreementModalOpen(true)
									}
								)}
							</Grid>
						</Container>
						<Space h={150} />
						<CreateAgreementModal
							isOpened={isCreateAgreementModalOpen}
							onModalClosed={() => {
								setIsCreateAgreementModalOpen(false)
							}}
						/>
					</>
				)}
		</div>
	)
}
