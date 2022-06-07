import log from "@kengoldfarb/log"
import { Integration } from "./club"

interface ClubMetadata {
	image: string
	description: string
	applicationLinks: string[]
	integrations: Integration[]
}

export function clubMetadataFromContractUri(uri: string): ClubMetadata {
	if (uri == undefined) {
		return { image: '', description: '', applicationLinks: [], integrations: []}
	}

	try {
		const base64Data = uri.substring(29)
		const contractURIJSONString = Buffer.from(base64Data, 'base64').toString()
		if (contractURIJSONString.length === 0) {
			return { image: '', description: '', applicationLinks: [], integrations: []}
		}
		const contractURIObject = JSON.parse(contractURIJSONString)
		const finalIntegrations: Integration[] = []
		if (contractURIObject.integrations) {
			const integrations= JSON.parse(contractURIObject.integrations)
			log.debug(`contract has ${integrations.length} integrations`)
			integrations.forEach((inte: any) => {
				finalIntegrations.push({name: inte.name, url: inte.url})
			})
		}

		const metadata: ClubMetadata = {
			image: contractURIObject.image,
			description: contractURIObject.description,
			applicationLinks: contractURIObject.application_links,
			integrations: finalIntegrations
		}
		return metadata
	} catch (e) {
		return { image: '', description: '', applicationLinks: [], integrations: [] }
	}
}


