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

export type RegisterRequest = {
  role: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  dob: string;
  teamId?: number | null;
  imageUrl?: string | null;
};

export type RegisterResponse = {
  userId: number;
  role: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  dob: string;
  teamId?: number | null;
  imageUrl?: string | null;
  token: string;
  expiration: string;
};
