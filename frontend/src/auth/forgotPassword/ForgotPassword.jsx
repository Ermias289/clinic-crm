import { useState } from "react";
import { resendOtpApi } from "../../api/auth.api";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css"; 

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();

    try {
      await resendOtpApi(email);
      setMessage("OTP sent to your email.");
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      setMessage("Failed to send OTP.");
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <h2 className="forgot-title">Forgot Password</h2>
        <p className="forgot-subtitle">
          Enter your email to receive an OTP
        </p>

        {message && <p className="info-text">{message}</p>}

        <form onSubmit={handleSendOtp} className="forgot-form">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit">Send OTP</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
