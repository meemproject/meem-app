import { useQuery } from '@apollo/client'
import log from '@kengoldfarb/log'
import { Text, Image, Divider, Space, Button, Radio } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { diamondABI, IFacetVersion, getCuts } from '@meemproject/meem-contracts'
import { useSDK, useWallet } from '@meemproject/react'
import { Contract, ethers } from 'ethers'
import { isEqual } from 'lodash'
// eslint-disable-next-line import/no-extraneous-dependencies
import React, { useEffect, useState } from 'react'
import { Check } from 'tabler-icons-react'
import { GetBundleByIdQuery } from '../../../../generated/graphql'
import { GET_BUNDLE_BY_ID } from '../../../graphql/clubs'
import { Club, ClubAdminRole } from '../../../model/club/club'
import { colorPink, useClubsTheme } from '../../Styles/ClubsTheme'

interface IProps {
	club: Club
}

export const CAContractAddress: React.FC<IProps> = ({ club }) => {
	const { classes: clubsTheme } = useClubsTheme()
	const wallet = useWallet()
	const { sdk } = useSDK()

	const [smartContractPermission, setSmartContractPermission] =
		useState('members-and-meem')

	// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
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

	const chainIdToGnosisUrlPrefix = (): string => {
		switch (process.env.NEXT_PUBLIC_CHAIN_ID) {
			case '5':
				return 'gor'
			case '10':
				return 'oeth'
			case '420':
				return 'gor'
			case '42161':
				return 'arb1'
			case '43114':
				return 'avax'
			case '80001':
				return 'matic'
			case '421613':
				return 'gor'
		}

		// Default to polygon
		return 'matic'
	}

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

		// set the Meem API control radio button selection based on club data
		setSmartContractPermission(
			club.isClubControlledByMeemApi ? 'members-and-meem' : 'members'
		)
	}, [club, wallet, bundleData, shouldShowUpgrade])

	return (
		<div>
			<Space h={12} />
			<Text className={clubsTheme.tLargeBold}>Contract Management</Text>
			<Space h={32} />

			<Text className={clubsTheme.tExtraSmallLabel}>
				CONTRACT ADDRESS
			</Text>
			<Space h={16} />

			<div className={clubsTheme.centeredRow}>
				<Text style={{ wordBreak: 'break-word' }}>{club.address}</Text>
				<Image
					className={clubsTheme.copyIcon}
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

			<Space h={32} />

			<Divider />

			<Space h={32} />

			<Text className={clubsTheme.tExtraSmallLabel}>MEEM PROTOCOL</Text>
			<Space h={16} />

			<Text
				className={clubsTheme.tSmallBold}
			>{`Does Meem protocol have permission to manage your club’s smart contract?`}</Text>
			<Space h={8} />
			<Text className={clubsTheme.tSmallFaded}>
				Please note that a transaction will occur when you save changes
				to this setting.
			</Text>
			<Space h={12} />

			<Radio.Group
				orientation="vertical"
				spacing={10}
				size="sm"
				color="dark"
				value={smartContractPermission}
				onChange={(value: any) => {
					setSmartContractPermission(value)
				}}
				required
			>
				<Radio
					value="members-and-meem"
					label="Yes, make Meem protocol an additional contract admin (Recommended)"
				/>
				<Radio
					value="members"
					label="No, only club members with the Admin role can manage this contract"
				/>
			</Radio.Group>

			<Space h={24} />

			<Button
				className={clubsTheme.buttonBlack}
				onClick={async () => {
					try {
						const agreement = new Contract(
							club?.address ?? '',
							bundleData?.Bundles[0].abi,
							wallet.signer
						)

						if (
							// If not controlled by meem api and the user wants to enable control...
							smartContractPermission === 'members-and-meem' &&
							!club.isClubControlledByMeemApi
						) {
							const tx = await agreement?.grantRole(
								ClubAdminRole,
								process.env.NEXT_PUBLIC_MEEM_API_WALLET_ADDRESS
							)

							await tx.wait()
						} else if (
							// If controlled by meem api and user wants to remove control...
							smartContractPermission === 'members' &&
							club.isClubControlledByMeemApi
						) {
							const tx = await agreement?.revokeRole(
								ClubAdminRole,
								process.env.NEXT_PUBLIC_MEEM_API_WALLET_ADDRESS
							)

							await tx.wait()
						} else {
							showNotification({
								title: 'Oops!',
								color: colorPink,
								message: `There are no changes to save.`
							})
						}
					} catch (e) {
						log.debug(e)
					}
				}}
			>
				Save Changes
			</Button>

			{shouldShowUpgrade && (
				<>
					<Space h={32} />
					<Divider />
					<Space h={32} />
					<Text className={clubsTheme.tExtraSmallLabel}>
						UPGRADE CLUB CONTRACT
					</Text>
					<Space h={16} />
					<div className={clubsTheme.row}>
						<div>
							<Text>
								A new version of Clubs is available! Upgrade to
								take advantage of all the new features.
							</Text>
						</div>
					</div>
					<Space h={24} />
					<Button
						loading={isUpgradingClub}
						disabled={isUpgradingClub}
						className={clubsTheme.buttonBlack}
						onClick={async () => {
							try {
								if (!club?.id) {
									return
								}
								setIsUpgradingClub(true)
								const txId =
									await sdk.agreement.upgradeAgreement({
										agreementId: club.id
									})

								// TODO: Watch for transaction to finish
								log.debug(`Upgrade agreement w/ txId: ${txId}`)
							} catch (e) {
								log.crit(e)
								showNotification({
									title: 'Error Upgrading Club',
									color: colorPink,
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

			<Space h={32} />
			<Divider />
			<Space h={32} />
			<Text className={clubsTheme.tExtraSmallLabel}>
				CLUB TREASURY ADDRESS
			</Text>
			<Space h={20} />
			{club.gnosisSafeAddress && (
				<>
					<div className={clubsTheme.row}>
						<Text style={{ wordBreak: 'break-word' }}>
							{club.gnosisSafeAddress}
						</Text>
						<Image
							className={clubsTheme.copyIcon}
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
					<Space h={12} />

					<Text
						className={clubsTheme.tSmall}
					>{`Your club's treasury was set up when the club was created. You can manage your treasury (including signing transactions and adding members) using the button below.`}</Text>
					<Space h={24} />

					<Button
						className={clubsTheme.buttonBlack}
						onClick={() => {
							window.open(
								`https://gnosis-safe.io/app/${chainIdToGnosisUrlPrefix()}:${
									club.gnosisSafeAddress
								}/home`
							)
						}}
					>
						View Treasury
					</Button>
				</>
			)}

			{!club.gnosisSafeAddress && wallet.chainId !== 420 && (
				<Button
					className={clubsTheme.buttonBlack}
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

							await sdk.agreement.createSafe({
								safeOwners: club.adminAddresses ?? [],
								agreementId: club.id
							})

							setIsCreatingSafe(false)
						} catch (e) {
							log.crit(e)
							setIsCreatingSafe(false)
							showNotification({
								radius: 'lg',
								title: 'Wallet creation failed.',
								message:
									'We were unable to create treasury for your club. Please refresh the page and try again.',
								color: colorPink
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
