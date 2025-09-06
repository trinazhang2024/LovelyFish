import React, { useState } from "react";
import api from "../../../API/axios";
import "./AdminChangePassword.css";

export default function AdminChangePassword() {
  // ✅ State for form inputs
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // ✅ State for feedback
  const [message, setMessage] = useState("");
  const [strength, setStrength] = useState("");

  // 🔑 Password strength checker
  const checkStrength = (password) => {
    if (password.length < 8) return "Weak ❌"; // Too short
    if (/[A-Z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password)) 
      return "Strong ✅"; // Has uppercase, number, special char
    if (/[A-Z]/.test(password) || /\d/.test(password)) 
      return "Medium ⚠️"; // Has uppercase OR number
    return "Weak ❌";
  };

  // Update new password & check strength
  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    setStrength(checkStrength(value));
  };

  // 📤 Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure new & confirm match
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      // Call backend API
      const res = await api.post("/admin/change-password", {
        oldPassword,
        newPassword,
      });

      // Success message from server
      setMessage(res.data.message || "Password changed successfully");
    } catch (err) {
      setMessage("Failed to change password");
    }
  };

  return (
    <div className="change-password-page">
      <form onSubmit={handleSubmit} className="change-password-form">
        <h2>Change Password</h2>

        {/* Old Password */}
        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />

        {/* New Password */}
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={handleNewPasswordChange}
          required
        />

        {/* Strength indicator */}
        {newPassword && (
          <p className={`strength ${strength.split(" ")[0].toLowerCase()}`}>
            Strength: {strength}
          </p>
        )}

        {/* Confirm Password */}
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {/* Submit button */}
        <button type="submit">Change Password</button>

        {/* Feedback message */}
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}
