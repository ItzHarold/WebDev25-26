import React, { createContext, useContext, useMemo, useState } from "react";
import type { AuthSession, AuthUser, LoginResponse } from "./authTypes";
import { clearSession, getSession, setSession as persist } from "./authStorage";

type AuthState = {
    user: AuthUser | null;
    isAuthenticated: boolean;
    setFromLoginResponse: (res: LoginResponse) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

function isExpired(expirationIso:string) {
    const exp = new Date(expirationIso).getTime();
    return Number.isNaN(exp) ? true : Date.now() >= exp;
}

export function AuthProvider({children }: {children: React.ReactNode }) {
    const existing = getSession();
    const [session, setSession] = useState<AuthSession | null>(() => {
        if (!existing) return null;
        if (isExpired(existing.expiration)) {
            clearSession();
            return null;
        }
        return existing;
    });

    const value = useMemo<AuthState>(
        () => ({
            user: session?.user ?? null,
            isAuthenticated: !!session,
            setFromLoginResponse: (res) => {
                const next: AuthSession = {
                    user: { userId: res.userId, email: res.email, role: res.role},
                    token: res.token,
                    expiration: res.expiration,
                };
                persist(next);
                setSession(next);
            },
            logout: () => {
                clearSession();
                setSession(null);
            },
        }),
        [session]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
    
}