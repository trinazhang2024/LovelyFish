import { useState } from "react";
import api from "../../API/axios";
import "./ForgotPasswordPage.css";

export default function ForgotPasswordPage() {
  // ----------------- State -----------------
  const [email, setEmail] = useState("");       // User input for email
  const [loading, setLoading] = useState(false); // Loading state during request
  const [message, setMessage] = useState("");   // Success message
  const [error, setError] = useState("");       // Error message

  // ----------------- Handle Form Submit -----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("⚠️ Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setError("");

      // Call backend API to send password reset email
      const res = await api.post("/account/forgot-password", { email });

      // Display success message (or test message if in console)
      setMessage(
        res.data.message ||
          "If this email exists, we have sent a password reset link (or test link to console)."
      );
    } catch (err) {
      console.error("Forgot password request failed:", err);
      setError(
        err.response?.data?.message || "Request failed. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <p>Enter your registered email, and we will send you a password reset link.</p>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Email"}
        </button>
      </form>

      {/* Success & Error Messages */}
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

/* 
Flow for users:

1. Visit /forgot-password
2. Enter email → POST /account/forgot-password
3. Backend prints reset link to console (or sends email in production)
4. Copy the link to browser → /reset-password?... page
5. Page pre-fills email & token → enter new password → POST /account/reset-password
6. On success → redirect to login page
*/
