import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../API/axios';
import './Register.css';
import PasswordStrengthMeter from './PasswordStrengthMeter';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirm) {
      alert('Passwords do not match');
      return;
    }

    // 前端校验：要求必须满足 PasswordStrengthMeter 中的所有规则
    const rulesPassed = password.length >= 6 && /[A-Z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password);
    if (!rulesPassed) {
      setErrorMessage('Password does not meet all requirements.');
      return;
    }

    try {
      const response = await api.post('account/register',  { email, password });

      alert(response.data.message || 'Registration successful!');
      navigate('/login', { state: { fromRegister: true } });

    } catch (error) {
      if (error.response && error.response.data) {
        if (Array.isArray(error.response.data[""])) {
          setErrorMessage(error.response.data[""].join(' '));
        } else {
          setErrorMessage(JSON.stringify(error.response.data));
        }
      } else {
        setErrorMessage('Network error: ' + error.message);
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center">
      <div className="register-container">
        <h2>Register</h2>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <form onSubmit={handleSubmit} className="register-form">
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
            />

            {/* 引用密码强度组件 */}
            <PasswordStrengthMeter password={password} />
          </div>

          <div className="mb-3">
            <label htmlFor="confirm" className="form-label">Confirm Password</label>
            <input
              type="password"
              className={`form-control ${confirm && confirm !== password ? "is-invalid" : ""}`}
              id="confirm"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            {confirm && confirm !== password && (
              <div className="invalid-feedback">Passwords do not match</div>
            )}
          </div>

          <button type="submit" className="btn btn-success w-100">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
