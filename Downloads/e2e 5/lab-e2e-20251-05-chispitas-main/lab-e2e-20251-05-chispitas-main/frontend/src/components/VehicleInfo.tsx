import { VehicleResponse } from "@interfaces/vehicle/VehicleResponse";
import { getDriver } from "@services/driver/getDriver";
import { useEffect, useState } from "react";
import { FaTaxi } from "react-icons/fa6";

export default function VehicleInfo() {
	const [vehicleInfo, setVehicleInfo] = useState<VehicleResponse | null>(null);
	const [category, setCategory] = useState<"X" | "XL" | "BLACK">("X"); // Agregamos estado para category
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string>("");

	async function fetchVehicleInfo() {
		try {
			setLoading(true);
			const driverData = await getDriver();
			setVehicleInfo(driverData.vehicle || null);
			if (["X", "XL", "BLACK"].includes(driverData.category)) {
				setCategory(driverData.category as "X" | "XL" | "BLACK");
			} else {
				setCategory("X"); // fallback
			}


		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to fetch vehicle info");
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		fetchVehicleInfo();
	}, []);

	if (loading) {
		return <div>Loading vehicle information...</div>;
	}

	if (error) {
		return <div style={{ color: "red" }}>{error}</div>;
	}

	return (
		<article>
			<h1 className="title mb-3">Vehículo</h1>
			<section className="flex">
				<div className="w-2/5">
					<FaTaxi className="w-full text-9xl" />
				</div>
				{vehicleInfo ? (
					<ul className="w-3/5 ml-6 list-disc">
						<li id="vehicleModel">
							{vehicleInfo.brand} {vehicleInfo.model}
						</li>
						<li id="driverCategory">
							<b>Categoría:</b> {category}
						</li>
						<li id="licenseNumber">
							<b>Placa:</b> {vehicleInfo.licensePlate}
						</li>
						<li id="yearOfFabrication">
							<b>Año de fabricación:</b> {vehicleInfo.fabricationYear}
						</li>
						<li id="capacityNumber">
							<b>Capacidad:</b> {vehicleInfo.capacity}
						</li>
					</ul>
				) : (
					<div className="w-3/5 ml-6">
						<p>No hay información del vehículo disponible</p>
					</div>
				)}
			</section>
		</article>
	);
}
