import { useSubscription } from '@apollo/client'
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
import { makeFetcher, useWallet } from '@meemproject/react'
import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import { Check } from 'tabler-icons-react'
// eslint-disable-next-line import/namespace
import {
	GetClubSubscriptionSubscription // eslint-disable-next-line import/namespace
} from '../../../generated/graphql'
import { SUB_CLUB } from '../../graphql/clubs'
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
	const wallet = useWallet()

	const { classes } = useStyles()

	const [step, setStep] = useState<Step>(Step.Start)

	const [currentClubDataString, setCurrentClubDataString] = useState('')

	const {
		loading,
		error,
		data: clubData
	} = useSubscription<GetClubSubscriptionSubscription>(SUB_CLUB, {
		variables: { slug: club?.slug ?? '' }
	})

	useEffect(() => {
		function compareClubData() {
			if (clubData) {
				const newClubDataString = JSON.stringify(clubData)

				if (currentClubDataString === newClubDataString) {
					log.debug('nothing has changed on the club yet.')
				} else {
					log.debug('changes detected on the club.')
					setStep(Step.Start)
					setCurrentClubDataString('')
					onModalClosed()

					showNotification({
						title: 'Success!',
						autoClose: 5000,
						color: 'green',
						icon: <Check color="green" />,

						message: `${clubData.MeemContracts[0].name} has been updated.`
					})
				}
			}
		}

		if (clubData && !loading && !error && isOpened) {
			if (currentClubDataString.length === 0) {
				if (clubData.MeemContracts.length > 0) {
					// Set initial club data
					log.debug('setting initial club data...')
					setCurrentClubDataString(JSON.stringify(clubData))
				}
			} else {
				// compare to initial club fata
				log.debug('compare club data...')
				compareClubData()
			}
		}
	}, [
		club,
		clubData,
		currentClubDataString,
		error,
		isOpened,
		loading,
		onModalClosed,
		wallet
	])

	const reinitialize = async () => {
		if (!wallet.web3Provider || !club) {
			return
		}

		setStep(Step.Initializing)

		try {
			// const clubSymbol = (club.name ?? '').split(' ')[0].toUpperCase()

			const applicationInstructions: string[] = []
			if (club.membershipSettings) {
				club.membershipSettings.requirements.forEach(requirement => {
					if (
						requirement.applicationInstructions &&
						requirement.applicationInstructions?.length > 0
					) {
						applicationInstructions.push(
							requirement.applicationInstructions
						)
					}
				})
			}

			let membershipStartUnix = -1
			let membershipEndUnix = -1
			if (club.membershipSettings) {
				if (club.membershipSettings.membershipStartDate) {
					membershipStartUnix = Math.floor(
						new Date(
							club.membershipSettings.membershipStartDate
						).getTime() / 1000
					)
					log.debug(membershipStartUnix)
				}
				if (club.membershipSettings.membershipEndDate) {
					membershipEndUnix = Math.floor(
						new Date(
							club.membershipSettings.membershipEndDate
						).getTime() / 1000
					)
					log.debug(membershipEndUnix)
				}
			}

			const joinCostInWei = club.membershipSettings
				? ethers.utils.parseEther(
						`${club.membershipSettings.costToJoin}`
				  )
				: 0

			const mintPermissions: any[] = []
			if (club.membershipSettings) {
				club.membershipSettings.requirements.forEach(requirement => {
					switch (requirement.type) {
						case MembershipReqType.None:
							// Anyone can join for X MATIC
							mintPermissions.push({
								permission: MeemAPI.Permission.Anyone,
								addresses: [],
								numTokens: 0,
								costWei: joinCostInWei,
								mintStartTimestamp: club.membershipSettings
									?.membershipStartDate
									? club.membershipSettings?.membershipStartDate.getTime() /
									  1000
									: 0,
								mintEndTimestamp: club.membershipSettings
									?.membershipEndDate
									? club.membershipSettings?.membershipEndDate.getTime() /
									  1000
									: 0
							})
							break
						case MembershipReqType.ApprovedApplicants:
							// Approved applicants join for X MATIC
							mintPermissions.push({
								permission: MeemAPI.Permission.Addresses,
								addresses: requirement.approvedAddresses,
								numTokens: 0,
								costWei: joinCostInWei,
								mintStartTimestamp: club.membershipSettings
									?.membershipStartDate
									? club.membershipSettings?.membershipStartDate.getTime() /
									  1000
									: 0,
								mintEndTimestamp: club.membershipSettings
									?.membershipEndDate
									? club.membershipSettings?.membershipEndDate.getTime() /
									  1000
									: 0
							})
							break
						case MembershipReqType.TokenHolders:
							//Token holders with X tokens can join for X MATIC
							mintPermissions.push({
								permission: MeemAPI.Permission.Holders,
								addresses: [requirement.tokenContractAddress],
								numTokens: requirement.tokenMinQuantity,
								costWei: joinCostInWei,
								mintStartTimestamp: club.membershipSettings
									?.membershipStartDate
									? club.membershipSettings?.membershipStartDate.getTime() /
									  1000
									: 0,
								mintEndTimestamp: club.membershipSettings
									?.membershipEndDate
									? club.membershipSettings?.membershipEndDate.getTime() /
									  1000
									: 0
							})
							break
						case MembershipReqType.OtherClubMember:
							// Members of X club can join for X MATIC
							mintPermissions.push({
								permission: MeemAPI.Permission.Holders,
								addresses: [requirement.clubContractAddress],
								numTokens: requirement.tokenMinQuantity,
								costWei: joinCostInWei,
								mintStartTimestamp: club.membershipSettings
									?.membershipStartDate
									? club.membershipSettings?.membershipStartDate.getTime() /
									  1000
									: 0,
								mintEndTimestamp: club.membershipSettings
									?.membershipEndDate
									? club.membershipSettings?.membershipEndDate.getTime() /
									  1000
									: 0
							})
							break
					}
				})

				// Now push special 'admin mint' permissions which bypass the other requirements
				log.debug('adding admin permissions...')
				club.admins?.forEach(admin => {
					mintPermissions.push({
						permission: MeemAPI.Permission.Addresses,
						addresses: [admin],
						numTokens: 0,
						costWei: 0,
						mintStartTimestamp: club.membershipSettings
							?.membershipStartDate
							? club.membershipSettings?.membershipStartDate.getTime() /
							  1000
							: 0,
						mintEndTimestamp: club.membershipSettings
							?.membershipEndDate
							? club.membershipSettings?.membershipEndDate.getTime() /
							  1000
							: 0
					})
				})
			}

			const reInitializeContractFetcher = makeFetcher<
				MeemAPI.v1.ReInitializeMeemContract.IQueryParams,
				MeemAPI.v1.ReInitializeMeemContract.IRequestBody,
				MeemAPI.v1.ReInitializeMeemContract.IResponseBody
			>({
				method: MeemAPI.v1.ReInitializeMeemContract.method
			})

			if (!club.id) {
				showNotification({
					title: 'Error saving club settings',
					message: `Please get in touch!`,
					color: 'red'
				})
				return
			}

			const data = {
				shouldMintAdminTokens: true,
				metadata: {
					meem_contract_type: 'meem-club',
					meem_metadata_version: 'MeemClub_Contract_20220718',
					name: club.name,
					description: club.description,
					image: club.image,
					associations: [],
					external_url: `https://clubs.link/${club.slug}`,
					application_instructions: applicationInstructions
				},
				name: club.name ?? '',
				admins: club.admins,
				minters: club.admins,
				maxSupply: !isNaN(
					club.membershipSettings?.membershipQuantity ?? 0
				)
					? `${club.membershipSettings?.membershipQuantity}`
					: '0',
				mintPermissions,
				splits:
					club.membershipSettings &&
					club.membershipSettings.membershipFundsAddress.length > 0
						? [
								{
									toAddress: club.membershipSettings
										? club.membershipSettings
												.membershipFundsAddress
										: wallet.accounts[0],
									// Amount in basis points 10000 == 100%
									amount: 10000,
									lockedBy: MeemAPI.zeroAddress
								}
						  ]
						: [],
				adminTokenMetadata: {
					meem_metadata_version: 'MeemClub_Token_20220718',
					description: `Membership token for ${club.name}`,
					name: `${club.name} membership token`,
					image: club.image,
					associations: [],
					external_url: `https://clubs.link/${club.slug}`,
					application_instructions: applicationInstructions
				}
			}

			// log.debug(JSON.stringify(data))
			log.debug(data)

			await reInitializeContractFetcher(
				MeemAPI.v1.ReInitializeMeemContract.path({
					meemContractId: club.id
				}),
				undefined,
				data
			)

			// Now we wait for an update on the db.
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
				title={
					<Text className={classes.modalTitle}>Confirm changes</Text>
				}
				onClose={() => {
					onModalClosed()
					setCurrentClubDataString('')
				}}
			>
				<Divider />
				<Space h={12} />
				<div className={classes.header}>
					<div className={classes.headerTitle}>
						<Image
							className={classes.clubLogoImage}
							src={club?.image}
						/>
						<Text className={classes.headerClubName}>
							{club?.name}
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
								step === Step.Start || step === Step.Initialized
									? 0
									: 1
							}
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
													className={
														classes.buttonConfirm
													}
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
