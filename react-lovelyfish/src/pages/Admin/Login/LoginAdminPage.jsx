import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../../API/axios";
import { useUser } from "../../../contexts/UserContext"; // ✅ 引入
import "./LoginAdminPage.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useUser(); // ✅ 从上下文拿 login

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 调用后端登录接口
      const res = await api.post("/account/login", { email, password });

      if (res.status === 200) {
        // 登录成功，获取当前用户信息
        const meRes = await api.get("/admin/me"); // ✅ 会返回 { name, email, roles: ["Admin"] }
        
        login(meRes.data); // ✅ 更新 UserContext.user
        navigate("/admin/dashboard"); // 跳转后台
      }
    } catch (err) {
      setError("登录失败，请检查账号或密码");
    }
  };

  return (
    <div className="admin-login-page">
      <form className="admin-login-form" onSubmit={handleSubmit}>
        <h2>管理员登录</h2>
        <input type="email" placeholder="邮箱" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="密码" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">登录</button>
        {error && <p>{error}</p>}
        <Link to="/admin/forgot-password" className="forgot-password">忘记密码？</Link>
      </form>
    </div>
  );
}
