import { Navigate, useLocation } from "react-router-dom";
import { AUTH_TOKEN_KEY } from "../config/auth";

export default function ProtectedRoute({
  children,
  isAuthenticated,
  isCheckingAuth,
}) {
  const location = useLocation();

  if (isCheckingAuth) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#FFF7D6]">
        <div className="rounded-[20px] border-[4px] border-black bg-[#4ADE80] px-6 py-4 text-sm font-black shadow-[6px_6px_0_#000]">
          Mengecek sesi login...
        </div>
      </main>
    );
  }

  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
