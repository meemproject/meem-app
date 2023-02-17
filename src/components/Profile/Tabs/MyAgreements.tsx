/* eslint-disable @typescript-eslint/naming-convention */
import { useSubscription } from '@apollo/client'
import {
	Text,
	Image,
	Space,
	Loader,
	Button,
	Center,
	Grid,
	Badge,
	useMantineColorScheme
} from '@mantine/core'
import { useWallet, useMeemApollo } from '@meemproject/react'
import { Group } from 'iconoir-react'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { MyAgreementsSubscriptionSubscription } from '../../../../generated/graphql'
import { SUB_MY_AGREEMENTS } from '../../../graphql/agreements'
import {
	Agreement,
	agreementSummaryFromDb,
	isJwtError as isJwtError
} from '../../../model/agreement/agreements'
import { CookieKeys } from '../../../utils/cookies'
import { hostnameToChainId } from '../../App'
import { CreateAgreementModal } from '../../Create/CreateAgreementModal'
import {
	colorBlack,
	colorDarkerGrey,
	colorDarkerYellow,
	colorWhite,
	colorYellow,
	useMeemTheme
} from '../../Styles/MeemTheme'

export const MyAgreementsComponent: React.FC = () => {
	const { classes: meemTheme } = useMeemTheme()
	const router = useRouter()
	const wallet = useWallet()
	const { mutualMembersClient } = useMeemApollo()

	const { colorScheme } = useMantineColorScheme()
	const isDarkTheme = colorScheme === 'dark'

	const [isCreationModalOpen, setIsCreationModalOpen] = useState(false)

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
		if (isJwtError(error)) {
			Cookies.set(
				CookieKeys.authRedirectUrl,
				`/profile?tab=myCommunities`
			)
			router.push('/authenticate')
		}
	}, [error, router])

	const agreements: Agreement[] = []

	agreementData?.Agreements.forEach(agr => {
		const possibleAgreement = agreementSummaryFromDb(
			agr,
			wallet.accounts[0]
		)

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
					<Loader variant="oval" color="cyan" />
				</>
			)}
			{agreements.length === 0 && !loading && (
				<>
					<Space h={16} />
					<Text className={meemTheme.tMediumBold}>
						My Communities
					</Text>
					<Space h={32} />
					<Text className={meemTheme.tMedium}>
						{`You haven't joined any communities!`}
					</Text>
					<Space h={16} />
					<Button
						className={meemTheme.buttonBlue}
						onClick={() => {
							setIsCreationModalOpen(true)
						}}
					>
						Start a new one?
					</Button>
				</>
			)}
			{agreements.length > 0 && !loading && (
				<>
					<Space h={12} />
					<Text className={meemTheme.tLargeBold}>My Communities</Text>
					<Space h={32} />

					<Grid style={{ maxWidth: 800 }}>
						{agreements.map(agreement => (
							<Grid.Col
								xs={6}
								sm={6}
								md={6}
								lg={6}
								xl={6}
								key={agreement.address}
							>
								<Link
									href={`/${agreement.slug}`}
									legacyBehavior
									passHref
								>
									<a className={meemTheme.unstyledLink}>
										<div
											key={agreement.address}
											className={meemTheme.gridItem}
										>
											<div className={meemTheme.row}>
												{agreement.image && (
													<>
														<Image
															className={
																meemTheme.imageAgreementLogo
															}
															style={{
																width: '56px',
																height: '56px'
															}}
															src={
																agreement.image
															}
															radius={8}
															fit={'cover'}
														/>
														<Space w={24} />
													</>
												)}

												<div
													className={
														meemTheme.tEllipsis
													}
												>
													<Text
														style={{
															fontWeight: 500,
															fontSize: 18
														}}
													>
														{agreement.name}
													</Text>

													<Space h={20} />
													<div
														className={
															meemTheme.row
														}
													>
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
															{
																agreement
																	.members
																	?.length
															}
														</Badge>
														{!agreement.isLaunched &&
															agreement.isCurrentUserAgreementAdmin && (
																<>
																	<Space
																		w={8}
																	/>
																	<Badge
																		gradient={{
																			from: isDarkTheme
																				? colorDarkerYellow
																				: colorYellow,
																			to: isDarkTheme
																				? colorDarkerYellow
																				: colorYellow,
																			deg: 35
																		}}
																		classNames={{
																			inner: meemTheme.tBadgeText
																		}}
																		variant={
																			'gradient'
																		}
																	>
																		Draft
																	</Badge>
																</>
															)}
													</div>
												</div>
											</div>
										</div>
									</a>
								</Link>
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
									setIsCreationModalOpen(true)
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
			<CreateAgreementModal
				isOpened={isCreationModalOpen}
				onModalClosed={function (): void {
					setIsCreationModalOpen(false)
				}}
			/>
		</>
	)
}
