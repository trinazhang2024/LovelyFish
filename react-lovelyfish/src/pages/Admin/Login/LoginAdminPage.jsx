import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../../API/axios";
import "./LoginAdminPage.css"

export default function AdminLogin({ setIsAdminLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/admin/login", { email, password });
      if (res.status === 200) {
        //localStorage.setItem("adminLoggedIn", "true");  // 保存登录状态
        setIsAdminLoggedIn(true);  // 更新 App 的状态
        navigate("/admin/dashboard"); // 登录成功跳转后台
        
      }
    } catch (err) {
      setError("登录失败，请检查账号或密码");
      setIsAdminLoggedIn(false);
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
        
        {/* 忘记密码链接 */}
        
        <Link to="/admin/forgot-password" className="forgot-password">
          忘记密码？
        </Link>
      
      </form>
    </div>
  );
}
