import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../API/axios";
import "./ResetPasswordPage.css";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !token) {
      alert("链接无效，请重新获取重置密码链接。");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("两次输入的密码不一致！");
      return;
    }
    try {
      setLoading(true);
      await api.post("/account/reset-password", {
        email,
        token,
        newPassword,
      });
      alert("密码重置成功，请登录！");
      navigate("/login");
    } catch (err) {
      console.error("重置密码失败", err);
      alert(err.message || "重置密码失败，请重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <h2>重置密码</h2>
      <p>重置邮箱：{email}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="新密码"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="确认新密码"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{ marginTop: "10px" }}
        />
        <button type="submit" disabled={loading}>
          {loading ? "提交中..." : "提交新密码"}
        </button>
      </form>
    </div>
  );
}
