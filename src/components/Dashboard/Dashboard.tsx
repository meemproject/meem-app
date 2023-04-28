/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/naming-convention */
import { useSubscription } from '@apollo/client'
import log from '@kengoldfarb/log'
import {
	Container,
	Text,
	Space,
	Center,
	Loader,
	Navbar,
	NavLink,
	MediaQuery,
	Burger,
	Select,
	Divider
} from '@mantine/core'
import { useMeemApollo, useWallet } from '@meemproject/react'
import { MeemAPI } from '@meemproject/sdk'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { AccessPoint, MoodSmile, Notes, Send, Wand } from 'tabler-icons-react'
import {
	SubDiscordsSubscription,
	SubTwittersSubscription,
	SubSlacksSubscription,
	SubRulesSubscription,
	MyAgreementsSubscriptionSubscription
} from '../../../generated/graphql'
import { SUB_MY_AGREEMENTS } from '../../graphql/agreements'
import {
	SUB_DISCORDS,
	SUB_TWITTERS,
	SUB_SLACKS,
	SUB_RULES
} from '../../graphql/rules'
import { isJwtError } from '../../model/agreement/agreements'
import { CookieKeys } from '../../utils/cookies'
import { useAgreement } from '../Providers/AgreementProvider'
import { useMeemTheme } from '../Styles/MeemTheme'
import {
	CTRule,
	CTConnection,
	CTConnectionType
} from './Flows/Model/communityTweets'
import { DashboardAccounts } from './Tabs/DashboardAccounts'
import { DashboardAirdrops } from './Tabs/DashboardAirdrops'
import { DashboardDetails } from './Tabs/DashboardDetails'
import { DashboardFlows } from './Tabs/DashboardFlows'
import { DashboardRoles } from './Tabs/DashboardRoles'

enum Tab {
	Flows,
	Accounts,
	Roles,
	Details,
	Airdrops
}

