// src/components/ProtectedRoute.js
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../Redux/Slice/authSlice";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useSelector(isAuthenticated);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
