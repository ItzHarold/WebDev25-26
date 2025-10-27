// ===============================================
// src/context/AuthContext.tsx
// ===============================================
import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export type Role = "player" | "manager" | "admin";
export interface User {
    id: string;
    email: string;
    role: Role;
    hasTeam?: boolean;
}

interface AuthContextType {
    user: User | null;
    login: (u: User) => void;
    logout: () => void;
    hasRole: (r: Role) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const STORAGE_KEY = "auth:user";

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const navigate = useNavigate();

    // Rehydrate from localStorage so navigation doesn’t drop auth
    const [user, setUser] = useState<User | null>(() => {
        const raw = localStorage.getItem(STORAGE_KEY);
        try { return raw ? (JSON.parse(raw) as User) : null; } catch { return null; }
    });

    const login = (u: User) => {
        setUser(u);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
        navigate("/Home", { replace: true });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
        navigate("/Login", { replace: true });
    };

    const hasRole = (r: Role) => user?.role === r;

    return (
        <AuthContext.Provider value={{ user, login, logout, hasRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
