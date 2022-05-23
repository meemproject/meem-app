import { Permission } from '@meemproject/meem-contracts'
import { MeemContracts } from '../../../generated/graphql'
import { clubMetadataFromContractUri } from '../../utils/club_metadata'

export interface Club {
	id?: string
	name?: string
	address?: string
	slug?: string
	description?: string
	image?: string
	admins?: string[]
	membershipSettings?: MembershipSettings
	members?: string[]
	isClubMember?: boolean
}

export interface MembershipSettings {
	requirements: MembershipRequirement[]
	costToJoin: number
	membershipFundsAddress: string
	membershipQuantity: number
	membershipStartDate?: Date
	membershipEndDate?: Date
	clubAdmins?: string[]
}

export enum MembershipReqType {
	None,
	ApprovedApplicants,
	TokenHolders,
	NftHolders,
	OtherClubMember
}

export enum MembershipReqAndor {
	None,
	And,
	Or
}

export interface MembershipRequirement {
	// Currently hardcoded as there is only one additional req.
	// 0 = first req
	// 1 = optional second req
	index: number
	// For additional reqs, whether they are 'alternatively' or 'in addition'
	andor: MembershipReqAndor
	// Type of requirement
	type: MembershipReqType
	// Applicants
	applicationLink: string
	approvedAddresses: string[]
	approvedAddressesString: string
	// NFT / Token holders
	tokenName: string // Resolved from contract
	tokenContractAddress: string
	tokenChain: string // Not used for V1
	tokenMinQuantity: number
	// Club membership
	clubContractAddress: string
	clubName: string // Resolved from contract
}

export default function clubFromMeemContract(
	walletAddress?: string,
	clubData?: MeemContracts
): Club {
	if (clubData != null && clubData) {
		// Parse the contract URI
		const metadata = clubMetadataFromContractUri(clubData.contractURI)

		// Convert minting permissions to membership requirements
		const reqs: MembershipRequirement[] = []
		let costToJoin = 0
		let index = 0
		clubData.mintPermissions.forEach((permission: any) => {
			costToJoin = Number(permission.costWei / 1000000000)

			let type = MembershipReqType.None
			let approvedAddresses: string[] = []
			const tokenName = 'TOKEN'
			let tokenContractAddress = ''
			let tokenMinQuantity = 0

			// Used for the 'other club' additional req, TODO
			const clubContractAddress = ''
			const clubName = ''

			switch (permission.permission) {
				case Permission.Anyone:
					type = MembershipReqType.None
					break
				case Permission.Addresses:
					type = MembershipReqType.ApprovedApplicants
					approvedAddresses = permission.addresses
					break
				case Permission.Holders:
					tokenMinQuantity = Number(permission.numTokens)
					// Use other properties to determine whether using NFT or Token holders
					if (tokenMinQuantity > 1) {
						type = MembershipReqType.NftHolders
					} else {
						type = MembershipReqType.TokenHolders
					}
					tokenContractAddress = permission.addresses[0]
					break
			}

			// Construct a requirement
			reqs.push({
				index,
				andor: MembershipReqAndor.Or,
				type,
				applicationLink: metadata.applicationLink,
				approvedAddresses,
				approvedAddressesString: '',
				tokenName,
				tokenMinQuantity,
				tokenChain: '',
				clubContractAddress,
				tokenContractAddress,
				clubName
			})

			index++
		})

		// Membership funds address
		let fundsAddress = ''
		if (clubData.splits.length > 0) {
			const split = clubData.splits[0]
			fundsAddress = split.toAddress
		}

		// Total memberships
		let totalMemberships = Number(clubData.totalOriginalsSupply)
		if (totalMemberships === -1) {
			totalMemberships = 0
		}

		// Club members
		const members: string[] = []

		// Is the current user a club member?
		let isClubMember = false
		clubData.Meems.forEach(meem => {
			if (walletAddress) {
				isClubMember = true
			}
			members.push(meem.owner)
		})

		return {
			id: clubData.id,
			name: clubData.name,
			address: clubData.address,
			slug: clubData.slug,
			description: metadata.description,
			image: metadata.image,
			isClubMember,
			members,
			membershipSettings: {
				requirements: reqs,
				costToJoin,
				membershipFundsAddress: fundsAddress,
				membershipStartDate: clubData.mintStartAt ? clubData.mintStartAt : null,
				membershipEndDate: clubData.mintEndAt ? clubData.mintEndAt : null,
				membershipQuantity: totalMemberships,
				clubAdmins: []
			}
		}
	} else {
		return {}
	}
}
