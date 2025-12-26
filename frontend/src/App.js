import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/login/Login";
import ForgotPassword from "./auth/forgotPassword/ForgotPassword";
import ResetPassword from "./auth/resetPassword/ResetPassword";
import Dashboard from "./pages/Dashboard";
import CardType from "./pages/CardType";
import Branches from "./pages/Branches";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/card-types"
          element={
            <ProtectedRoute>
              <CardType />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/branches"
          element={
            <ProtectedRoute>
              <Branches />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
