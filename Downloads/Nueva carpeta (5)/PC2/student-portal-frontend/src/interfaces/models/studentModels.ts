export interface StudentCreate {
  first_name: string;
  last_name: string;
  email: string;
  dni: string;
  phone: string;
  birth_date: string; // Asumiendo formato de fecha como string
  admission_date: string; // Asumiendo formato de fecha como string
}

export interface StudentProfileRead {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  dni: string;
  phone: string | null;
  birth_date: string; // Asumiendo formato de fecha como string
  admission_date: string; // Asumiendo formato de fecha como string
  profile_photo_key: string | null;
}

