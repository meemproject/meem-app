import log from '@kengoldfarb/log'
import { Text, Space, Loader, Center, Button } from '@mantine/core'
import { useMeemUser, useWallet } from '@meemproject/react'
import { BigNumber } from 'ethers'
import { CheckCircle, DeleteCircle, Settings } from 'iconoir-react'
import Linkify from 'linkify-react'
import Link from 'next/link'
import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import {
	Agreement,
	MembershipReqType
} from '../../../model/agreement/agreements'
import { tokenFromContractAddress } from '../../../model/token/token'
import {
	colorGreen,
	colorBlue,
	useMeemTheme,
	colorRed
} from '../../Styles/MeemTheme'
interface IProps {
	agreement: Agreement
	onMeetsAllReqsChanged: (changed: boolean) => void
	onRequirementsChecked: (checked: boolean) => void
}

interface RequirementString {
	requirementComponent: ReactNode
	requirementKey: string
	meetsRequirement: boolean
}

export const AgreementRequirementsWidget: React.FC<IProps> = ({
	agreement,
	onMeetsAllReqsChanged,
	onRequirementsChecked
}) => {
	const { classes: meemTheme } = useMeemTheme()
	const wallet = useWallet()
	const user = useMeemUser()

	const [parsedRequirements, setParsedRequirements] = useState<
		RequirementString[]
	>([])
	const [areRequirementsParsed, setRequirementsParsed] = useState(false)

	const checkEligibility = useCallback(
		(
			reqs: RequirementString[],
			isCurrentUserAgreementAdmin: boolean,
			slotsLeft: number
		) => {
			onRequirementsChecked(true)

			if (reqs.length === 0 || isCurrentUserAgreementAdmin) {
				onMeetsAllReqsChanged(true)
			} else {
				let reqsMet = 0
				reqs.forEach(req => {
					if (req.meetsRequirement) {
						reqsMet++
					}
				})
				log.debug(`reqs met = ${reqsMet}`)
				log.debug(`total reqs = ${reqs.length}`)
				log.debug(`slots left = ${slotsLeft}`)
				if (
					reqsMet === reqs.length &&
					(slotsLeft === -1 || slotsLeft > 0)
				) {
					onMeetsAllReqsChanged(true)
				}
			}
		},
		[onMeetsAllReqsChanged, onRequirementsChecked]
	)

	const parseRequirements = useCallback(
		async (possibleAgreement: Agreement) => {
			if (areRequirementsParsed || !possibleAgreement) {
				return
			}

			const reqs: RequirementString[] = []
			let index = 0

			if (
				possibleAgreement.membershipSettings &&
				possibleAgreement.membershipSettings.requirements
			) {
				// eslint-disable-next-line no-unsafe-optional-chaining
				for await (const req of possibleAgreement.membershipSettings
					?.requirements) {
					index++

					let tokenBalance = BigNumber.from(0)
					let tokenUrl = ''
					let tokenName = 'Unknown Token'
					if (
						wallet.web3Provider &&
						wallet.signer &&
						req.type === MembershipReqType.TokenHolders
					) {
						const token = await tokenFromContractAddress(
							req.tokenContractAddress,
							wallet
						)
						if (token) {
							log.debug(`token ${JSON.stringify(token)}`)
							tokenBalance = token.balance
							tokenUrl = token.url
							tokenName = token.name
						} else {
							log.debug(`no token found`)
						}
					}

					switch (req.type) {
						case MembershipReqType.None:
							reqs.push({
								requirementKey: `Anyone${index}`,
								requirementComponent: (
									<Text className={meemTheme.tExtraSmall}>
										Anyone can join this community.
									</Text>
								),
								meetsRequirement: true
							})
							break
						case MembershipReqType.ApprovedApplicants:
							reqs.push({
								requirementKey: `Applicants${index}`,
								requirementComponent: (
									<div
										style={{
											display: 'flex',
											flexDirection: 'column'
										}}
									>
										<Text className={meemTheme.tExtraSmall}>
											Membership is available to approved
											applicants.
											{!req.applicationInstructions && (
												<span>
													{' '}
													Contact a Community
													Administrator for
													instructions.
												</span>
											)}
										</Text>
										{req.applicationInstructions && (
											<>
												<Space h={16} />
												<Text
													className={
														meemTheme.tExtraSmallBold
													}
												>
													Follow these instructions to
													apply:
												</Text>
												<Space h={8} />
												<Text
													className={
														meemTheme.tLinkified
													}
												>
													<Space h={4} />
													<Linkify>
														{`${req.applicationInstructions}`}
													</Linkify>
												</Text>
												<Space h={8} />
											</>
										)}
									</div>
								),

								meetsRequirement: wallet.isConnected
									? req.approvedAddresses.includes(
											wallet.accounts[0]
									  )
									: false
							})
							break

						case MembershipReqType.TokenHolders:
							reqs.push({
								requirementKey: `Token${index}`,
								requirementComponent: (
									<Text className={meemTheme.tExtraSmall}>
										Members must hold {req.tokenMinQuantity}{' '}
										<a
											className={meemTheme.tLink}
											href={tokenUrl}
											target={'_blank'}
											rel="noreferrer"
										>
											{tokenName}
										</a>
										.
									</Text>
								),
								meetsRequirement:
									tokenBalance > BigNumber.from(0)
							})
							break
						case MembershipReqType.OtherAgreementMember:
							reqs.push({
								requirementKey: `OtherAgreement${index}`,
								requirementComponent: (
									<Text className={meemTheme.tExtraSmall}>
										Members must also be a member of{' '}
										<a
											className={meemTheme.tLink}
											href="/agreement"
										>
											{req.otherAgreementName}
										</a>
									</Text>
								),
								meetsRequirement: true
							})
							break
					}

					//log.debug(`parse requirement ${index} at ${Date.now()}`)
				}
			}

			log.debug('set parsed reqs')
			if (reqs.length === 0) {
				reqs.push({
					requirementKey: `Error${index}`,
					requirementComponent: (
						<Text className={meemTheme.tExtraSmall}>
							Anyone can join this community for free.
						</Text>
					),
					meetsRequirement: true
				})
			}

			// If mint start or end are valid,
			// determine whether the user falls within the date range.
			if (possibleAgreement.membershipSettings) {
				const mintStart =
					possibleAgreement.membershipSettings.membershipStartDate
				const mintEnd =
					possibleAgreement.membershipSettings.membershipEndDate

				const isAfterMintStart =
					Date.now() > (mintStart ? new Date(mintStart).getTime() : 0)
				const isBeforeMintEnd =
					Date.now() <
					(mintEnd ? new Date(mintEnd).getTime() : 200000000000000)

				let mintDatesText = 'Membership is available now'
				const mintStartString = mintStart
					? `${new Date(mintStart).toDateString()} at ${new Date(
							mintStart
					  ).getHours()}:${
							new Date(mintStart).getMinutes() > 9
								? new Date(mintStart).getMinutes()
								: `0${new Date(mintStart).getMinutes()}`
					  }`
					: ''

				const mintEndString = mintEnd
					? `${new Date(mintEnd).toDateString()} at ${new Date(
							mintEnd
					  ).getHours()}:${
							new Date(mintEnd).getMinutes() > 9
								? new Date(mintEnd).getMinutes()
								: `0${new Date(mintEnd).getMinutes()}`
					  }`
					: ''
				if (mintStart && !mintEnd) {
					if (isAfterMintStart) {
						mintDatesText = `Membership opened ${mintStartString}.`
					} else {
						mintDatesText = `Membership opens ${mintStartString}.`
					}
				} else if (!mintStart && mintEnd) {
					if (isBeforeMintEnd) {
						mintDatesText = `Membership closes ${mintEndString}.`
					} else {
						mintDatesText = `Membership closed ${mintEndString}.`
					}
				} else if (mintStart && mintEnd) {
					log.debug(`mint start = ${mintStart.getTime()}`)
					log.debug(`mint end = ${mintEnd.getTime()}`)

					if (mintStart.getTime() < 1 && mintEnd.getTime() < 1) {
						mintDatesText = 'People may join at any time.'
					} else if (!isAfterMintStart) {
						mintDatesText = `Membership opens ${mintStartString} and closes ${mintEndString}.`
					} else if (isAfterMintStart && isBeforeMintEnd) {
						mintDatesText = `Membership opened ${mintStartString} and closes ${mintEndString}.`
					} else if (!isBeforeMintEnd) {
						mintDatesText = `Membership closed ${mintEndString}.`
					}
				} else if (!mintStart && !mintEnd) {
					mintDatesText = 'People may join at any time.'
				}

				reqs.push({
					requirementKey: `mintDates${index}`,
					requirementComponent: (
						<Text className={meemTheme.tExtraSmall}>
							{mintDatesText}
						</Text>
					),
					meetsRequirement:
						(isAfterMintStart && isBeforeMintEnd) ||
						(mintStart &&
							mintEnd &&
							mintStart.getTime() === 0 &&
							mintEnd.getTime() === 0) ||
						false
				})
			}

			setParsedRequirements(reqs)
			checkEligibility(
				reqs,
				possibleAgreement.isCurrentUserAgreementAdmin ?? false,
				possibleAgreement.slotsLeft ?? -1
			)

			setRequirementsParsed(true)
		},
		[areRequirementsParsed, checkEligibility, meemTheme, wallet]
	)

	useEffect(() => {
		if (agreement && user.user && !user.isLoading && wallet.isConnected) {
			parseRequirements(agreement)
		}
	}, [
		agreement,
		parseRequirements,
		user,
		user.isLoading,
		user.user,
		wallet,
		wallet.isConnected,
		wallet.signer,
		wallet.web3Provider
	])

	return (
		<>
			<div className={meemTheme.widgetAsh}>
				<div className={meemTheme.spacedRowCentered}>
					<Text className={meemTheme.tMediumBold}>Requirements</Text>
					<div className={meemTheme.centeredRow}>
						{agreement.isCurrentUserAgreementAdmin &&
							agreement.isLaunched && (
								<div className={meemTheme.row}>
									<Space w={8} />
									<Link
										href={`/${agreement.slug}/admin?tab=membershiprequirements`}
										legacyBehavior
									>
										<div>
											<Settings
												className={meemTheme.clickable}
											/>
										</div>
									</Link>
								</div>
							)}
					</div>
				</div>

				<Space h={16} />
				{user.user && !areRequirementsParsed && (
					<Loader variant="oval" color={colorBlue} />
				)}
				{!user.user && user.isLoading && (
					<Loader variant="oval" color={colorBlue} />
				)}
				{!user.isLoading && !user.user && (
					<>
						<Text className={meemTheme.tSmall}>
							Connect an account to see membership requirements.
						</Text>
					</>
				)}
				{parsedRequirements.length > 0 && (
					<>
						{parsedRequirements.map(requirement => (
							<div key={requirement.requirementKey}>
								<div
									className={meemTheme.centeredRow}
									style={{ marginTop: 8 }}
								>
									{requirement.meetsRequirement && (
										<CheckCircle
											width={24}
											height={24}
											color={colorGreen}
										/>
									)}
									{!requirement.meetsRequirement && (
										<DeleteCircle
											width={24}
											height={24}
											color={colorRed}
										/>
									)}
									<Space w={12} />
									<Text
										className={meemTheme.tSmall}
										style={{ width: '100%' }}
									>
										{requirement.requirementComponent}
									</Text>
								</div>
								<Space h={8} />
							</div>
						))}
					</>
				)}
				{!agreement.isLaunched && (
					<>
						<Space h={16} />
						<Center>
							<Link
								href={`/${agreement.slug}/admin?tab=membershiprequirements`}
								legacyBehavior
							>
								<Button className={meemTheme.buttonAsh}>
									Edit requirements
								</Button>
							</Link>
						</Center>
					</>
				)}
			</div>
		</>
	)
}
