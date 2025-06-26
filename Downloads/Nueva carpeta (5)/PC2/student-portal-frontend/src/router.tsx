import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import Navbar from "@components/common/Navbar";
import LoginPage from "@pages/LoginPage";
import Dashboard from "@pages/Dashboard";
import SubjectsList from "@pages/SubjectsList";
import SubjectForm from "@pages/SubjectForm";
import SubjectDetails from "@pages/SubjectDetails";
import EnrollmentForm from "@pages/EnrollmentForm";
import EnrollmentConfirmation from "@pages/EnrollmentConfirmation";
import { PublicOnlyRoute } from "./components/common/PublicOnlyRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // 1. Public Authentication Routes (e.g., /auth/login)
      {
        element: <PublicOnlyRoute />,
        children: [
          {
            path: "auth",
            children: [
              {
                path: "login",
                element: <LoginPage />
              },
              // Puedes agregar más rutas públicas aquí
            ]
          }
        ]
      },
      // 2. Protected Routes (require authentication and will display Navbar)
      {
        element: (
          <>
            <Navbar />
            <ProtectedRoute />
          </>
        ),
        children: [
          {
            path: "/",
            element: <Navigate to="dashboard" replace />
          },
          {
            path: "dashboard",
            element: <Dashboard />
          },
          {
            path: "subjects",
            children: [
              { index: true, element: <SubjectsList /> },
              { path: "new", element: <SubjectForm /> },
              { path: ":id", element: <SubjectDetails /> }
            ]
          },
          {
            path: "enrollment",
            children: [
              { index: true, element: <EnrollmentForm /> },
              { path: "success", element: <EnrollmentConfirmation /> }
            ]
          }
        ]
      },
      // 3. Catch-all route for any undefined paths (404)
      {
        path: "*",
        element: <div className="text-center text-2xl font-bold mt-20">404 - Página No Encontrada</div>
      }
    ]
  }
]);