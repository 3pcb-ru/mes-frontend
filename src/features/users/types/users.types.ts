export interface Role {
    id: string;
    name: string;
    permissions?: string[];
}

export interface Factory {
    id: string;
    name: string;
    location?: string;
}

export interface DetailedProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isVerified: boolean;
    role?: Role;
    factory?: Factory;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateUserProfileDto {
    firstName?: string;
    lastName?: string;
    email?: string;
}

export interface UserListItem {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isVerified: boolean;
    createdAt: string;
}
