import { gql } from '@apollo/client'

export const SUB_TRANSACTIONS = gql`
	subscription GetTransactions($transactionIds: [uuid!]) {
		Transactions(where: { id: { _in: $transactionIds } }) {
			id
			hash
			status
			Agreements {
				id
				slug
				address
				createdAt
				OwnerId
				name
				metadata
				isLaunched
				splits
				gnosisSafeAddress
				mintPermissions
				symbol
				AgreementExtensions {
					Extension {
						slug
					}
				}
				AgreementWallets {
					role
					Wallet {
						ens
						address
					}
				}
				AgreementRoles {
					id
					name
					isAdminRole
					address
					metadata
					AgreementRoleTokens {
						OwnerId
					}
					Agreement {
						isTransferrable
					}
				}
				AgreementTokens {
					Wallet {
						address
						ens
					}
					OwnerId
				}
			}
		}
	}
`
