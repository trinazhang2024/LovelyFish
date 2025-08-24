import React, { useState } from "react";
import api from "../../../API/axios";
import "./AdminChangePassword.css";

export default function AdminChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [strength, setStrength] = useState("");

  // 密码强度检测
  const checkStrength = (password) => {
    if (password.length < 8) return "Weak ❌";
    if (/[A-Z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password)) return "Strong ✅";
    if (/[A-Z]/.test(password) || /\d/.test(password)) return "Medium ⚠️";
    return "Weak ❌";
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    setStrength(checkStrength(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    try {
      const res = await api.post("/admin/change-password", {
        oldPassword,
        newPassword,
      });
      setMessage(res.data.message || "Password changed successfully");
    } catch (err) {
      setMessage("Failed to change password");
    }
  };

  return (
    <div className="change-password-page">
      <form onSubmit={handleSubmit} className="change-password-form">
        <h2>Change Password</h2>
        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={handleNewPasswordChange}
          required
        />
        {newPassword && <p className={`strength ${strength.split(" ")[0].toLowerCase()}`}>Strength: {strength}</p>}
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Change Password</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}
