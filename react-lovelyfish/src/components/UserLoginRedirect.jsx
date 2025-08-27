import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from ".././contexts/UserContext";

const UserLoginRedirect = ({ children }) => {
  const { isAdmin } = useUser();
  if (isAdmin) return <Navigate to="/admin/dashboard" />;
  return children;
};

export default UserLoginRedirect;
