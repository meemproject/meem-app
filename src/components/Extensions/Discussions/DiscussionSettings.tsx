/* eslint-disable import/named */
import log from '@kengoldfarb/log'
import {
	Container,
	Text,
	Space,
	Center,
	Button,
	Divider,
	Switch,
	Select,
	SelectItem
} from '@mantine/core'
import { useSDK } from '@meemproject/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { extensionFromSlug } from '../../../model/agreement/agreements'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import { useMeemTheme } from '../../Styles/MeemTheme'
import { ExtensionBlankSlate, extensionIsReady } from '../ExtensionBlankSlate'
import { ExtensionPageHeader } from '../ExtensionPageHeader'

export const DiscussionSettings: React.FC = () => {
	// Default settings
	const router = useRouter()
	const sdk = useSDK()
	const { classes: meemTheme } = useMeemTheme()
	const { agreement, isLoadingAgreement } = useAgreement()
	const agreementExtension = extensionFromSlug('discussions', agreement)
	const [isSavingChanges, setIsSavingChanges] = useState(false)
	const [shouldDisplayDashboardWidget, setShouldDisplayDashboardWidget] =
		useState(false)
	const [isPrivateExtension, setIsPrivateExtension] = useState(false)

	// Discussion-specific settings
	const [shouldShowUpvotesOnWidgetTiles, setShowUpvotesOnWidgetTiles] =
		useState(true)
	const [
		shouldShowCommentCountOnWidgetTiles,
		setShowCommentCountOnWidgetTiles
	] = useState(true)
	const [shouldShowAuthorOnWidgetTiles, setShowAuthorOnWidgetTiles] =
		useState(true)

	// These are role ids
	const [newDiscussionsRole, setNewDiscussionsRole] = useState<string>()
	const [manageExtensionRole, setManageExtensionRole] = useState<string>()
	const [upvoteRole, setUpvoteRole] = useState<string>()
	const [leaveCommentsRole, setLeaveCommentsRole] = useState<string>()

	// Convert roles to Mantine SelectItems
	const [roleSelectItems, setRoleSelectItems] = useState<SelectItem[]>([])
	const [hasSetRoleSelectItems, setHasSetRoleSelectItems] = useState(false)
	useEffect(() => {
		if (
			roleSelectItems?.length === 0 &&
			agreement &&
			agreement.roles &&
			!hasSetRoleSelectItems
		) {
			const items: React.SetStateAction<SelectItem[] | undefined> = []
			agreement.roles.forEach(role => {
				const item: SelectItem = { value: role.id, label: role.name }
				items.push(item)
			})
			setRoleSelectItems(items)
			setHasSetRoleSelectItems(true)
			log.debug(`Set ${items.length} roles as dropdown options`)
		}
	}, [agreement, hasSetRoleSelectItems, roleSelectItems])

	/*
	TODO
	Add your custom extension settings layout here.
	 */
	const customExtensionSettings = () => (
		<>
			<Space h={48} />
			<Text className={meemTheme.tExtraSmallLabel}>CONFIGURE WIDGET</Text>
			<Space h={16} />
			<div>
				<Space h={4} />
				<div className={meemTheme.spacedRowCentered}>
					<Switch
						color={'green'}
						label={'Show upvotes on widget tiles'}
						checked={shouldShowUpvotesOnWidgetTiles}
						onChange={value => {
							if (value) {
								setShowUpvotesOnWidgetTiles(
									value.currentTarget.checked
								)
							}
						}}
					/>
				</div>
				<Space h={16} />
				<Divider />
			</div>
			<div>
				<Space h={4} />
				<div className={meemTheme.spacedRowCentered}>
					<Switch
						color={'green'}
						label={'Show comment count on widget tiles'}
						checked={shouldShowCommentCountOnWidgetTiles}
						onChange={value => {
							if (value) {
								setShowCommentCountOnWidgetTiles(
									value.currentTarget.checked
								)
							}
						}}
					/>
				</div>
				<Space h={16} />
				<Divider />
			</div>
			<div>
				<Space h={4} />
				<div className={meemTheme.spacedRowCentered}>
					<Switch
						color={'green'}
						label={'Show author on widget tiles'}
						checked={shouldShowAuthorOnWidgetTiles}
						onChange={value => {
							if (value) {
								setShowAuthorOnWidgetTiles(
									value.currentTarget.checked
								)
							}
						}}
					/>
				</div>
				<Space h={16} />
				<Divider />
			</div>
			<Space h={16} />
		</>
	)

	/*
	TODO
	Add your custom extension permissions layout here.
	 */
	const customExtensionPermissions = () => (
		<>
			<Space h={12} />

			<Text className={meemTheme.tSmallBold}>
				Who can start new discussions?
			</Text>
			<Space h={8} />
			<Text className={meemTheme.tExtraSmallFaded}>
				Please choose one role.
			</Text>
			<Space h={12} />
			<Select
				radius={8}
				size={'md'}
				data={roleSelectItems}
				value={
					newDiscussionsRole ? newDiscussionsRole : 'agreement-member'
				}
				onChange={(value: string) => {
					setNewDiscussionsRole(value)
				}}
			/>
			<Space h={24} />
			<Text className={meemTheme.tSmallBold}>
				Who can manage extension settings?
			</Text>
			<Space h={8} />
			<Text className={meemTheme.tExtraSmallFaded}>
				Please choose one role.
			</Text>
			<Space h={12} />
			<Select
				radius={8}
				size={'md'}
				data={roleSelectItems}
				value={manageExtensionRole ? manageExtensionRole : 'admin'}
				onChange={(value: string) => {
					setManageExtensionRole(value)
				}}
			/>
			<Space h={24} />
			<Text className={meemTheme.tSmallBold}>
				Who can upvote and downvote?
			</Text>
			<Space h={8} />
			<Text className={meemTheme.tExtraSmallFaded}>
				Please choose one role.
			</Text>
			<Space h={12} />
			<Select
				radius={8}
				size={'md'}
				data={roleSelectItems}
				value={upvoteRole ? upvoteRole : 'agreement-member'}
				onChange={(value: string) => {
					setUpvoteRole(value)
				}}
			/>
			<Space h={24} />
			<Text className={meemTheme.tSmallBold}>
				Who can leave comments?
			</Text>
			<Space h={8} />
			<Text className={meemTheme.tExtraSmallFaded}>
				Please choose one role.
			</Text>
			<Space h={12} />
			<Select
				radius={8}
				size={'md'}
				data={roleSelectItems}
				value={
					leaveCommentsRole ? leaveCommentsRole : 'agreement-member'
				}
				onChange={(value: string) => {
					setLeaveCommentsRole(value)
				}}
			/>
			<Space h={24} />
			<Button
				className={meemTheme.buttonWhite}
				onClick={() => {
					router.push({
						pathname: `/${agreement?.slug}/admin`,
						query: { tab: 'roles' }
					})
				}}
			>
				Manage roles
			</Button>
		</>
	)

	/*
	TODO
	Use this function to save any specific settings you have created for this extension and make any calls you need to external APIs.
	 */
	const saveCustomChanges = async () => {
		await sdk.sdk.agreementExtension.updateAgreementExtension({
			agreementId: agreement?.id ?? '',
			agreementExtensionId: agreementExtension?.id,
			isSetupComplete: true
		})
	}

	/*
	Boilerplate area - please don't edit the below code!
	===============================================================
	 */

	const saveChanges = async () => {
		setIsSavingChanges(true)
		await saveCustomChanges()
		setIsSavingChanges(false)
	}

	return (
		<>
			<ExtensionBlankSlate extensionSlug={'discussions'} />
			{extensionIsReady(
				isLoadingAgreement,
				agreement,
				agreementExtension
			) && (
				<>
					{!agreement?.isCurrentUserAgreementAdmin && (
						<Container>
							<Space h={120} />
							<Center>
								<Text>
									Sorry, you do not have permission to view
									this page. Contact the community owner for
									help.
								</Text>
							</Center>
						</Container>
					)}

					{agreement?.isCurrentUserAgreementAdmin && (
						<div>
							<ExtensionPageHeader
								extensionSlug={'discussions'}
							/>

							<Container>
								<Space h={16} />

								<Text className={meemTheme.tExtraSmallLabel}>
									DISPLAY SETTINGS
								</Text>

								<div>
									<Space h={16} />
									<div
										className={meemTheme.spacedRowCentered}
									>
										<Switch
											color={'green'}
											label={'Display dashboard widget'}
											checked={
												shouldDisplayDashboardWidget
											}
											onChange={value => {
												if (value) {
													setShouldDisplayDashboardWidget(
														value.currentTarget
															.checked
													)
												}
											}}
										/>
									</div>
									<Space h={16} />
									<Divider />
								</div>
								<div>
									<Space h={16} />
									<div
										className={meemTheme.spacedRowCentered}
									>
										<Switch
											color={'green'}
											label={
												'Hide widget if viewer is not a community member'
											}
											checked={isPrivateExtension}
											onChange={value => {
												if (value) {
													setIsPrivateExtension(
														value.currentTarget
															.checked
													)
												}
											}}
										/>
									</div>
									<Space h={16} />
									<Divider />
								</div>

								{customExtensionSettings()}
								<Space h={32} />
								<Text className={meemTheme.tExtraSmallLabel}>
									PERMISSIONS
								</Text>
								<Space h={16} />

								{customExtensionPermissions()}
								<Space h={48} />
								<Button
									disabled={isSavingChanges}
									loading={isSavingChanges}
									onClick={() => {
										saveChanges()
									}}
									className={meemTheme.buttonBlack}
								>
									Save Changes
								</Button>
							</Container>
						</div>
					)}
				</>
			)}
		</>
	)
}
