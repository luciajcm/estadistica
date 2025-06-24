import { VehicleResponse } from "@interfaces/vehicle/VehicleResponse";
import { RegisterRequest } from "@interfaces/auth/RegisterRequest";
import { register } from "@services/auth/register";
import { ChangeEvent, FormEvent, useState } from "react";

interface RegisterVehicleProps {
	userData: Omit<RegisterRequest, "category" | "vehicle">;
	onSuccess?: () => void;
}

export default function RegisterVehicle({ userData, onSuccess }: RegisterVehicleProps) {
	const [vehicleData, setVehicleData] = useState<VehicleResponse>({
		brand: "",
		model: "",
		licensePlate: "",
		fabricationYear: new Date().getFullYear(),
		capacity: 4,
	});

	const [category, setCategory] = useState<"X" | "XL" | "BLACK">("X");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>("");

	function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
		const { name, value } = e.target;
		setVehicleData((prev) => ({
		...prev,
		[name]: name === "fabricationYear" || name === "capacity" ? parseInt(value) : value,
		}));
	}

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		setError("");
		
		try {
		const fullRequest: RegisterRequest = {
			...userData,
			category,
			vehicle: vehicleData,
		};

		await register(fullRequest);
		onSuccess?.();
		} catch (err) {
		setError(err instanceof Error ? err.message : "Error al registrar usuario y vehículo");
		} finally {
		setLoading(false);
		}
	}

	return (
		<section className="login-section bg-secondary p-4 rounded-2xl">
		<h1 className="text-2xl font-bold">Registra tu vehículo</h1>
		<form onSubmit={handleSubmit}>
			<div>
			<label htmlFor="category">Categoría</label>
			<select
				name="category"
				id="category"
				value={category}
				onChange={(e) => setCategory(e.target.value as "X" | "XL" | "BLACK")}
				required
			>
				<option value="X">X</option>
				<option value="XL">XL</option>
				<option value="BLACK">BLACK</option>
			</select>
			</div>

			<div>
			<label htmlFor="brand">Marca</label>
			<input
				type="text"
				name="brand"
				id="brand"
				value={vehicleData.brand}
				onChange={handleChange}
				required
			/>
			</div>

			<div>
			<label htmlFor="model">Modelo</label>
			<input
				type="text"
				name="model"
				id="model"
				value={vehicleData.model}
				onChange={handleChange}
				required
			/>
			</div>

			<div>
			<label htmlFor="licensePlate">Placa</label>
			<input
				type="text"
				name="licensePlate"
				id="licensePlate"
				value={vehicleData.licensePlate}
				onChange={handleChange}
				required
			/>
			</div>

			<div>
			<label htmlFor="fabricationYear">Año de fabricación</label>
			<input
				type="number"
				name="fabricationYear"
				id="fabricationYear"
				value={vehicleData.fabricationYear}
				onChange={handleChange}
				min="1900"
				max={new Date().getFullYear() + 1}
				required
			/>
			</div>

			<div>
			<label htmlFor="capacity">Capacidad</label>
			<input
				type="number"
				name="capacity"
				id="capacity"
				value={vehicleData.capacity}
				onChange={handleChange}
				min="1"
				max="10"
				required
			/>
			</div>

			<button
			id="registerVehicleSubmit"
			className="bg-primary text-white font-bold mx-6 py-2 px-4 rounded-full cursor-pointer disabled:opacity-50"
			type="submit"
			disabled={loading}
			>
			{loading ? "Registrando..." : "Registrar Vehículo"}
			</button>

			{error && <div style={{ color: "red" }}>{error}</div>}
		</form>
		</section>
	);
}
