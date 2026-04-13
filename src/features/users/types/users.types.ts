export interface Role {
    id: string;
    name: string;
    description?: string;
    isDefault: boolean;
    isAdmin: boolean;
    organizationId?: string | null;
    permissions?: Permission[];
}

export interface Permission {
    id: string;
    name: string;
    description: string;
}

export interface Organization {
    id: string;
    name: string;
    logoId?: string;
    logoUrl?: string;
    location?: string;
}

export interface DetailedProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isVerified: boolean;
    role?: Role;
    organization?: Organization;
    organizationId?: string;
    avatarId?: string;
    avatarUrl?: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
}

export interface UpdateUserProfileDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    avatarId?: string;
}

export interface UserListItem {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isVerified: boolean;
    createdAt: string;
    deletedAt?: string | null;
}

export interface InviteUserDto {
    email: string;
    firstName: string;
    lastName: string;
    roleId: string;
}

export interface UpdateUserStatusDto {
    status: 'active' | 'inactive';
}

export interface AcceptInvitationDto {
    token: string;
    password: string;
}

export interface RoleWithPermissions extends Role {
    permissions: Permission[];
}
