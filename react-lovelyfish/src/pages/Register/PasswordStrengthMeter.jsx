import React from 'react';
import './Register.css'; // 可以共用 Register.css

const PasswordStrengthMeter = ({ password }) => {
  // 密码规则
  const rules = [
    { test: (pwd) => pwd.length >= 6, label: 'At least 6 characters' },
    { test: (pwd) => /[A-Z]/.test(pwd), label: 'At least one uppercase letter' },
    { test: (pwd) => /\d/.test(pwd), label: 'At least one number' },
    { test: (pwd) => /[^A-Za-z0-9]/.test(pwd), label: 'At least one special character' },
  ];

  // 计算密码强度（满足多少条规则）
  const strength = rules.reduce((acc, rule) => acc + (rule.test(password) ? 1 : 0), 0);

  // 强度文字
  const strengthLabels = ["", "Weak", "Fair", "Medium", "Strong"];

  return (
    <div className="password-strength-meter">
      {/* 进度条 */}
      <div className={`strength-bar strength-${strength}`}></div>
      {/* 强度文字 */}
      <div className={`strength-text strength-text-${strength}`}>
        {strengthLabels[strength]}
      </div>
      {/* 规则列表 */}
      <ul className="password-rules">
        {rules.map((rule, idx) => (
          <li
            key={idx}
            className={rule.test(password) ? "rule-passed" : "rule-failed"}
          >
            {rule.test(password) ? "✔" : "✖"} {rule.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordStrengthMeter;
