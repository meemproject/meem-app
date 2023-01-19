import { Text, Space, Image, Button } from '@mantine/core'
import { useRouter } from 'next/router'
// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react'
import { ArrowLeft, Settings } from 'tabler-icons-react'
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

	const router = useRouter()

	const navigateToAgreementHome = () => {
		router.push({
			pathname: `/${agreement?.slug}`
		})
	}

	const navigateToExtensionSettings = () => {
		router.push({
			pathname: `/${agreement?.slug}/e/${extensionSlug}/settings`
		})
	}

	const isSettingsPage =
		(window && window.location.pathname.includes('settings')) ?? false

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
							<a
								onClick={() => {
									if (hasNoWidget) {
										router.push({
											pathname: `/${agreement?.slug}/admin`,
											query: { tab: 'extensions' }
										})
									} else {
										router.push({
											pathname: `/${agreement?.slug}/e/${extensionSlug}`
										})
									}
								}}
							>
								<ArrowLeft
									className={meemTheme.backArrow}
									size={32}
								/>
							</a>
							<Space w={24} />
						</>
					)}

					{agreement?.image && (
						<>
							<Image
								radius={8}
								height={80}
								width={80}
								src={agreement?.image}
							/>
							<Space w={24} />
						</>
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
								src={`/${agreementExtension?.Extension?.icon}`}
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
							<Button
								leftIcon={<Settings />}
								onClick={() => {
									navigateToExtensionSettings()
								}}
								className={meemTheme.buttonWhite}
							>
								Settings
							</Button>
						)}
					<Space w={16} />
					<a
						className={meemTheme.pageHeaderExitButton}
						onClick={navigateToAgreementHome}
					>
						<Image src="/delete.png" width={24} height={24} />
					</a>
				</div>
			</div>
		</>
	)
}
