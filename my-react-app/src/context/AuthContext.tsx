// ===============================================
// src/context/AuthContext.tsx
// Auth with loading state + centralized post-login redirect
// ===============================================

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Role = "user" | "admin" | "manager";

export type AuthUser = {
    id: string;
    email: string;
    role: Role;
} | null;

type AuthContextValue = {
    user: AuthUser;
    loading: boolean;
    login: (u: { id: string; email: string; role: Role }) => void | Promise<void>;
    logout: () => void;
    hasRole: (roles: Role | Role[]) => boolean;
    destinationFor: (role: Role) => string;
};

const LS_USER = "auth:user";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [user, setUser] = useState<AuthUser>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(LS_USER);
            if (raw) setUser(JSON.parse(raw));
        } finally {
            setLoading(false);
        }
    }, []);

    const login = (u: { id: string; email: string; role: Role }) => {
        setUser(u);
        localStorage.setItem(LS_USER, JSON.stringify(u));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(LS_USER);
    };

    const hasRole = (roles: Role | Role[]) => {
        if (!user) return false;
        const list = Array.isArray(roles) ? roles : [roles];
        return list.includes(user.role);
    };

    const destinationFor = (role: Role) =>
        role === "admin" ? "/admin" : role === "manager" ? "/manager" : "/profile";

    const value = useMemo(
        () => ({ user, loading, login, logout, hasRole, destinationFor }),
        [user, loading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
    return ctx;
};
