import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../../API/axios";
import './AdminResetPassword.css'

export default function AdminResetPassword() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email"); // Extract email from URL query
  const token = searchParams.get("token"); // Extract token from URL query

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(""); // Display success/error messages
  const [loading, setLoading] = useState(false); // Loading state during API call
  const navigate = useNavigate();

  // ------------------- Password Strength Calculation -------------------
  // Returns a number between 1 and 5 based on criteria: length, uppercase, lowercase, digit, special char
  const calculateStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[\W_]/.test(password)) strength++;
    return strength;
  };
  const strength = calculateStrength(newPassword);

  // ------------------- Form Submission -------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      // Call backend API to reset password
      const res = await api.post("/admin/reset-password", {
        email,
        token,
        newPassword,
      });

      setMessage(res.data.message || "Password reset successful");

      // Redirect to admin login after 1 second
      setTimeout(() => navigate("/admin/login"), 1000);
    } catch (err) {
      setMessage("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  // ------------------- JSX Render -------------------
  return (
    <div className="admin-reset-page">
      <form onSubmit={handleSubmit} className="admin-reset-form">
        <h2>Reset Password</h2>

        {/* New Password Input */}
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        {/* Password Strength Bar */}
        <div className="password-strength">
          <div
            className={`password-strength-bar strength-${strength}`}
            style={{ width: `${(strength / 5) * 100}%` }}
          ></div>
        </div>

        {/* Confirm Password Input */}
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {/* Submit Button */}
        <button type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        {/* Message Display */}
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}
