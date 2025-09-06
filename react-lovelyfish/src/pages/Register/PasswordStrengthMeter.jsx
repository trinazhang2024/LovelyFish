import React from 'react';
import './Register.css'; // Reuse Register.css for styling

const PasswordStrengthMeter = ({ password }) => {
  // Password validation rules
  const rules = [
    { test: (pwd) => pwd.length >= 6, label: 'At least 6 characters' },
    { test: (pwd) => /[A-Z]/.test(pwd), label: 'At least one uppercase letter' },
    { test: (pwd) => /\d/.test(pwd), label: 'At least one number' },
    { test: (pwd) => /[^A-Za-z0-9]/.test(pwd), label: 'At least one special character' },
  ];

  // Count how many rules are satisfied
  const strength = rules.reduce((acc, rule) => acc + (rule.test(password) ? 1 : 0), 0);

  // Labels for different strength levels
  const strengthLabels = ["", "Weak", "Fair", "Medium", "Strong"];

  return (
    <div className="password-strength-meter">
      {/* Strength progress bar (visual indicator) */}
      <div className={`strength-bar strength-${strength}`}></div>
      
      {/* Strength label text */}
      <div className={`strength-text strength-text-${strength}`}>
        {strengthLabels[strength]}
      </div>

      {/* List of password rules */}
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
