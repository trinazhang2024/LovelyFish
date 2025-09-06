// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

/*
 A wrapper component to protect routes that require authentication.
 If the user is not logged in, they will be redirected to the login page.
 */
const ProtectedRoute = ({ children }) => {
  const { user } = useUser(); // Get current user state from context

  // If the user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If the user is logged in, render the protected component
  return children;
};

export default ProtectedRoute;
