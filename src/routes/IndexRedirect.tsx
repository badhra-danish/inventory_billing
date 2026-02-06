import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const RoleRedirect = () => {
  const { user } = useAuth();

  // not logged in
  if (!user) return <Navigate to="/login" replace />;

  // role based redirect
  if (user.role === "SUPER_ADMIN") {
    return <Navigate to="/super/dashboard" replace />;
  }

  if (user.role === "SHOP_ADMIN") {
    return <Navigate to="/shop/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default RoleRedirect;
