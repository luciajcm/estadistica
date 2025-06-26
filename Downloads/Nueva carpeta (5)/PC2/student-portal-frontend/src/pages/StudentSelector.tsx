import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudentContext } from "../contexts/StudentContext";
import { getStudents } from "@services/studentService";
import { type StudentProfileRead } from "@interfaces/models/studentModels";
import Card from "@components/ui/Card";
import Button from "@components/ui/Button";
import LoadingSpinner from "@components/ui/LoadingSpinner";
import ErrorMessage from "@components/ui/ErrorMessage";

export default function StudentSelector() {
  const { selectStudent, selectedStudent, isLoading: isStudentContextLoading } = useStudentContext();
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentProfileRead[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Si ya hay un estudiante seleccionado, redirigir al dashboard
    if (!isStudentContextLoading && selectedStudent) {
      navigate('/dashboard', { replace: true });
      return;
    }

    const fetchStudents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getStudents();
        // Ensure each student has the required properties for StudentProfileRead
        setStudents(
          data.map((student: any) => ({
            id: student.id,
            first_name: student.first_name,
            last_name: student.last_name,
            email: student.email ?? "",
            dni: student.dni ?? "",
            phone: student.phone ?? "",
            birth_date: student.birth_date ?? "",
            admission_date: student.admission_date ?? "",
            profile_photo_key: student.profile_photo_key ?? ""
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar la lista de estudiantes.');
      } finally {
        setIsLoading(false);
      }
    };

    // Solo cargar si el contexto del estudiante no está cargando y no hay un estudiante seleccionado
    if (!isStudentContextLoading && !selectedStudent) {
        fetchStudents();
    }
  }, [selectStudent, navigate, selectedStudent, isStudentContextLoading]);

  const handleSelectStudent = (student: StudentProfileRead) => {
    selectStudent(student);
    navigate('/dashboard');
  };

  if (isLoading || isStudentContextLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Selecciona un Estudiante</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.length > 0 ? (
          students.map(student => (
            <Card key={student.id} className="p-6 flex flex-col items-center text-center">
              <h2 className="text-xl font-semibold mb-2">{student.first_name} {student.last_name}</h2>
              <p className="text-gray-600 mb-4">DNI: {student.dni}</p>
              <Button onClick={() => handleSelectStudent(student)}>
                Seleccionar
              </Button>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600">No hay estudiantes disponibles.</p>
        )}
      </div>
    </main>
  );
}