import { useState } from "react";
import { loginApi } from "../../api/auth.api";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const getUserFriendlyError = (error) => {
    // Map backend errors to user-friendly messages
    const errorMessage = error.response?.data?.message || error.message || "";
    const statusCode = error.response?.status;

    // Handle specific error cases
    if (statusCode === 401) {
      if (errorMessage.toLowerCase().includes("username")) {
        return "The email or phone number you entered doesn't exist. Please check and try again.";
      }
      if (errorMessage.toLowerCase().includes("password")) {
        return "The password you entered is incorrect. Please try again.";
      }
      return "Invalid login credentials. Please check your email/phone and password.";
    }

    if (statusCode === 403) {
      return "Your account doesn't have permission to access this system. Please contact support.";
    }

    if (statusCode === 404) {
      return "Account not found. Please check your credentials or contact support.";
    }

    if (statusCode === 500 || statusCode === 502 || statusCode === 503) {
      return "We're having trouble connecting to our servers. Please try again in a moment.";
    }

    if (error.code === "ERR_NETWORK" || error.message.includes("Network")) {
      return "Unable to connect. Please check your internet connection and try again.";
    }

    if (errorMessage.toLowerCase().includes("timeout")) {
      return "The request took too long. Please check your connection and try again.";
    }

    // Default user-friendly message
    return "Unable to sign in. Please check your credentials and try again.";
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Send data with capital case to match backend DTO
      const res = await loginApi({ 
        PhoneOrEmail: phoneOrEmail, 
        Password: password 
      });
      
      const { token, user, userRole } = res.data;

      // Block patients from accessing admin dashboard
      if (userRole?.name?.toLowerCase() === "patient") {
        setError("This dashboard is for staff only. Patients cannot access this area.");
        return;
      }

      // Build user object with full name
      const fullName = `${user.fName || ""} ${user.mName || ""} ${user.lName || ""}`.trim();
      const userData = {
        id: user.id,
        fullName: fullName || user.username || user.email,
        email: user.email,
        phoneNumber: user.phoneNumber,
        username: user.username,
        userRole: userRole.name,
        userRoleId: user.userRoleId,
        isEmailConfirmed: user.isEmailConfirmed,
        avatar: null, // Add avatar URL if backend provides it
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(getUserFriendlyError(err));
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Clinic CRM Admin</h2>
        <p className="login-subtitle">Sign in to continue</p>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="Phone or Email"
            value={phoneOrEmail}
            onChange={(e) => setPhoneOrEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>

        <Link to="/forgot-password" className="forgot-link">
          Forgot Password?
        </Link>
      </div>
    </div>
  );
};

export default Login;
