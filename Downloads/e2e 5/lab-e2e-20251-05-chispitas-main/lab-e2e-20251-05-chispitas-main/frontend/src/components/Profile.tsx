import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { getRoleBasedOnToken } from "src/utils/getRoleBasedOnToken";
import { getDriver } from "@services/driver/getDriver";
import { getPassenger } from "@services/passenger/getPassenger";
import { getRidesByUser } from "@services/getRidesByUser";
import { DriverResponse } from "@interfaces/driver/DriverResponse";
import { PassengerResponse } from "@interfaces/passenger/PassengerResponse";

interface ProfileProps {
	setUserId: (id: number) => void;
}

export default function Profile({ setUserId }: ProfileProps) {
	const [profileInfo, setProfileInfo] = useState<DriverResponse | PassengerResponse | null>(null);
	const [role, setRole] = useState<string | null>(null);
	const [tripCount, setTripCount] = useState<number>(0);

	useEffect(() => {
		const role = getRoleBasedOnToken();
		setRole(role);
		fetchProfileInfo(role);
	}, []);

	async function fetchProfileInfo(role: string) {
		try {
			if (role === "ROLE_DRIVER") {
				const driver = await getDriver();
				setProfileInfo(driver);
				setUserId(driver.id);
			} else if (role === "ROLE_PASSENGER") {
				const passenger = await getPassenger();
				setProfileInfo(passenger);
				setUserId(passenger.id);
			} else {
				console.error("Rol no válido");
			}

			const result = await getRidesByUser({ page: 0, size: 100 });
			setTripCount(result.content.length);
		} catch (error) {
			console.error("Error obteniendo perfil o viajes:", error);
		}
	}

	if (!profileInfo || !role) return null;

	const isDriver = role === "ROLE_DRIVER";

	return (
		<article>
			<h1 className="title mb-3">{isDriver ? "Conductor" : "Pasajero"}</h1>

			<section className="flex">
				<div className="w-2/5">
					<FaUserCircle className="w-full text-9xl" />
				</div>

				<ul className="w-3/5 ml-6 list-disc">
					<li id="profileNames">{profileInfo.firstName} {profileInfo.lastName}</li>
					<li id="profileEmail">{profileInfo.email}</li>
					<li id="profilePhone">{profileInfo.phoneNumber}</li>
					<li id="profileTrips"><b>N° viajes:</b> {tripCount}</li>

					{isDriver && "avgRating" in profileInfo && (
						<>
							<li id="profileRating"><b>Puntuación:</b> {profileInfo.avgRating.toFixed(2)}</li>
						</>
					)}
				</ul>
			</section>
		</article>
	);
}
