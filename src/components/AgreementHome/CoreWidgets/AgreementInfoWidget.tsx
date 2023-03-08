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
import { QrCode, Settings } from 'iconoir-react'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import QRCode from 'react-qr-code'
import { GetBundleByIdQuery } from '../../../../generated/graphql'
import { GET_BUNDLE_BY_ID } from '../../../graphql/agreements'
import { Agreement } from '../../../model/agreement/agreements'
import { CookieKeys } from '../../../utils/cookies'
import {
	showErrorNotification,
	showSuccessNotification
} from '../../../utils/notifications'
import {
	correctChainIdName,
	isWrongChainId,
	SwitchChainsModal
} from '../../Authenticate/SwitchChainsModal'
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

	const [isSwitchChainsModalOpened, setIsSwitchChainsModalOpened] =
		useState(false)

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
		const doesRequireMembershipFee =
			typeof agreement?.membershipSettings?.costToJoin === 'number' &&
			agreement.membershipSettings.costToJoin > 0

		if (doesRequireMembershipFee && isWrongChainId(wallet.chainId ?? 0)) {
			log.debug(`wrong chain id for action.`)
			setIsSwitchChainsModalOpened(true)
			return
		}

		if (
			!wallet.web3Provider ||
			!wallet.isConnected ||
			!wallet.signer ||
			wallet.loginState !== LoginState.LoggedIn
		) {
			Cookies.set(CookieKeys.authRedirectUrl, `/${agreement?.slug}`)
			router.push('/authenticate')
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
				if (doesRequireMembershipFee) {
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
						`Contact us using the top-right link on this page.`
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
						`Come back tomorrow or contact us using the top-right link on this page.`
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
		const network = await wallet.web3Provider?.getNetwork()

		if (network && isWrongChainId(network.chainId)) {
			log.debug(`wrong chain id for action.`)
			setIsSwitchChainsModalOpened(true)
			return
		}

		if (!wallet.web3Provider || !wallet.isConnected) {
			showErrorNotification(
				'Unable to leave this community.',
				`Make sure you are connected to the ${correctChainIdName()} network.`
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
			Cookies.set(CookieKeys.authRedirectUrl, `/${agreement?.slug}`)
			router.push('/authenticate')
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
							<Link
								href={`/${agreement.slug}/admin?tab=icon`}
								legacyBehavior
								passHref
							>
								<a className={meemTheme.unstyledLink}>
									<Image
										className={meemTheme.clickable}
										height={150}
										width={150}
										radius={16}
										src={'/community-no-icon.png'}
									/>
								</a>
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
						<Space
							h={16}
							className={meemTheme.visibleDesktopOnly}
						/>
						<Space h={4} className={meemTheme.visibleMobileOnly} />

						<Center>
							<Link
								href={`/${agreement.slug}/admin?tab=details`}
								legacyBehavior
								passHref
							>
								<a className={meemTheme.unstyledLink}>
									<Button className={meemTheme.buttonAsh}>
										Edit info
									</Button>
								</a>
							</Link>
						</Center>
						<Space
							h={16}
							className={meemTheme.visibleDesktopOnly}
						/>
						<Space h={4} className={meemTheme.visibleMobileOnly} />
					</>
				)}
				{agreement.isLaunched && (
					<>
						<Center>
							<Text
								className={meemTheme.tSmall}
								style={{ textAlign: 'center' }}
							>
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
					<Link
						href={`/${agreement.slug}/admin`}
						legacyBehavior
						passHref
					>
						<a className={meemTheme.unstyledLink}>
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
						</a>
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
			<SwitchChainsModal
				isOpened={isSwitchChainsModalOpened}
				onModalClosed={function (): void {
					setIsSwitchChainsModalOpened(false)
				}}
			/>
		</>
	)
}
