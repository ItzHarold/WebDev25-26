import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

interface RequireRoleProps {
  allowedRoles: string[];
}

export default function RequireRole({ allowedRoles }: RequireRoleProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
