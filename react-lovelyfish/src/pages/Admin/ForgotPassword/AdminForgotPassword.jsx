import React, { useState } from "react";
import api from "../../../API/axios";
import "./AdminForgotPassword.css"; 

export default function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/admin/forgot-password", { email });
      setMessage(`${res.data.message || "Reset link sent!"}, Please check your email.`);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send reset link，请检查邮箱。");
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <form onSubmit={handleSubmit} className="forgot-password-form">
        <h2>Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}
