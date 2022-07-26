interface ClubMetadata {
	image: string
	description: string
	applicationInstructions: string[]
}

export function clubMetadataFromContractUri(uri: string): ClubMetadata {
	if (uri == undefined) {
		return {
			image: '',
			description: '',
			applicationInstructions: []
		}
	}

	try {
		const base64Data = uri.substring(29)
		const contractURIJSONString = Buffer.from(
			base64Data,
			'base64'
		).toString()
		if (contractURIJSONString.length === 0) {
			return {
				image: '',
				description: '',
				applicationInstructions: []
			}
		}
		const contractURIObject = JSON.parse(contractURIJSONString)

		const metadata: ClubMetadata = {
			image: contractURIObject.image,
			description: contractURIObject.description,
			applicationInstructions: contractURIObject.application_instructions
		}
		return metadata
	} catch (e) {
		return {
			image: '',
			description: '',
			applicationInstructions: []
		}
	}
}
