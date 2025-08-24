import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../../API/axios";
import './AdminResetPassword.css'

export default function AdminResetPassword() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  
  //计算密码强度
  
  const calculateStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[\W_]/.test(password)) strength++;
    return strength; // 1 ~ 5
  };
  const strength = calculateStrength(newPassword);



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    try {
      const res = await api.post("/admin/reset-password", {
        email,
        token,
        newPassword,
      });
      setMessage(res.data.message || "Password reset successful");
    } catch (err) {
      setMessage("Failed to reset password");
    }
  };

  return (
    <div className="admin-reset-page">
      <form onSubmit={handleSubmit} className="admin-reset-form">
        <h2>Reset Password</h2>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <div className="password-strength">
          <div
            className={`password-strength-bar strength-${strength}`}
            style={{ width: `${(strength / 5) * 100}%` }}
          ></div>
        </div>

        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" >
          Reset Password
        </button>
        {message && <p >{message}</p>}
      </form>
    </div>
  );
}
