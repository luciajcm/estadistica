import { RideByUserResponse } from "@interfaces/ride/RideByUserResponse";
import { getRidesByUser } from "@services/getRidesByUser";
import { useEffect, useState } from "react";
import RideItem from "./RideItem";

export default function RidesHistorial() {
	const [rides, setRides] = useState<RideByUserResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string>('');

	async function fetchRides() {
		try {
			setLoading(true);
			const ridesData = await getRidesByUser({ page: 0, size: 10 });
			setRides(ridesData.content || []);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to fetch rides');
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		fetchRides();
	}, []);

	if (loading) {
		return <div>Loading rides...</div>;
	}

	if (error) {
		return <div style={{ color: "red" }}>{error}</div>;
	}

	return (
		<article className="home-section">
			<h1 className="title mb-3">Historial de viajes</h1>
			<section id="ridesHistorial">
				{rides.length === 0 ? (
					<p>No hay viajes en el historial</p>
				) : (
					rides.map((ride) => (
						<RideItem
							key={ride.id}
							ride={ride}
						/>
					))
				)}
			</section>
		</article>
	);
}
