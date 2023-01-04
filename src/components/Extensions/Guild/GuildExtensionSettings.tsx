import {
	guild,
	CreateGuildResponse,
	Chain as GuildChain,
	GetGuildByIdResponse,
	GetGuildResponse
} from '@guildxyz/sdk'
import log from '@kengoldfarb/log'
import {
	Container,
	Text,
	Space,
	Center,
	Button,
	Divider,
	Switch,
	List,
	Card,
	Group,
	Stack,
	Title,
	Anchor
} from '@mantine/core'
import { useSDK, useWallet } from '@meemproject/react'
import { Bytes } from 'ethers'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { Settings } from 'tabler-icons-react'
import { extensionFromSlug } from '../../../model/agreement/agreements'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import { useMeemTheme } from '../../Styles/MeemTheme'
import { ExtensionBlankSlate, extensionIsReady } from '../ExtensionBlankSlate'
import { ExtensionPageHeader } from '../ExtensionPageHeader'

export const GuildExtensionSettings: React.FC = () => {
	// Default extension settings / properties - leave these alone if possible!
	const { classes: meemTheme } = useMeemTheme()
	const router = useRouter()
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
		GetGuildResponse | undefined
	>()

	const wallet = useWallet()
	const { sdk } = useSDK()

	const fetchGuild = useCallback(
		async (guildId: number) => {
			if (!agreementExtension) {
				return
			}
			setIsFetchingGuild(true)

			log.debug('FETCHING GUILD', guildId)

			try {
				const guildResponse = await guild.get(guildId)
				log.debug(guildResponse)
				setAgreementGuild(guildResponse as GetGuildResponse)
			} catch (e) {
				log.crit(e)
			}

			setIsFetchingGuild(false)
		},
		[agreementExtension]
	)

	useEffect(() => {
		if (!wallet || wallet.accounts.length < 1 || !agreementExtension) {
			setIsFetchingGuild(false)
			return
		}

		log.debug('AGREEMENT EXT', agreementExtension)

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

	const updateAgreementExtension = useCallback(
		async (params: { guildId?: number; test?: string }) => {
			setIsUpdatingExtension(true)
			const currentMetadata = agreementExtension?.metadata

			log.debug('UPDATING GUILD EXT', params, agreementExtension)

			try {
				await sdk.agreementExtension.updateAgreementExtension({
					agreementId: agreement?.id ?? '',
					agreementExtensionId: agreementExtension?.id,
					metadata: {
						guildId: params.guildId
							? params.guildId
							: currentMetadata?.guildId,
						test: params.test ? params.test : currentMetadata?.test
					}
				})
			} catch (e) {
				log.crit(e)
			}

			setIsUpdatingExtension(false)
		},
		[agreement, agreementExtension]
	)

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
			log.debug('GUILD CREATED', myGuild)
			await fetchGuild(myGuild.id)
			await updateAgreementExtension({
				guildId: myGuild.id
			})
			setIsCreatingGuild(false)
		} catch (err) {
			setIsCreatingGuild(false)
			log.crit(err)
		}
	}, [agreement, agreementGuild])

	/*
TODO
Add your custom extension settings layout here.
 */

	const roleComponent = (props: { name: string; tokenAddress: string }) => {
		const isAgreementRole = agreement?.address === props.tokenAddress
		return (
			<Card shadow="sm" p="lg" radius="md" withBorder>
				<Group>
					<Stack spacing="xs">
						<Text weight="bold">{props.name}</Text>
						<Text fz="sm">
							{isAgreementRole ? `Member Role` : `Agreement Role`}
						</Text>
					</Stack>
					{isAgreementRole && (
						<Button
							ml="auto"
							onClick={() => {
								router.push({
									pathname: `/${agreement.slug}/members`
								})
							}}
							className={meemTheme.buttonBlack}
						>
							Manage Members
						</Button>
					)}
				</Group>
			</Card>
		)
	}

	const customExtensionSettings = () => (
		<>
			<Space h={40} />
			<Text className={meemTheme.tExtraSmallLabel}>CONFIGURATION</Text>
			<Space h={16} />
			{agreementGuild ? (
				<>
					<Group>
						<Title order={4}>{agreementGuild.name}</Title>
						<Button
							ml="auto"
							component="a"
							leftIcon={<Settings />}
							className={meemTheme.buttonBlack}
							href={`https://guild.xyz/${agreementGuild.urlName}`}
							target="_blank"
						>
							Manage Guild
						</Button>
					</Group>
					<Divider mt={'md'} />
					<Title order={5} mt={'xl'}>
						Synced Roles
					</Title>
					<List mt={'sm'}>
						{agreementGuild.roles.map(r =>
							// TODO: make sure only one required token and chain matches
							roleComponent({
								name: r.name,
								tokenAddress: r.requirements[0].address
							})
						)}
					</List>
				</>
			) : (
				<Button
					onClick={() => {
						createGuild()
					}}
				>
					Create a New Guild
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
									<Space h={16} />

									{customExtensionSettings()}
								</Container>
							</div>
						)}
					</>
				)}
		</div>
	)
}
