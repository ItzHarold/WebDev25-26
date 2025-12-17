import { api } from "../../shared/api/http";
import type { LoginRequest, LoginResponse } from "./authTypes";

export function login(payload: LoginRequest) : Promise<LoginResponse> {
    return api<LoginResponse>("/Auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}