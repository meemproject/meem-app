import { Text, Space, Container, Loader, Center, Button } from '@mantine/core'
import { LoginState, useAuth } from '@meemproject/react'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { useRouter } from 'next/router'
// eslint-disable-next-line import/no-extraneous-dependencies
import React, { useEffect } from 'react'
import { AgreementExtensions } from '../../../generated/graphql'
import { Agreement, extensionFromSlug } from '../../model/agreement/agreements'
import { CookieKeys } from '../../utils/cookies'
import { useAgreement } from '../AgreementHome/AgreementProvider'
import { useMeemTheme } from '../Styles/MeemTheme'

interface IProps {
	extensionSlug: string
}

export const extensionIsReady = (
	isLoadingAgreement: boolean,
	agreement: Agreement | undefined,
	agreementExtension: AgreementExtensions | undefined
): boolean => {
	const isReady =
		!isLoadingAgreement &&
		agreement?.name !== undefined &&
		agreementExtension &&
		agreementExtension?.isInitialized
	return isReady ?? false
}

export const ExtensionBlankSlate: React.FC<IProps> = ({ extensionSlug }) => {
	const { classes: meemTheme } = useMeemTheme()

	const { agreement, isLoadingAgreement, isMembersOnly } = useAgreement()

	const auth = useAuth()

	const router = useRouter()

	const agreementExtension = extensionFromSlug(extensionSlug, agreement)

	useEffect(() => {
		if (
			auth.loginState === LoginState.NotLoggedIn &&
			isMembersOnly &&
			window
		) {
			Cookies.set(CookieKeys.authRedirectUrl, window.location.toString())
			router.push('/authenticate')
		}
	}, [agreement?.slug, auth.loginState, isMembersOnly, router])

	return (
		<>
			{isLoadingAgreement && (
				<Container>
					<Space h={16} />
					<Center>
						<Loader color="cyan" variant="oval" />
					</Center>
				</Container>
			)}

			{!isLoadingAgreement && agreement?.name && !agreementExtension && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>
							This extension is not enabled for this club.
						</Text>
					</Center>
					{(agreement.isCurrentUserAgreementOwner ||
						agreement.isCurrentUserAgreementAdmin) && (
						<>
							<Space h={24} />{' '}
							<Center>
								<Link
									href={`/${agreement.slug}/admin?tab=extensions`}
									legacyBehavior
								>
									<Button className={meemTheme.buttonGrey}>
										Enable this extension
									</Button>
								</Link>
							</Center>
						</>
					)}
				</Container>
			)}
			{!isLoadingAgreement &&
				agreement?.name &&
				agreementExtension &&
				!agreementExtension.isInitialized && (
					<Container>
						<Space h={120} />
						<Center>
							<Text>
								{`${agreementExtension.Extension?.name} is being set up. Please wait...`}
							</Text>
						</Center>
						<Space h={24} />
						<Center>
							<Loader variant="oval" color="cyan" />
						</Center>
					</Container>
				)}
		</>
	)
}
