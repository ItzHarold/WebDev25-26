export type LoginRequest = {
    email: string;
    password: string;
}

export type LoginResponse = {
    userId: number;
    email: string;
    role: string;
    token: string;
    expiration: string;
}

export type AuthUser = {
    userId: number;
    email: string;
    role: string;

}

export type AuthSession = {
    user: AuthUser;
    token: string;
    expiration: string;
}