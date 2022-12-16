import { Club } from '../club/club'

export const PERMISSION_EDIT_PROFILE = 'clubs.admin.editProfile'
export const PERMISSION_MANAGE_MEMBERSHIP_SETTINGS =
	'clubs.admin.manageMembershipSettings'
export const PERMISSION_MANAGE_ROLES = 'clubs.admin.manageRoles'
export const PERMISSION_MANAGE_APPS = 'clubs.apps.manageApps'
export const PERMISSION_VIEW_APPS = 'clubs.apps.viewApps'

export function userHasPermissionEditProfile(club: Club): boolean {
	if (club.currentUserClubPermissions) {
		if (club.currentUserClubPermissions.includes(PERMISSION_EDIT_PROFILE)) {
			return true
		}
	} else if (club.isCurrentUserClubAdmin) {
		return true
	}

	return false
}

export function userHasPermissionManageMembershipSettings(club: Club): boolean {
	if (club.currentUserClubPermissions) {
		if (
			club.currentUserClubPermissions.includes(
				PERMISSION_MANAGE_MEMBERSHIP_SETTINGS
			)
		) {
			return true
		}
	} else if (club.isCurrentUserClubAdmin) {
		return true
	}

	return false
}

export function userHasPermissionManageRoles(club: Club): boolean {
	if (club.currentUserClubPermissions) {
		if (club.currentUserClubPermissions.includes(PERMISSION_MANAGE_ROLES)) {
			return true
		}
	} else if (club.isCurrentUserClubAdmin) {
		return true
	}

	return false
}

export function userHasPermissionManageApps(club: Club): boolean {
	if (club.currentUserClubPermissions) {
		if (club.currentUserClubPermissions.includes(PERMISSION_MANAGE_APPS)) {
			return true
		}
	} else if (club.isCurrentUserClubAdmin) {
		return true
	}

	return true
}

export function userHasPermissionViewApps(club: Club): boolean {
	if (club.currentUserClubPermissions) {
		if (club.currentUserClubPermissions.includes(PERMISSION_VIEW_APPS)) {
			return true
		}
	} else if (club.isCurrentUserClubAdmin) {
		return true
	}

	return false
}
