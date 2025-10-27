// ===============================================
// src/components/guards.tsx
// ===============================================
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../context/AuthContext";

export const RequireRole: React.FC<React.PropsWithChildren<{ roles: Role[] }>> = ({ roles, children }) => {
    const { user } = useAuth();
    const loc = useLocation();
    if (!user) return <Navigate to="/Login" replace state={{ from: loc }} />;
    if (!roles.includes(user.role)) return <Navigate to="/Home" replace />;
    return <>{children}</>;
};
