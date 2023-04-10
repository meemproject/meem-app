import { Center, Image, Container, Space, Text, Button } from '@mantine/core'
import { DeleteCircle } from 'iconoir-react'
import Link from 'next/link'
import React from 'react'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import { colorAshLight, colorWhite, useMeemTheme } from '../../Styles/MeemTheme'
import { CommunityTweetsExtension } from './CommunityTweetsExtension'

export enum SelectedConnection {
	ConnectionDiscord = 'discord',
	ConnectionTwitter = 'twitter',
	ConnectionSlack = 'slack'
}

export const CTExtensionOnboarding: React.FC = () => {
	// General params
	const { classes: meemTheme } = useMeemTheme()
	const { agreement } = useAgreement()

	const pageHeader = (
		<>
			<div
				className={meemTheme.pageHeaderExtension}
				style={{ paddingLeft: 24, paddingRight: 24 }}
			>
				<Center>
					<div>
						<Image
							className={meemTheme.copyIcon}
							src={`/ext-ct.png`}
							fit={'contain'}
							width={240}
							height={60}
						/>
					</div>
				</Center>

				<Link href={`/${agreement?.slug}`} legacyBehavior passHref>
					<a className={meemTheme.unstyledLink}>
						<DeleteCircle
							className={meemTheme.clickable}
							width={24}
							height={24}
							color={colorWhite}
						/>
					</a>
				</Link>
			</div>
		</>
	)

	return (
		<div>
			{pageHeader}
			<Container>
				<CommunityTweetsExtension />
			</Container>
			<Space h={64} />

			<div style={{ backgroundColor: colorAshLight }}>
				<Space h={64} />
				<Center>
					<Text className={meemTheme.tMediumBold}>
						Community Tweets is just the beginning!
					</Text>
				</Center>
				<Space h={16} />
				<Center>
					<Text>
						See what other products are in the works or kick off
						something new.
					</Text>
				</Center>
				<Space h={40} />
				<Center>
					<Link href={`/meem`} legacyBehavior passHref>
						<a className={meemTheme.unstyledLink}>
							<div>
								<Button
									className={meemTheme.buttonBlack}
								>{`View Meem's Roadmap`}</Button>
							</div>
						</a>
					</Link>
				</Center>
				<Space h={64} />
			</div>
		</div>
	)
}
