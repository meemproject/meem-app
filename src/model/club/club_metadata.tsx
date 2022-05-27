interface ClubMetadata {
	image: string
	description: string
	applicationLinks: string[]
}

export function clubMetadataFromContractUri(uri: string): ClubMetadata {
	if (uri == undefined) {
		return { image: '', description: '', applicationLinks: [] }
	}
	const base64Data = uri.substring(29)
	const contractURIJSONString = atob(base64Data)
	if (contractURIJSONString.length === 0) {
		return { image: '', description: '', applicationLinks: [] }
	}
	const contractURIObject = JSON.parse(contractURIJSONString)
	const metadata: ClubMetadata = {
		image: contractURIObject.image,
		description: contractURIObject.description,
		applicationLinks: contractURIObject.application_links
	}

	return metadata
}
