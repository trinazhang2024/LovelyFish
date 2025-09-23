import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../../API/axios';
import { useUser } from '../../contexts/UserContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [registerMessage, setRegisterMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // Show registration success message if redirected from register page
  useEffect(() => {
    if (location.state?.fromRegister) {
      setRegisterMessage('Registration successful! Please login.');
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      console.log('Attempting login with', email);

      // 1: call backend login endpoint, get token
      const res = await api.post('/account/login', { email, password });
      const token = res.data.token;
      if (!token) throw new Error('No token returned from backend');

      // 2: store token in localStorage
      localStorage.setItem('token', token);

      // 3: fetch current user
      const meRes = await api.get('/account/me');
      login(meRes.data, token); // update context
      navigate('/');
    } catch (error) {
      console.error('Login error:', error.response || error);
       // if fail to login, remove token
      localStorage.removeItem('token');

      if (error.response) {
        if (error.response.status === 401) {
          setErrorMessage('Invalid credentials or session expired.');
        } else if (error.response.data?.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage('Login failed.');
        }
      } else {
        setErrorMessage(error.message || 'Network error.');
      }
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
              <div className="forgot-password-link">
                <Link to="/forgot-password">Forgot password?</Link>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
