import { Text, Button, Space, TextInput } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { Agreement } from '../../../model/agreement/agreements'
import { showErrorNotification } from '../../../utils/notifications'
import { useAgreement } from '../../Providers/AgreementProvider'
import { useMeemTheme } from '../../Styles/MeemTheme'
import { AgreementAdminChangesComponent } from '../ChangesComponents/AgreementAdminChangesModal'

export const DashboardDetails: React.FC = () => {
	const { classes: meemTheme } = useMeemTheme()

	const [agreementName, setAgreementName] = useState('')
	const [agreementDescription, setAgreementDescription] = useState('')
	const [hasLoadedAgreementData, setHasLoadedAgreementData] = useState(false)
	const [isSavingChanges, setIsSavingChanges] = useState(false)

	const { isTransactionInProgress, agreement } = useAgreement()

	useEffect(() => {
		if (!hasLoadedAgreementData) {
			setHasLoadedAgreementData(true)
			setAgreementName(agreement?.name ?? '')
			setAgreementDescription(agreement?.description ?? '')
		}
	}, [agreement, hasLoadedAgreementData])

	const [newAgreementData, setNewAgreementData] = useState<Agreement>()

	const startRequest = () => {
		// Some basic validation
		if (agreementName.length < 3 || agreementName.length > 50) {
			// Agreement name invalid
			setIsSavingChanges(false)
			showErrorNotification(
				'Oops!',
				'You entered an invalid community name. Names must be between 3 and 50 characters.'
			)
			return
		}

		if (
			agreementDescription.length < 3 ||
			agreementDescription.length > 140
		) {
			// Agreement name invalid
			showErrorNotification(
				'Oops!',
				'You entered an invalid community description. Descriptions must be between 3 and 140 characters.'
			)
			return
		}

		// 'save changes' modal for execution agreement settings updates
		// convert current settings and update for the modal
		const oldAgreement = JSON.stringify(agreement)
		const newAgreement = JSON.parse(oldAgreement)
		newAgreement.name = agreementName
		newAgreement.description = agreementDescription
		newAgreement.image = agreement?.image

		setNewAgreementData(newAgreement)
		setIsSavingChanges(true)
	}

	return (
		<div className={meemTheme.fullWidth}>
			<div>
				<Space h={24} />

				<Text className={meemTheme.tLargeBold}>Community Details</Text>

				<Space h={32} />
			</div>

			<Text
				className={meemTheme.tMediumBold}
			>{`What's your community called?`}</Text>
			<Space h={12} />
			<TextInput
				radius="lg"
				size="lg"
				value={agreementName}
				style={{ maxWidth: 800 }}
				onChange={event => setAgreementName(event.currentTarget.value)}
			/>

			<Space h={40} />
			<Button
				className={meemTheme.buttonBlack}
				loading={isSavingChanges || isTransactionInProgress}
				disabled={isSavingChanges || isTransactionInProgress}
				onClick={startRequest}
			>
				Save Changes
			</Button>
			<Space h={32} />
			{/* <Divider />
			<Space h={32} />
			<Text className={meemTheme.tExtraSmallLabel}>DEVELOPER PORTAL</Text>
			<Space h={20} />
			<DeveloperPortalButton
				portalButtonText={`Add more community details`}
				modalTitle={'Add more community details'}
				modalText={`What other key information might communities want to advertise? You can contribute by building on the meem app source code. Look for AdminAgreementDetails.tsx and get coding! Pull Requests are always welcome.`}
				githubLink={`https://github.com/meemproject/meem-app`}
			/> */}
			<Space h={64} />
			<AgreementAdminChangesComponent
				agreement={newAgreementData}
				isRequestInProgress={isSavingChanges}
				onRequestComplete={() => {
					setIsSavingChanges(false)
				}}
			/>
		</div>
	)
}
