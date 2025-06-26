import Api from "./api";
import { type EnrollmentCreate, type EnrollmentRead, type EnrollmentAvailabilityCheckResponse } from "@interfaces/models/enrollmentModels";

export async function createEnrollment(enrollmentData: EnrollmentCreate): Promise<EnrollmentRead> {
  const api = await Api.getInstance();
  const response = await api.post<EnrollmentCreate, EnrollmentRead>(enrollmentData, { url: '/enrollments/' });
  return response.data;
}

export async function checkEnrollmentAvailability(studentId: number, subjectId: number): Promise<EnrollmentAvailabilityCheckResponse> {
  const api = await Api.getInstance();
  const response = await api.get<void, EnrollmentAvailabilityCheckResponse>({ url: `/enrollments/check_availability/?student_id=${studentId}&subject_id=${subjectId}` });
  return response.data;
}

export async function getEnrollmentsBySubject(subjectId: number): Promise<EnrollmentRead[]> {
  const api = await Api.getInstance();
  const response = await api.get<void, EnrollmentRead[]>({ url: `/enrollments/?subject_id=${subjectId}` });
  return response.data;
}

// Si necesitas obtener las matrículas de un estudiante (ej. para verificar sus materias actuales)
export async function getEnrollmentsByStudent(studentId: number): Promise<EnrollmentRead[]> {
  const api = await Api.getInstance();
  const response = await api.get<void, EnrollmentRead[]>({ url: `/enrollments/?student_id=${studentId}` });
  return response.data;
}