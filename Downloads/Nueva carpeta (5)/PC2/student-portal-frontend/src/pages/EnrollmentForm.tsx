import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStudentContext } from "@contexts/StudentContext";
import { getStudents } from "@services/studentService";
import { getSubjectsOccupancy, getSubjects } from "@services/subjectService";
import { checkEnrollmentAvailability, createEnrollment } from "@services/enrollmentService";
import { type StudentProfileRead } from "@interfaces/models/studentModels";
import { type SubjectRead, type SubjectOccupancyRead } from "@interfaces/models/subjectModels";
import { type EnrollmentAvailabilityCheckResponse } from "@interfaces/models/enrollmentModels";
import Card from "@components/ui/Card";
import Button from "@components/ui/Button";
import LoadingSpinner from "@components/ui/LoadingSpinner";
import ErrorMessage from "@components/ui/ErrorMessage";
import InputField from "@components/ui/InputField";

export default function EnrollmentForm() {
  const navigate = useNavigate();
  const { selectedStudent, selectStudent } = useStudentContext(); // Añadir clearSelectedStudent
  const [currentStep, setCurrentStep] = useState(1);
  const [students, setStudents] = useState<StudentProfileRead[]>([]);
  const [subjects, setSubjects] = useState<SubjectOccupancyRead[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<SubjectRead | null>(null);
  const [availabilityCheck, setAvailabilityCheck] = useState<EnrollmentAvailabilityCheckResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(''); // For student search
  const [subjectSearchTerm, setSubjectSearchTerm] = useState<string>(''); // For subject search

  // Step 1: Select Student
  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getStudents();
        // Ensure each student has all properties required by StudentProfileRead
        const studentsProfile: StudentProfileRead[] = data.map((s: any) => ({
          id: s.id,
          first_name: s.first_name,
          last_name: s.last_name,
          email: s.email,
          dni: s.dni,
          phone: s.phone,
          birth_date: s.birth_date,
          admission_date: s.admission_date,
          profile_photo_key: s.profile_photo_key,
        }));
        setStudents(studentsProfile);
        // If a student was previously selected and is still in the list, keep it selected
        if (selectedStudent && studentsProfile.some(s => s.id === selectedStudent.id)) {
          selectStudent(selectedStudent);
        } else {
          selectStudent(null); // Clear selection if not found
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar la lista de estudiantes.');
      } finally {
        setIsLoading(false);
      }
    };
    if (currentStep === 1) {
      fetchStudents();
    }
  }, [currentStep, selectedStudent, selectStudent]);

  // Step 2: Select Subject
  useEffect(() => {
    const fetchSubjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Obtener ambas listas
        const [occupancyData, subjectsData] = await Promise.all([
          getSubjectsOccupancy(),
          getSubjects(),
        ]);
        // Combinar por id
        const mergedSubjects: SubjectOccupancyRead[] = occupancyData.map((occ: any) => {
          const subjectDetail = subjectsData.find((s: any) => s.id === occ.id) as any || {};
          return {
            ...occ,
            location: subjectDetail.location ?? "",
            credits: subjectDetail.credits ?? 0,
            // Puedes agregar más campos si los necesitas
          };
        });
        setSubjects(mergedSubjects);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar la lista de materias.');
      } finally {
        setIsLoading(false);
      }
    };
    if (currentStep === 2) {
      fetchSubjects();
    }
  }, [currentStep]);

  const handleStudentSelect = (student: StudentProfileRead) => {
    selectStudent(student);
    setSearchTerm(''); // Clear search when selected
    setCurrentStep(2);
  };

  const handleSubjectSelect = async (subject: SubjectRead) => {
    setSelectedSubject(subject);
    setSubjectSearchTerm(''); // Clear search when selected
    setCurrentStep(3);

    // Automatically check availability when subject is selected
    if (selectedStudent && subject) {
      setIsLoading(true);
      setError(null);
      try {
        const availability = await checkEnrollmentAvailability(selectedStudent.id, subject.id);
        setAvailabilityCheck(availability);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al verificar la disponibilidad.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleConfirmEnrollment = async () => {
    if (!selectedStudent || !selectedSubject) {
      setError('Estudiante o materia no seleccionados.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await createEnrollment({
        student_id: selectedStudent.id,
        subject_id: selectedSubject.id,
      });
      navigate('/enrollment/success', { state: { student: selectedStudent, subject: selectedSubject } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al confirmar la matrícula.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStudents = students.filter(student =>
    `${student.first_name} ${student.last_name} ${student.dni}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSubjects = subjects.filter(subject =>
    `${subject.name} ${subject.code}`.toLowerCase().includes(subjectSearchTerm.toLowerCase()) && !subject.is_full
  );


  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Proceso de Matrícula</h1>

      {error && <ErrorMessage message={error} />}
      {isLoading && <LoadingSpinner />}

      {!isLoading && !error && (
        <Card className="p-6">
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Paso 1: Selecciona un Estudiante</h2>
              <InputField
                label="Buscar Estudiante"
                id="studentSearch"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, apellido o DNI"
                className="mb-4"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map(student => (
                    <Button
                      key={student.id}
                      onClick={() => handleStudentSelect(student)}
                      className="text-left py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg flex flex-col items-start"
                    >
                      <span className="font-semibold">{student.first_name} {student.last_name}</span>
                      <span className="text-sm text-gray-600">DNI: {student.dni}</span>
                    </Button>
                  ))
                ) : (
                  <p className="col-span-full text-center text-gray-600">No se encontraron estudiantes.</p>
                )}
              </div>
              {selectedStudent && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                  Estudiante Seleccionado: <span className="font-bold">{selectedStudent.first_name} {selectedStudent.last_name}</span>
                  <Button onClick={() => { setSelectedSubject(null); setCurrentStep(1); }} className="ml-2 text-sm bg-red-400 hover:bg-red-500">
                    Cambiar
                  </Button>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && selectedStudent && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Paso 2: Selecciona una Materia para {selectedStudent.first_name} {selectedStudent.last_name}</h2>
              <InputField
                label="Buscar Materia"
                id="subjectSearch"
                type="text"
                value={subjectSearchTerm}
                onChange={(e) => setSubjectSearchTerm(e.target.value)}
                placeholder="Buscar por nombre o código"
                className="mb-4"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {filteredSubjects.length > 0 ? (
                  filteredSubjects.map(subject => (
                                      <Button
                                        key={subject.id}
                                        onClick={() =>
                                          handleSubjectSelect({
                                            ...subject,
                                            location: (subject as any).location ?? "",
                                            credits: (subject as any).credits ?? 0,
                                          })
                                        }
                                        className={`text-left py-3 px-4 rounded-lg flex flex-col items-start
                                          ${subject.is_full ? 'bg-red-100 text-red-800 cursor-not-allowed opacity-70' : 'bg-green-100 hover:bg-green-200 text-green-800'}
                                        `}
                                        disabled={subject.is_full}
                                      >
                                        <span className="font-semibold">{subject.name} ({subject.code})</span>
                                        <span className="text-sm text-gray-600">
                                          Cupo: {subject.enrolled_students_count} / {subject.capacity}
                                          {subject.is_full && <span className="ml-2 font-bold text-red-700">(Lleno)</span>}
                                        </span>
                                      </Button>
                                    ))
                ) : (
                  <p className="col-span-full text-center text-gray-600">No se encontraron materias disponibles.</p>
                )}
              </div>
              <Button onClick={() => setCurrentStep(1)} className="mt-4 bg-gray-500 hover:bg-gray-600">
                Atrás
              </Button>
            </div>
          )}

          {currentStep === 3 && selectedStudent && selectedSubject && availabilityCheck && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Paso 3: Confirmar Matrícula</h2>
              <p className="mb-2"><strong>Estudiante:</strong> {selectedStudent.first_name} {selectedStudent.last_name} (DNI: {selectedStudent.dni})</p>
              <p className="mb-4"><strong>Materia:</strong> {selectedSubject.name} ({selectedSubject.code})</p>

              <div className={`p-4 rounded-lg mb-4 ${availabilityCheck.is_available ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`}>
                <h3 className="font-bold text-lg mb-2">Verificación de Disponibilidad:</h3>
                <p>{availabilityCheck.message}</p>
                {availabilityCheck.current_enrollments_count !== undefined && (
                    <p>Materias actuales del estudiante: {availabilityCheck.current_enrollments_count}</p>
                )}
              </div>

              <div className="flex space-x-4 mt-6">
                <Button onClick={() => { setAvailabilityCheck(null); setCurrentStep(2); }} className="bg-gray-500 hover:bg-gray-600">
                  Atrás
                </Button>
                {availabilityCheck.is_available && (
                  <Button onClick={handleConfirmEnrollment} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                    {isLoading ? <LoadingSpinner /> : 'Confirmar Matrícula'}
                  </Button>
                )}
              </div>
            </div>
          )}
        </Card>
      )}
    </main>
  );
}