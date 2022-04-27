import React, { useState } from 'react'

export const CreateComponent: React.FC = () => {
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
			<CreateDetailsStepComponent />
			<CreateLogoStepComponent />
		</>
	)
}