export const DashboardComponent: React.FC = () => {
	// General properties / tab management
	const { classes: meemTheme } = useMeemTheme()
	const router = useRouter()
	const wallet = useWallet()

	const { agreement, isLoadingAgreement, error } = useAgreement()

	const { mutualMembersClient } = useMeemApollo()

	// Navigation
	const [currentTab, setCurrentTab] = useState<Tab>(Tab.Flows)
	const [mobileNavBarVisible, setMobileNavBarVisible] = useState(false)

	useEffect(() => {
		if (isJwtError(error)) {
			Cookies.set(CookieKeys.authRedirectUrl, `/${agreement?.slug}`)
			router.push({
				pathname: '/authenticate'
			})
		}
	}, [agreement?.slug, error, router, wallet])

	useEffect(() => {
		switch (router.query.tab) {
			case 'flows':
				setCurrentTab(Tab.Flows)
				break
			case 'accounts':
				setCurrentTab(Tab.Accounts)
				break
			case 'roles':
				setCurrentTab(Tab.Roles)
				break
			case 'airdrops':
				setCurrentTab(Tab.Airdrops)
				break
			case 'details':
				setCurrentTab(Tab.Details)
				break
		}
	}, [router.query.tab])

	// Communities
	const [communities, setCommunities] = useState([])
	const [community, setCommunity] = useState<string | null>(null)
	const [previousCommunitiesDataString, setPreviousCommunitiesDataString] =
		useState('')
	const { data: communitiesData } =
		useSubscription<MyAgreementsSubscriptionSubscription>(
			SUB_MY_AGREEMENTS,
			{
				variables: {
					walletAddress: wallet.isConnected ? wallet.accounts[0] : '',
					chainId: process.env.NEXT_PUBLIC_CHAIN_ID
				},
				skip: !mutualMembersClient || !agreement?.id,
				client: mutualMembersClient
			}
		)

	// Flows and connections
	const [previousRulesDataString, setPreviousRulesDataString] = useState('')
	const [rules, setRules] = useState<CTRule[]>()

	const [previousConnectionsDataString, setPreviousConnectionsDataString] =
		useState('')
	const [isFetchingConnections, setIsFetchingConnections] = useState(false)
	const [hasFetchedConnections, setHasFetchedConnections] = useState(false)
	const [communityTweetsConnections, setCommunityTweetsConnections] =
		useState<CTConnection[]>([])

	const {
		data: discordConnectionData,
		loading: isFetchingDiscordConnections
	} = useSubscription<SubDiscordsSubscription>(SUB_DISCORDS, {
		variables: {
			agreementId: agreement?.id
		},
		skip: !mutualMembersClient || !agreement?.id,
		client: mutualMembersClient
	})

	const {
		data: twitterConnectionData,
		loading: isFetchingTwitterConnections
	} = useSubscription<SubTwittersSubscription>(SUB_TWITTERS, {
		variables: {
			agreementId: agreement?.id
		},
		skip: !mutualMembersClient || !agreement?.id,
		client: mutualMembersClient
	})

	const { data: slackConnectionData, loading: isFetchingSlackConnections } =
		useSubscription<SubSlacksSubscription>(SUB_SLACKS, {
			variables: {
				agreementId: agreement?.id
			},
			skip: !mutualMembersClient || !agreement?.id,
			client: mutualMembersClient
		})

	// Parse connections from subscription
	useEffect(() => {
		if (
			discordConnectionData &&
			twitterConnectionData &&
			slackConnectionData
		) {
			const conns: CTConnection[] = []
			discordConnectionData.AgreementDiscords.forEach(c => {
				const con: CTConnection = {
					id: c.id,
					name: `Discord: ${c.Discord?.name}`,
					type: CTConnectionType.InputOnly,
					platform: MeemAPI.RuleIo.Discord,
					icon: c.Discord?.icon ?? ''
				}
				if (c.Discord?.name) {
					conns.push(con)
				}
			})

			twitterConnectionData.AgreementTwitters.forEach(c => {
				const con: CTConnection = {
					id: c.id,
					name: `Twitter: ${c.Twitter?.username}`,
					type: CTConnectionType.OutputOnly,
					platform: MeemAPI.RuleIo.Twitter
				}
				conns.push(con)
			})

			slackConnectionData.AgreementSlacks.forEach(c => {
				const con: CTConnection = {
					id: c.id,
					name: `Slack: ${c.Slack?.name}`,
					type: CTConnectionType.InputOnly,
					platform: MeemAPI.RuleIo.Slack
				}
				conns.push(con)
			})

			// Add Webhook connection
			const webhookCon: CTConnection = {
				id: 'webhook',
				name: 'Add a custom Webhook',
				type: CTConnectionType.OutputOnly,
				platform: MeemAPI.RuleIo.Webhook
			}
			conns.push(webhookCon)

			const jsonConns = JSON.stringify(conns)
			if (jsonConns !== previousConnectionsDataString) {
				setPreviousConnectionsDataString(jsonConns)
				setCommunityTweetsConnections(conns)
				setHasFetchedConnections(true)
				setIsFetchingConnections(false)
			}
		}
	}, [
		discordConnectionData,
		hasFetchedConnections,
		isFetchingConnections,
		previousConnectionsDataString,
		slackConnectionData,
		twitterConnectionData
	])

	const { data: rulesData } = useSubscription<SubRulesSubscription>(
		SUB_RULES,
		{
			variables: {
				agreementId: agreement?.id
			},
			skip: !agreement?.id,
			client: mutualMembersClient
		}
	)

	// Parse rules from subscription
	useEffect(() => {
		const newRules: CTRule[] = []
		if (rulesData) {
			rulesData.Rules.forEach(rule => {
				const newRule: CTRule = {
					id: rule.id,
					agreementId: rule.AgreementId,
					inputPlatformString: rule.input ?? '',
					inputId: rule.inputRef,
					definition: rule.definition,
					outputPlatformString: rule.output ?? '',
					outputId: rule.outputRef,
					description: rule.description,
					abridgedDescription: rule.abridgedDescription,
					webhookUrl: rule.webhookUrl ?? '',
					webhookPrivateKey: rule.webhookSecret ?? ''
				}

				newRules.push(newRule)
			})
		}

		const rulesToJson = JSON.stringify(newRules)
		if (rulesToJson !== previousRulesDataString) {
			setRules(newRules)
			setPreviousRulesDataString(rulesToJson)
		}
	}, [previousRulesDataString, rulesData])

	useEffect(() => {
		if (communitiesData) {
			const data: any = []

			const currentAgSlug = router.query.slug?.toString() ?? ''
			communitiesData.Agreements.forEach(ag => {
				data.push({ value: ag.slug, label: ag.name })
				if (ag.slug === currentAgSlug) {
					setCommunity(ag.slug)
				}
			})

			data.push({ value: 'create-new', label: '+ Create New Community' })

			log.debug(JSON.stringify(data))

			const commsToJson = JSON.stringify(data)
			if (commsToJson !== previousCommunitiesDataString) {
				setCommunities(data)
				setPreviousCommunitiesDataString(commsToJson)
			}
		}
	}, [communitiesData, previousCommunitiesDataString, router.query.slug])

	return (
		<>
			{isLoadingAgreement && (
				<Container>
					<Space h={120} />
					<Center>
						<Loader color="cyan" variant="oval" />
					</Center>
				</Container>
			)}
			{!isLoadingAgreement && !agreement?.name && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>
							Sorry, either this community does not exist or you
							do not have permission to view this page.
						</Text>
					</Center>
				</Container>
			)}

			{!isLoadingAgreement && agreement?.name && (
				<>
					<MediaQuery largerThan="sm" styles={{ display: 'none' }}>
						<Burger
							style={{ marginLeft: 24, marginTop: 24 }}
							opened={mobileNavBarVisible}
							onClick={() => setMobileNavBarVisible(o => !o)}
							size="sm"
							mr="xl"
						/>
					</MediaQuery>
					<div className={meemTheme.pagePanelLayoutContainer}>
						<Navbar
							className={meemTheme.pagePanelLayoutNavBar}
							width={{ base: 288 }}
							height={400}
							style={{ zIndex: 0 }}
							hidden={!mobileNavBarVisible}
							hiddenBreakpoint={'sm'}
							withBorder={false}
							p="xs"
						>
							<div style={{ padding: 16 }}>
								<Select
									placeholder={community ?? ''}
									size="lg"
									value={community}
									data={communities}
									onChange={value => {
										if (value) {
											if (value === 'create-new') {
												// TODO: Create new community
											} else {
												router.push(`/${value}`)
											}
										}
									}}
								/>
								<Space h={24} />
								<Divider />
								<Space h={24} />
								<NavLink
									className={meemTheme.pagePanelLayoutNavItem}
									active={currentTab === Tab.Flows}
									label={'Flows'}
									icon={<Wand />}
									onClick={() => {
										setCurrentTab(Tab.Flows)
										router.push(
											`/${agreement.slug}?tab=flows`,
											undefined,
											{ shallow: true }
										)
										setMobileNavBarVisible(false)
									}}
								/>

								<NavLink
									className={meemTheme.pagePanelLayoutNavItem}
									active={currentTab === Tab.Accounts}
									label={'Connected Accounts'}
									icon={<AccessPoint />}
									onClick={() => {
										setCurrentTab(Tab.Accounts)
										router.push(
											`/${agreement.slug}?tab=accounts`,
											undefined,
											{ shallow: true }
										)
										setMobileNavBarVisible(false)
									}}
								/>

								<NavLink
									className={meemTheme.pagePanelLayoutNavItem}
									active={currentTab === Tab.Roles}
									icon={<MoodSmile />}
									label={'Roles'}
									onClick={() => {
										setCurrentTab(Tab.Roles)
										router.push(
											`/${agreement.slug}?tab=roles`,
											undefined,
											{ shallow: true }
										)
										setMobileNavBarVisible(false)
									}}
								/>

								<NavLink
									className={meemTheme.pagePanelLayoutNavItem}
									active={currentTab === Tab.Airdrops}
									label={'Airdrops'}
									icon={<Send />}
									onClick={() => {
										setCurrentTab(Tab.Airdrops)
										router.push(
											`/${agreement.slug}?tab=airdrops`,
											undefined,
											{ shallow: true }
										)
										setMobileNavBarVisible(false)
									}}
								/>

								<NavLink
									className={meemTheme.pagePanelLayoutNavItem}
									active={currentTab === Tab.Details}
									label={'Community Details'}
									icon={<Notes />}
									onClick={() => {
										setCurrentTab(Tab.Details)
										router.push(
											`/${agreement.slug}?tab=details`,
											undefined,
											{ shallow: true }
										)
										setMobileNavBarVisible(false)
									}}
								/>
							</div>
						</Navbar>
						{!mobileNavBarVisible && (
							<div className={meemTheme.pagePanelLayoutContent}>
								{currentTab === Tab.Flows && (
									<DashboardFlows
										rules={rules ?? []}
										communityTweetsConnections={
											communityTweetsConnections
										}
									/>
								)}
								{currentTab === Tab.Accounts && (
									<DashboardAccounts
										communityTweetsConnections={
											communityTweetsConnections
										}
										isFetchingDiscordConnections={
											isFetchingDiscordConnections
										}
										isFetchingSlackConnections={
											isFetchingSlackConnections
										}
										isFetchingTwitterConnections={
											isFetchingTwitterConnections
										}
										isFetchingConnections={
											isFetchingConnections
										}
									/>
								)}
								{currentTab === Tab.Roles && <DashboardRoles />}
								{currentTab === Tab.Airdrops && (
									<DashboardAirdrops />
								)}
								{currentTab === Tab.Details && (
									<DashboardDetails />
								)}
							</div>
						)}
					</div>
				</>
			)}
		</>
	)
}