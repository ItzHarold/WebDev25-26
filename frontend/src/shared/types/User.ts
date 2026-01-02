export interface User {
    id: number;
    role: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    dob: string;
    teamId: number | null;
    imageUrl: string | null;
    createdAt: string;
    lastLoginAt: string | null;
}

export interface UpdateUserRequest {
    role: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
    dob: string;
    teamId: number | null;
    imageUrl: string | null;
}

export interface ChangePasswordRequest {
    userId: number;
    currentPassword: string;
    newPassword: string;
}