import React, { useEffect, useState } from 'react';
import { useLocation ,  useNavigate} from 'react-router-dom';
import api from '../../API/axios'
import { useUser } from '../../contexts/UserContext'; // 你自己的用户上下文
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [registerMessage, setRegisterMessage] = useState('');

  useEffect(() => {
    if (location.state?.fromRegister) {
      setRegisterMessage('Registration successful! Please login.');
    }
  }, [location.state]);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true); // 防止重复提交
    

    try {
      // 调用后端登录接口，后端设置的认证 Cookie 会自动存入浏览器。
      await api.post('/account/login', {email,password});

      // 登录成功后，调用 /me 获取用户信息,更新上下文（UserContext），这样全局知道当前是谁。
      const meRes = await api.get('/account/me');

      console.log('登录后 /account/me 返回的数据:', meRes.data);  // 打印用户信息，调试用
      
      login(meRes.data); // 假设返回 { name: "xxx", email: "xxx@xxx.com" }

      navigate('/'); //登录成功自动跳转 /。
    } catch (error) {
      // 如果全局拦截器没捕获，这里兜底
      setErrorMessage(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {registerMessage && (
        <div className="alert alert-success text-center">{registerMessage}</div>
      )}
      <div className="container d-flex justify-content-center">
        <div className="login-container">
          <h2>Login</h2>
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          <form onSubmit={handleSubmit} className="login-form" autoComplete="new-password">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                autoComplete="new-email"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                autoComplete="new-password"
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Logging in ...': 'login'}
              </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;

// Navbar 可以拿到 user.name 直接显示 “Welcome, xxx”。
// 用 https 避免接口被浏览器拒绝。
// 错误信息会直接显示在表单上，而不是弹个大 JSON 框。
// 安全：不在前端存 token，全靠 Cookie。
// 统一：错误信息由 axios.js 拦截器处理，不用每个接口写一堆 catch。
// 自动恢复：刷新页面时 UserContext 可以自动调 /account/me 恢复登录状态。
