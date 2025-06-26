// src/interfaces/models/enrollmentModels.ts
export interface EnrollmentCreate {
  student_id: number;
  subject_id: number;
}

export interface EnrollmentRead {
  id: number;
  student_id: number;
  subject_id: number;
  enrollment_date: string;
}

// Nueva interfaz para la respuesta de verificación de disponibilidad
export interface EnrollmentAvailabilityCheckResponse {
  is_available: boolean;
  message: string;
  max_subjects_reached?: boolean; // True si el estudiante ya tiene 2 materias
  subject_full?: boolean; // True si la materia no tiene cupo
  already_enrolled?: boolean; // True si ya está matriculado
  current_enrollments_count?: number; // Cantidad de materias en las que ya está matriculado el estudiante
}