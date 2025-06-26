import { useState, useEffect } from "react";
import { getSubjectsOccupancy } from "@services/subjectService";
import { type SubjectOccupancyRead } from "@interfaces/models/subjectModels";
import Card from "@components/ui/Card";
import Table from "@components/ui/Table";
import LoadingSpinner from "@components/ui/LoadingSpinner";
import ErrorMessage from "@components/ui/ErrorMessage";
import InputField from "@components/ui/InputField";
import { useDebounce } from "@hooks/useDebounce";
import { Link } from "react-router-dom";
import Button from "@components/ui/Button";

export default function SubjectsList() {
  const [subjects, setSubjects] = useState<SubjectOccupancyRead[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getSubjectsOccupancy();
        setSubjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar las materias.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredSubjects = subjects.filter(subject =>
    `${subject.name} ${subject.code}`.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const tableHeaders = ["Nombre", "Código", "Ocupación", "Estado", "Acciones"];

  const tableRows = filteredSubjects.map(subject => [
    subject.name,
    subject.code,
    `${subject.enrolled_students_count} / ${subject.capacity}`,
    <span key={`${subject.id}-status`} className={`px-2 py-1 rounded-full text-xs font-semibold ${
      subject.is_full ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
    }`}>
      {subject.is_full ? 'Lleno' : 'Disponible'}
    </span>,
    <Link key={`${subject.id}-details`} to={`/subjects/${subject.id}`} className="text-blue-600 hover:underline">
      Ver Detalles
    </Link>
  ]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Gestión de Materias</h1>

      <div className="flex justify-between items-center mb-6">
        <InputField
          label="Buscar Materia"
          id="subjectSearch"
          type="text"
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre o código"
          className="w-full md:w-1/2"
        />
        <Link to="/subjects/new">
          <Button>Crear Nueva Materia</Button>
        </Link>
      </div>

      {filteredSubjects.length > 0 ? (
        <Card className="p-4 overflow-x-auto">
          <Table headers={tableHeaders} rows={tableRows} />
        </Card>
      ) : (
        <p className="text-center text-gray-600">No se encontraron materias.</p>
      )}
    </main>
  );
}