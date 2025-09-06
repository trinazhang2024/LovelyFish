import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

/*
 A wrapper component to protect admin routes.
 Only allows access if the user is logged in and has admin privileges.
 */
const ProtectedAdminRoute = ({ children }) => {
  const { user, isAdmin } = useUser(); // ✅ Get user state and admin flag from context

  // If user state is null, we are still checking login status
  if (user === null) return <p>Checking login status...</p>;

  // If user is not an admin, redirect to the admin login page
  if (!isAdmin) return <Navigate to="/admin/login" />;

  // User is logged in and is an admin, render the protected content
  return children;
};

export default ProtectedAdminRoute;
