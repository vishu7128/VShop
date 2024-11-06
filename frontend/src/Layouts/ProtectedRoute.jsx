/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const userInfo =
    useSelector((state) => state.auth.user) ||
    JSON.parse(localStorage.getItem("userInfo"));

  // Redirect to login if user is not authenticated
  if (!userInfo) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
