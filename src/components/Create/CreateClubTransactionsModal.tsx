/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import log from '@kengoldfarb/log'
import {
	createStyles,
	Container,
	Text,
	Image,
	Button,
	Space,
	Grid,
	Modal,
	Divider,
	Stepper,
	Loader,
	MantineProvider
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { MeemAPI } from '@meemproject/api'
import { Chain } from '@meemproject/meem-contracts'
import * as meemContracts from '@meemproject/meem-contracts'
import meemABI from '@meemproject/meem-contracts/types/Meem.json'
import { useWallet } from '@meemproject/react'
import { Contract } from 'ethers'
// eslint-disable-next-line import/no-extraneous-dependencies
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import {
	BrandDiscord,
	BrandTwitter,
	Check,
	CircleCheck,
	Settings
} from 'tabler-icons-react'
import { CookieKeys } from '../../utils/cookies'

const useStyles = createStyles(theme => ({
	header: {
		display: 'flex',
		alignItems: 'start',
		flexDirection: 'row',
		paddingTop: 8,
		paddingBottom: 8,
		position: 'relative'
	},
	modalTitle: {
		fontWeight: 600,
		fontSize: 18
	},
	headerTitle: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row'
	},
	headerClubName: {
		fontSize: 16,
		marginLeft: 16
	},
	clubLogoImage: {
		imageRendering: 'pixelated',
		width: 40,
		height: 40,
		minHeight: 40,
		minWidth: 40
	},
	stepsContainer: {
		border: '1px solid rgba(204, 204, 204, 1)',
		borderRadius: 16,
		padding: 16
	},
	buttonConfirm: {
		paddingTop: 8,
		paddingLeft: 16,
		paddingBottom: 8,
		paddingRight: 16,
		color: 'white',
		backgroundColor: 'black',
		cursor: 'pointer',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 24
	},
	stepDescription: {
		fontSize: 14
	}
}))

interface IProps {
	isOpened: boolean
	onModalClosed: () => void
}

enum Step {
	Start,
	Creating,
	Created,
	Initializing,
	Initialized,
	Minting,
	Minted
}

