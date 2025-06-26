import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "@contexts/AuthContext"; // Ensure this import path is correct

export function ProtectedRoute() {
    const authContext = useAuthContext();
    const location = useLocation();

    // Add console logs here
    console.log("ProtectedRoute rendering...");
    console.log("  isLoading:", authContext.isLoading);
    console.log("  session:", authContext.session);
    console.log("  Current Pathname:", location.pathname);

    if (authContext.isLoading) {
        console.log("ProtectedRoute: Authentication is still loading, returning null.");
        return null; // Or a loading spinner
    }

    if (!authContext.session) {
        console.log("ProtectedRoute: No session found, redirecting to /auth/login.");
        // Make sure this path exactly matches the public login route in routes.tsx
        return <Navigate to={`/auth/login?from=${location.pathname}`} replace />;
    }

    console.log("ProtectedRoute: Session found, rendering Outlet for protected content.");
    return <Outlet />;
}