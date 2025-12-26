import { useState } from "react";
import { loginApi } from "../../api/auth.api";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  // MOCK LOGIN
  const mockUser = {
    fullName: "Admin User",
    email: "admin@clinic.com",
    userRole: "admin",
    avatar: "https://via.placeholder.com/40",
  };

  // block patients (just as in real logic)
  if (mockUser.userRole === "patient") {
    setError("Patients are not allowed to access the admin dashboard.");
    return;
  }

  // save to localStorage as if logged in
  localStorage.setItem("token", "mock-token");
  localStorage.setItem("user", JSON.stringify(mockUser));

  // navigate to dashboard
  navigate("/dashboard");
};


  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setError("");

  //   try {
  //     const res = await loginApi({ phoneOrEmail, password });
  //     const { token, user } = res.data;

  //     if (user?.userRole === "patient") {
  //       setError("Patients are not allowed to access the admin dashboard.");
  //       return;
  //     }

  //     localStorage.setItem("token", token);
  //     localStorage.setItem("user", JSON.stringify(user));
  //     navigate("/dashboard");
  //   } catch (err) {
  //     setError(err.response?.data?.message || "Login failed");
  //   }
  // };

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
