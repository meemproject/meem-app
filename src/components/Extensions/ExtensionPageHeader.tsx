import {
	Text,
	Space,
	Image,
	Button,
	useMantineColorScheme
} from '@mantine/core'
import { ArrowLeft, DeleteCircle, Settings } from 'iconoir-react'
import Link from 'next/link'
// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react'
import { extensionFromSlug } from '../../model/agreement/agreements'
import { useAgreement } from '../AgreementHome/AgreementProvider'
import { useMeemTheme } from '../Styles/MeemTheme'

interface IProps {
	extensionSlug: string
	isSubPage?: boolean
}

export const ExtensionPageHeader: React.FC<IProps> = ({
	extensionSlug,
	isSubPage
}) => {
	const { classes: meemTheme } = useMeemTheme()

	const { agreement } = useAgreement()

	const agreementExtension = extensionFromSlug(extensionSlug, agreement)

	const isSettingsPage =
		(window && window.location.pathname.includes('settings')) ?? false

	const { colorScheme } = useMantineColorScheme()
	const isDarkTheme = colorScheme === 'dark'

	// Hide the back arrow for extensions with no widgets - presumably they
	// have no homepage either (i.e. are link extensions)
	const hasNoWidget =
		agreement &&
		agreementExtension &&
		agreementExtension.AgreementExtensionWidgets.length === 0

	return (
		<>
			<div className={meemTheme.pageHeader}>
				<div className={meemTheme.spacedRowCentered}>
					{(hasNoWidget || isSettingsPage || isSubPage) && (
						<>
							<Link
								href={
									hasNoWidget
										? `/${agreement?.slug}/admin?tab=extensions`
										: `/${agreement?.slug}/e/${extensionSlug}`
								}
								legacyBehavior
								passHref
							>
								<a className={meemTheme.unstyledLink}>
									<div>
										<ArrowLeft
											className={meemTheme.backArrow}
											width={32}
											height={32}
										/>
									</div>
								</a>
							</Link>
							<Space w={24} />
						</>
					)}

					{agreement?.image && (
						<Link
							href={`/${agreement?.slug}`}
							legacyBehavior
							passHref
						>
							<a className={meemTheme.unstyledLink}>
								<div className={meemTheme.row}>
									<Image
										style={{ cursor: 'pointer' }}
										radius={8}
										height={80}
										width={80}
										src={agreement?.image}
									/>
									<Space w={24} />
								</div>
							</a>
						</Link>
					)}
					{/* <Text className={classes.headerAgreementName}>{agreementName}</Text> */}
					<div className={meemTheme.pageHeaderTitleContainer}>
						<Text className={meemTheme.tLargeBold}>
							{agreement?.name}
						</Text>
						<Space h={8} />
						<div className={meemTheme.centeredRow}>
							<Image
								className={meemTheme.copyIcon}
								src={`/${
									isDarkTheme
										? `${(
												agreementExtension?.Extension
													?.icon ?? ''
										  ).replace('.png', '-white.png')}`
										: agreementExtension?.Extension?.icon
								}`}
								width={16}
							/>
							<Space w={8} />
							<Text className={meemTheme.tMedium}>{`${
								agreementExtension?.Extension?.name
							} ${
								isSettingsPage
									? ' Settings'
									: hasNoWidget
									? ' Settings'
									: ''
							}`}</Text>
						</div>
					</div>
				</div>
				<div className={meemTheme.centeredRow}>
					{!isSettingsPage &&
						!hasNoWidget &&
						(agreement?.isCurrentUserAgreementAdmin ||
							agreement?.isCurrentUserAgreementOwner) && (
							<Link
								href={`/${agreement?.slug}/e/${extensionSlug}/settings`}
								legacyBehavior
								passHref
							>
								<a className={meemTheme.unstyledLink}>
									<Button
										leftIcon={<Settings />}
										className={meemTheme.buttonWhite}
									>
										Settings
									</Button>
								</a>
							</Link>
						)}
					<Space w={16} />
					<div className={meemTheme.pageHeaderExitButton}>
						<Link
							href={`/${agreement?.slug}`}
							legacyBehavior
							passHref
						>
							<a className={meemTheme.unstyledLink}>
								<DeleteCircle width={24} height={24} />
							</a>
						</Link>
					</div>
				</div>
			</div>
		</>
	)
}
