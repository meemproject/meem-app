import {
	Text,
	Button,
	Textarea,
	Space,
	TextInput,
	Divider
} from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { Agreement } from '../../../model/agreement/agreements'
import { showErrorNotification } from '../../../utils/notifications'
import { useAgreement } from '../../AgreementHome/AgreementProvider'
import { DeveloperPortalButton } from '../../Developer/DeveloperPortalButton'
import { useMeemTheme } from '../../Styles/MeemTheme'
import { AgreementAdminChangesModal } from '../AgreementAdminChangesModal'
interface IProps {
	agreement: Agreement
}

export const AdminAgreementDetails: React.FC<IProps> = ({ agreement }) => {
	const { classes: meemTheme } = useMeemTheme()

	const [agreementName, setAgreementName] = useState('')
	const [agreementDescription, setAgreementDescription] = useState('')
	const [hasLoadedAgreementData, setHasLoadedAgreementData] = useState(false)
	const [isSavingChanges, setIsSavingChanges] = useState(false)

	const { isTransactionInProgress } = useAgreement()

	useEffect(() => {
		if (!hasLoadedAgreementData) {
			setHasLoadedAgreementData(true)
			setAgreementName(agreement.name ?? '')
			setAgreementDescription(agreement.description ?? '')
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
				'You entered an invalid community name. Please choose a longer or shorter name.'
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
				'You entered an invalid community description. Please choose a longer or shorter description.'
			)
			return
		}

		// 'save changes' modal for execution agreement settings updates
		// convert current settings and update for the modal
		const oldAgreement = JSON.stringify(agreement)
		const newAgreement = JSON.parse(oldAgreement)
		newAgreement.name = agreementName
		newAgreement.description = agreementDescription
		newAgreement.image = agreement.image

		setNewAgreementData(newAgreement)
		setIsSavingChanges(true)
	}

	return (
		<div className={meemTheme.fullWidth}>
			<Space h={12} />

			<Text className={meemTheme.tLargeBold}>Community Profile</Text>
			<Space h={32} />

			<Text
				className={meemTheme.tMediumBold}
			>{`What's your community called?`}</Text>
			<Space h={12} />
			<TextInput
				radius="lg"
				size="md"
				value={agreementName}
				style={{ maxWidth: 800 }}
				onChange={event => setAgreementName(event.currentTarget.value)}
			/>
			<Space h={'xl'} />
			<Text className={meemTheme.tMediumBold}>
				In a sentence, describe what your members do together.
			</Text>
			<Space h={12} />
			<Textarea
				radius="lg"
				size="md"
				minRows={2}
				maxRows={4}
				maxLength={140}
				style={{ maxWidth: 800 }}
				value={agreementDescription}
				onChange={event =>
					setAgreementDescription(event.currentTarget.value)
				}
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
			<Divider />
			<Space h={32} />
			<Text className={meemTheme.tExtraSmallLabel}>DEVELOPER PORTAL</Text>
			<Space h={20} />
			<DeveloperPortalButton
				portalButtonText={`Add more community details`}
				modalTitle={'Add more community details'}
				modalText={`What other key information might communities want to advertise? You can contribute by building on the meem app source code. Look for AdminAgreementDetails.tsx and get coding! Pull Requests are always welcome.`}
				githubLink={`https://github.com/meemproject/meem-app`}
			/>
			<Space h={64} />
			<AgreementAdminChangesModal
				agreement={newAgreementData}
				isRequestInProgress={isSavingChanges}
				onRequestComplete={() => {
					setIsSavingChanges(false)
				}}
			/>
		</div>
	)
}
