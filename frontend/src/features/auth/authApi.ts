import { api } from "../../shared/api/http";
import type { LoginRequest, LoginResponse } from "./authTypes";
import type { RegisterRequest, RegisterResponse } from "./authTypes";

export function login(payload: LoginRequest) : Promise<LoginResponse> {
    return api<LoginResponse>("/Auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function register(payload: RegisterRequest) : Promise<RegisterResponse> {
    return api<RegisterResponse>("/Auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}