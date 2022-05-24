interface ClubMetadata {
	image: string
	description: string
	applicationLink: string
}

export function clubMetadataFromContractUri(uri: string): ClubMetadata {
	const base64Data = uri.substring(29)
	const contractURIJSONString = atob(base64Data)
	const contractURIObject = JSON.parse(contractURIJSONString)
	const metadata: ClubMetadata = {
		image: contractURIObject.image,
		description: contractURIObject.description,
		applicationLink: contractURIObject.applicationLink
	}

	return metadata
}
