import {
	guild,
	user as guildUser,
	Chain as GuildChain,
	GetGuildResponse,
	role as guildRole,
	CreateRoleParams
} from '@guildxyz/sdk'
import log from '@kengoldfarb/log'
import {
	Text,
	Space,
	Center,
	Button,
	Divider,
	List,
	Card,
	Group,
	Stack,
	Title,
	Anchor,
	UnstyledButton,
	Select,
	Loader
} from '@mantine/core'
import { useSDK, useWallet } from '@meemproject/react'
// eslint-disable-next-line import/named
import { Bytes } from 'ethers'
import { DeleteCircle, Settings } from 'iconoir-react'
import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
import { extensionFromSlug } from '../../../model/agreement/agreements'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import { useMeemTheme } from '../../Styles/MeemTheme'
import { ExtensionBlankSlate, extensionIsReady } from '../ExtensionBlankSlate'

interface ISyncedGuildRole {
	name: string
	tokenAddress: string
	guildRoleId?: number
	agreementRoleId?: string
}

export const GuildExtension: React.FC = () => {
	// Default extension settings / properties - leave these alone if possible!
	const { classes: meemTheme } = useMeemTheme()
	const { agreement, isLoadingAgreement } = useAgreement()
	const agreementExtension = extensionFromSlug('guild', agreement)

	const [isSavingChanges, setIsSavingChanges] = useState(false)

	const [isFetchingGuild, setIsFetchingGuild] = useState(true)

	const [agreementGuild, setAgreementGuild] = useState<
		GetGuildResponse | undefined
	>()
	const [userGuilds, setUserGuilds] = useState<
		| {
				id: number
				name: string
				roles: { requirements: { address: string }[] }[]
		  }[]
		| undefined
	>()
	const [syncedRoles, setSyncedRoles] = useState<ISyncedGuildRole[]>([])
	const [unsyncedRoles, setUnsyncedRoles] = useState<any[]>([])

	const [userSelectedGuildId, setUserSelectedGuildId] = useState<
		string | null
	>()

	const wallet = useWallet()
	const { sdk } = useSDK()

	const fetchGuild = useCallback(
		async (guildId: number) => {
			if (isFetchingGuild || !agreementExtension) {
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
		[agreementExtension, isFetchingGuild]
	)

	const fetchUserGuilds = useCallback(async () => {
		if (isFetchingGuild || !agreementExtension) {
			return
		}

		setIsFetchingGuild(true)

		log.debug('FETCHING USER GUILDS')

		try {
			const userGuildsResponse = await guildUser.getMemberships(
				wallet.accounts[0]
			)
			const userAdminGuilds =
				userGuildsResponse?.filter(
					g =>
						(
							g as unknown as {
								guildId: number
								isAdmin: boolean
							}
						).isAdmin
				) ?? []
			const guildsData = await Promise.all(
				userAdminGuilds.map(async g => {
					return guild.get(g.guildId)
				})
			)
			setUserGuilds(guildsData)
		} catch (e) {
			log.crit(e)
		}

		setIsFetchingGuild(false)
	}, [agreementExtension, isFetchingGuild, wallet])

	useEffect(() => {
		if (!wallet || wallet.accounts.length < 1 || !agreementExtension) {
			setIsFetchingGuild(false)
			return
		}

		if (agreementExtension.metadata?.guildId && !agreementGuild) {
			fetchGuild(agreementExtension.metadata?.guildId)
		} else if (!userGuilds) {
			fetchUserGuilds()
		}
	}, [
		wallet,
		agreementExtension,
		agreementGuild,
		userGuilds,
		fetchGuild,
		fetchUserGuilds
	])

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

	const createGuild = useCallback(async () => {
		try {
			if (!wallet.signer || wallet.accounts.length < 1) {
				throw new Error("Can't sign the guild transaction.")
			}

			if (!agreement?.name || !agreement.address) {
				throw new Error('No agreement name or addre')
			}

			setIsSavingChanges(true)

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

			await fetchGuild(myGuild.id)
			try {
				await sdk.agreementExtension.updateAgreementExtension({
					agreementId: agreement?.id ?? '',
					isSetupComplete: true,
					agreementExtensionId: agreementExtension?.id,
					externalLink: {
						label: `${myGuild.name}`,
						url: `https://guild.xyz/${myGuild.urlName}`
					},
					metadata: {
						guildId: myGuild.id,
						// TODO: allow user to change these settings
						sidebarVisible: true,
						favoriteLinksVisible: true
					}
				})
			} catch (e) {
				log.crit(e)
			}
			setIsSavingChanges(false)
		} catch (err) {
			setIsSavingChanges(false)
			log.crit(err)
		}
	}, [agreement, agreementExtension, fetchGuild, sdk, wallet])

	const unsyncGuild = useCallback(async () => {
		try {
			if (!wallet.signer || wallet.accounts.length < 1) {
				throw new Error("Can't sign the guild transaction.")
			}

			if (!agreement?.name || !agreement.address) {
				throw new Error('No agreement name or addre')
			}

			setIsSavingChanges(true)

			try {
				await sdk.agreementExtension.updateAgreementExtension({
					agreementId: agreement?.id ?? '',
					agreementExtensionId: agreementExtension?.id,
					externalLink: null,
					metadata: {}
				})
			} catch (e) {
				log.crit(e)
			}
			setAgreementGuild(undefined)
			setIsSavingChanges(false)
		} catch (err) {
			setIsSavingChanges(false)
			log.crit(err)
		}
	}, [agreement, agreementExtension, sdk, wallet])

	const syncGuild = useCallback(
		async (guildId: number) => {
			try {
				if (!wallet.signer || wallet.accounts.length < 1) {
					throw new Error("Can't sign the guild transaction.")
				}

				if (!agreement?.name || !agreement.address) {
					throw new Error('No agreement name or addre')
				}

				setIsSavingChanges(true)

				try {
					const selectedGuildData = await guild.get(guildId)

					await sdk.agreementExtension.updateAgreementExtension({
						isSetupComplete: true,
						agreementId: agreement?.id ?? '',
						agreementExtensionId: agreementExtension?.id,
						externalLink: {
							label: `${selectedGuildData.name}`,
							url: `https://guild.xyz/${selectedGuildData.urlName}`
						},
						metadata: {
							guildId
						}
					})
				} catch (e) {
					log.crit(e)
				}
				setIsSavingChanges(false)
			} catch (err) {
				setIsSavingChanges(false)
				log.crit(err)
			}
		},
		[agreement, agreementExtension, sdk, wallet]
	)

	const syncRole = useCallback(
		async (tokenAddress: string) => {
			if (!agreement || !agreementGuild) {
				return
			}

			const agreementRole = agreement.roles?.find(
				ar => ar.tokenAddress === tokenAddress
			)

			if (!agreementRole || !agreementRole.tokenAddress) {
				return
			}

			try {
				if (!wallet.signer || wallet.accounts.length < 1) {
					throw new Error("Can't sign the guild transaction.")
				}

				if (!agreement?.name || !agreement.address) {
					throw new Error('No agreement name or addre')
				}

				setIsSavingChanges(true)

				const sign = (signableMessage: string | Bytes) =>
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					wallet.signer!.signMessage(signableMessage)

				try {
					const guildRoleData: CreateRoleParams = {
						guildId: agreementGuild.id,
						name: agreementRole.name,
						logic: 'AND',
						requirements: [
							{
								type: 'ERC721',
								chain: wallet.chainId
									? getGuildChain(wallet.chainId)
									: 'ETHEREUM',
								address: agreementRole.tokenAddress,
								data: {
									minAmount: 1
								}
							}
						]
					}
					await guildRole.create(
						wallet.accounts[0], // You have to insert your own wallet here
						sign,
						guildRoleData
					)
				} catch (e) {
					log.crit(e)
				}
				fetchGuild(agreementGuild.id)
				setIsSavingChanges(false)
			} catch (err) {
				setIsSavingChanges(false)
				log.crit(err)
			}
		},
		[agreement, agreementGuild, fetchGuild, wallet]
	)

	const deleteGuildRole = useCallback(
		async (roleId: number) => {
			if (!agreement || !agreementGuild) {
				return
			}

			// const agreementRole = agreement.roles?.find(
			// 	ar => ar.tokenAddress === tokenAddress
			// )

			// if (!agreementRole || !agreementRole.tokenAddress) {
			// 	return
			// }

			try {
				if (!wallet.signer || wallet.accounts.length < 1) {
					throw new Error("Can't sign the guild transaction.")
				}

				if (!agreement?.name || !agreement.address) {
					throw new Error('No agreement name or addre')
				}

				setIsSavingChanges(true)

				const sign = (signableMessage: string | Bytes) =>
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					wallet.signer!.signMessage(signableMessage)

				try {
					await guildRole.delete(
						roleId,
						wallet.accounts[0], // You have to insert your own wallet here
						sign
					)
				} catch (e) {
					log.crit(e)
				}
				fetchGuild(agreementGuild.id)
				setIsSavingChanges(false)
			} catch (err) {
				setIsSavingChanges(false)
				log.crit(err)
			}
		},
		[agreement, agreementGuild, fetchGuild, wallet]
	)

	useEffect(() => {
		if (!agreementGuild) {
			return
		}

		const syncedRolesData: ISyncedGuildRole[] = []

		agreementGuild.roles?.forEach(r => {
			let syncedRole: ISyncedGuildRole | undefined

			r.requirements.forEach(req => {
				if (req.address === agreement?.address) {
					syncedRole = {
						name: r.name,
						guildRoleId: r.id,
						tokenAddress: agreement?.address
					}
				} else {
					agreement?.roles?.forEach(ar => {
						if (ar.tokenAddress === req.address) {
							syncedRole = {
								name: r.name,
								guildRoleId: r.id,
								tokenAddress: ar.tokenAddress,
								agreementRoleId: ar.id
							}
						}
					})
				}
			})

			if (syncedRole) {
				syncedRolesData.push(syncedRole)
			}
		})

		setSyncedRoles(syncedRolesData)

		const unsyncedRolesData = agreement?.roles?.filter(ar => {
			const guildRoleIndex = agreementGuild.roles?.findIndex(gr => {
				const reqMatchIndex = gr.requirements.findIndex(req => {
					return ar.tokenAddress === req.address
				})
				return reqMatchIndex > -1
			})
			return !guildRoleIndex || guildRoleIndex < 0
		})

		setUnsyncedRoles(unsyncedRolesData ?? [])
	}, [agreementGuild, agreement])

	const roleComponent = (props: {
		name: string
		tokenAddress: string
		agreementRoleId?: string
		guildRoleId?: number
	}) => {
		const isAgreementMemberRole = agreement?.address === props.tokenAddress
		return (
			<Card shadow="sm" p="lg" radius="md" withBorder mt="sm">
				<Group>
					<Stack spacing={8}>
						<Text weight="bold">{props.name}</Text>
						<Text fz="sm">
							{isAgreementMemberRole
								? `Member Role`
								: `Agreement Role`}
						</Text>
					</Stack>
					<Group ml="auto">
						{isAgreementMemberRole ? (
							<Link
								href={`/${agreement.slug}/members`}
								legacyBehavior
								passHref
							>
								<a className={meemTheme.unstyledLink}>
									<Button className={meemTheme.buttonBlack}>
										Manage Members
									</Button>
								</a>
							</Link>
						) : props.guildRoleId ? (
							<>
								{props.agreementRoleId && (
									<Link
										href={`/${agreement?.slug}/roles?role=${props.agreementRoleId}`}
										legacyBehavior
										passHref
									>
										<a className={meemTheme.unstyledLink}>
											<Button
												className={
													meemTheme.buttonBlack
												}
											>
												Manage Members
											</Button>
										</a>
									</Link>
								)}
								<Button
									leftIcon={<DeleteCircle />}
									style={{ backgroundColor: 'red' }}
									ml="auto"
									onClick={() => {
										if (props.guildRoleId)
											deleteGuildRole(props.guildRoleId)
									}}
									className={meemTheme.buttonBlack}
								>
									Delete Guild Role
								</Button>
							</>
						) : (
							<Button
								ml="auto"
								onClick={() => {
									syncRole(props.tokenAddress)
								}}
								className={meemTheme.buttonBlack}
							>
								Sync Role
							</Button>
						)}
					</Group>
				</Group>
			</Card>
		)
	}

	const customExtensionSettings = () => (
		<>
			{agreementGuild ? (
				<>
					<Group>
						<Stack spacing="xs">
							<Title order={4}>{agreementGuild.name}</Title>
							<UnstyledButton
								style={{ color: 'red' }}
								fz="sm"
								onClick={() => {
									unsyncGuild()
								}}
							>
								Unsync Guild
							</UnstyledButton>
						</Stack>
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
					<Text>
						{`Once you've synced your roles, `}
						<Anchor
							weight={'bold'}
							href={`https://guild.xyz/${agreementGuild.urlName}`}
							target="_blank"
						>
							go to your Guild page
						</Anchor>
						{` to manage rewards and additional access controls.`}
					</Text>
					<List mt={'sm'}>
						{syncedRoles.map(r =>
							// TODO: make sure only one required token and chain matches
							roleComponent(r)
						)}
					</List>
					<Title order={5} mt={'xl'}>
						Unsynced Roles
					</Title>
					{unsyncedRoles.length === 0 ? (
						<Stack mt="5">
							<Text>{`You don't have any roles to sync.`}</Text>
							<Button mr="auto" className={meemTheme.buttonBlack}>
								Manage Roles
							</Button>
						</Stack>
					) : (
						<List mt={'sm'}>
							{unsyncedRoles.map(r =>
								// TODO: make sure only one required token and chain matches
								roleComponent({
									name: r.name,
									tokenAddress: r.tokenAddress
								})
							)}
						</List>
					)}
				</>
			) : (
				<>
					{userGuilds && (
						<Select
							mt="sm"
							data={userGuilds.map(g => {
								return {
									value: `${g.id}`,
									label: g.name
								}
							})}
							size={'md'}
							radius={'sm'}
							onChange={value => {
								if (value) {
									setUserSelectedGuildId(
										value === '' ? null : value
									)
								}
							}}
							placeholder="Select a Guild"
							value={userSelectedGuildId}
						/>
					)}
					<Button
						className={meemTheme.buttonGrey}
						disabled={!userSelectedGuildId}
						onClick={() => {
							if (userSelectedGuildId) {
								syncGuild(parseInt(userSelectedGuildId, 10))
							}
						}}
					>
						Sync Guild
					</Button>
					<Space h={0} />
					<Button
						mt="lg"
						className={meemTheme.buttonDarkGrey}
						onClick={() => {
							createGuild()
						}}
					>
						+ Create a new Guild
					</Button>
				</>
			)}
			<Space h={8} />
		</>
	)

	return (
		<div>
			<ExtensionBlankSlate />
			{extensionIsReady(
				isLoadingAgreement,
				agreement,
				agreementExtension
			) && (
				<>
					<div>
						{isSavingChanges ? (
							<Center>
								<Loader />
							</Center>
						) : (
							customExtensionSettings()
						)}
					</div>
				</>
			)}
		</div>
	)
}