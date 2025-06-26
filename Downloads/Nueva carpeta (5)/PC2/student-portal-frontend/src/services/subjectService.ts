import Api from "./api";
import { type SubjectRead, type SubjectCreate, type SubjectOccupancyRead, type DashboardStats } from "@interfaces/models/subjectModels";
import { getStudents } from "./studentService";

export async function getSubjects(): Promise<SubjectRead[]> {
  const api = await Api.getInstance();
  const response = await api.get<void, SubjectRead[]>({ url: '/subjects/' });
  return response.data;
}

export async function getSubjectById(subjectId: number): Promise<SubjectRead> {
  const api = await Api.getInstance();
  const response = await api.get<void, SubjectRead>({ url: `/subjects/${subjectId}/` });
  return response.data;
}

export async function getSubjectsOccupancy(): Promise<SubjectOccupancyRead[]> {
  const api = await Api.getInstance();
  const response = await api.get<void, SubjectOccupancyRead[]>({ url: '/subjects/occupancy/' });
  return response.data;
}

export async function createSubject(subjectData: SubjectCreate): Promise<SubjectRead> {
  const api = await Api.getInstance();
  const response = await api.post<SubjectCreate, SubjectRead>(subjectData, { url: '/subjects/' });
  return response.data;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const api = await Api.getInstance();
  // Asumo un endpoint /dashboard/stats o similar si no existe, combina datos de /students/, /subjects/occupancy/, etc.
  // Por simplicidad, haré llamadas a endpoints existentes y combinaré.
  const students = await getStudents();
  const subjectsOccupancy = await getSubjectsOccupancy();
  const allSubjects = await getSubjects();

  // Calcular total de matrículas (requeriría un endpoint o iteración)
  // Como no hay un endpoint directo para 'total_enrollments', lo estimamos o lo ignoramos si no es crítico.
  // Para ser precisos, necesitaríamos un endpoint para el conteo global de matrículas o iterar todos los subjects/enrollments.
  // Aquí, lo dejo como 0 si no hay forma de calcularlo directamente sin otro endpoint.
  let totalEnrollments = 0;
  subjectsOccupancy.forEach(s => totalEnrollments += s.enrolled_students_count);

  // Ordenar por popularidad (más inscritos)
  const mostPopularSubjects = [...subjectsOccupancy].sort((a, b) => b.enrolled_students_count - a.enrolled_students_count);


  return {
    total_students: students.length,
    total_subjects: allSubjects.length,
    total_enrollments: totalEnrollments,
    most_popular_subjects: mostPopularSubjects.slice(0, 5), // Top 5
  };
}