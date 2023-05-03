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
import { useMeemTheme } from '../Styles/MeemTheme'

export function OnboardingConnectAccount() {
	const router = useRouter()

	const { classes: meemTheme } = useMeemTheme()

	const wallet = useWallet()

	const authIfNecessary = () => {
		Cookies.set(CookieKeys.authRedirectUrl, window.location.toString())
		router.push('/authenticate')
	}

	const { agreement, isLoadingAgreement, error } = useAgreement()

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
					<Container>
						<Space h={64} />
						<Center>
							<Text className={meemTheme.tLargeBold}>
								Please connect at least one account below.
							</Text>
						</Center>
						<Space h={24} />
						<Center>
							<Text className={meemTheme.tSmall}>
								You’ll be able to connect additional accounts
								later.
							</Text>
						</Center>
						<Space h={24} />

						<Space h={48} />
						<Center>
							<Button
								size={'lg'}
								onClick={() => {
									if (
										!wallet.isConnected ||
										isJwtError(error)
									) {
										authIfNecessary()
										return
									}
									router.push(`/${agreement?.slug}`)
								}}
								className={meemTheme.buttonBlack}
							>
								Next
							</Button>
						</Center>
						<Space h={128} />
					</Container>
				</>
			)}
		</div>
	)
}
