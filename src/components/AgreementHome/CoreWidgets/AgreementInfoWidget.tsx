import { useQuery } from '@apollo/client'
import log from '@kengoldfarb/log'
import {
	Text,
	Button,
	Space,
	Image,
	Center,
	Modal,
	Divider,
	useMantineColorScheme,
	Loader
} from '@mantine/core'
import { cleanNotifications } from '@mantine/notifications'
import {
	LoginState,
	useMeemApollo,
	useMeemUser,
	useSDK,
	useWallet
} from '@meemproject/react'
import { getAgreementContract, MeemAPI } from '@meemproject/sdk'
import { Contract, ethers } from 'ethers'
import { QrCode } from 'iconoir-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import QRCode from 'react-qr-code'
import { Settings } from 'iconoir-react'
import { GetBundleByIdQuery } from '../../../../generated/graphql'
import { GET_BUNDLE_BY_ID } from '../../../graphql/agreements'
import { Agreement } from '../../../model/agreement/agreements'
import {
	showErrorNotification,
	showSuccessNotification
} from '../../../utils/notifications'
import { colorLightGrey, useMeemTheme } from '../../Styles/MeemTheme'
import { AgreementDetailsModal } from '../AgreementDetailsModal'
import { JoinLeaveAgreementModal } from '../JoinLeaveAgreementModal'
interface IProps {
	agreement: Agreement
	meetsReqs: boolean
	reqsChecked: boolean
}

