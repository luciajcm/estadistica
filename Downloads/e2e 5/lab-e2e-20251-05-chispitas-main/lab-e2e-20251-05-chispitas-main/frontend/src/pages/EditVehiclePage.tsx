import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import VehicleInfo from "@components/VehicleInfo";
import { getDriver } from "@services/driver/getDriver";
import { updateDriverCar } from "@services/driver/updateDriverCar";
import { VehicleResponse } from "@interfaces/vehicle/VehicleResponse";


interface VehicleFormData {
	brand: string;
	model: string;
	licensePlate: string;
	fabricationYear: string;
	capacity: string;
}

export default function EditVehiclePage() {
	const [vehicleData, setVehicleData] = useState<VehicleFormData>({
		brand: "",
		model: "",
		licensePlate: "",
		fabricationYear: "",
		capacity: "",
	});
	const [userId, setUserId] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		async function fetchVehicleInfo() {
			try {
				const driver = await getDriver();
				if (driver.id) setUserId(driver.id);
				if (driver.vehicle) {
					setVehicleData({
						brand: driver.vehicle.brand,
						model: driver.vehicle.model,
						licensePlate: driver.vehicle.licensePlate,
						fabricationYear: String(driver.vehicle.fabricationYear),
						capacity: String(driver.vehicle.capacity),
					});
				}
			} catch (error) {
				console.error("Error fetching driver vehicle:", error);
			} finally {
				setIsLoading(false);
			}
		}
		fetchVehicleInfo();
	}, []);

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setVehicleData((prev) => ({
			...prev,
			[name]: value,
		}));
	}

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const { brand, model, licensePlate, fabricationYear, capacity } = vehicleData;

		if (
			!brand ||
			!model ||
			!licensePlate ||
			!fabricationYear ||
			!capacity ||
			isNaN(Number(fabricationYear)) ||
			isNaN(Number(capacity)) ||
			Number(fabricationYear) <= 0 ||
			Number(capacity) <= 0
		) {
			alert("Todos los campos son obligatorios y deben tener valores válidos.");
			return;
		}

		if (userId === null) {
			alert("No se pudo determinar el ID del conductor.");
			return;
		}

		const parsedVehicleData: VehicleResponse = {
			brand,
			model,
			licensePlate,
			fabricationYear: Number(fabricationYear),
			capacity: Number(capacity),
		};

		try {
			await updateDriverCar(userId, parsedVehicleData);
			navigate("/dashboard");
		} catch (error) {
			console.error("Error updating vehicle:", error);
		}
	}

	if (isLoading) {
		return <div>Loading vehicle data...</div>;
	}

	return (
		<main>
			<article>
				<h1>Editar Vehículo</h1>
				<form onSubmit={handleSubmit}>
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
						<label htmlFor="fabricationYear">Año de Fabricación</label>
						<input
							type="number"
							name="fabricationYear"
							id="fabricationYear"
							value={vehicleData.fabricationYear}
							onChange={handleChange}
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
							required
						/>
					</div>

					<button
						id="vehicleSubmit"
						className="bg-primary text-white font-bold mx-6 py-2 px-4 rounded-full cursor-pointer"
						type="submit"
					>
						Actualizar
					</button>
				</form>
			</article>

			{process.env.NODE_ENV !== "test" && <VehicleInfo />}
		</main>
	);
}
