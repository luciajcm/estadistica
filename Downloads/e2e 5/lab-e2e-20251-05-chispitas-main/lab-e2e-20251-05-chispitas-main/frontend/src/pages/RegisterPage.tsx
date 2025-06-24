import { useState } from "react";
import Button from "@components/Button";
import RegisterForm from "@components/RegisterForm";
import RegisterVehicle from "@components/RegisterVehicle";
import img6 from "../assets/Img6.png";
import { useNavigate } from "react-router-dom";
import { RegisterRequest } from "@interfaces/auth/RegisterRequest";
import { register } from "@services/auth/register";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<Omit<RegisterRequest, "category" | "vehicle"> | null>(null);
  const [isRegisteringPassenger, setIsRegisteringPassenger] = useState(false);
  const [error, setError] = useState("");

  async function handlePassengerRegister(data: Omit<RegisterRequest, "category" | "vehicle">) {
    try {
      setIsRegisteringPassenger(true);
      setError("");

      // Construye solo los campos necesarios
      const request: Partial<RegisterRequest> = {
        ...data,
        isDriver: false,
      };

      // Elimina campos innecesarios para pasajeros
      delete request.category;
      delete request.vehicle;

      console.log("Registrando pasajero con:", request);

      await register(request as RegisterRequest);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrar pasajero");
    } finally {
      setIsRegisteringPassenger(false);
    }
  }

  return (
    <main className="px-10">
      <section className="flex justify-center items-center py-4 gap-4">
        <Button onClick={() => navigate("/auth/login")} className="bg-blue-500">
          Iniciar Sesión
        </Button>
        <Button onClick={() => navigate("/auth/register")} className="bg-green-500">
          Registrarse
        </Button>
      </section>

      <article className="flex justify-between">
        <section className="login-section flex flex-col items-center p-4 text-center">
          <h1 className="title">¡Bienvenido!</h1>
          <p>Regístrate como pasajero o conductor para empezar con Uber</p>
          <img src={img6} alt="uber" className="max-w-md" />
        </section>

        {userData ? (
          userData.isDriver ? (
            <RegisterVehicle userData={userData} onSuccess={() => navigate("/dashboard")} />
          ) : (
            <div className="login-section bg-secondary p-4 rounded-2xl">
              <p>Registrando pasajero...</p>
              {isRegisteringPassenger && <p>Cargando...</p>}
              {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
          )
        ) : (
          <RegisterForm
            onNext={(formData) => {
              if (formData.isDriver) {
                setUserData(formData); // conductor: pasa al formulario de vehículo
              } else {
                handlePassengerRegister(formData); // pasajero: registra directamente
              }
            }}
          />
        )}
      </article>
    </main>
  );
}
