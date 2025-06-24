import { RegisterRequest } from "@interfaces/auth/RegisterRequest";
import { ChangeEvent, FormEvent, useState } from "react";

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
	<section className="login-section bg-secondary p-4 rounded-2xl">
		<h1 className="text-2xl font-bold">Registrarse a Uber</h1>
		<form onSubmit={handleSubmit}>
			<div>
				<label htmlFor="firstName">Nombres</label>
				<input
				type="text"
				name="firstName"
				id="firstName"
				value={formData.firstName}
				onChange={handleChange}
				required/>
			</div>
			
			<div>
				<label htmlFor="lastName">Apellidos</label>
				<input
				type="text"
				name="lastName"
				id="lastName"
				value={formData.lastName}
				onChange={handleChange}
				required/>
			</div>

			<div>
				<label htmlFor="email">Correo electrónico</label>
				<input
				type="email"
				name="email"
				id="email"
				value={formData.email}
				onChange={handleChange}
				required/>
			</div>

			<div>
				<label htmlFor="password">Contraseña</label>
				<input
				type="password"
				name="password"
				id="password"
				value={formData.password}
				onChange={handleChange}
				required/>
			</div>

			<div>
				<label htmlFor="phone">Número de teléfono</label>
				<input
				type="text"
				name="phone"
				id="phone"
				value={formData.phone}
				onChange={handleChange}
				required/>
			</div>

			<div>
				<label>¿Eres conductor?</label>
				<input
				type="radio"
				name="isDriver"
				id="driver"
				value="true"
				checked={formData.isDriver}
				onChange={handleRoleChange}/>
				<label htmlFor="driver">Sí</label>
				<input
				type="radio"
				name="isDriver"
				id="passenger"
				value="false"
				checked={!formData.isDriver}
				onChange={handleRoleChange}/>
				<label htmlFor="passenger">No</label>
			</div>
			
			<button
			id="registerSubmit"
			className="bg-primary text-white font-bold mx-6 py-2 px-4 rounded-full cursor-pointer"
			type="submit"
			>Continuar
			</button>
			
			</form>
			
			{error && <div style={{ color: "red" }}>{error}</div>}
			</section>
		);
}