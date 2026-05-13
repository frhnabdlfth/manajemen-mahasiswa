import { Navigate } from "react-router-dom";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "../config/auth";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const user = localStorage.getItem(AUTH_USER_KEY);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
