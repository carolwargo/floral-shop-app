// client/src/pages/Auth/ForgotPassword.jsx
import { useState } from "react";
import axios from "axios";
import "./Login/Login.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setMessage(res.data.message || "Password reset email sent!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link.");
    }
  };

  return (
    <div className="login-container">
      <h2>Forgot Password</h2>
      {error && <p className="login-error">{error}</p>}
      {message && <p className="login-success">{message}</p>}

      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          name="email"
          id="forgot-email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
          required
        />
        <button type="submit" className="login-button">
          Send Reset Link
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
