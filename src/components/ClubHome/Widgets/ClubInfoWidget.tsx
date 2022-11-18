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
import { LoginState, useWallet } from '@meemproject/react'
import { makeFetcher, MeemAPI } from '@meemproject/sdk'
import { Contract, ethers } from 'ethers'
import { QrCode } from 'iconoir-react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import QRCode from 'react-qr-code'
import { Check, Settings } from 'tabler-icons-react'
import { GetBundleByIdQuery } from '../../../../generated/graphql'
import { GET_BUNDLE_BY_ID } from '../../../graphql/clubs'
import { Club } from '../../../model/club/club'
import { quickTruncate } from '../../../utils/truncated_wallet'
import { hostnameToChainId } from '../../App'
import { colorGreen, useClubsTheme } from '../../Styles/ClubsTheme'
import { JoinLeaveClubModal } from '../JoinLeaveClubModal'
interface IProps {
	club: Club
	meetsReqs: boolean
}

export const ClubInfoWidget: React.FC<IProps> = ({ club, meetsReqs }) => {
	// General Imports
	const { classes: clubsTheme } = useClubsTheme()
	const router = useRouter()
	const wallet = useWallet()

	const [isJoiningClub, setIsJoiningClub] = useState(false)
	const [isLeavingClub, setIsLeavingClub] = useState(false)

	const { data: bundleData } = useQuery<GetBundleByIdQuery>(
		GET_BUNDLE_BY_ID,
		{
			variables: {
				id: process.env.NEXT_PUBLIC_MEEM_BUNDLE_ID
			}
		}
	)

	const joinClub = async () => {
		if (!wallet.web3Provider || !wallet.isConnected) {
			await wallet.connectWallet()
			return
		}

		if (wallet.loginState !== LoginState.LoggedIn) {
			router.push({
				pathname: '/authenticate',
				query: {
					return: `/${club?.slug}`
				}
			})
			return
		}

		setIsJoiningClub(true)
		try {
			if (club && club.rawClub && club.id) {
				if (
					typeof club?.membershipSettings?.costToJoin === 'number' &&
					club.membershipSettings.costToJoin > 0
				) {
					const getProofFetcher = makeFetcher<
						MeemAPI.v1.GetMintingProof.IQueryParams,
						MeemAPI.v1.GetMintingProof.IRequestBody,
						MeemAPI.v1.GetMintingProof.IResponseBody
					>({
						method: MeemAPI.v1.GetMintingProof.method
					})

					const { proof } = await getProofFetcher(
						MeemAPI.v1.GetMintingProof.path({
							meemContractId: club.id
						})
					)

					// Cost to join. Run the transaction in browser.
					const meemContract = new Contract(
						club?.address ?? '',
						bundleData?.Bundles[0].abi,
						wallet.signer
					)

					const uri = JSON.stringify({
						name: club?.name ?? '',
						description:
							club?.description && club?.description?.length > 0
								? club?.description
								: 'Club Token',
						image: club?.image,
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
					const tx = await meemContract?.mint(data, {
						gasLimit: '5000000',
						value: ethers.utils.parseEther(
							club?.membershipSettings
								? `${club.membershipSettings.costToJoin}`
								: '0'
						)
					})

					// @ts-ignore
					await tx.wait()
				} else if (club?.address && wallet.chainId) {
					// No cost to join. Call the API
					const joinClubFetcher = makeFetcher<
						MeemAPI.v1.MintOriginalMeem.IQueryParams,
						MeemAPI.v1.MintOriginalMeem.IRequestBody,
						MeemAPI.v1.MintOriginalMeem.IResponseBody
					>({
						method: MeemAPI.v1.MintOriginalMeem.method
					})

					const data = {
						meemContractAddress: club.address,
						to: wallet.accounts[0],
						metadata: {
							name: club?.name ?? '',
							description:
								club?.description &&
								club?.description?.length > 0
									? club?.description
									: 'Club Token',
							image: club?.image,
							meem_metadata_version: 'MeemClub_Token_20220718'
						},
						chainId:
							wallet.chainId ??
							hostnameToChainId(
								global.window ? global.window.location.host : ''
							)
					}
					log.debug(JSON.stringify(data))

					await joinClubFetcher(
						MeemAPI.v1.MintOriginalMeem.path(),
						undefined,
						data
					)
				} else {
					setIsJoiningClub(false)
					showNotification({
						radius: 'lg',
						title: 'Error joining this club.',
						message: `Please get in touch!`
					})
				}
			}
		} catch (e) {
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
					title: 'Error joining this club.',
					message: `Please get in touch!`
				})
			}
			setIsJoiningClub(false)
		}
	}

	const leaveClub = async () => {
		if (!wallet.web3Provider || !wallet.isConnected) {
			showNotification({
				radius: 'lg',
				title: 'Unable to leave this club.',
				message: `Did you connect your wallet?`
			})
			return
		}

		if (club?.isCurrentUserClubAdmin && club?.admins?.length === 1) {
			showNotification({
				radius: 'lg',
				title: 'Oops!',
				message: `You cannot leave this club because you are the only admin.`
			})
			return
		}

		if (wallet.loginState !== LoginState.LoggedIn) {
			router.push({
				pathname: '/authenticate',
				query: {
					return: `/${club?.slug}`
				}
			})
			return
		}

		setIsLeavingClub(true)
		try {
			const meemContract = new Contract(
				club?.address ?? '',
				bundleData?.Bundles[0].abi,
				wallet.signer
			)
			if (club && club.membershipToken) {
				const tx = await meemContract?.burn(club?.membershipToken)
				// @ts-ignore
				await tx.wait()
			}
		} catch (e) {
			setIsLeavingClub(false)
			showNotification({
				radius: 'lg',
				title: 'Error leaving this club.',
				message: `Did you cancel the transaction?`
			})
		}
	}

	useEffect(() => {
		async function join() {
			if (club.isCurrentUserClubMember) {
				log.debug('current user has joined the club!')
				setIsJoiningClub(false)

				showNotification({
					radius: 'lg',
					title: `Welcome to ${club.name}!`,
					color: colorGreen,
					autoClose: 5000,
					message: `You now have access to this club.`
				})
			}
		}

		async function leave() {
			if (!club.isCurrentUserClubMember) {
				log.debug('current user has left the club')

				setIsLeavingClub(false)

				cleanNotifications()
				showNotification({
					radius: 'lg',
					title: 'Successfully left the club.',
					color: colorGreen,
					autoClose: 5000,
					message: `You'll be missed!`
				})
			}
		}

		if (isJoiningClub && club) {
			join()
		} else if (isLeavingClub && club) {
			leave()
		}
	}, [club, isJoiningClub, isLeavingClub])

	// UI
	const [isQrModalOpened, setIsQrModalOpened] = useState(false)

	const navigateToAdmin = () => {
		router.push({ pathname: `/${club.slug}/admin` })
	}

	return (
		<>
			<div className={clubsTheme.widgetDark}>
				<Space h={8} />
				<Center>
					<Image
						className={clubsTheme.imagePixelated}
						height={150}
						width={150}
						src={club.image}
					/>
				</Center>
				<Space h={16} />
				<Center>
					<Text className={clubsTheme.tLargeBold}>{club.name}</Text>
				</Center>
				<Space h={16} />
				<Center>
					<Text className={clubsTheme.tSmall}>
						{club.description}
					</Text>
				</Center>
				<Space h={16} />
				<Center>
					{club.isCurrentUserClubMember && (
						<Button
							className={clubsTheme.buttonDarkGrey}
							disabled={isLeavingClub}
							loading={isLeavingClub}
							onClick={() => {
								leaveClub()
							}}
						>
							Leave Club
						</Button>
					)}
					{!club.isCurrentUserClubMember && (
						<Button
							className={clubsTheme.buttonWhite}
							disabled={isJoiningClub || !meetsReqs}
							loading={isJoiningClub}
							onClick={() => {
								joinClub()
							}}
						>
							{meetsReqs ? 'Join Club' : 'Requirements Not Met'}
						</Button>
					)}
				</Center>
				<Space h={32} />
				<Center>
					<div
						className={clubsTheme.row}
						style={{ flexWrap: 'wrap' }}
					>
						<Button
							style={{
								margin:
									club.allIntegrations &&
									club.allIntegrations?.length > 0
										? 3
										: 0
							}}
							className={clubsTheme.buttonWhite}
							onClick={() => {
								setIsQrModalOpened(true)
							}}
						>
							<QrCode />
						</Button>

						{club.allIntegrations?.map(integration => (
							<>
								<Button
									style={{
										margin: 3
									}}
									className={clubsTheme.buttonWhite}
									onClick={() => {
										if (
											integration.name === 'Phone Number'
										) {
											window.open(
												`tel:${integration.url}`
											)
										} else if (
											integration.name === 'Email Address'
										) {
											window.open(
												`mailto:${integration.url}`
											)
										} else {
											window.open(integration.url)
										}
									}}
								>
									<Image
										width={20}
										height={20}
										src={integration.icon}
									/>
								</Button>
							</>
						))}
					</div>
				</Center>
				<Space h={32} />
				<Center>
					<Text className={clubsTheme.tExtraSmallLabel}>
						Contract Address
					</Text>
				</Center>
				<Space h={8} />
				<Center>
					<div className={clubsTheme.row}>
						<Text>{quickTruncate(club.address ?? '')}</Text>
						<Space w={4} />
						<Image
							className={clubsTheme.copyIcon}
							src="/copy.png"
							height={20}
							onClick={() => {
								navigator.clipboard.writeText(
									`${window.location.origin}/${club.slug}`
								)
								showNotification({
									radius: 'lg',
									title: 'Club contract address copied!',
									autoClose: 2000,
									color: colorGreen,
									icon: <Check />,

									message: `This club's contract address was copied to your clipboard.`
								})
							}}
							width={20}
						/>
					</div>
				</Center>
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
			</div>

			<JoinLeaveClubModal
				isOpened={isJoiningClub || isLeavingClub}
				onModalClosed={() => {}}
			/>
			<Modal
				centered
				overlayBlur={8}
				radius={16}
				size={300}
				padding={'sm'}
				title={'Club QR Code'}
				opened={isQrModalOpened}
				onClose={() => setIsQrModalOpened(false)}
			>
				<Divider />
				<Space h={24} />
				<QRCode
					value={club ? `${window.location.origin}/${club.slug}` : ''}
				/>
			</Modal>
		</>
	)
}
