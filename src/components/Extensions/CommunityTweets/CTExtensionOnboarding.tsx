import { Space, Center, Image, Container } from '@mantine/core'
import { DeleteCircle } from 'iconoir-react'
import Link from 'next/link'
import React from 'react'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import { colorWhite, useMeemTheme } from '../../Styles/MeemTheme'
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
						<Space h={8} />

						<Image
							className={meemTheme.copyIcon}
							src={`/ext-communityTweets.png`}
							fit={'contain'}
							width={180}
							height={40}
						/>

						<Space h={8} />
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
		</div>
	)
}
