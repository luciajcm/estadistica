import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSubjectById } from "@services/subjectService";
import { getEnrollmentsBySubject } from "@services/enrollmentService";
import { type SubjectRead } from "@interfaces/models/subjectModels";
import { type StudentProfileRead } from "@interfaces/models/studentModels"; // Para los estudiantes matriculados
import Card from "@components/ui/Card";
import LoadingSpinner from "@components/ui/LoadingSpinner";
import ErrorMessage from "@components/ui/ErrorMessage";
import Table from "@components/ui/Table";
import { getStudents } from "@services/studentService"; // Para obtener detalles del estudiante

export default function SubjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [subject, setSubject] = useState<SubjectRead | null>(null);
  const [enrolledStudents, setEnrolledStudents] = useState<StudentProfileRead[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('ID de materia no proporcionado.');
      setIsLoading(false);
      return;
    }

    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const subjectId = parseInt(id, 10);
        if (isNaN(subjectId)) {
          setError('ID de materia inválido.');
          setIsLoading(false);
          return;
        }

        const subjectData = await getSubjectById(subjectId);
        setSubject(subjectData);

        const enrollmentsData = await getEnrollmentsBySubject(subjectId);
        const allStudents = await getStudents(); // Obtener todos los estudiantes para mapear

        const studentsInSubject = enrollmentsData
          .map(enrollment => allStudents.find(s => s.id === enrollment.student_id))
          .filter((s): s is StudentProfileRead => s !== undefined);

        setEnrolledStudents(studentsInSubject);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar los detalles de la materia.');
        setSubject(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [id, navigate]);

  const enrolledPercentage = subject ? ((enrolledStudents.length / subject.capacity) * 100).toFixed(1) : '0';

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!subject) return <p className="text-center text-gray-600">Materia no encontrada.</p>;

  const studentsTableHeaders = ["Nombre", "DNI", "Email"];
  const studentsTableRows = enrolledStudents.map(student => [
    `${student.first_name} ${student.last_name}`,
    student.dni,
    student.email,
  ]);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Detalles de la Materia: {subject.name}</h1>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Información General</h2>
          <p><strong>Código:</strong> {subject.code}</p>
          <p><strong>Créditos:</strong> {subject.credits}</p>
          <p><strong>Ubicación:</strong> {subject.location || 'N/A'}</p>
          <p><strong>Capacidad:</strong> {subject.capacity} estudiantes</p>
          <p><strong>Inscritos:</strong> {enrolledStudents.length} estudiantes</p>
          <div className="mt-4">
            <p className="text-sm font-semibold mb-1">Ocupación: {enrolledPercentage}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className={`h-2.5 rounded-full ${enrolledPercentage === '100.0' ? 'bg-red-600' : 'bg-blue-600'}`}
                style={{ width: `${enrolledPercentage}%` }}
              ></div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Estudiantes Matriculados ({enrolledStudents.length})</h2>
          {enrolledStudents.length > 0 ? (
            <Table headers={studentsTableHeaders} rows={studentsTableRows} />
          ) : (
            <p className="text-gray-600">No hay estudiantes matriculados en esta materia aún.</p>
          )}
        </Card>
      </section>
    </main>
  );
}