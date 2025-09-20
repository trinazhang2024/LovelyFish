// // src/contexts/UserContext.js
// import React, { createContext, useState, useContext, useEffect } from 'react';
// import api from '../API/axios'

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);  // Initial state is null
//   const [loading, setLoading] = useState(true);  
  
//   // Simple login function: set the current user
//   // login(userData) simply sets the current user state; front-end can use /account/me response {name, email}.
//   const login = async(userData) => {
//     setUser(userData); // temporarily store the user data
//     await updateUser(); // ensure that roles and permissions are updated immediately
//   };

//   // Logout: call API to clear backend cookie and reset user
//   // logout calls the API to clear backend cookies to prevent stale sessions; failures are logged but won't block front-end logout logic.
//   const logout = async () => {
//     try {
//       await api.post("/account/logout");
//     } catch (error) {
//       console.error("Logout failed", error);
//     }
//     setUser(null);
//   };

//   // Update user info (refresh the entire user object)
//   const updateUser = async () => {
//     try {
//       const res = await api.get("/account/me");
//       setUser(res.data);
//     } catch (error) {
//       console.error("updateUser error:", error);
//     }
//   };

//   // ✅ Automatically fetch user info on page refresh
//   useEffect(() => {
//     const fetchMe = async () => {
//       try {
//         const res = await api.get("/account/me");

//         console.log("Current user info:", res.data); // ✅ Log for inspection

//         setUser(res.data); // res.data may contain roles = ["Admin"] or empty array

//       } catch(error){
//         console.error("fetchMe error:", error);
//         setUser(null); // Clear user state on failure
//       }
//       finally {
//         setLoading(false); // End loading state regardless of success/failure
//       }
//     };
//     fetchMe();
//   }, []);

//   const isAdmin = user?.roles?.includes("Admin") || false;

//   return (
//     <UserContext.Provider value={{ user, isAdmin, loading, login, logout, updateUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => useContext(UserContext);

// src/contexts/UserContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../API/axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // 当前用户信息
  const [loading, setLoading] = useState(true); // 页面加载期间保持 loading

  // 登录：存 token + 拉取用户信息
  const login = async (credentials) => {
    try {
      const res = await api.post("/account/login", credentials);
      localStorage.setItem("token", res.data.token);

      const meRes = await api.get("/account/me");
      setUser(meRes.data);
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  // 登出：清 token + 清前端状态
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // 更新用户信息（可手动刷新角色/权限）
  const updateUser = async () => {
    try {
      const res = await api.get("/account/me");
      setUser(res.data);
    } catch (err) {
      console.error("updateUser failed:", err);
      logout(); // token 无效或过期 → 安全登出
    }
  };

  // 页面刷新自动拉取用户信息
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    api.get("/account/me")
      .then(res => setUser(res.data))
      .catch(err => {
        console.error("fetchMe failed:", err);
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const isAdmin = user?.roles?.includes("Admin") || false;

  return (
    <UserContext.Provider value={{ user, isAdmin, loading, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);



