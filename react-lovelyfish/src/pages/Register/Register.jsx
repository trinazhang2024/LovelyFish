import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; //用 navigate 跳转到登录页，注册完or还是停在原地。
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errorMessage, setErrorMessage]=useState('')

  const navigate = useNavigate();

  // 简单的密码规则验证
  const validatePassword = (pwd) => {
    const hasUppercase = /[A-Z]/.test(pwd);
    const hasDigit = /\d/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
    const minLength = pwd.length >= 6;
    return hasUppercase && hasDigit && hasSpecial && minLength;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirm) {
      alert('Passwords do not match');
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage('Password must have at least 6 characters, one uppercase letter, one number, and one special character.');
      return;
    }


    try {
      const response = await axios.post(
        'https://localhost:7148/api/account/register', //here must be carefully, its 'https' not 'http'
        {email, password});
    

      alert(response.data.message || 'Registration successful!');

      // 注册成功后跳转到登录页，传递状态消息
      navigate('/login', { state: { fromRegister: true } });

    } catch (error) {
      if (error.response && error.response.data) {
        // 处理 Identity 返回的数组错误
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
            <input type="email" className="form-control" id="email" value={email}
                  onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" value={password}
                  onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label htmlFor="confirm" className="form-label">Confirm Password</label>
            <input type="password" className="form-control" id="confirm" value={confirm}
                  onChange={(e) => setConfirm(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-success w-100">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
