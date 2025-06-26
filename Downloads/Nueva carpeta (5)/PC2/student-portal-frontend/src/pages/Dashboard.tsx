import { useEffect, useState } from "react";
import { getDashboardStats } from "@services/subjectService";
import { type DashboardStats } from "@interfaces/models/subjectModels";
import Card from "@components/ui/Card";
import LoadingSpinner from "@components/ui/LoadingSpinner";
import ErrorMessage from "@components/ui/ErrorMessage";
import { Link } from "react-router-dom";
import { useAuthContext } from "@contexts/AuthContext";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { session, isLoading: authLoading } = useAuthContext();

  useEffect(() => {
    if (!authLoading && session) {
      const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const dashboardStats = await getDashboardStats();
          setStats(dashboardStats);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Error al cargar las estadísticas del dashboard.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    } else if (!authLoading && !session) {
      setIsLoading(false);
      setError("No autenticado. Por favor, inicie sesión.");
    }
  }, [session, authLoading]);

  if (isLoading || authLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!stats) return <p className="text-center">No se pudieron cargar las estadísticas.</p>;

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Dashboard del Portal de Matrícula</h1>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Total Estudiantes</h2>
          <p className="text-4xl font-bold text-blue-600">{stats.total_students ?? 0}</p>
        </Card>
        <Card className="p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Total Materias</h2>
          <p className="text-4xl font-bold text-green-600">{stats.total_subjects ?? 0}</p>
        </Card>
        <Card className="p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Total Matrículas</h2>
          <p className="text-4xl font-bold text-purple-600">{stats.total_enrollments ?? 0}</p>
        </Card>
      </section>

      <Card className="p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Accesos Rápidos</h2>
        <div className="flex flex-col space-y-3">
          <button
            className="bg-blue-200 hover:bg-blue-300 text-blue-800 font-semibold py-2 px-4 rounded-lg text-center transition duration-200"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Ver Estadísticas Generales
          </button>
          <Link to="/subjects" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg text-center transition duration-200">
            Ver Gestión de Materias
          </Link>
          <Link to="/subjects/new" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg text-center transition duration-200">
            Crear Nueva Materia
          </Link>
          <Link to="/enrollment" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg text-center transition duration-200">
            Iniciar Proceso de Matrícula
          </Link>
        </div>
      </Card>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Materias Más Populares</h2>
          {stats.most_popular_subjects.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2">
              {stats.most_popular_subjects.map(subject => (
                <li key={subject.id}>
                  {subject.name ?? "Sin nombre"} ({subject.code ?? "Sin código"}) - {subject.enrolled_students_count} inscritos
                  <Link
                    to={`/subjects/${subject.id}`}
                    className="ml-4 text-blue-600 underline hover:text-blue-800"
                  >
                    Ver Detalles
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay materias populares aún.</p>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Accesos Rápidos</h2>
          <div className="flex flex-col space-y-3">
            <Link to="/subjects" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg text-center transition duration-200">
              Ver Gestión de Materias
            </Link>
            <Link to="/subjects/new" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg text-center transition duration-200">
              Crear Nueva Materia
            </Link>
            <Link to="/enrollment" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg text-center transition duration-200">
              Iniciar Proceso de Matrícula
            </Link>
          </div>
        </Card>
      </section>
    </main>
  );
}