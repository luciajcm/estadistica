import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "@components/ui/Card";
import Button from "@components/ui/Button";
import { type StudentProfileRead } from "@interfaces/models/studentModels";
import { type SubjectRead } from "@interfaces/models/subjectModels";
import LoadingSpinner from "@components/ui/LoadingSpinner";

interface EnrollmentSuccessState {
  student: StudentProfileRead;
  subject: SubjectRead;
}

export default function EnrollmentConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [enrollmentDetails, setEnrollmentDetails] = useState<EnrollmentSuccessState | null>(null);

  useEffect(() => {
    // Recuperar los detalles del estado de la navegación
    if (location.state && (location.state as EnrollmentSuccessState).student && (location.state as EnrollmentSuccessState).subject) {
      setEnrollmentDetails(location.state as EnrollmentSuccessState);
    } else {
      // Si no hay estado, redirigir al inicio del proceso de matrícula
      navigate('/enrollment', { replace: true });
    }
  }, [location.state, navigate]);

  if (!enrollmentDetails) {
    return (
      <main className="container mx-auto p-4 flex justify-center items-center h-screen">
        <LoadingSpinner />
      </main>
    );
  }

  const { student, subject } = enrollmentDetails;

  return (
    <main className="container mx-auto p-4 flex justify-center items-center h-screen">
      <Card className="p-8 text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-green-600 mb-4">¡Matrícula Exitosa!</h1>
        <p className="text-lg text-gray-800 mb-2">El estudiante ha sido matriculado con éxito:</p>
        <p className="mb-1"><strong>Estudiante:</strong> {student.first_name} {student.last_name}</p>
        <p className="mb-4"><strong>Materia:</strong> {subject.name} ({subject.code})</p>

        <div className="flex flex-col space-y-3 mt-6">
          <Button onClick={() => navigate('/dashboard')} className="bg-blue-600 hover:bg-blue-700">
            Ir al Dashboard
          </Button>
          <Button onClick={() => navigate('/enrollment')} className="bg-gray-500 hover:bg-gray-600">
            Realizar Nueva Matrícula
          </Button>
          <Button onClick={() => navigate('/subjects')} className="bg-purple-600 hover:bg-purple-700">
            Ver Lista de Materias
          </Button>
        </div>
      </Card>
    </main>
  );
}