import React from 'react';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* El Outlet renderizará la ruta activa, incluyendo Navbar si está definida en el router */}
      <Outlet />
    </div>
  );
}

export default App;