import React, { createContext, useContext, useState, useEffect } from 'react';
import './Toast.css';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [message, setMessage] = useState(null);
  const [visible, setVisible] = useState(false);
  const [duration, setDuration] = useState(3000);

  const showToast = (msg, ms = 3000) => {
    setMessage(msg);
    setDuration(ms);
    setVisible(true);
  };

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && (
        <div className={`global-toast ${visible ? 'show' : 'hide'}`}>
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
};
