/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { Text, Center, Space, Divider, Container, Image } from '@mantine/core'
// eslint-disable-next-line import/no-extraneous-dependencies
import Link from 'next/link'
import React from 'react'
import { useAgreement } from '../Providers/AgreementProvider'
import {
	colorLightYellow,
	colorYellow,
	useMeemTheme
} from '../Styles/MeemTheme'

interface IProps {
	noAgreement: boolean
}

export const MeemFooter: React.FC<IProps> = ({ noAgreement }) => {
	const { classes: meemTheme } = useMeemTheme()

	const { agreement } = useAgreement()

	return (
		<div>
			{(agreement || noAgreement) && (
				<>
					<div className={meemTheme.pageFooterContainer}>
						<Divider />
						<div className={meemTheme.pageFooterBackground}>
							<Space h={40} />

							<Container>
								<div
									className={meemTheme.rowResponsive}
									style={{
										justifyContent: 'space-evenly'
									}}
								>
									<div style={{ maxWidth: 300 }}>
										<Image
											src={'/meem-logo-white.svg'}
											width={200}
										/>
										<Space h={16} />
										<Text
											className={meemTheme.tExtraSmall}
											style={{ color: 'white' }}
										>
											Meem is a (co-)operating system for
											community apps. We’re helping
											communities work together to craft
											their own tools.
										</Text>
										<Space h={24} />
										<Text
											className={meemTheme.tExtraSmall}
											style={{ color: 'white' }}
										>
											Meem 2023 ©
										</Text>
										<Space h={4} />
										<div className={meemTheme.row}>
											<Link
												href={
													'https://build.meem.wtf/terms-of-use'
												}
												target="_blank"
												rel="noreferrer noopener"
											>
												<Text
													className={
														meemTheme.tExtraSmall
													}
													style={{
														color: 'white',
														cursor: 'pointer'
													}}
												>
													Terms of Use
												</Text>
											</Link>
											<Space w={8} />
											<Text
												className={
													meemTheme.tExtraSmall
												}
												style={{
													color: 'white'
												}}
											>
												|
											</Text>
											<Space w={8} />
											<Link
												href={
													'https://build.meem.wtf/privacy-policy'
												}
												target="_blank"
												rel="noreferrer noopener"
											>
												<Text
													className={
														meemTheme.tExtraSmall
													}
													style={{
														color: 'white',
														cursor: 'pointer'
													}}
												>
													Privacy Policy
												</Text>
											</Link>
										</div>
									</div>
									<Space h={24} />
									<div>
										<Text
											className={
												meemTheme.tExtraSmallLabel
											}
											style={{ color: colorYellow }}
										>
											CONNECT
										</Text>
										<Link
											href={
												'https://discord.gg/jX59uYvNbw'
											}
											target="_blank"
											rel="noreferrer noopener"
										>
											<Text
												className={
													meemTheme.tExtraSmall
												}
												style={{
													color: colorYellow,
													cursor: 'pointer',
													marginTop: 8
												}}
											>
												Discord
											</Text>
										</Link>
										<Link
											href={'https://twitter.com/0xmeem'}
											target="_blank"
											rel="noreferrer noopener"
										>
											<Text
												className={
													meemTheme.tExtraSmall
												}
												style={{
													color: colorYellow,
													cursor: 'pointer',
													marginTop: 8
												}}
											>
												Twitter
											</Text>
										</Link>
										<Link
											href={'https://support.meem.wtf/'}
											target="_blank"
											rel="noreferrer noopener"
										>
											<Text
												className={
													meemTheme.tExtraSmall
												}
												style={{
													color: colorYellow,
													cursor: 'pointer',
													marginTop: 8
												}}
											>
												Get Help
											</Text>
										</Link>
									</div>
									<Space h={24} />

									<div>
										<Text
											className={
												meemTheme.tExtraSmallLabel
											}
											style={{ color: colorYellow }}
										>
											COLLABORATE
										</Text>
										<Link
											href={
												'https://docs.meem.wtf/meem-protocol/'
											}
											target="_blank"
											rel="noreferrer noopener"
										>
											<Text
												className={
													meemTheme.tExtraSmall
												}
												style={{
													color: colorYellow,
													cursor: 'pointer',
													marginTop: 8
												}}
											>
												Dev Docs
											</Text>
										</Link>
										<Link
											href={
												'https://zora.co/collections/0x51518bc3fbd8868e25511b0d3e0754e8bd400f7f'
											}
											target="_blank"
											rel="noreferrer noopener"
										>
											<Text
												className={
													meemTheme.tExtraSmall
												}
												style={{
													color: colorYellow,
													cursor: 'pointer',
													marginTop: 8
												}}
											>
												Meem Drops
											</Text>
										</Link>
										<Link
											href={
												'https://form.typeform.com/to/TyeFu5om'
											}
											target="_blank"
											rel="noreferrer noopener"
										>
											<Text
												className={
													meemTheme.tExtraSmall
												}
												style={{
													color: colorYellow,
													cursor: 'pointer',
													marginTop: 8
												}}
											>
												Build With Us
											</Text>
										</Link>
									</div>
								</div>
							</Container>
							<Space h={48} />
						</div>
					</div>
				</>
			)}
		</div>
	)
}
