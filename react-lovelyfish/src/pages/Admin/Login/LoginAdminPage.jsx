import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../../API/axios";
import { useUser } from "../../../contexts/UserContext"; // ✅ Import UserContext
import "./LoginAdminPage.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useUser(); // ✅ Get login function from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      
      // Call backend login API
      const res = await api.post("/account/login", { email, password });

      localStorage.setItem("token", res.data.token);
  
      if (res.status === 200) {
        // After successful login, fetch current admin info
        const meRes = await api.get("/admin/me"); 
        // Example response: { name, email, roles: ["Admin"] }
        
        login(meRes.data); // ✅ Update UserContext.user
        navigate("/admin/dashboard"); // Redirect to admin dashboard

        
      }
    }  catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed");
      }
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
