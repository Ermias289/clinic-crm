import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

export const LoginPage: React.FC = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginUser(phoneOrEmail, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <form className="card" onSubmit={onSubmit}>
        <h1>Clinic CRM</h1>
        <p className="subtitle">Sign in to manage clinic operations</p>

        <label>
          Phone or Email
          <input
            type="text"
            value={phoneOrEmail}
            onChange={(e) => setPhoneOrEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
};

