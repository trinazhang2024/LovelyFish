import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const UserLoginRedirect = ({ children }) => {
  const { isAdmin, user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // If the user is logged in and is an admin, navigate to the admin dashboard
    if (user && isAdmin) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [user, isAdmin, navigate]);

  // If already an admin, render Navigate to prevent flickering of the login page
  if (isAdmin) return <Navigate to="/admin/dashboard" replace />;

  return children; // If not logged in or not an admin, render the child components (e.g., login page)
};

export default UserLoginRedirect;
