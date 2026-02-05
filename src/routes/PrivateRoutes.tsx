import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth, type User } from "../context/authContext";

/* ===============================
   Types
================================ */

interface PrivateRouteProps {
  children: ReactNode;
  roles?: User["role"][]; // auto-typed from User role
}

/* ===============================
   Component
================================ */

const PrivateRoute = ({ children, roles }: PrivateRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
