// src/contexts/UserContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../API/axios'

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // 初始为 null

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post("/account/logout");
    } catch (error) {
      console.error("Logout failed", error);
    }
    setUser(null);
  };

  // 更新用户资料（刷新整个 user 对象）
  const updateUser = async () => {
    try {
      const res = await api.get("/account/me");
      setUser(res.data);
    } catch (error) {
      console.error("updateUser error:", error);
    }
  };


  // ✅ 刷新页面时自动获取用户信息
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get("/account/me");
        setUser(res.data);
      } catch(error){
        console.error("fetchMe error:", error);
        setUser(null);
      }
    };
    fetchMe();
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

// login(userData) 函数简单设置当前用户状态，前端拿 /account/me 返回的 {name, email} 就很好了。

// logout 做了 API 调用清理后端 Cookie，防止后端会话残留，调用失败时打印错误，保证不会阻塞前端退出逻辑。

// 刷新时 useEffect 里调 /account/me ，如果失败则清空用户状态，保持前端和后端状态一致。

// 你可以在 UserContext.Provider 里根据 user 状态做更多逻辑，比如是否登录，角色判断等。
