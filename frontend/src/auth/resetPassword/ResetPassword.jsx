import { useState } from "react";
import { resetPasswordApi } from "../../api/auth.api";
import { useLocation, useNavigate } from "react-router-dom";
import "./ResetPassword.css"; 

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await resetPasswordApi({
        phoneOrEmail: email,
        password: "",
        newPassword,
        otp,
        reset: true,
      });

      navigate("/");
    } catch (err) {
      setError("Password reset failed");
    }
  };

  return (
    <div className="reset-page">
      <div className="reset-card">
        <h2 className="reset-title">Reset Password</h2>
        <p className="reset-subtitle">
          Enter the OTP and your new password
        </p>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleReset} className="reset-form">
          <input
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))
            }
            required
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
