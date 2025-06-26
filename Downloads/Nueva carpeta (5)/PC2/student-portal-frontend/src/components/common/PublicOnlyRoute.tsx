// src/components/common/PublicOnlyRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
// Update the import path below if your AuthContext is located elsewhere
import { useAuthContext } from "../../contexts/AuthContext";

export function PublicOnlyRoute() {
    const { session, isLoading } = useAuthContext();

    if (isLoading) {
        // Still checking auth state (e.g., from localStorage), render nothing for now
        return null;
    }

    if (session) {
        // If authenticated, redirect away from public-only pages (like login/register)
        return <Navigate to="/dashboard" replace />;
    }

    // If not loading and no session, render the child routes (e.g., LoginPage, RegisterPage)
    return <Outlet />;
}