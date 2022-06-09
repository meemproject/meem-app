interface ClubMetadata {
	image: string
	description: string
	applicationLinks: string[]
}

export function clubMetadataFromContractUri(uri: string): ClubMetadata {
	if (uri == undefined) {
		return {
			image: '',
			description: '',
			applicationLinks: []
		}
	}

	try {
		const base64Data = uri.substring(29)
		const contractURIJSONString = Buffer.from(base64Data, 'base64').toString()
		if (contractURIJSONString.length === 0) {
			return {
				image: '',
				description: '',
				applicationLinks: []
			}
		}
		const contractURIObject = JSON.parse(contractURIJSONString)

		const metadata: ClubMetadata = {
			image: contractURIObject.image,
			description: contractURIObject.description,
			applicationLinks: contractURIObject.application_links
		}
		return metadata
	} catch (e) {
		return {
			image: '',
			description: '',
			applicationLinks: []
		}
	}
}
