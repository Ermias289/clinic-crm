import { Navigate } from "react-router-dom";
import { authService } from "@/lib/api";

interface Props {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: Props) => {
  const isAuth = authService.isAuthenticated();
  return isAuth ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
