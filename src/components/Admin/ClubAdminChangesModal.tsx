/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import log from '@kengoldfarb/log'
import {
	createStyles,
	Text,
	Image,
	Space,
	Modal,
	Divider,
	Stepper,
	MantineProvider
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { MeemAPI } from '@meemproject/api'
import { Chain, Permission } from '@meemproject/meem-contracts'
import * as meemContracts from '@meemproject/meem-contracts'
import { useWallet } from '@meemproject/react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { BigNumber, ethers } from 'ethers'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Club, MembershipReqType } from '../../model/club/club'

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
		borderRadius: 16,
		marginBottom: 24
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
	club?: Club
	isOpened: boolean
	onModalClosed: () => void
}

enum Step {
	Start,
	Initializing,
	Initialized
}

export const ClubAdminChangesModal: React.FC<IProps> = ({
	isOpened,
	onModalClosed,
	club
}) => {
	const router = useRouter()

	const { web3Provider, accounts, signer, meemContract } = useWallet()

	const { classes } = useStyles()

	const [step, setStep] = useState<Step>(Step.Start)

	const reinitialize = async () => {
		if (!web3Provider || !club) {
			return
		}

		setStep(Step.Initializing)

		try {
			const clubSymbol = club.name!.split(' ')[0].toUpperCase()

			const applicationLinks: string[] = []
			if (club.membershipSettings) {
				club.membershipSettings.requirements.forEach(requirement => {
					if (
						requirement.applicationLink &&
						requirement.applicationLink?.length > 0
					) {
						applicationLinks.push(requirement.applicationLink)
					}
				})
			}

			const uri = JSON.stringify({
				name: club.name!,
				description: club.description,
				image: club.image,
				external_link: `https://clubs.link/${club.slug}`,
				application_links: applicationLinks
			})

			let membershipStartUnix = -1
			let membershipEndUnix = -1
			if (club.membershipSettings) {
				if (club.membershipSettings.membershipStartDate) {
					membershipStartUnix = Math.floor(
						new Date(club.membershipSettings.membershipStartDate).getTime() /
							1000
					)
					log.debug(membershipStartUnix)
				}
				if (club.membershipSettings.membershipEndDate) {
					membershipEndUnix = Math.floor(
						new Date(club.membershipSettings.membershipEndDate).getTime() / 1000
					)
					log.debug(membershipEndUnix)
				}
			}

			const joinCostInWei = club.membershipSettings
				? ethers.utils.parseEther(`${club.membershipSettings.costToJoin}`)
				: 0

			const mintPermissions: any[] = []
			if (club.membershipSettings) {
				club.membershipSettings.requirements.forEach(requirement => {
					switch (requirement.type) {
						case MembershipReqType.None:
							// Anyone can join for X MATIC
							mintPermissions.push({
								permission: Permission.Anyone,
								addresses: [],
								numTokens: 0,
								costWei: joinCostInWei,
								lockedBy: MeemAPI.zeroAddress
							})
							break
						case MembershipReqType.ApprovedApplicants:
							// Approved applicants join for X MATIC
							mintPermissions.push({
								permission: Permission.Addresses,
								addresses: requirement.approvedAddresses,
								numTokens: 0,
								costWei: joinCostInWei,
								lockedBy: MeemAPI.zeroAddress
							})
							break
						case MembershipReqType.TokenHolders:
							//Token holders with X tokens can join for X MATIC
							mintPermissions.push({
								permission: Permission.Holders,
								addresses: [requirement.tokenContractAddress],
								numTokens: requirement.tokenMinQuantity,
								costWei: joinCostInWei,
								lockedBy: MeemAPI.zeroAddress
							})
							break
						case MembershipReqType.OtherClubMember:
							// Members of X club can join for X MATIC
							mintPermissions.push({
								permission: Permission.Holders,
								addresses: [requirement.clubContractAddress],
								numTokens: requirement.tokenMinQuantity,
								costWei: joinCostInWei,
								lockedBy: MeemAPI.zeroAddress
							})
							break
					}
				})

				// Now push a special 'admin mint' permission which bypasses the other requirements
				log.debug('adding admin permission')
				mintPermissions.push({
					permission: Permission.Addresses,
					addresses: [accounts[0]],
					numTokens: 0,
					costWei: 0,
					lockedBy: MeemAPI.zeroAddress
				})
			}

			const baseProperties = {
				// Total # of tokens available. -1 means unlimited.
				totalOriginalsSupply: club.membershipSettings
					? club.membershipSettings.membershipQuantity === 0 ||
					  isNaN(club.membershipSettings.membershipQuantity)
						? -1
						: club.membershipSettings.membershipQuantity
					: -1,
				totalOriginalsSupplyLockedBy: MeemAPI.zeroAddress,
				// Specify who can mint originals
				mintPermissions,
				mintPermissionsLockedBy: MeemAPI.zeroAddress,
				// Payout of minting
				splits:
					club.membershipSettings &&
					club.membershipSettings.membershipFundsAddress.length > 0
						? [
								{
									toAddress: club.membershipSettings
										? club.membershipSettings.membershipFundsAddress
										: accounts[0],
									// Amount in basis points 10000 == 100%
									amount: 10000,
									lockedBy: MeemAPI.zeroAddress
								}
						  ]
						: [],
				splitsLockedBy: MeemAPI.zeroAddress,
				// Number of originals allowed to be held by the same wallet
				originalsPerWallet: -1,
				originalsPerWalletLockedBy: MeemAPI.zeroAddress,
				// Whether originals are transferrable
				isTransferrable: true,
				isTransferrableLockedBy: MeemAPI.zeroAddress,
				// Mint start unix timestamp
				mintStartTimestamp: membershipStartUnix,
				// Mint end unix timestamp
				mintEndTimestamp: membershipEndUnix,
				mintDatesLockedBy: MeemAPI.zeroAddress,
				// Prevent transfers until this unix timestamp
				transferLockupUntil: 0,
				transferLockupUntilLockedBy: MeemAPI.zeroAddress
			}

			log.debug(`baseProperties: ${JSON.stringify(baseProperties)}`)
			log.debug(`club symbol: ${clubSymbol}`)
			log.debug(`club admins: ${club.membershipSettings?.clubAdmins}`)

			const contract = await meemContracts.getMeemContract({
				contractAddress: club.address!,
				signer: web3Provider.getSigner()
			})
			log.debug('contract found')

			const data = {
				name: club.name ?? '',
				symbol: clubSymbol,
				admins: club.membershipSettings
					? club.membershipSettings.clubAdmins
						? club.membershipSettings.clubAdmins
						: []
					: [],
				contractURI: uri,
				baseProperties,
				defaultProperties: meemContracts.defaultMeemProperties,
				defaultChildProperties: meemContracts.defaultMeemProperties,
				tokenCounterStart: BigNumber.from(1),
				childDepth: BigNumber.from(-1),
				nonOwnerSplitAllocationAmount: BigNumber.from(0)
			}
			log.debug(data)
			const tx = await contract.reInitialize(data, { gasLimit: '5000000' })

			log.debug(tx)
			// @ts-ignore
			await tx.wait()
			setStep(Step.Start)
			onModalClosed()
		} catch (e) {
			setStep(Step.Start)
			log.debug(e)
			showNotification({
				title: 'Error saving club settings',
				message: `Please get in touch!`
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
				title={<Text className={classes.modalTitle}>Confirm changes</Text>}
				onClose={() => onModalClosed()}
			>
				<Divider />
				<Space h={12} />
				<div className={classes.header}>
					<div className={classes.headerTitle}>
						<Image className={classes.clubLogoImage} src={club?.image} />
						<Text className={classes.headerClubName}>{club?.name}</Text>
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
							active={step === Step.Start || step === Step.Initialized ? 0 : 1}
						>
							<Stepper.Step
								label={
									step === Step.Initializing
										? 'Please wait...'
										: 'Tap below to confirm'
								}
								loading={step === Step.Initializing}
								description={
									<>
										{step === Step.Start && (
											<div>
												<Space h={12} />
												<a
													onClick={reinitialize}
													className={classes.buttonConfirm}
												>
													Confirm changes
												</a>
											</div>
										)}

										{step === Step.Initialized && (
											<div>
												<Space h={12} />
												<Text>Done!</Text>
											</div>
										)}
									</>
								}
							/>
						</Stepper>
					</MantineProvider>
				</div>
			</Modal>
		</>
	)
}