export const CreateClubTransactionsModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed
}) => {
	const router = useRouter()

	const { web3Provider, accounts, signer } = useWallet()

	const { classes } = useStyles()

	const [step, setStep] = useState<Step>(Step.Start)
	const [proxyAddress, setProxyAddress] = useState('')

	const create = async () => {
		if (!web3Provider) {
			return
		}

		setStep(Step.Creating)
		try {
			const contract = await meemContracts.deployProxy({
				signer: web3Provider.getSigner()
			})

			log.debug(
				`Deployed proxy at ${contract.address} w/ tx: ${contract.deployTransaction.hash}`
			)
			setProxyAddress(contract.address)
			setStep(Step.Created)
		} catch (e) {
			setStep(Step.Start)
			showNotification({
				title: 'Error creating club.',
				message: `${e as string}`
			})
		}
	}

	const initialize = async () => {
		if (!web3Provider) {
			return
		}

		setStep(Step.Initializing)

		try {
			const clubSymbol = (Cookies.get(CookieKeys.clubName) ?? '')
				.split(' ')[0]
				.toUpperCase()

			const uri = `{"name": ${Cookies.get(
				CookieKeys.clubName
			)},"description": ${CookieKeys.clubDescription},"image": ${Cookies.get(
				CookieKeys.clubImage
			)},"external_link": ${Cookies.get(CookieKeys.clubExternalUrl)}}`

			const tx = await meemContracts.initProxy({
				signer: web3Provider.getSigner(),
				proxyContractAddress: proxyAddress,
				name: Cookies.get(CookieKeys.clubName) ?? '',
				symbol: clubSymbol,
				contractURI: uri,
				chain: Chain.Rinkeby,
				version: 'latest'
			})

			log.debug(tx)

			setStep(Step.Initialized)
		} catch (e) {
			setStep(Step.Created)
			showNotification({
				title: 'Error initalizing club.',
				message: `${e as string}`
			})
		}
	}

	const mint = async () => {
		if (!web3Provider) {
			return
		}
		setStep(Step.Minting)
		try {
			const meemContract = new Contract(
				proxyAddress,
				meemABI,
				signer
			) as unknown as meemContracts.Meem

			const tx = await meemContract?.mint(
				{
					to: accounts[0],
					tokenURI: 'ipfs://example',
					parentChain: MeemAPI.Chain.Polygon,
					parent: MeemAPI.zeroAddress,
					parentTokenId: 0,
					meemType: MeemAPI.MeemType.Original,
					data: '',
					isURILocked: false,
					reactionTypes: ['upvote', 'downvote', 'heart'],
					uriSource: MeemAPI.UriSource.TokenUri,
					mintedBy: accounts[0]
				},
				meemContracts.defaultMeemProperties,
				meemContracts.defaultMeemProperties,
				{ gasLimit: '1000000' }
			)

			log.debug(tx)

			// Remove all metadata cookies!
			Cookies.remove(CookieKeys.clubName)
			Cookies.remove(CookieKeys.clubDescription)
			Cookies.remove(CookieKeys.clubImage)
			Cookies.remove(CookieKeys.clubExternalUrl)

			// TODO: Get club slug

			// Route to the created club detail page
			showNotification({
				title: 'Success!',
				autoClose: 5000,
				color: 'green',
				icon: <Check color="green" />,

				message: `Your club has been published.`
			})
			router.push({ pathname: '/club' })

			setStep(Step.Minted)
		} catch (e) {
			setStep(Step.Initialized)
			showNotification({
				title: 'Error minting club membership.',
				message: `${e as string}`
			})
		}
	}

	return (
		<>
			<Modal
				centered
				closeOnClickOutside={false}
				closeOnEscape={false}
				radius={16}
				size={'lg'}
				padding={'sm'}
				opened={isOpened}
				title={
					<Text className={classes.modalTitle}>Finalize club creation</Text>
				}
				onClose={() => onModalClosed()}
			>
				<Divider />
				<Space h={12} />
				<div className={classes.header}>
					<div className={classes.headerTitle}>
						<Image
							className={classes.clubLogoImage}
							src={Cookies.get(CookieKeys.clubImage)}
						/>
						<Text className={classes.headerClubName}>
							{Cookies.get(CookieKeys.clubName)}
						</Text>
					</div>
				</div>
				<Space h={12} />

				<div className={classes.stepsContainer}>
					<MantineProvider
						theme={{
							colors: {
								brand: [
									'#1DAD4E',
									'#1DAD4E',
									'#1DAD4E',
									'#1DAD4E',
									'#1DAD4E',
									'#1DAD4E',
									'#1DAD4E',
									'#1DAD4E',
									'#1DAD4E',
									'#1DAD4E'
								]
							},
							primaryColor: 'brand'
						}}
					>
						<Stepper
							size="md"
							color="green"
							orientation="vertical"
							active={
								step === Step.Start || step === Step.Creating
									? 0
									: step === Step.Created || step === Step.Initializing
									? 1
									: step === Step.Initialized || step === Step.Minting
									? 2
									: 3
							}
						>
							<Stepper.Step
								label="Establish Club"
								loading={step === Step.Creating}
								description={
									step !== Step.Start && step !== Step.Creating ? null : (
										<>
											{step === Step.Start && (
												<div>
													<Space h={12} />
													<a onClick={create} className={classes.buttonConfirm}>
														Confirm
													</a>
												</div>
											)}
										</>
									)
								}
							/>
							<Stepper.Step
								label="Authorize membership settings"
								loading={step === Step.Initializing}
								description={
									step !== Step.Created && step !== Step.Initializing ? (
										<Text className={classes.stepDescription}>
											Multiple transactions may occur if several updates were
											made.
										</Text>
									) : (
										<>
											{step === Step.Created && (
												<div>
													<Space h={12} />

													<a
														onClick={initialize}
														className={classes.buttonConfirm}
													>
														Confirm
													</a>
												</div>
											)}
										</>
									)
								}
							/>
							<Stepper.Step
								label="Confirm club creation"
								loading={step === Step.Minting}
								description={
									step !== Step.Initialized && step !== Step.Minting ? (
										<Text className={classes.stepDescription}>
											Your club will be published at the URL you selected once
											this step is complete.
										</Text>
									) : (
										<>
											{step === Step.Initialized && (
												<div>
													<Space h={12} />

													<a onClick={mint} className={classes.buttonConfirm}>
														Confirm
													</a>
												</div>
											)}
										</>
									)
								}
							/>
						</Stepper>
					</MantineProvider>
					{(step === Step.Initialized || step === Step.Minted) && (
						<Space h={'xs'} />
					)}
				</div>
			</Modal>
		</>
	)
}
