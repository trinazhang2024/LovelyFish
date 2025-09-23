import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../API/axios";
import { useUser } from "../../../contexts/UserContext"; 
import "./LoginAdminPage.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser(); // Get login function from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Call backend login API
      const res = await api.post("/admin/login", { email, password });
      const token = res.data.token;
      if (!token) throw new Error("No token returned from backend");

      localStorage.setItem("token", token);

      // get admin info by token
      const meRes = await api.get("/admin/me");
      login(meRes.data, token); 

      // navigate to admin dashboard
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Admin login error:", err.response || err);
      localStorage.removeItem("token"); // remove token
      setError("Login failed, please check your email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <form className="admin-login-form" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p>{error}</p>}
        <Link to="/admin/forgot-password" className="forgot-password">
          Forgot password?
        </Link>
      </form>
    </div>
  );
}
