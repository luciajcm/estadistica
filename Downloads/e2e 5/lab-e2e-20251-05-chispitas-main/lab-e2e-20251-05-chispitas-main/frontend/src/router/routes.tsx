import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "src/App";
import { ProtectedRoute } from "./ProtectedRoute";
import LoginPage from "@pages/LoginPage";
import RegisterPage from "@pages/RegisterPage";
import DashboardPage from "@pages/DashboardPage";
import EditProfilePage from "@pages/EditProfilePage";
import EditVehiclePage from "@pages/EditVehiclePage";
import NotFoundPage from "@pages/NotFoundPage";

export const router = createBrowserRouter([{
	path: "/",
	element: <App />,
	children: [
	{
		path: "/",
		element: <Navigate to="/auth/login" replace />
	},
	{
		path: "auth",
		children: [
			{
				path: "login",
				element: <LoginPage />
			}
			,{
				path: "register",
				element: <RegisterPage />
			}
		]
	},
		// Rutas protegidas
	{
		path: "/",
		element: <ProtectedRoute />,
		children: [
			{
				path: "dashboard",
				element: <DashboardPage />
			},
			{
				path: "profile/edit",
				element: <EditProfilePage />
			},
			{
				path: "vehicle/edit",
				element: <EditVehiclePage />
			}
		]
	},
	// Ruta no encontrada
	{
		path: "*",
		element: <NotFoundPage />
	}
]
}]);
