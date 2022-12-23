import { useQuery } from '@apollo/client'
import log from '@kengoldfarb/log'
import { Text, Image, Divider, Space, Button, Radio } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { diamondABI, IFacetVersion, getCuts } from '@meemproject/meem-contracts'
import { useAuth, useSDK, useWallet } from '@meemproject/react'
import { Contract, ethers } from 'ethers'
import { isEqual } from 'lodash'
// eslint-disable-next-line import/no-extraneous-dependencies
import React, { useEffect, useState } from 'react'
import { Check } from 'tabler-icons-react'
import { GetBundleByIdQuery } from '../../../../generated/graphql'
import { GET_BUNDLE_BY_ID } from '../../../graphql/agreements'
import {
	Agreement,
	AgreementAdminRole
} from '../../../model/agreement/agreements'
import { colorBlue, useMeemTheme } from '../../Styles/MeemTheme'

interface IProps {
	agreement: Agreement
}

export const AdminContractManagement: React.FC<IProps> = ({ agreement }) => {
	const { classes: meemTheme } = useMeemTheme()
	const wallet = useWallet()
	const { sdk } = useSDK()
	const { chainId } = useAuth()

	const [smartContractPermission, setSmartContractPermission] =
		useState('members-and-meem')

	// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
	const [isCreatingSafe, setIsCreatingSafe] = useState(false)
	const [shouldShowUpgrade, setShouldShowUpgrade] = useState(false)
	const [isUpgradingAgreement, setIsUpgradingAgreement] = useState(false)

	const { data: bundleData } = useQuery<GetBundleByIdQuery>(
		GET_BUNDLE_BY_ID,
		{
			variables: {
				id: process.env.NEXT_PUBLIC_MEEM_BUNDLE_ID
			}
		}
	)

	const chainIdToGnosisUrlPrefix = (chainIdToCheck: number): string => {
		switch (chainIdToCheck) {
			case 5:
				return 'gor'
			case 10:
				return 'oeth'
			case 420:
				return 'gor'
			case 42161:
				return 'arb1'
			case 43114:
				return 'avax'
			case 80001:
				return 'matic'
			case 421613:
				return 'gor'
		}

		// Default to polygon
		return 'matic'
	}

	useEffect(() => {
		const fetchFacets = async () => {
			// TODO: Move this to meem-contracts package?
			if (agreement?.address && bundleData) {
				try {
					const diamond = new ethers.Contract(
						agreement.address,
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

								const agreementFacet = fromVersion.find(f => {
									if (bc.Contract) {
										const agreementFacetFunctionSelectors =
											[...f.functionSelectors].sort()
										const bcFunctionSelectors = [
											...bc.functionSelectors
										].sort()

										if (
											f.address.toLowerCase() ===
												ci.address.toLowerCase() &&
											isEqual(
												agreementFacetFunctionSelectors,
												bcFunctionSelectors
											)
										) {
											return true
										}
									}
									return false
								})

								if (agreementFacet) {
									toVersion.push(agreementFacet)
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
						proxyContractAddress: agreement.address,
						fromVersion,
						toVersion
					})

					if (cuts.length > 0) {
						setShouldShowUpgrade(true)
					}

					if (shouldShowUpgrade && cuts.length === 0) {
						showNotification({
							title: 'Community agreement contract upgraded!',
							color: 'green',
							icon: <Check />,
							message: `This community's agreement contract has been upgraded to the latest version.`
						})
						setShouldShowUpgrade(false)
						setIsUpgradingAgreement(false)
					}
				} catch (e) {
					log.crit(e)
				}
			}
		}
		fetchFacets()

		// set the Meem API control radio button selection based on agreement data
		setSmartContractPermission(
			agreement.isAgreementControlledByMeemApi
				? 'members-and-meem'
				: 'members'
		)
	}, [agreement, wallet, bundleData, shouldShowUpgrade])

	return (
		<div>
			<Space h={12} />
			<Text className={meemTheme.tLargeBold}>Contract Management</Text>
			<Space h={32} />

			<Text className={meemTheme.tExtraSmallLabel}>CONTRACT ADDRESS</Text>
			<Space h={16} />

			<div className={meemTheme.centeredRow}>
				<Text style={{ wordBreak: 'break-word' }}>
					{agreement.address}
				</Text>
				<Image
					className={meemTheme.copyIcon}
					src="/copy.png"
					height={20}
					onClick={() => {
						navigator.clipboard.writeText(agreement.address ?? '')
						showNotification({
							radius: 'lg',
							title: 'Address copied',
							autoClose: 2000,
							color: 'green',
							icon: <Check />,

							message: `This community's agreement contract address was copied to your clipboard.`
						})
					}}
					width={20}
				/>
			</div>

			<Space h={32} />

			<Divider />

			<Space h={32} />

			<Text className={meemTheme.tExtraSmallLabel}>MEEM PROTOCOL</Text>
			<Space h={16} />

			<Text
				className={meemTheme.tSmallBold}
			>{`Does Meem protocol have permission to manage your community's agreement smart contract?`}</Text>
			<Space h={8} />
			<Text className={meemTheme.tSmallFaded}>
				Please note that a transaction will occur when you save changes
				to this setting.
			</Text>
			<Space h={12} />

			<Radio.Group
				orientation="vertical"
				spacing={10}
				size="md"
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
					label="No, only community members with the Admin role can manage this contract"
				/>
			</Radio.Group>

			<Space h={24} />

			<Button
				className={meemTheme.buttonBlack}
				onClick={async () => {
					try {
						const agreementContract = new Contract(
							agreement?.address ?? '',
							bundleData?.Bundles[0].abi,
							wallet.signer
						)

						if (
							// If not controlled by meem api and the user wants to enable control...
							smartContractPermission === 'members-and-meem' &&
							!agreement.isAgreementControlledByMeemApi
						) {
							const tx = await agreementContract?.grantRole(
								AgreementAdminRole,
								process.env.NEXT_PUBLIC_MEEM_API_WALLET_ADDRESS
							)

							await tx.wait()
						} else if (
							// If controlled by meem api and user wants to remove control...
							smartContractPermission === 'members' &&
							agreement.isAgreementControlledByMeemApi
						) {
							const tx = await agreementContract?.revokeRole(
								AgreementAdminRole,
								process.env.NEXT_PUBLIC_MEEM_API_WALLET_ADDRESS
							)

							await tx.wait()
						} else {
							showNotification({
								title: 'Oops!',
								color: colorBlue,
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
					<Text className={meemTheme.tExtraSmallLabel}>
						UPGRADE COMMMUNITY AGREEMENT CONTRACT
					</Text>
					<Space h={16} />
					<div className={meemTheme.row}>
						<div>
							<Text>
								{`A new version of your community's agreement contract is available!
								Upgrade to take advantage of all the new
								features.`}
							</Text>
						</div>
					</div>
					<Space h={24} />
					<Button
						loading={isUpgradingAgreement}
						disabled={isUpgradingAgreement}
						className={meemTheme.buttonBlack}
						onClick={async () => {
							try {
								if (!agreement?.id) {
									return
								}
								setIsUpgradingAgreement(true)
								const txId =
									await sdk.agreement.upgradeAgreement({
										agreementId: agreement.id
									})

								// TODO: Watch for transaction to finish
								log.debug(`Upgrade agreement w/ txId: ${txId}`)
							} catch (e) {
								log.crit(e)
								showNotification({
									title: 'Error upgrading agreement contract',
									color: colorBlue,
									message: `Something went wrong during the upgrade.`
								})
								setIsUpgradingAgreement(false)
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
			<Text className={meemTheme.tExtraSmallLabel}>
				COMMUNITY TREASURY ADDRESS
			</Text>
			<Space h={20} />
			{agreement.gnosisSafeAddress && (
				<>
					<div className={meemTheme.row}>
						<Text style={{ wordBreak: 'break-word' }}>
							{agreement.gnosisSafeAddress}
						</Text>
						<Image
							className={meemTheme.copyIcon}
							src="/copy.png"
							height={20}
							onClick={() => {
								navigator.clipboard.writeText(
									agreement.gnosisSafeAddress ?? ''
								)
								showNotification({
									radius: 'lg',
									title: 'Address copied',
									autoClose: 2000,
									color: 'green',
									icon: <Check />,

									message: `This community's treasury address was copied to your clipboard.`
								})
							}}
							width={20}
						/>
					</div>
					<Space h={12} />

					<Text
						className={meemTheme.tSmall}
					>{`You can manage your community treasury (including signing transactions and adding members) using the button below.`}</Text>
					<Space h={24} />

					<Button
						className={meemTheme.buttonBlack}
						onClick={() => {
							window.open(
								`https://gnosis-safe.io/app/${chainIdToGnosisUrlPrefix(
									chainId ?? 137
								)}:${agreement.gnosisSafeAddress}/home`
							)
						}}
					>
						View Treasury
					</Button>
				</>
			)}

			{!agreement.gnosisSafeAddress && wallet.chainId !== 420 && (
				<Button
					className={meemTheme.buttonBlack}
					disabled={isCreatingSafe}
					loading={isCreatingSafe}
					onClick={async () => {
						if (
							!agreement.id ||
							!agreement.adminAddresses ||
							!wallet.chainId
						) {
							return
						}
						try {
							setIsCreatingSafe(true)

							await sdk.agreement.createSafe({
								safeOwners: agreement.adminAddresses ?? [],
								agreementId: agreement.id
							})

							setIsCreatingSafe(false)
						} catch (e) {
							log.crit(e)
							setIsCreatingSafe(false)
							showNotification({
								radius: 'lg',
								title: 'Wallet creation failed.',
								message:
									'We were unable to create a treasury for your community. Please refresh the page and try again.',
								color: colorBlue
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