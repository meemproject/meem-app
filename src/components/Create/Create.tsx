import React, { useState } from 'react'

enum CreateStep {
	Details,
	Logo
}

export const CreateComponent: React.FC = () => {
	const [currentStep, setCurrentStep] = useState<CreateStep>(CreateStep.Details)

	// Club details / image
	const [clubName, setClubName] = useState('')
	const [clubDescription, setClubDescription] = useState('')
	const [clubLogo, setClubLogo] = useState('')

	const CreateDetailsStepComponent: React.FC = () => {
		return <div>Hello create details step</div>
	}

	const CreateLogoStepComponent: React.FC = () => {
		return <div>Hello create logo step</div>
	}

	return (
		<>
			{currentStep == CreateStep.Details && <CreateDetailsStepComponent />}
			{currentStep == CreateStep.Logo && <CreateLogoStepComponent />}
		</>
	)
}
