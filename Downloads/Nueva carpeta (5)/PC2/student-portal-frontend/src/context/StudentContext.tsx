import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
// Update the import path below to the correct relative path where studentModels is located, for example:
import { type StudentProfileRead } from '../interfaces/models/studentModels';
// Or adjust the path as needed based on your project structure
// Update the import path below to the correct relative path where useStorageState is located, for example:
import { useStorageState } from '../hooks/useStorageState';

interface StudentContextType {
  selectedStudent: StudentProfileRead | null;
  selectStudent: (student: StudentProfileRead | null) => void;
  isLoading: boolean;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export function StudentProvider({ children }: { children: ReactNode }) {
  // Usamos useStorageState para persistir el estudiante seleccionado
  const [[isLoading, storedStudent], setStoredStudent] = useStorageState("selected_student");
  const [selectedStudent, setSelectedStudent] = useState<StudentProfileRead | null>(null);

  useEffect(() => {
    // Cuando el storedStudent de localStorage se carga, lo parseamos y lo establecemos
    if (!isLoading && storedStudent) {
      try {
        setSelectedStudent(JSON.parse(storedStudent));
      } catch (e) {
        console.error("Failed to parse stored student", e);
        setStoredStudent(null); // Clear invalid data
      }
    } else if (!isLoading && !storedStudent) {
        setSelectedStudent(null); // No stored student
    }
  }, [isLoading, storedStudent, setStoredStudent]);


  const selectStudent = (student: StudentProfileRead | null) => {
    setSelectedStudent(student);
    if (student) {
      setStoredStudent(JSON.stringify(student));
    } else {
      setStoredStudent(null);
    }
  };

  return (
    <StudentContext.Provider value={{ selectedStudent, selectStudent: selectStudent, isLoading }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudentContext() {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudentContext must be used within a StudentProvider');
  }
  return context;
}