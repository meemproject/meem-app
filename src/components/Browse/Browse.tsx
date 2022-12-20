/* eslint-disable @typescript-eslint/naming-convention */
import { useQuery } from '@apollo/client'
import {
	Container,
	Text,
	Image,
	Button,
	Space,
	Center,
	Loader,
	Grid,
	Badge,
	useMantineColorScheme
} from '@mantine/core'
import { useWallet, useMeemApollo } from '@meemproject/react'
import { Group } from 'iconoir-react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { ArrowLeft } from 'tabler-icons-react'
import { AllAgreementsQuery, Agreements } from '../../../generated/graphql'
import { GET_ALL_AGREEMENTS } from '../../graphql/agreements'
import {
	Agreement,
	agreementSummaryFromAgreement
} from '../../model/agreement/agreements'
import { hostnameToChainId } from '../App'
import {
	colorBlack,
	colorDarkerGrey,
	colorWhite,
	useMeemTheme
} from '../Styles/AgreementsTheme'

export const BrowseComponent: React.FC = () => {
	const { classes: meemTheme } = useMeemTheme()
	const router = useRouter()
	const { chainId } = useWallet()
	const limit = 20
	const [page, setPage] = useState(0)

	const [agreements] = useState<Agreement[]>([])

	const { anonClient } = useMeemApollo()

	const {
		loading,
		error,
		data: agreementData
	} = useQuery<AllAgreementsQuery>(GET_ALL_AGREEMENTS, {
		variables: {
			chainId:
				chainId ??
				hostnameToChainId(
					global.window ? global.window.location.host : ''
				),
			limit,
			offset: limit * page
		},
		client: anonClient
	})

	const navigateHome = () => {
		router.push({ pathname: '/' })
	}

	const navigateToCreate = () => {
		router.push({ pathname: '/' })
	}

	const navigateToAgreement = (agreement: string) => {
		router.push({ pathname: `/${agreement}` })
	}

	agreementData?.Agreements.forEach(meem => {
		const possibleAgreement = agreementSummaryFromAgreement(
			meem as Agreements
		)

		if (possibleAgreement.name) {
			let doesAgreementExist = false
			agreements.forEach(agreement => {
				if (possibleAgreement.slug === agreement.slug) {
					doesAgreementExist = true
				}
			})
			if (!doesAgreementExist) {
				agreements.push(possibleAgreement)
			}
		}
	})

	const isLoadingAgreements = agreements.length === 0

	const { colorScheme } = useMantineColorScheme()
	const isDarkTheme = colorScheme === 'dark'

	return (
		<>
			<div className={meemTheme.pageHeader}>
				<div className={meemTheme.centeredRow}>
					<a onClick={navigateHome}>
						<ArrowLeft className={meemTheme.backArrow} size={32} />
					</a>
					<Space w={16} />
					<Text className={meemTheme.tLargeBold}>
						Browse all agreements
					</Text>
				</div>
				<Button
					style={{ marginRight: 32 }}
					onClick={navigateToCreate}
					className={meemTheme.buttonBlack}
				>
					Create a Agreement
				</Button>
			</div>

			<Container>
				{!error && isLoadingAgreements && (
					<Container>
						<Space h={60} />
						<Center>
							<Loader color="blue" variant="oval" />
						</Center>
					</Container>
				)}

				{error && (
					<Container>
						<Space h={60} />
						<Center>
							<div>
								<Text>
									An error occurred loading agreements. Try
									again later.
								</Text>
								<Space h={8} />
								<Text>{JSON.stringify(error)}</Text>
							</div>
						</Center>
					</Container>
				)}

				<Space h={32} />

				{!isLoadingAgreements && (
					<>
						<Grid>
							{agreements.map(agreement => (
								<Grid.Col
									xs={8}
									sm={6}
									md={4}
									lg={4}
									xl={4}
									key={agreement.address}
								>
									<div
										key={agreement.address}
										className={meemTheme.gridItem}
										style={{
											display: 'flex'
										}}
										onClick={() => {
											navigateToAgreement(
												agreement.slug ?? ''
											)
										}}
									>
										<Image
											className={
												meemTheme.imageAgreementLogo
											}
											src={agreement.image ?? ''}
											width={40}
											radius={8}
											height={40}
											fit={'cover'}
										/>
										<Space w="xs" />
										<div className={meemTheme.tEllipsis}>
											<Text
												className={meemTheme.tSmallBold}
												style={{
													textOverflow: 'ellipsis',
													msTextOverflow: 'ellipsis',
													whiteSpace: 'nowrap',
													overflow: 'hidden'
												}}
											>
												{agreement.name}
											</Text>
											<Space h={4} />
											<Text
												className={
													meemTheme.tExtraSmall
												}
												style={{
													marginRight: 8,
													lineHeight: 1.4,
													textOverflow: 'ellipsis',
													msTextOverflow: 'ellipsis',
													whiteSpace: 'nowrap',
													overflow: 'hidden'
												}}
											>
												{agreement.description}{' '}
											</Text>
											<Space h={8} />
											<Badge
												gradient={{
													from: isDarkTheme
														? colorDarkerGrey
														: '#DCDCDC',
													to: isDarkTheme
														? colorDarkerGrey
														: '#DCDCDC',
													deg: 35
												}}
												classNames={{
													inner: meemTheme.tBadgeText
												}}
												variant={'gradient'}
												leftSection={
													<>
														<Group
															style={{
																color: isDarkTheme
																	? colorWhite
																	: colorBlack,
																marginTop: 5
															}}
														/>
													</>
												}
											>
												{agreement.memberCount}
											</Badge>
										</div>
									</div>
								</Grid.Col>
							))}
						</Grid>
						<Space h={24} />

						<Button
							className={meemTheme.buttonBlack}
							loading={loading}
							onClick={() => {
								setPage(page + 1)
							}}
						>
							Load more
						</Button>
					</>
				)}
			</Container>
		</>
	)
}
