import {
	Center,
	Space,
	Text,
	Image,
	Badge,
	useMantineColorScheme
} from '@mantine/core'
import { DateTime } from 'luxon'
import Link from 'next/link'
import React from 'react'
import { ChevronDown, ChevronUp, Message, Share } from 'tabler-icons-react'
import { DiscussionPost } from '../../../model/agreement/extensions/discussion/discussionPost'
import { quickTruncate } from '../../../utils/truncated_wallet'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import { colorDarkerGrey, useMeemTheme } from '../../Styles/AgreementsTheme'
interface IProps {
	post: DiscussionPost
}

export const DiscussionPostPreview: React.FC<IProps> = ({ post }) => {
	const { classes: meemTheme } = useMeemTheme()
	const { agreement } = useAgreement()

	const { colorScheme } = useMantineColorScheme()
	const isDarkTheme = colorScheme === 'dark'

	return (
		<div className={meemTheme.greyContentBox} style={{ marginBottom: 16 }}>
			<Link href={`/${agreement?.slug}/e/discussion/${post.id}`}>
				<a>
					<div className={meemTheme.row}>
						<div>
							<Center>
								<ChevronUp />
							</Center>

							<Space h={16} />
							<Center>{post.votes ?? 0}</Center>
							<Space h={16} />
							<Center>
								<ChevronDown />
							</Center>
						</div>
						<Space w={16} />
						<div style={{ width: '100%' }}>
							<div className={meemTheme.row}>
								{post.attachment && (
									<>
										<Image
											src={post.attachment}
											height={80}
											width={80}
											radius={4}
										/>
										<Space w={12} />
									</>
								)}
								<div>
									<Text className={meemTheme.tSmallBold}>
										{post.title}
									</Text>
									<Space h={8} />
									<Text
										className={meemTheme.tExtraSmall}
										dangerouslySetInnerHTML={{
											// TODO: Sanitize html. Possible XSS vulnerability
											__html: post.body
										}}
									/>
									<Space h={12} />
									{post.tags && (
										<>
											{post.tags.map(tag => (
												<Badge
													style={{ marginRight: 4 }}
													key={tag}
													size={'xs'}
													gradient={{
														from: isDarkTheme
															? colorDarkerGrey
															: '#DCDCDC',
														to: isDarkTheme
															? colorDarkerGrey
															: '#DCDCDC',
														deg: 35
													}}
													classNames={{
														inner: meemTheme.tBadgeTextSmall
													}}
													variant={'gradient'}
												>
													{tag}
												</Badge>
											))}
										</>
									)}
								</div>
							</div>

							<Space h={20} />
							<div className={meemTheme.spacedRowCentered}>
								<div className={meemTheme.centeredRow}>
									<Image
										src={
											post.profilePicUrl ??
											`/exampleagreement.png`
										}
										height={32}
										width={32}
										radius={16}
									/>
									<Space w={8} />
									<div>
										<Text
											className={
												meemTheme.tExtraSmallBold
											}
										>
											{post.displayName ??
												quickTruncate(
													post.walletAddress
												)}
										</Text>
										<Text
											className={
												meemTheme.tExtraExtraSmall
											}
										>
											{DateTime.fromSeconds(
												post.createdAt
											).toRelative()}
										</Text>
									</div>
								</div>
								<div
									className={meemTheme.row}
									style={{ marginTop: 16 }}
								>
									<Link
										href={`/${post.agreementSlug}/e/discussion/post1`}
									>
										<div
											className={meemTheme.centeredRow}
											style={{ cursor: 'pointer' }}
										>
											<Message width={20} height={20} />
											<Space w={4} />
											<Text
												className={
													meemTheme.tExtraSmall
												}
											>
												14
											</Text>
										</div>
									</Link>
									<Space w={16} />
									<div
										className={meemTheme.centeredRow}
										style={{ cursor: 'pointer' }}
									>
										<Share width={20} height={20} />
										<Space w={4} />
										<Text className={meemTheme.tExtraSmall}>
											Share
										</Text>
									</div>
									<Space w={16} />
								</div>
							</div>
						</div>
					</div>
				</a>
			</Link>
		</div>
	)
}
