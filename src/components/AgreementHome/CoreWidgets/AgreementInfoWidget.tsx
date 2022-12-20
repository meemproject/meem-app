import { useQuery } from '@apollo/client'
import log from '@kengoldfarb/log'
import {
	Text,
	Button,
	Space,
	Image,
	Center,
	Modal,
	Divider
} from '@mantine/core'
import { cleanNotifications, showNotification } from '@mantine/notifications'
import { LoginState, useSDK, useWallet } from '@meemproject/react'
import { getAgreementContract, MeemAPI } from '@meemproject/sdk'
import { Contract, ethers } from 'ethers'
import { QrCode } from 'iconoir-react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import QRCode from 'react-qr-code'
import { Check, Settings } from 'tabler-icons-react'
import { GetBundleByIdQuery } from '../../../../generated/graphql'
import { GET_BUNDLE_BY_ID } from '../../../graphql/agreements'
import { Agreement } from '../../../model/agreement/agreements'
import { quickTruncate } from '../../../utils/truncated_wallet'
import { colorGreen, useMeemTheme } from '../../Styles/AgreementsTheme'
import { JoinLeaveAgreementModal } from '../JoinLeaveAgreementModal'
interface IProps {
	agreement: Agreement
	meetsReqs: boolean
}

export const AgreementInfoWidget: React.FC<IProps> = ({
	agreement,
	meetsReqs
}) => {
	// General Imports
	const { classes: meemTheme } = useMeemTheme()
	const router = useRouter()
	const wallet = useWallet()
	const { sdk } = useSDK()

	const [isJoiningAgreement, setIsJoiningAgreement] = useState(false)
	const [isLeavingAgreement, setIsLeavingAgreement] = useState(false)

	const { data: bundleData } = useQuery<GetBundleByIdQuery>(
		GET_BUNDLE_BY_ID,
		{
			variables: {
				id: process.env.NEXT_PUBLIC_MEEM_BUNDLE_ID
			}
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
					showNotification({
						radius: 'lg',
						title: 'Error joining this agreement.',
						message: `Please get in touch!`
					})
				}
			}
		} catch (e) {
			log.crit(e)
			const error: any = JSON.parse(
				(e as any).toString().split('Error: ')[1]
			)
			log.debug(error.code)
			if (error.code === 'TX_LIMIT_EXCEEDED') {
				showNotification({
					radius: 'lg',
					title: 'Transaction limit exceeded',
					message: `Come back tomorrow or get in touch!`
				})
			} else {
				showNotification({
					radius: 'lg',
					title: 'Error joining this agreement.',
					message: `Please get in touch!`
				})
			}
			setIsJoiningAgreement(false)
		}
	}

	const leaveAgreement = async () => {
		if (!wallet.web3Provider || !wallet.isConnected) {
			showNotification({
				radius: 'lg',
				title: 'Unable to leave this agreement.',
				message: `Did you connect your wallet?`
			})
			return
		}

		if (
			agreement?.isCurrentUserAgreementAdmin &&
			agreement?.admins?.length === 1
		) {
			showNotification({
				radius: 'lg',
				title: 'Oops!',
				message: `You cannot leave this agreement because you are the only admin.`
			})
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
				wallet.signer
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
			showNotification({
				radius: 'lg',
				title: 'Error leaving this agreement.',
				message: `Did you cancel the transaction?`
			})
		}
	}

	useEffect(() => {
		async function join() {
			if (agreement.isCurrentUserAgreementMember) {
				log.debug('current user has joined the agreement!')
				setIsJoiningAgreement(false)

				showNotification({
					radius: 'lg',
					title: `Welcome to ${agreement.name}!`,
					color: colorGreen,
					autoClose: 5000,
					message: `You now have access to this agreement.`
				})
			}
		}

		async function leave() {
			if (!agreement.isCurrentUserAgreementMember) {
				log.debug('current user has left the agreement')

				setIsLeavingAgreement(false)

				cleanNotifications()
				showNotification({
					radius: 'lg',
					title: 'Successfully left the agreement.',
					color: colorGreen,
					autoClose: 5000,
					message: `You'll be missed!`
				})
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

	const navigateToAdmin = () => {
		router.push({ pathname: `/${agreement.slug}/admin` })
	}

	return (
		<>
			<div className={meemTheme.widgetDark}>
				<Space h={8} />
				<Center>
					<Image
						className={meemTheme.imagePixelated}
						height={150}
						width={150}
						src={agreement.image}
					/>
				</Center>
				<Space h={16} />
				<Center>
					<Text className={meemTheme.tLargeBold}>
						{agreement.name}
					</Text>
				</Center>
				<Space h={16} />
				<Center>
					<Text className={meemTheme.tSmall}>
						{agreement.description}
					</Text>
				</Center>

				<Space h={32} />
				<Center>
					<div className={meemTheme.row} style={{ flexWrap: 'wrap' }}>
						<Button
							style={{
								margin:
									agreement.extensions &&
									agreement.extensions?.length > 0
										? 3
										: 0
							}}
							className={meemTheme.buttonWhite}
							onClick={() => {
								setIsQrModalOpened(true)
							}}
						>
							<QrCode />
							<Space w={4} />
							<Text>Scan</Text>
						</Button>

						{agreement.extensions
							?.filter(
								ext => ext.AgreementExtensionLinks.length > 0
							)
							.map(extension => (
								<>
									<Button
										style={{
											margin: 3
										}}
										className={meemTheme.buttonWhite}
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
											height={20}
											src={extension.Extension?.icon}
										/>
									</Button>
								</>
							))}
					</div>
				</Center>
				<Space h={16} />

				<Center>
					{agreement.isCurrentUserAgreementMember && (
						<Button
							className={meemTheme.buttonDarkGrey}
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
						<Button
							className={meemTheme.buttonWhite}
							disabled={isJoiningAgreement || !meetsReqs}
							loading={isJoiningAgreement}
							onClick={() => {
								joinAgreement()
							}}
						>
							{meetsReqs
								? 'Join Community'
								: 'Requirements Not Met'}
						</Button>
					)}
				</Center>
				<Space h={32} />
				<Center>
					<Text className={meemTheme.tExtraSmallLabel}>
						Contract Address
					</Text>
				</Center>
				<Space h={8} />
				<Center>
					<div className={meemTheme.row}>
						<Text>{quickTruncate(agreement.address ?? '')}</Text>
						<Space w={4} />
						<Image
							className={meemTheme.copyIcon}
							src="/copy.png"
							height={20}
							onClick={() => {
								navigator.clipboard.writeText(
									`${window.location.origin}/${agreement.slug}`
								)
								showNotification({
									radius: 'lg',
									title: 'Agreement contract address copied!',
									autoClose: 2000,
									color: colorGreen,
									icon: <Check />,

									message: `This agreement's contract address was copied to your clipboard.`
								})
							}}
							width={20}
						/>
					</div>
				</Center>
				{agreement.isCurrentUserAgreementAdmin && (
					<div
						style={{
							position: 'absolute',
							top: 16,
							right: 16,
							cursor: 'pointer'
						}}
					>
						<Settings
							onClick={() => {
								navigateToAdmin()
							}}
						/>
					</div>
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
				title={'Agreement QR Code'}
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
		</>
	)
}
