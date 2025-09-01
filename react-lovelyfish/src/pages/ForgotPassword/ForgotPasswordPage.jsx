import { useState } from "react";
import api from "../../API/axios";
import "./ForgotPasswordPage.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      alert("请输入邮箱");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/account/forgot-password", { email });
      setMessage(res.data.message || "如果该邮箱存在，我们已发送密码重置邮件（或测试链接）到控制台。");
    } catch (err) {
      console.error("忘记密码请求失败", err);
      setError(err.response?.data?.message || "请求失败，请稍后再试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>忘记密码</h2>
      <p>请输入你的注册邮箱，我们会发送密码重置链接。</p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="请输入邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "发送中..." : "发送重置邮件"}
        </button>
      </form>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      
    </div>
  );
}


// 用户访问 /forgot-password，输入邮箱 → 调用 /account/forgot-password → 后端打印重置链接。

// 复制后端控制台的链接到浏览器，访问 /reset-password?... 页面 → 自动带邮箱和 token → 输入新密码提交 /account/reset-password → 成功后跳转登录页。
