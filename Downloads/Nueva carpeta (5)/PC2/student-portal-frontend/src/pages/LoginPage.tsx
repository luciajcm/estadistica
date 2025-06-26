import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import InputField from "@components/ui/InputField";
import Button from "@components/ui/Button";
import ErrorMessage from "@components/ui/ErrorMessage";
import LoadingSpinner from "@components/ui/LoadingSpinner";

export default function LoginPage() {
  const [apiKey, setApiKey] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, session } = useAuthContext();

  // Si ya hay una sesión (API Key), redirigir
  if (session) {
    navigate('/dashboard', { replace: true });
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(apiKey); // Pasamos directamente la API Key
      navigate('/dashboard'); // Redirigir a la selección de estudiante tras "login" exitoso
    } catch (err) {
      // Aunque no hay una llamada directa a la API en el login, se mantiene por si hay errores de storage
      setError(err instanceof Error ? err.message : 'Error al guardar la API Key.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Iniciar Sesión con API Key</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <InputField
            label="API Key"
            id="apiKey"
            type="password" // Para ocultar la key
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Ingresa tu API Key"
            required
          />
          {error && <ErrorMessage message={error} />}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <LoadingSpinner /> : 'Acceder al Portal'}
          </Button>
        </form>
      </div>
    </main>
  );
}