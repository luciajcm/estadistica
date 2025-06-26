import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "@contexts/AuthContext";
import Button from "@components/ui/Button";

export default function Navbar() {
  const { logout, session } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirigir a la nueva ruta de login
  };

  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold">Portal de Matrícula</Link>

        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
          <Link to="/subjects" className="hover:text-blue-200">Materias</Link>
          <Link to="/enrollment" className="hover:text-blue-200">Matrícula</Link>
          {session && ( // Mostrar botón de logout solo si hay sesión activa
            <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded-md">
              Cerrar Sesión
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}