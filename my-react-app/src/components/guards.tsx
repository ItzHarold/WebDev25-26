// ===============================================
// src/components/guards.tsx
// Guards with loading gate (no flash while restoring session)
// ===============================================

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../context/AuthContext";
import type { PropsWithChildren } from "react";

export const RequireAuth: React.FC<PropsWithChildren> = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Navigate to="/Login" replace />;
    return <>{children}</>;
};

export const RequireRole: React.FC<PropsWithChildren<{ roles: Role[] }>> = ({
                                                                                roles,
                                                                                children,
                                                                            }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Navigate to="/Login" replace />;
    if (!roles.includes(user.role)) return <Navigate to="/Home" replace />;
    return <>{children}</>;
};
