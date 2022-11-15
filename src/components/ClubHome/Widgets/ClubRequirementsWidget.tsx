import log from '@kengoldfarb/log'
import { Text, Space, Alert, Loader } from '@mantine/core'
import { useWallet } from '@meemproject/react'
import { BigNumber } from 'ethers'
import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import { CircleCheck, CircleMinus, CircleX } from 'tabler-icons-react'
import { Club, MembershipReqType } from '../../../model/club/club'
import { tokenFromContractAddress } from '../../../model/token/token'
import { colorGreen, colorPink, useClubsTheme } from '../../Styles/ClubsTheme'
interface IProps {
	club: Club
}

interface RequirementString {
	requirementComponent: ReactNode
	requirementKey: string
	meetsRequirement: boolean
}

export const ClubRequirementsWidget: React.FC<IProps> = ({ club }) => {
	const { classes: clubsTheme } = useClubsTheme()
	const wallet = useWallet()

	const [parsedRequirements, setParsedRequirements] = useState<
		RequirementString[]
	>([])
	const [areRequirementsParsed, setRequirementsParsed] = useState(false)
	const [doesMeetAllRequirements, setMeetsAllRequirements] = useState(false)

	const checkEligibility = useCallback(
		(
			reqs: RequirementString[],
			isCurrentUserClubAdmin: boolean,
			slotsLeft: number
		) => {
			if (reqs.length === 0 || isCurrentUserClubAdmin) {
				setMeetsAllRequirements(true)
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
					setMeetsAllRequirements(true)
				}
			}
		},
		[]
	)

	const parseRequirements = useCallback(
		async (possibleClub: Club) => {
			if (areRequirementsParsed || !possibleClub) {
				return
			}

			const reqs: RequirementString[] = []
			let index = 0

			if (possibleClub.membershipSettings) {
				await Promise.all(
					possibleClub.membershipSettings?.requirements.map(
						async function (req) {
							index++

							let tokenBalance = BigNumber.from(0)
							let tokenUrl = ''
							let tokenName = 'Unknown Token'
							if (wallet.web3Provider && wallet.signer) {
								const token = await tokenFromContractAddress(
									req.tokenContractAddress,
									wallet
								)
								if (token) {
									tokenBalance = token.balance
									tokenUrl = token.url
									tokenName = token.name
								}
							}

							switch (req.type) {
								case MembershipReqType.None:
									reqs.push({
										requirementKey: `Anyone${index}`,
										requirementComponent: (
											<Text>
												Anyone can join this club.
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
												<Text>
													Membership is available to
													approved applicants.
													{!req.applicationInstructions && (
														<span>
															{' '}
															Contact a Club Admin
															for instructions.
														</span>
													)}
												</Text>
												{req.applicationInstructions && (
													<>
														<Space h={8} />
														<Alert
															title="Follow these
														instructions to
														apply:"
															color="red"
															radius="lg"
														>
															<Text
																style={{
																	color: colorPink
																}}
															>
																<Space h={4} />
																{`${req.applicationInstructions}`}
															</Text>
														</Alert>
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
											<Text>
												Members must hold{' '}
												{req.tokenMinQuantity}{' '}
												<a
													className={clubsTheme.tLink}
													href={tokenUrl}
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
								case MembershipReqType.OtherClubMember:
									reqs.push({
										requirementKey: `OtherClub${index}`,
										requirementComponent: (
											<Text>
												Members must also be a member of{' '}
												<a
													className={clubsTheme.tLink}
													href="/club"
												>
													{req.otherClubName}
												</a>
											</Text>
										),
										meetsRequirement: true
									})
									break
							}
						}
					)
				)
			}

			log.debug('set parsed reqs')
			if (reqs.length === 0) {
				reqs.push({
					requirementKey: `Error${index}`,
					requirementComponent: (
						<Text>Anyone can join this club for free.</Text>
					),
					meetsRequirement: true
				})
			}

			// If mint start or end are valid,
			// determine whether the user falls within the date range.
			if (possibleClub.membershipSettings) {
				const mintStart =
					possibleClub.membershipSettings.membershipStartDate
				const mintEnd =
					possibleClub.membershipSettings.membershipEndDate

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
					requirementComponent: <Text>{mintDatesText}</Text>,
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
				possibleClub.isCurrentUserClubAdmin ?? false,
				possibleClub.slotsLeft ?? -1
			)

			setRequirementsParsed(true)
		},
		[areRequirementsParsed, checkEligibility, clubsTheme.tLink, wallet]
	)

	useEffect(() => {
		if (club.name) {
			parseRequirements(club)
		}
	}, [club, parseRequirements])

	return (
		<>
			<div className={clubsTheme.widgetLight}>
				<Text className={clubsTheme.tLargeBold}>
					Membership Requirements
				</Text>
				<Space h={16} />
				{parsedRequirements.length === 0 && (
					<Loader variant="oval" color={colorPink} />
				)}
				{parsedRequirements.length > 0 && (
					<>
						{parsedRequirements.map(requirement => (
							<div
								key={requirement.requirementComponent?.toString()}
							>
								<div
									className={clubsTheme.centeredRow}
									style={{ marginTop: 8 }}
								>
									{requirement.meetsRequirement && (
										<CircleCheck
											width={24}
											color={colorGreen}
										/>
									)}
									{!requirement.meetsRequirement && (
										<CircleX
											style={{ width: 24 }}
											color={colorPink}
										/>
									)}
									<Space w={12} />
									<Text
										className={clubsTheme.tSmall}
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
			</div>
		</>
	)
}
