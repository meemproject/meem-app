import { useQuery } from '@apollo/client'
import log from '@kengoldfarb/log'
import {
	createStyles,
	Text,
	Image,
	Divider,
	Space,
	Button
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { makeFetcher, MeemAPI } from '@meemproject/api'
import { diamondABI, IFacetVersion, getCuts } from '@meemproject/meem-contracts'
import { useWallet } from '@meemproject/react'
import { ethers } from 'ethers'
import { isEqual } from 'lodash'
// eslint-disable-next-line import/no-extraneous-dependencies
import React, { useEffect, useState } from 'react'
import { Check } from 'tabler-icons-react'
import { GetBundleByIdQuery } from '../../../../generated/graphql'
import { GET_BUNDLE_BY_ID } from '../../../graphql/clubs'
import { Club } from '../../../model/club/club'

const useStyles = createStyles(theme => ({
	header: {
		marginBottom: 32,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
		paddingTop: 32,
		backgroundColor: '#FAFAFA',
		borderBottomColor: 'rgba(0, 0, 0, 0.08)',
		borderBottomWidth: '1px',
		borderBottomStyle: 'solid',
		paddingBottom: 32,
		paddingLeft: 32,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			marginBottom: 32,
			paddingBottom: 16,
			paddingLeft: 8,
			paddingTop: 16
		}
	},
	headerArrow: {
		marginRight: 24,
		cursor: 'pointer',
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			display: 'none'
		}
	},
	headerTitle: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row'
	},
	headerClubNameContainer: {
		marginLeft: 32,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			marginLeft: 16
		}
	},
	headerClubName: {
		fontWeight: 600,
		fontSize: 24,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 16
		}
	},
	clubUrlContainer: {
		marginTop: 8,
		display: 'flex',
		flexDirection: 'row'
	},
	clubUrl: {
		fontSize: 14,
		opacity: 0.6,
		fontWeight: 500
	},

	clubLogoImage: {
		imageRendering: 'pixelated',
		width: 80,
		height: 80,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			width: 40,
			height: 40,
			minHeight: 40,
			minWidth: 40,
			marginLeft: 16
		}
	},
	clubSettingsIcon: {
		width: 16,
		height: 16,
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			width: 24,
			height: 24
		}
	},
	buttonEditProfile: {
		borderRadius: 24,
		marginRight: 24,
		color: 'black',
		borderColor: 'black',
		backgroundColor: 'white',
		'&:hover': {
			backgroundColor: theme.colors.gray[0]
		},
		[`@media (max-width: ${theme.breakpoints.md}px)`]: {
			fontSize: 0,
			marginLeft: 16,
			marginRight: 0,
			borderColor: 'transparent'
		}
	},
	buttonCreate: {
		backgroundColor: 'black',
		'&:hover': {
			backgroundColor: theme.colors.gray[8]
		},
		borderRadius: 24
	},
	tabs: {
		display: 'flex',
		flexDirection: 'row'
	},
	visibleTab: {
		display: 'block'
	},
	invisibleTab: {
		display: 'none'
	},
	clubIntegrationsSectionTitle: {
		fontSize: 20,
		marginBottom: 16,
		fontWeight: 600
	},
	clubContractAddress: {
		wordBreak: 'break-word'
	},
	contractAddressContainer: {
		display: 'flex',
		flexDirection: 'row'
	},
	copy: {
		marginLeft: 4,
		padding: 2,
		cursor: 'pointer'
	}
}))
interface IProps {
	club: Club
}

