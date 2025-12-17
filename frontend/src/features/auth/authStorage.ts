import type { AuthSession } from "./authTypes";

const KEY = "auth_sesion";

export function getSession(): AuthSession | null {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;

    try {
        return JSON.parse(raw) as AuthSession;
    } catch {
        localStorage.removeItem(KEY);
        return null;
    }
}

export function setSession(session: AuthSession): void {
    localStorage.setItem(KEY, JSON.stringify(session));
}

export function clearSession(): void {
    localStorage.removeItem(KEY);
}

export function getToken(): string | null {
    return getSession()?.token ?? null;
}