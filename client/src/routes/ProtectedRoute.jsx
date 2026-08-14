import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  selectInitialized,
  selectIsAuthenticated,
} from "../features/auth/authSelectors";

function ProtectedRoute() {
  const initialized = useSelector(selectInitialized);

  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
