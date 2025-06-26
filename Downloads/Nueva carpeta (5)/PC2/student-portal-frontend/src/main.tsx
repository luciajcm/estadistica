// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router.tsx'; // Correct relative path
import './index.css';
import { AuthProvider } from './contexts/AuthContext.tsx'; // Ensure 'contexts' (plural)
import { StudentProvider } from './contexts/StudentContext.tsx'; // Ensure 'contexts' (plural)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <StudentProvider>
        <RouterProvider router={router} />
      </StudentProvider>
    </AuthProvider>
  </React.StrictMode>,
);