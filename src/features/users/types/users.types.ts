import type {
    UserListItem as UserListItemType,
    DetailedProfile as DetailedProfileType,
    InviteUserDto as InviteUserDtoType,
    UpdateUserStatusDto as UpdateUserStatusType,
    AcceptInvitationDto as AcceptInvitationDtoType,
    RoleWithPermissions as RoleWithPermissionsType,
} from './users.schema';
import type { Role as RoleSchemaType, Organization as OrganizationSchemaType } from '../../../shared/types/api.schema';

/**
 * Users Types - Re-exported from Zod Schemas
 */

export type Role = RoleSchemaType;
export type Organization = OrganizationSchemaType;
export type DetailedProfile = DetailedProfileType;
export type UserListItem = UserListItemType;
export type InviteUserDto = InviteUserDtoType;
export type UpdateUserStatusDto = UpdateUserStatusType;
export type AcceptInvitationDto = AcceptInvitationDtoType;
export type RoleWithPermissions = RoleWithPermissionsType;

// Backward compatibility or UI-only types can remain here if not in schema
export interface UpdateUserProfileDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    avatarId?: string;
}
