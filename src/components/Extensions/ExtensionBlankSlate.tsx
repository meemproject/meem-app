import { Text, Space, Container, Loader, Center, Button } from '@mantine/core'
import { LoginState, useAuth } from '@meemproject/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
// eslint-disable-next-line import/no-extraneous-dependencies
import React, { useEffect } from 'react'
import { AgreementExtensions } from '../../../generated/graphql'
import { Agreement, extensionFromSlug } from '../../model/agreement/agreements'
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

	const { agreement, isLoadingAgreement, error, isMembersOnly } =
		useAgreement()

	const auth = useAuth()

	const router = useRouter()

	const agreementExtension = extensionFromSlug(extensionSlug, agreement)

	useEffect(() => {
		if (
			auth.loginState === LoginState.NotLoggedIn &&
			isMembersOnly &&
			window
		) {
			router.push({
				pathname: '/authenticate',
				query: {
					return: window.location.href
				}
			})
		}
	}, [auth.loginState, isMembersOnly, router])

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
			{!isLoadingAgreement && !error && !agreement?.name && (
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
			{!isLoadingAgreement && error && (
				<Container>
					<Space h={120} />
					<Center>
						<Text>
							There was an error loading this community. Please
							let us know!
						</Text>
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
