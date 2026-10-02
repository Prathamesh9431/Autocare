import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedAdminRoute({ children }) {

  const { user } = useContext(AuthContext);

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin
  if (user.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  // Admin
  return children;
}

export default ProtectedAdminRoute;