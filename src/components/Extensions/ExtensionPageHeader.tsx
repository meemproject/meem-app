import { Text, Space, Image, useMantineColorScheme } from '@mantine/core'
import { ArrowLeft, DeleteCircle } from 'iconoir-react'
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

	const { colorScheme } = useMantineColorScheme()
	const isDarkTheme = colorScheme === 'dark'

	return (
		<>
			<div className={meemTheme.pageHeader}>
				<div className={meemTheme.spacedRowCentered}>
					{isSubPage && (
						<>
							<Link
								href={`/${agreement?.slug}/e/${extensionSlug}`}
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
							<Text
								className={meemTheme.tMedium}
							>{`${agreementExtension?.Extension?.name}`}</Text>
						</div>
					</div>
				</div>
				<div className={meemTheme.centeredRow}>
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