export const AgreementInfoWidget: React.FC<IProps> = ({
	agreement,
	meetsReqs,
	reqsChecked
}) => {
	// General Imports
	const { classes: meemTheme } = useMeemTheme()
	const router = useRouter()
	const wallet = useWallet()
	const user = useMeemUser()
	const { sdk } = useSDK()

	const { anonClient } = useMeemApollo()

	const [isJoiningAgreement, setIsJoiningAgreement] = useState(false)
	const [isLeavingAgreement, setIsLeavingAgreement] = useState(false)

	const [isAgreementDetailsModalOpen, setIsAgreementDetailsModalOpen] =
		useState(false)

	const { colorScheme } = useMantineColorScheme()
	const isDarkTheme = colorScheme === 'dark'

	const { data: bundleData } = useQuery<GetBundleByIdQuery>(
		GET_BUNDLE_BY_ID,
		{
			variables: {
				id: process.env.NEXT_PUBLIC_MEEM_BUNDLE_ID
			},
			client: anonClient
		}
	)

	const joinAgreement = async () => {
		if (!wallet.web3Provider || !wallet.isConnected || !wallet.signer) {
			await wallet.connectWallet()
			return
		}

		if (wallet.loginState !== LoginState.LoggedIn) {
			router.push({
				pathname: '/authenticate',
				query: {
					return: `/${agreement?.slug}`
				}
			})
			return
		}

		const membershipQuantityIsFinite =
			agreement.membershipSettings?.membershipQuantity &&
			agreement.membershipSettings.membershipQuantity > 0

		if (
			agreement.members &&
			agreement.membershipSettings &&
			agreement.members?.length >=
				agreement.membershipSettings?.membershipQuantity &&
			membershipQuantityIsFinite
		) {
			showErrorNotification(
				`This community is full!`,
				`Please contact a community owner or admin.`
			)
			return
		}

		setIsJoiningAgreement(true)
		try {
			if (
				agreement &&
				agreement.rawAgreement &&
				agreement.id &&
				agreement.address
			) {
				if (
					typeof agreement?.membershipSettings?.costToJoin ===
						'number' &&
					agreement.membershipSettings.costToJoin > 0
				) {
					const { proof } = await sdk.agreement.getMintingProof({
						to: wallet.accounts[0],
						agreementId: agreement.id
					})

					// Cost to join. Run the transaction in browser.
					const agreementContract = getAgreementContract({
						address: agreement.address,
						signer: wallet.signer
					})

					const uri = JSON.stringify({
						name: agreement?.name ?? '',
						description:
							agreement?.description &&
							agreement?.description?.length > 0
								? agreement?.description
								: 'Community Token',
						image: agreement?.image,
						external_link: '',
						application_instructions: []
					})
					const data = {
						to: wallet.accounts[0],
						tokenURI: uri,
						tokenType: MeemAPI.MeemType.Original,
						proof
					}

					log.debug(JSON.stringify(data))
					const tx = await agreementContract?.mint(data, {
						gasLimit: '5000000',
						value: ethers.utils.parseEther(
							agreement?.membershipSettings
								? `${agreement.membershipSettings.costToJoin}`
								: '0'
						)
					})

					// @ts-ignore
					await tx.wait()
				} else if (agreement?.address && wallet.chainId) {
					const { txId } = await sdk.agreement.bulkMint({
						agreementId: agreement.id,
						tokens: [
							{
								to: wallet.accounts[0],
								metadata: {
									name: agreement?.name ?? '',
									description:
										agreement?.description &&
										agreement?.description?.length > 0
											? agreement?.description
											: 'Community Token',
									image: agreement?.image,
									meem_metadata_type: 'Meem_AgreementToken',
									meem_metadata_version: '20221116'
								}
							}
						]
					})

					// TODO: Watch for transaction to complete

					log.debug(`Minting w/ transaction id: ${txId}`)
				} else {
					setIsJoiningAgreement(false)
					showErrorNotification(
						'Error joining this community.',
						`Please get in touch!`
					)
				}
			}
		} catch (e) {
			log.crit(e)
			const error: any = JSON.parse(
				(e as any).toString().split('Error: ')[1]
			)

			if (error.code) {
				log.debug(error.code)
				if (error.code === 'TX_LIMIT_EXCEEDED') {
					showErrorNotification(
						'Transaction limit exceeded',
						`Come back tomorrow or get in touch!`
					)
				} else {
					showErrorNotification(
						'Unable to join this community.',
						`Make sure you meet all of the community's requirements!`
					)
				}
			}

			setIsJoiningAgreement(false)
		}
	}

	const leaveAgreement = async () => {
		if (!wallet.web3Provider || !wallet.isConnected) {
			showErrorNotification(
				'Unable to leave this community.',
				`Did you connect your wallet?`
			)
			return
		}

		if (
			agreement?.isCurrentUserAgreementAdmin &&
			agreement?.admins?.length === 1
		) {
			showErrorNotification(
				'Oops!',
				`You cannot leave this community because you are the only administrator.`
			)
			return
		}

		if (wallet.loginState !== LoginState.LoggedIn) {
			router.push({
				pathname: '/authenticate',
				query: {
					return: `/${agreement?.slug}`
				}
			})
			return
		}

		setIsLeavingAgreement(true)
		try {
			const agreementContract = new Contract(
				agreement?.address ?? '',
				bundleData?.Bundles[0].abi,
				wallet.web3Provider.getSigner()
			)
			if (agreement && agreement.membershipToken) {
				const tx = await agreementContract?.burn(
					agreement?.membershipToken
				)
				// @ts-ignore
				await tx.wait()
			}
		} catch (e) {
			setIsLeavingAgreement(false)
			showErrorNotification(
				'Error leaving this community.',
				`Did you cancel the transaction?`
			)
		}
	}

	useEffect(() => {
		async function join() {
			if (agreement.isCurrentUserAgreementMember) {
				log.debug('current user has joined the agreement!')
				setIsJoiningAgreement(false)

				showSuccessNotification(
					`Welcome to ${agreement.name}!`,
					`You now have access to this community.`
				)
			}
		}

		async function leave() {
			if (!agreement.isCurrentUserAgreementMember) {
				log.debug('current user has left the agreement')

				setIsLeavingAgreement(false)

				cleanNotifications()
				showSuccessNotification(
					'Successfully left the community.',
					`You'll be missed!`
				)
			}
		}

		if (isJoiningAgreement && agreement) {
			join()
		} else if (isLeavingAgreement && agreement) {
			leave()
		}
	}, [agreement, isJoiningAgreement, isLeavingAgreement])

	// UI
	const [isQrModalOpened, setIsQrModalOpened] = useState(false)

	return (
		<>
			<div className={meemTheme.widgetDark}>
				{agreement.image && (
					<>
						<Space h={8} />
						<Center>
							<Image
								height={150}
								width={150}
								radius={16}
								src={agreement.image}
							/>
						</Center>
					</>
				)}
				{agreement.isCurrentUserAgreementAdmin && !agreement.image && (
					<>
						<Space h={8} />
						<Center>
							<Link href={`/${agreement.slug}/admin?tab=icon`}>
								<Image
									className={meemTheme.clickable}
									height={150}
									width={150}
									radius={16}
									src={'/community-no-icon.png'}
								/>
							</Link>
						</Center>
					</>
				)}

				<Space h={16} />
				<Center>
					<Text
						className={meemTheme.tLargeBold}
						style={{ textAlign: 'center' }}
					>
						{agreement.name}
					</Text>
				</Center>
				<Space h={16} />
				{!agreement.isLaunched && (
					<>
						<Space h={16} />
						<Center>
							<Link href={`/${agreement.slug}/admin?tab=details`}>
								<Button className={meemTheme.buttonAsh}>
									Edit info
								</Button>
							</Link>
						</Center>
						<Space h={16} />
					</>
				)}
				{agreement.isLaunched && (
					<>
						<Center>
							<Text className={meemTheme.tSmall}>
								{agreement.description &&
								agreement.description?.length > 0
									? agreement.description
									: 'A Meem community'}
							</Text>
						</Center>
						<Space h={24} />
						<Center>
							<div style={{ width: 200 }}>
								{agreement.isCurrentUserAgreementMember && (
									<Button
										fullWidth
										className={
											meemTheme.buttonYellowBordered
										}
										disabled={isLeavingAgreement}
										loading={isLeavingAgreement}
										onClick={() => {
											leaveAgreement()
										}}
									>
										Leave Community
									</Button>
								)}
								{!agreement.isCurrentUserAgreementMember && (
									<>
										{user.user && !reqsChecked && (
											<>
												<Center>
													<Loader
														height={24}
														variant={'oval'}
														color={'cyan'}
													/>
												</Center>
											</>
										)}
										{((user.user && reqsChecked) ||
											(!user.user &&
												!user.isLoading)) && (
											<Button
												fullWidth
												className={
													meemTheme.buttonYellow
												}
												disabled={
													isJoiningAgreement ||
													(!meetsReqs &&
														user.user &&
														!user.isLoading)
												}
												loading={isJoiningAgreement}
												onClick={() => {
													joinAgreement()
												}}
											>
												{meetsReqs ||
												(!user.user && !user.isLoading)
													? `Join ${
															agreement
																.membershipSettings
																?.costToJoin &&
															agreement
																.membershipSettings
																?.costToJoin > 0
																? `(${agreement.membershipSettings.costToJoin} MATIC)`
																: ''
													  }`
													: 'Requirements Not Met'}
											</Button>
										)}
									</>
								)}
							</div>
						</Center>

						{!agreement.isCurrentUserAgreementMember &&
							agreement.membershipSettings?.membershipQuantity !==
								undefined &&
							agreement.membershipSettings.membershipQuantity >
								0 && (
								<>
									<Space h={8} />
									<Center>
										<Text
											className={meemTheme.tExtraSmall}
											style={{ color: colorLightGrey }}
										>{`${agreement.members?.length} of ${agreement.membershipSettings.membershipQuantity}`}</Text>
									</Center>
								</>
							)}
						<Space h={16} />

						<Center>
							<div style={{ width: 200 }}>
								<Button
									style={{
										margin:
											agreement.extensions &&
											agreement.extensions?.length > 0
												? 3
												: 0
									}}
									fullWidth
									className={
										agreement.isCurrentUserAgreementMember
											? meemTheme.buttonYellow
											: meemTheme.buttonYellowBordered
									}
									onClick={() => {
										setIsQrModalOpened(true)
									}}
								>
									<QrCode />
									<Space w={4} />
									<Text>Scan Code</Text>
								</Button>
							</div>
						</Center>
						{agreement.extensions &&
							agreement.extensions?.filter(
								ext =>
									ext.AgreementExtensionLinks.length > 0 &&
									ext.isSetupComplete &&
									ext.metadata.sidebarVisible
							).length > 0 && <Space h={12} />}
						{agreement.extensions &&
							agreement.extensions?.filter(
								ext =>
									ext.AgreementExtensionLinks.length > 0 &&
									ext.isSetupComplete &&
									ext.metadata.sidebarVisible
							).length > 0 && (
								<>
									<Center>
										<div
											className={meemTheme.row}
											style={{ flexWrap: 'wrap' }}
										>
											{agreement.extensions
												?.filter(
													ext =>
														ext
															.AgreementExtensionLinks
															.length > 0 &&
														ext.metadata
															.sidebarVisible
												)
												.map(extension => (
													<div key={extension.id}>
														<Button
															style={{
																margin: 3
															}}
															className={
																meemTheme.buttonWhite
															}
															onClick={() => {
																if (
																	extension
																		.AgreementExtensionLinks[0]
																) {
																	window.open(
																		extension
																			.AgreementExtensionLinks[0]
																			.url
																	)
																}
															}}
														>
															<Image
																width={20}
																src={`/${
																	isDarkTheme
																		? `${(
																				extension
																					.Extension
																					?.icon ??
																				''
																		  ).replace(
																				'.png',
																				'-white.png'
																		  )}`
																		: extension
																				.Extension
																				?.icon
																}`}
															/>
														</Button>
													</div>
												))}
										</div>
									</Center>
								</>
							)}

						<Space h={32} />
						<Center>
							<Text
								className={meemTheme.tExtraSmallBold}
								style={{ cursor: 'pointer' }}
								onClick={() => {
									setIsAgreementDetailsModalOpen(true)
								}}
							>
								View Details
							</Text>
						</Center>
					</>
				)}

				{agreement.isCurrentUserAgreementAdmin && (
					<Link href={`/${agreement.slug}/admin`}>
						<div>
							<Settings
								style={{
									position: 'absolute',
									top: 16,
									right: 16,
									cursor: 'pointer'
								}}
							/>
						</div>
					</Link>
				)}
			</div>

			<JoinLeaveAgreementModal
				isOpened={isJoiningAgreement || isLeavingAgreement}
				onModalClosed={() => {}}
			/>
			<Modal
				centered
				overlayBlur={8}
				radius={16}
				size={300}
				padding={'sm'}
				title={'Community QR Code'}
				opened={isQrModalOpened}
				onClose={() => setIsQrModalOpened(false)}
			>
				<Divider />
				<Space h={24} />
				<QRCode
					value={
						agreement
							? `${window.location.origin}/${agreement.slug}`
							: ''
					}
				/>
			</Modal>
			<AgreementDetailsModal
				agreement={agreement}
				isOpened={isAgreementDetailsModalOpen}
				onModalClosed={() => {
					setIsAgreementDetailsModalOpen(false)
				}}
			/>
		</>
	)
}
