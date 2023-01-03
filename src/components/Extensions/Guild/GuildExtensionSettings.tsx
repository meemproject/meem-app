import {
	guild,
	CreateGuildResponse,
	Chain as GuildChain,
	GetGuildByIdResponse
} from '@guildxyz/sdk'
import log from '@kengoldfarb/log'
import {
	Container,
	Text,
	Space,
	Center,
	Button,
	Divider,
	Switch
} from '@mantine/core'
import { useSDK, useWallet } from '@meemproject/react'
import { Bytes } from 'ethers'
import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
import { extensionFromSlug } from '../../../model/agreement/agreements'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import { useMeemTheme } from '../../Styles/MeemTheme'
import { ExtensionBlankSlate, extensionIsReady } from '../ExtensionBlankSlate'
import { ExtensionPageHeader } from '../ExtensionPageHeader'

export const GuildExtensionSettings: React.FC = () => {
	// Default extension settings / properties - leave these alone if possible!
	const { classes: meemTheme } = useMeemTheme()
	const { agreement, isLoadingAgreement } = useAgreement()
	const agreementExtension = extensionFromSlug('guild', agreement)

	const [isSavingChanges, setIsSavingChanges] = useState(false)
	const [isDisablingExtension, setIsDisablingExtension] = useState(false)
	const [shouldDisplayDashboardWidget, setShouldDisplayDashboardWidget] =
		useState(false)
	const [isPrivateExtension, setIsPrivateExtension] = useState(false)

	const [isFetchingGuild, setIsFetchingGuild] = useState(true)
	const [isUpdatingExtension, setIsUpdatingExtension] = useState(true)
	const [isCreatingGuild, setIsCreatingGuild] = useState(false)

	const [agreementGuild, setAgreementGuild] = useState<
		CreateGuildResponse | GetGuildByIdResponse | undefined
	>()

	const wallet = useWallet()
	const { sdk } = useSDK()

	const fetchGuild = async (guildId: number) => {
		if (!agreementExtension) {
			return
		}
		setIsFetchingGuild(true)

		try {
			const guildResponse = await guild.get(guildId)
			log.debug(guildResponse)
			setAgreementGuild(guildResponse)
		} catch (e) {
			log.crit(e)
		}

		setIsFetchingGuild(false)
	}

	useEffect(() => {
		if (!wallet || wallet.accounts.length < 1 || !agreementExtension) {
			setIsFetchingGuild(false)
			return
		}

		if (agreementExtension.metadata?.guildId) {
			fetchGuild(agreementExtension.metadata?.guildId)
		}
	}, [wallet, agreementExtension])

	const getGuildChain = (chainId: number): GuildChain => {
		switch (chainId) {
			case 1:
				return 'ETHEREUM'
				break
			case 4:
				return 'RINKEBY' as GuildChain
				break
			case 5:
				return 'GOERLI'
				break
			case 137:
				return 'POLYGON'
				break
			case 420:
				return 'OPTIMISM'
				break
			case 421613:
				return 'ARBITRUM'
				break
			default:
				return 'POLYGON'
		}
	}

	const updateAgreementExtension = async (params: { guildId?: number }) => {
		setIsUpdatingExtension(true)
		const currentMetadata = agreementExtension?.metadata

		try {
			await sdk.agreementExtension.updateAgreementExtension({
				agreementId: agreement?.id ?? '',
				agreementExtensionId: agreementExtension?.id,
				metadata: {
					guildId: params.guildId
						? params.guildId
						: currentMetadata?.guildId
				}
			})
		} catch (e) {
			log.crit(e)
		}

		setIsUpdatingExtension(false)
	}

	const createGuild = useCallback(async () => {
		try {
			if (!wallet.signer || wallet.accounts.length < 1) {
				throw new Error("Can't sign the guild transaction.")
			}

			if (!agreement?.name || !agreement.address) {
				throw new Error('No agreement name or addre')
			}

			setIsCreatingGuild(true)

			const sign = (signableMessage: string | Bytes) =>
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				wallet.signer!.signMessage(signableMessage)

			// Creating a Guild
			const myGuild = await guild.create(
				wallet.accounts[0], // You have to insert your own wallet here
				sign,
				{
					name: `${agreement.name} Guild`,
					description: 'Cool stuff', // Optional
					admins: [wallet.accounts[0]], // Optional
					showMembers: true, // Optional
					hideFromExplorer: false, // Optional
					roles: [
						{
							name: `${agreement.name} Member`,
							logic: 'AND',
							requirements: [
								{
									type: 'ERC721',
									chain: wallet.chainId
										? getGuildChain(wallet.chainId)
										: 'ETHEREUM',
									address: agreement.address,
									data: {
										minAmount: 1
									}
								}
							]
						}
					]
				}
			)
			setAgreementGuild(myGuild)
			setIsCreatingGuild(false)
			updateAgreementExtension({
				guildId: myGuild.id
			})
		} catch (err) {
			setIsCreatingGuild(false)
			log.crit(err)
		}
	}, [agreement, agreementGuild])

	/*
TODO
Add your custom extension settings layout here.
 */
	const customExtensionSettings = () => (
		<>
			<Space h={40} />
			<Text className={meemTheme.tExtraSmallLabel}>CONFIGURATION</Text>
			<Space h={16} />
			{agreementGuild ? (
				<>
					<Text>{agreementGuild.name}</Text>
					<Link
						href={`https://guild.xyz/${agreementGuild.urlName}`}
					>{`https://guild.xyz/${agreementGuild.urlName}`}</Link>
				</>
			) : (
				<Button
					onClick={() => {
						createGuild()
					}}
				>
					Create Guild
				</Button>
			)}
			<Space h={8} />
		</>
	)

	/*
			TODO
			Add your custom extension permissions layout here.
			*/
	const customExtensionPermissions = () => (
		<>This extension does not provide any permissions.</>
	)

	/*
TODO
Use this function to save any specific settings you have created for this extension and make any calls you need to external APIs.
 */

	const saveCustomChanges = async () => { }

	/*
			Boilerplate area - please don't edit the below code!
===============================================================
 */

	const saveChanges = async () => {
		setIsSavingChanges(true)
		await saveCustomChanges()
		setIsSavingChanges(false)
	}

	const disableExtension = async () => {
		setIsDisablingExtension(true)
		setIsDisablingExtension(false)
	}

	log.debug('IS ADMIN', {
		isLoadingAgreement,
		agreementExtension
	})

	return (
		<div>
			<ExtensionBlankSlate extensionSlug={'guild'} />
			{extensionIsReady(
				isLoadingAgreement,
				agreement,
				agreementExtension
			) && (
					<>
						{!agreement?.isCurrentUserAgreementAdmin && (
							<Container>
								<Space h={120} />
								<Center>
									<Text>
										Sorry, you do not have permission to view
										this page. Contact the community owner for
										help.
									</Text>
								</Center>
							</Container>
						)}

						{agreement?.isCurrentUserAgreementAdmin && (
							<div>
								<ExtensionPageHeader extensionSlug={'guild'} />

								<Container>
									<div>
										<div
											className={meemTheme.spacedRowCentered}
										>
											<Switch
												color={'green'}
												label={'Display dashboard widget'}
												checked={
													shouldDisplayDashboardWidget
												}
												onChange={value => {
													if (value) {
														setShouldDisplayDashboardWidget(
															value.currentTarget
																.checked
														)
													}
												}}
											/>
										</div>
										<Space h={16} />
										<Divider />
									</div>
									<div>
										<Space h={4} />
										<div
											className={meemTheme.spacedRowCentered}
										>
											<Switch
												color={'green'}
												label={
													'Hide widget if viewer is not a community member'
												}
												checked={isPrivateExtension}
												onChange={value => {
													if (value) {
														setIsPrivateExtension(
															value.currentTarget
																.checked
														)
													}
												}}
											/>
										</div>
										<Space h={16} />
										<Divider />
									</div>
									<Space h={16} />

									<Button
										disabled={isDisablingExtension}
										loading={isDisablingExtension}
										className={meemTheme.buttonBlue}
										onClick={disableExtension}
									>
										Disable extension
									</Button>

									{customExtensionSettings()}
									<Space h={40} />
									<Text className={meemTheme.tExtraSmallLabel}>
										PERMISSIONS
									</Text>
									<Space h={16} />

									{customExtensionPermissions()}
									<Space h={48} />
									<Button
										disabled={isSavingChanges}
										loading={isSavingChanges}
										onClick={() => {
											saveChanges()
										}}
										className={meemTheme.buttonBlack}
									>
										Save Changes
									</Button>
								</Container>
							</div>
						)}
					</>
				)}
		</div>
	)
}
