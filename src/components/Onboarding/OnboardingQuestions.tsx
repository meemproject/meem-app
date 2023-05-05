import {
	Center,
	Space,
	Text,
	Button,
	Container,
	Loader,
	Chip,
	Group,
	MantineProvider
} from '@mantine/core'
import { useWallet } from '@meemproject/react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { isJwtError } from '../../model/agreement/agreements'
import { CookieKeys } from '../../utils/cookies'
import { useAgreement } from '../Providers/AgreementProvider'
import { useAnalytics } from '../Providers/AnalyticsProvider'
import { colorBlack, useMeemTheme } from '../Styles/MeemTheme'

export enum OnboardingState {
	QuestionOne,
	QuestionTwo
}

export function OnboardingQuestions() {
	const router = useRouter()

	const { classes: meemTheme } = useMeemTheme()

	const wallet = useWallet()

	const analytics = useAnalytics()

	const authIfNecessary = () => {
		Cookies.set(CookieKeys.authRedirectUrl, window.location.toString())
		router.push('/authenticate')
	}

	const [currentState, setCurrentState] = useState<OnboardingState>(
		OnboardingState.QuestionOne
	)

	const { agreement, isLoadingAgreement, error } = useAgreement()

	const [questionOneAnswer, setQuestionOneAnswer] = useState<string[]>([])
	const [questionTwoAnswer, setQuestionTwoAnswer] = useState<
		string | string[]
	>('')

	const questionOneContent = (
		<div>
			<Container>
				<Space h={64} />
				<Center>
					<Text className={meemTheme.tLargeBold} color={colorBlack}>
						What does your community do together?
					</Text>
				</Center>
				<Space h={24} />
				<Center>
					<Text className={meemTheme.tSmall} color={colorBlack}>
						Please select all that apply.
					</Text>
				</Center>
				<Space h={24} />
				<Container>
					<Center>
						<MantineProvider
							theme={{
								primaryColor: 'dark'
							}}
						>
							<Chip.Group
								multiple
								value={questionOneAnswer}
								onChange={setQuestionOneAnswer}
							>
								<Group
									position="center"
									mt="md"
									style={{ maxWidth: 500 }}
								>
									<Chip
										variant={'filled'}
										size={'lg'}
										value="share-media"
									>
										Share and discuss media
									</Chip>
									<Chip
										variant={'filled'}
										size={'lg'}
										value="hang-out-irl"
									>
										Hang out IRL
									</Chip>
									<Chip
										variant={'filled'}
										size={'lg'}
										value="write-newsletter"
									>
										Write a newsletter
									</Chip>
									<Chip
										variant={'filled'}
										size={'lg'}
										value="hang-out-virtually"
									>
										Hang out virtually
									</Chip>
									<Chip
										variant={'filled'}
										size={'lg'}
										value="casual-chats"
									>
										Casual chats
									</Chip>
									<Chip
										variant={'filled'}
										size={'lg'}
										value="experimental-projects"
									>
										Start experimental projects
									</Chip>
									<Chip
										variant={'filled'}
										size={'lg'}
										value="work-remotely"
									>
										Work remotely
									</Chip>
									<Chip
										variant={'filled'}
										size={'lg'}
										value="dao-governance"
									>
										DAO governance
									</Chip>
									<Chip
										variant={'filled'}
										size={'lg'}
										value="manage-treasury"
									>
										Manage a treasury
									</Chip>
									<Chip
										variant={'filled'}
										size={'lg'}
										value="other"
									>
										Something else...
									</Chip>
								</Group>
							</Chip.Group>
						</MantineProvider>
					</Center>
				</Container>
				<Space h={48} />
				<Center>
					<Button
						size={'lg'}
						onClick={() => {
							if (!wallet.isConnected || isJwtError(error)) {
								authIfNecessary()
								return
							}
							setCurrentState(OnboardingState.QuestionTwo)

							analytics.track('Onboarding Question Answered', {
								communityActivities: questionOneAnswer
							})
						}}
						className={meemTheme.buttonBlack}
					>
						Next
					</Button>
				</Center>
				<Space h={16} />
				<Center>
					<Button
						onClick={() => {
							analytics.track('Onboarding Question Skipped', {
								question: 1
							})
							setCurrentState(OnboardingState.QuestionTwo)
						}}
						radius={16}
						variant={'subtle'}
					>
						Skip
					</Button>
				</Center>
				<Space h={128} />
			</Container>
		</div>
	)

	const questionTwoContent = (
		<div>
			<Container>
				<Space h={64} />
				<Center>
					<Text className={meemTheme.tLargeBold} color={colorBlack}>
						How big is your community?
					</Text>
				</Center>
				<Space h={24} />
				<Center>
					<Text className={meemTheme.tSmall} color={colorBlack}>
						Please make one selection
					</Text>
				</Center>
				<Space h={24} />
				<Container>
					<Center>
						<MantineProvider
							theme={{
								primaryColor: 'dark'
							}}
						>
							<Chip.Group
								value={questionTwoAnswer}
								onChange={setQuestionTwoAnswer}
							>
								<Group
									position="center"
									mt="md"
									style={{ maxWidth: 300 }}
								>
									<Chip
										variant={'filled'}
										size={'lg'}
										value="1-10"
									>
										1-10 people
									</Chip>
									<Chip
										variant={'filled'}
										size={'lg'}
										value="10-50"
									>
										10-50 people
									</Chip>
									<Chip
										variant={'filled'}
										size={'lg'}
										value="50-500"
									>
										50-500 people
									</Chip>
									<Chip
										variant={'filled'}
										size={'lg'}
										value="500-5000"
									>
										500-5,000 people
									</Chip>
									<Chip
										variant={'filled'}
										size={'lg'}
										value="5000-plus"
									>
										5,000+ people
									</Chip>
								</Group>
							</Chip.Group>
						</MantineProvider>
					</Center>
				</Container>
				<Space h={48} />
				<Center>
					<Button
						onClick={() => {
							analytics.track('Onboarding Question Answered', {
								communitySize: questionTwoAnswer
							})
							router.push(`/${agreement?.slug}/connect`)
						}}
						size={'lg'}
						className={meemTheme.buttonBlack}
					>
						Next
					</Button>
				</Center>
				<Space h={16} />
				<Center>
					<Button
						onClick={() => {
							analytics.track('Onboarding Question Skipped', {
								question: 2
							})
							router.push(`/${agreement?.slug}/connect`)
						}}
						radius={16}
						variant={'subtle'}
					>
						Skip
					</Button>
				</Center>
				<Space h={128} />
			</Container>
		</div>
	)

	return (
		<div className={meemTheme.backgroundMeem}>
			{isLoadingAgreement && (
				<>
					<Space h={120} />
					<Center>
						<Loader />
					</Center>
					<Space h={256} />
				</>
			)}
			{!isLoadingAgreement && !agreement?.name && (
				<>
					<Space h={120} />
					<Center>
						<Text>
							Sorry, we were unable to find that community. Check
							your spelling and try again.
						</Text>
					</Center>
					<Space h={256} />
				</>
			)}
			{!isLoadingAgreement && agreement && (
				<>
					{currentState === OnboardingState.QuestionOne && (
						<>{questionOneContent}</>
					)}
					{currentState === OnboardingState.QuestionTwo && (
						<>{questionTwoContent}</>
					)}
				</>
			)}
		</div>
	)
}
