import { RegisterRequest } from "@interfaces/auth/RegisterRequest";
import { ChangeEvent, FormEvent, useState } from "react";
import { FaGoogle } from "react-icons/fa";

interface RegisterFormProps {
	isDriver?: boolean;
	onNext: (partialData: Omit<RegisterRequest, "category" | "vehicle">) => void;
}

export default function RegisterForm({ isDriver = false, onNext }: RegisterFormProps) {
	const [formData, setFormData] = useState<Omit<RegisterRequest, "category" | "vehicle">>({
		email: "",
		password: "",
		firstName: "",
		lastName: "",
		phone: "",
		isDriver: isDriver,
	});

	const [error, setError] = useState<string>("");
	
	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	}

	function handleRoleChange(e: ChangeEvent<HTMLInputElement>) {
		const value = e.target.value === "true";
		setFormData((prev) => ({
		...prev,
		isDriver: value,
	}));
}

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		// Validaciones básicas (puedes extender si quieres)
		if (!formData.email || !formData.password || !formData.firstName || !formData.lastName || !formData.phone) {
		setError("Todos los campos son obligatorios");
		return;
	}

		setError("");
		onNext(formData);
	}
	
	return (
    <section className="login-section bg-secondary rounded-2xl p-10 flex flex-col items-center justify-center gap-4">
        <h1 className="title">Registrarse a Uber</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <section className="w-full grid grid-cols-2 gap-4">
                <div className="col-span-1 flex flex-col gap-1">
                    <label htmlFor="firstName">Nombres</label>
                    <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="bg-secondary rounded-sm border-black border p-1"
                    />
                </div>
                <div className="col-span-1 flex flex-col gap-1">
                    <label htmlFor="lastName">Apellidos</label>
                    <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="bg-secondary rounded-sm border-black border p-1"
                    />
                </div>
            </section>
            <div className="flex flex-col gap-1">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-secondary rounded-sm border-black border p-1"
                />
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="password">Contraseña</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-secondary rounded-sm border-black border p-1"
                />
            </div>
            <section className="w-full grid grid-cols-2 gap-4 items-center justify-center">
                <div className="flex flex-col gap-1">
                    <label htmlFor="phone">Celular</label>
                    <input
                        type="text"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="bg-secondary rounded-sm border-black border p-1"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="isDriver">¿Eres Conductor?</label>
                    <div className="flex gap-2 justify-between">
                        <div>
                            <input
                                type="radio"
                                name="isDriver"
                                id="driver"
                                value="true"
                                checked={formData.isDriver === true}
                                onChange={handleRoleChange}
                                className="w-4 h-4 accent-primary"
                            />{" "}
                            <span>Sí</span>
                        </div>
                        <div>
                            <input
                                type="radio"
                                name="isDriver"
                                id="passenger"
                                value="false"
                                checked={formData.isDriver === false}
                                onChange={handleRoleChange}
                                className="w-4 h-4 accent-primary"
                            />{" "}
                            <span>No</span>
                        </div>
                    </div>
                </div>
            </section>
            <button
                id="registerSubmit"
                className="bg-primary text-white font-bold mx-6 py-2 px-4 rounded-full cursor-pointer"
                type="submit"
            >
                Registrarse
            </button>
            {error && (
                <div className="text-red-600 font-semibold text-center">{error}</div>
            )}
            <div className="flex items-center gap-2">
                <div className="w-full h-[1px] bg-black"></div>
                <span>o</span>
                <div className="w-full h-[1px] bg-black"></div>
            </div>
            <button className="bg-white rounded-md py-2 px-4 text-[#333] flex items-center gap-2 flex-row justify-center">
				<FaGoogle />
				<span>Ingresar con Google</span>
			</button>
        </form>
    </section>
	);
}