import { Outlet } from "react-router-dom";
import PrivateRoute from "./PrivateRoutes";
import type { User } from "../context/authContext";

interface Props {
  roles?: User["role"][];
}

const ProtectedLayout = ({ roles }: Props) => {
  return (
    <PrivateRoute roles={roles}>
      <Outlet />
    </PrivateRoute>
  );
};

export default ProtectedLayout;
