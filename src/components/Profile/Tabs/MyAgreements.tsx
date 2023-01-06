/* eslint-disable @typescript-eslint/naming-convention */
import { useSubscription } from '@apollo/client'
import {
	Text,
	Image,
	Space,
	Loader,
	Center,
	Grid,
	Badge,
	useMantineColorScheme
} from '@mantine/core'
import { useWallet, useMeemApollo } from '@meemproject/react'
import { Group } from 'iconoir-react'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { MyAgreementsSubscriptionSubscription } from '../../../../generated/graphql'
import { SUB_MY_AGREEMENTS } from '../../../graphql/agreements'
import {
	Agreement,
	agreementSummaryFromAgreement
} from '../../../model/agreement/agreements'
import { hostnameToChainId } from '../../App'
import {
	colorBlack,
	colorDarkerGrey,
	colorWhite,
	useMeemTheme
} from '../../Styles/MeemTheme'

export const MyAgreementsComponent: React.FC = () => {
	const { classes: meemTheme } = useMeemTheme()
	const router = useRouter()
	const wallet = useWallet()
	const { mutualMembersClient } = useMeemApollo()

	const { colorScheme } = useMantineColorScheme()
	const isDarkTheme = colorScheme === 'dark'

	const {
		loading,
		data: agreementData,
		error
	} = useSubscription<MyAgreementsSubscriptionSubscription>(
		SUB_MY_AGREEMENTS,
		{
			variables: {
				chainId:
					wallet.chainId ??
					hostnameToChainId(
						global.window ? global.window.location.host : ''
					),
				walletAddress:
					wallet.accounts &&
					wallet.accounts[0] &&
					wallet.accounts[0].toLowerCase()
			},
			client: mutualMembersClient
		}
	)

	useEffect(() => {
		if (
			error?.graphQLErrors &&
			error.graphQLErrors.length > 0 &&
			error.graphQLErrors[0].extensions.code === 'invalid-jwt'
		) {
			router.push({
				pathname: '/authenticate',
				query: {
					return: `/profile?tab=myCommunities`
				}
			})
		}
	}, [error, router])

	const navigateToCreate = () => {
		router.push({ pathname: '/create' })
	}

	const navigateToAgreement = (agreement: string) => {
		router.push({ pathname: `/${agreement}` })
	}

	const agreements: Agreement[] = []

	agreementData?.Agreements.forEach(agr => {
		const possibleAgreement = agreementSummaryFromAgreement(agr)

		if (possibleAgreement.name) {
			const alreadyAdded =
				agreements.filter(
					agreement => agreement.id === possibleAgreement.id
				).length > 0
			if (!alreadyAdded) {
				agreements.push(possibleAgreement)
			}
		}
	})

	return (
		<>
			{loading && (
				<>
					<Space h={16} />
					<Loader variant="oval" color="blue" />
				</>
			)}
			{agreements.length === 0 && !loading && (
				<>
					<Space h={16} />
					<Text className={meemTheme.tMediumBold}>
						My Communities
					</Text>
					<Space h={32} />
					<Text className={meemTheme.tMediumBold}>
						{`You haven't joined any communities!`}
					</Text>
					<Space h={16} />
					<Text className={meemTheme.tLink}>
						<a onClick={navigateToCreate}>Start a new one?</a>
					</Text>
				</>
			)}
			{agreements.length > 0 && !loading && (
				<>
					<Space h={12} />
					<Text className={meemTheme.tLargeBold}>My Communities</Text>
					<Space h={32} />

					<Grid style={{ maxWidth: 1000 }}>
						{agreements.map(agreement => (
							<Grid.Col
								xs={6}
								sm={6}
								md={6}
								lg={6}
								xl={6}
								key={agreement.address}
							>
								<div
									key={agreement.address}
									className={meemTheme.gridItem}
									onClick={() => {
										navigateToAgreement(
											agreement.slug ?? ''
										)
									}}
								>
									<div className={meemTheme.row}>
										<Image
											className={
												meemTheme.imageAgreementLogo
											}
											style={{
												width: '56px',
												height: '56px'
											}}
											src={agreement.image ?? ''}
											radius={8}
											fit={'cover'}
										/>
										<Space w={20} />

										<div className={meemTheme.tEllipsis}>
											<Text
												style={{
													fontWeight: 500,
													fontSize: 18
												}}
												className={meemTheme.tEllipsis}
											>
												{agreement.name}
											</Text>

											<Space h={20} />
											<div className={meemTheme.row}>
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
													{agreement.members?.length}
												</Badge>
											</div>
										</div>
									</div>
								</div>
							</Grid.Col>
						))}
						<Grid.Col
							xs={6}
							sm={6}
							md={6}
							lg={6}
							xl={6}
							key={'create-new-agreement'}
						>
							<div
								className={meemTheme.gridItemCenteredAsh}
								onClick={() => {
									navigateToCreate()
								}}
							>
								<Space h={16} />
								<Center>
									<Text
										className={meemTheme.tMedium}
										style={{ color: 'black' }}
									>
										+ Launch a new community
									</Text>
								</Center>
								<Space h={16} />
							</div>
						</Grid.Col>
					</Grid>

					<Space h={60} />
				</>
			)}
		</>
	)
}
