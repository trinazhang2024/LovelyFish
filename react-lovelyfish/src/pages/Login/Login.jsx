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
      // Call backend login endpoint; auth cookies are automatically stored
      await api.post('/account/login', { email, password });

      // Fetch current user info and update UserContext
      const meRes = await api.get('/account/me');
      console.log('Logged in user data:', meRes.data);

      login(meRes.data); // Example: { name: "John Doe", email: "john@example.com" }

      navigate('/'); // Redirect to homepage after login
    } catch (error) {
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
