import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../API/axios";
import "./ResetPasswordPage.css";

export default function ResetPasswordPage() {

  // React Router hooks

  const [searchParams] = useSearchParams(); // Read query params from URL
  const navigate = useNavigate();           // For programmatic navigation

  // Extract email and token from URL query
  // -----------------------------
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";


  // Component state

  const [newPassword, setNewPassword] = useState("");       // New password input
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm password input
  const [loading, setLoading] = useState(false);           // Loading state during API call
  const [message, setMessage] = useState("");              // Success message
  const [error, setError] = useState("");                  // Error message


  // Handle form submission

  const handleSubmit = async (e) => {
    e.preventDefault();      // Prevent page reload
    setMessage("");          // Reset previous success
    setError("");            // Reset previous error

    // Validate URL parameters

    if (!email || !token) {
      setError("Invalid link. Please request a new password reset link.");
      return;
    }

  
    // Validate password confirmation
   
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }


    // Optional: Frontend password strength check

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    // Call backend API to reset password

    try {
      setLoading(true);
      await api.post("/account/reset-password", {
        email,
        token,
        newPassword,
      });

      setMessage("Password reset successful! Redirecting to login...");
      // Automatically redirect to login after 2 seconds
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Password reset failed", err);
      setError(err.response?.data?.message || "Password reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // JSX: Render form and messages

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      <p>Email: {email}</p>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{ marginTop: "10px" }}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit New Password"}
        </button>
      </form>

      {/* Display success or error messages */}
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
