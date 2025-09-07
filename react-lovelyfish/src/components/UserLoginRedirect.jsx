import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const UserLoginRedirect = ({ children }) => {
  const { isAdmin, user } = useUser();
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false); // Flag to mark if login status has been checked

  useEffect(() => {
    // Trigger redirect when user state updates
    if (user) {
      if (isAdmin) {
        navigate("/admin/dashboard");
      }
      setChecked(true); // Mark as checked
    } else {
      setChecked(true);
    }
  }, [user, isAdmin, navigate]);

  // If login status hasn't been checked yet, don't render children
  if (!checked) return null;

  // If already logged in as Admin, use Navigate to prevent flickering
  if (isAdmin) return <Navigate to="/admin/dashboard" replace />;

  return children; // Not logged in or not Admin, render children normally (e.g., login page)
};

export default UserLoginRedirect;
