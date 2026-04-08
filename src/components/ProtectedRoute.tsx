import { Navigate } from "react-router-dom";
import { authService } from "@/lib/api";

interface Props {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: Props) => {
  const user = authService.getCurrentUser();
  const token = localStorage.getItem('authToken');
  const isPatient = user?.userRole?.name?.toLowerCase?.().trim() === 'patient';
  const isAuth = !!token && !isPatient;

  if (!isAuth && isPatient) {
    authService.logout();
  }

  return isAuth ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
