// src/contexts/UserContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../API/axios'

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // Initial state is null
  const [loading, setLoading] = useState(true);  
  
  // login: store token and fetch current user
  const login = async (userData, token) => {
    if (token) localStorage.setItem("token", token);
    setUser(userData);
  };

  // logout: clear token and user state
  const logout = () => {
    localStorage.removeItem("token"); // remove token
    setUser(null);
  };

  // refresh current user info from backend
  const updateUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const res = await api.get("/account/me"); // Authorization header is automatically added
      setUser(res.data);
    } catch (error) {
      console.error("updateUser error:", error);
      localStorage.removeItem('token'); // remove invalid token
      setUser(null);
    }
  };

  // On page load, fetch user if token exists
  useEffect(() => {
    const initUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/account/me");
        setUser(res.data);
      } catch (error) {
        console.error("fetchMe error:", error);
        localStorage.removeItem("token"); // remove invalid token
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initUser();
  }, []);

  const isAdmin = user?.roles?.includes("Admin") || false;

  return (
    <UserContext.Provider value={{ user, isAdmin, loading, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