export const CAContractAddress: React.FC<IProps> = ({ club }) => {
	const { classes } = useStyles()
	const wallet = useWallet()

	const [isCreatingSafe, setIsCreatingSafe] = useState(false)
	const [shouldShowUpgrade, setShouldShowUpgrade] = useState(false)
	const [isUpgradingClub, setIsUpgradingClub] = useState(false)

	const { data: bundleData } = useQuery<GetBundleByIdQuery>(
		GET_BUNDLE_BY_ID,
		{
			variables: {
				id: process.env.NEXT_PUBLIC_MEEM_BUNDLE_ID
			}
		}
	)

	useEffect(() => {
		const fetchFacets = async () => {
			// TODO: Move this to meem-contracts package?
			if (club?.address && bundleData) {
				try {
					const diamond = new ethers.Contract(
						club.address,
						diamondABI,
						wallet.signer
					)

					const diamondFacets = await diamond.facets()
					const fromVersion: IFacetVersion[] = diamondFacets.map(
						(f: any) => ({
							address: f.target,
							functionSelectors: f.selectors
						})
					)

					const toVersion: IFacetVersion[] = []

					for (
						let i = 0;
						i < bundleData.Bundles[0].BundleContracts.length;
						i++
					) {
						const bc = bundleData.Bundles[0].BundleContracts[i]
						if (
							bc.Contract &&
							bc.Contract?.ContractInstances &&
							bc.Contract?.ContractInstances.length > 0
						) {
							let didFindFacet = false
							for (
								let j = 0;
								j < bc.Contract.ContractInstances.length;
								j += 1
							) {
								const ci = bc.Contract.ContractInstances[j]

								const clubFacet = fromVersion.find(f => {
									if (bc.Contract) {
										const clubFacetFunctionSelectors = [
											...f.functionSelectors
										].sort()
										const bcFunctionSelectors = [
											...bc.functionSelectors
										].sort()

										if (
											f.address.toLowerCase() ===
												ci.address.toLowerCase() &&
											isEqual(
												clubFacetFunctionSelectors,
												bcFunctionSelectors
											)
										) {
											return true
										}
									}
									return false
								})

								if (clubFacet) {
									toVersion.push(clubFacet)
									didFindFacet = true
									break
								}
							}

							if (!didFindFacet) {
								toVersion.push({
									address:
										bc.Contract.ContractInstances[0]
											.address,
									functionSelectors: bc.functionSelectors
								})
							}
						}
					}

					const cuts = getCuts({
						proxyContractAddress: club.address,
						fromVersion,
						toVersion
					})

					if (cuts.length > 0) {
						setShouldShowUpgrade(true)
					}

					if (shouldShowUpgrade && cuts.length === 0) {
						showNotification({
							title: 'Club Upgraded!',
							color: 'green',
							icon: <Check />,
							message: `The club has been upgraded to the latest version.`
						})
						setShouldShowUpgrade(false)
						setIsUpgradingClub(false)
					}
				} catch (e) {
					log.crit(e)
				}
			}
		}
		fetchFacets()
	}, [club, wallet, bundleData, shouldShowUpgrade])

	return (
		<div>
			<Space h={12} />
			<Text className={classes.clubIntegrationsSectionTitle}>
				Club Contract Address
			</Text>
			<div className={classes.contractAddressContainer}>
				<Text className={classes.clubContractAddress}>
					{club.address}
				</Text>
				<Image
					className={classes.copy}
					src="/copy.png"
					height={20}
					onClick={() => {
						navigator.clipboard.writeText(club.address ?? '')
						showNotification({
							radius: 'lg',
							title: 'Address copied',
							autoClose: 2000,
							color: 'green',
							icon: <Check />,

							message: `This club's contract address was copied to your clipboard.`
						})
					}}
					width={20}
				/>
			</div>

			<Space h={8} />

			<Text>{`You can use this address to token-gate third-party apps and tools, such as creating an exclusive Discord community with Collab.Land. Every club member holds this club's token.`}</Text>

			{shouldShowUpgrade && (
				<>
					<Space h={'xl'} />
					<Divider />
					<Space h={'xl'} />
					<Text className={classes.clubIntegrationsSectionTitle}>
						Upgrade Club Contract
					</Text>
					<div className={classes.contractAddressContainer}>
						<div>
							<Text>
								A new version of Clubs is available! Upgrade to
								take advantage of all the new features.
							</Text>
						</div>
					</div>
					<Space h={'xs'} />
					<Button
						loading={isUpgradingClub}
						disabled={isUpgradingClub}
						className={classes.buttonCreate}
						onClick={async () => {
							try {
								if (!club?.id) {
									return
								}
								setIsUpgradingClub(true)
								const upgradeClubFetcher = makeFetcher<
									MeemAPI.v1.UpgradeClub.IQueryParams,
									MeemAPI.v1.UpgradeClub.IRequestBody,
									MeemAPI.v1.UpgradeClub.IResponseBody
								>({
									method: MeemAPI.v1.UpgradeClub.method
								})

								await upgradeClubFetcher(
									MeemAPI.v1.UpgradeClub.path({
										meemContractId: club.id
									})
								)
							} catch (e) {
								log.crit(e)
								showNotification({
									title: 'Error Upgrading Club',
									color: 'red',
									message: `Something went wrong during the upgrade.`
								})
								setIsUpgradingClub(false)
							}
						}}
					>
						Upgrade Contract
					</Button>
				</>
			)}

			<Space h={'xl'} />
			<Divider />
			<Space h={'xl'} />
			<Text className={classes.clubIntegrationsSectionTitle}>
				Club Treasury Address
			</Text>
			{club.gnosisSafeAddress && (
				<>
					<div className={classes.contractAddressContainer}>
						<Text className={classes.clubContractAddress}>
							{club.gnosisSafeAddress}
						</Text>
						<Image
							className={classes.copy}
							src="/copy.png"
							height={20}
							onClick={() => {
								navigator.clipboard.writeText(
									club.gnosisSafeAddress ?? ''
								)
								showNotification({
									radius: 'lg',
									title: 'Address copied',
									autoClose: 2000,
									color: 'green',
									icon: <Check />,

									message: `This club's treasury address was copied to your clipboard.`
								})
							}}
							width={20}
						/>
					</div>
					<Space h={8} />

					<Text>{`Your club's treasury was set up when the club was created. You can manage your treasury (including signing transactions and adding members) using the button below.`}</Text>
					<Space h={'xs'} />

					<Button
						className={classes.buttonCreate}
						onClick={() => {
							window.open(
								`https://gnosis-safe.io/app/${
									process.env.NEXT_PUBLIC_CHAIN_ID === '4'
										? 'rin'
										: 'matic'
								}:${club.gnosisSafeAddress}/home`
							)
						}}
					>
						View Treasury
					</Button>
				</>
			)}

			{!club.gnosisSafeAddress && wallet.chainId !== 420 && (
				<Button
					className={classes.buttonCreate}
					disabled={isCreatingSafe}
					loading={isCreatingSafe}
					onClick={async () => {
						if (
							!club.id ||
							!club.adminAddresses ||
							!wallet.chainId
						) {
							return
						}
						try {
							setIsCreatingSafe(true)
							const createSafeFetcher = makeFetcher<
								MeemAPI.v1.CreateClubSafe.IQueryParams,
								MeemAPI.v1.CreateClubSafe.IRequestBody,
								MeemAPI.v1.CreateClubSafe.IResponseBody
							>({
								method: MeemAPI.v1.CreateClubSafe.method
							})

							await createSafeFetcher(
								MeemAPI.v1.CreateClubSafe.path({
									meemContractId: club.id
								}),
								undefined,
								{
									safeOwners: club.adminAddresses ?? [],
									chainId: wallet.chainId
								}
							)
							await new Promise(f => setTimeout(f, 10000))

							// refetchClub()

							setIsCreatingSafe(false)
						} catch (e) {
							log.crit(e)
							setIsCreatingSafe(false)
							showNotification({
								radius: 'lg',
								title: 'Wallet creation failed.',
								message:
									'We were unable to create treasury for your club. Please refresh the page and try again.',
								color: 'red'
							})
						}
					}}
				>
					Create Treasury
				</Button>
			)}

			<Space h={'xl'} />
		</div>
	)
}
