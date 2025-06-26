import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSubject } from "@services/subjectService";
import { type SubjectCreate } from "@interfaces/models/subjectModels";
import InputField from "@components/ui/InputField";
import Button from "@components/ui/Button";
import ErrorMessage from "@components/ui/ErrorMessage";
import LoadingSpinner from "@components/ui/LoadingSpinner";
import Card from "@components/ui/Card";

export default function SubjectForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SubjectCreate>({
    name: '',
    code: '',
    location: '',
    credits: 0,
    capacity: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === 'credits' || id === 'capacity' ? parseInt(value, 10) || 0 : value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "El nombre de la materia es requerido.";
    if (!formData.code.trim()) return "El código de la materia es requerido.";
    if (formData.credits <= 0) return "Los créditos deben ser un número positivo.";
    if (formData.capacity <= 0) return "La capacidad debe ser un número positivo.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      await createSubject(formData);
      setSuccessMessage('Materia creada exitosamente!');
      setFormData({ name: '', code: '', location: '', credits: 0, capacity: 0 }); // Reset form
      navigate('/subjects'); // Redirigir a la lista de materias
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la materia.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Crear Nueva Materia</h1>
      <Card className="p-6 max-w-lg mx-auto">
        <form onSubmit={handleSubmit}>
          <InputField
            label="Nombre de la Materia"
            id="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ej. Introducción a la Programación"
            required
          />
          <InputField
            label="Código de la Materia"
            id="code"
            type="text"
            value={formData.code}
            onChange={handleChange}
            placeholder="Ej. CS101"
            required
          />
          <InputField
            label="Ubicación (opcional)"
            id="location"
            type="text"
            value={formData.location || ''}
            onChange={handleChange}
            placeholder="Ej. Aula 201"
          />
          <InputField
            label="Créditos"
            id="credits"
            type="number"
            value={formData.credits}
            onChange={handleChange}
            placeholder="Ej. 3"
            min="1"
            required
          />
          <InputField
            label="Capacidad"
            id="capacity"
            type="number"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="Ej. 30"
            min="1"
            required
          />

          {error && <ErrorMessage message={error} />}
          {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">{successMessage}</div>}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? <LoadingSpinner /> : 'Crear Materia'}
          </Button>
        </form>
      </Card>
    </main>
  );
}