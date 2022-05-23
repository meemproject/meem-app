interface ClubMetadata {
	image: string
	description: string
	applicationLink: string
}

export function clubMetadataFromContractUri(uri: string): ClubMetadata {
	const base64Data = uri.substring(29)
	const contractURIJSONString = atob(base64Data)
	console.log(`json string: ${contractURIJSONString}`)
	const contractURIObject = JSON.parse(contractURIJSONString)
	console.log(contractURIObject)
	const metadata: ClubMetadata = {
		image: contractURIObject.image,
		description: contractURIObject.description,
		applicationLink: contractURIObject.applicationLink
	}

	return metadata
}
