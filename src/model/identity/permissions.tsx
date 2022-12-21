import { Agreement } from '../agreement/agreements'

export const PERMISSION_EDIT_PROFILE = 'agreements.admin.editProfile'
export const PERMISSION_MANAGE_MEMBERSHIP_SETTINGS =
	'agreements.admin.manageMembershipSettings'
export const PERMISSION_MANAGE_ROLES = 'agreements.admin.manageRoles'
export const PERMISSION_MANAGE_APPS = 'agreements.apps.manageApps'
export const PERMISSION_VIEW_APPS = 'agreements.apps.viewApps'

export function userHasPermissionEditProfile(agreement: Agreement): boolean {
	if (agreement.currentUserAgreementPermissions) {
		if (
			agreement.currentUserAgreementPermissions.includes(
				PERMISSION_EDIT_PROFILE
			)
		) {
			return true
		}
	} else if (
		agreement.isCurrentUserAgreementAdmin ||
		agreement.isCurrentUserAgreementOwner
	) {
		return true
	}

	return false
}

export function userHasPermissionManageMembershipSettings(
	agreement: Agreement
): boolean {
	if (agreement.currentUserAgreementPermissions) {
		if (
			agreement.currentUserAgreementPermissions.includes(
				PERMISSION_MANAGE_MEMBERSHIP_SETTINGS
			)
		) {
			return true
		}
	} else if (
		agreement.isCurrentUserAgreementAdmin ||
		agreement.isCurrentUserAgreementOwner
	) {
		return true
	}

	return false
}

export function userHasPermissionManageRoles(agreement: Agreement): boolean {
	if (agreement.currentUserAgreementPermissions) {
		if (
			agreement.currentUserAgreementPermissions.includes(
				PERMISSION_MANAGE_ROLES
			)
		) {
			return true
		}
	} else if (
		agreement.isCurrentUserAgreementAdmin ||
		agreement.isCurrentUserAgreementOwner
	) {
		return true
	}

	return false
}

export function userHasPermissionManageApps(agreement: Agreement): boolean {
	if (agreement.currentUserAgreementPermissions) {
		if (
			agreement.currentUserAgreementPermissions.includes(
				PERMISSION_MANAGE_APPS
			)
		) {
			return true
		}
	} else if (
		agreement.isCurrentUserAgreementAdmin ||
		agreement.isCurrentUserAgreementOwner
	) {
		return true
	}

	return true
}

export function userHasPermissionViewApps(agreement: Agreement): boolean {
	if (agreement.currentUserAgreementPermissions) {
		if (
			agreement.currentUserAgreementPermissions.includes(
				PERMISSION_VIEW_APPS
			)
		) {
			return true
		}
	} else if (
		agreement.isCurrentUserAgreementAdmin ||
		agreement.isCurrentUserAgreementOwner
	) {
		return true
	}

	return false
}
