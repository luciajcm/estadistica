// src/interfaces/models/subjectModels.ts
export interface SubjectRead {
  id: number;
  name: string;
  code: string;
  location: string | null;
  credits: number;
  capacity: number; // Añadido campo 'capacity'
}

export interface SubjectCreate {
  name: string;
  code: string;
  location?: string;
  credits: number;
  capacity: number;
}

// Nueva interfaz para la respuesta de ocupación de materias
export interface SubjectOccupancyRead {
  id: number;
  name: string;
  code: string;
  capacity: number;
  enrolled_students_count: number;
  is_full: boolean;
}

// Nueva interfaz para estadísticas generales del dashboard
export interface DashboardStats {
  total_students: number;
  total_subjects: number;
  total_enrollments: number;
  most_popular_subjects: SubjectOccupancyRead[]; // Materias con más inscritos
}