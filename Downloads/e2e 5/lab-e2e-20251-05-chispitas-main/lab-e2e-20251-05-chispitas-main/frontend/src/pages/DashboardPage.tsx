import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "@components/Profile";
import RidesHistorial from "@components/RidesHistorial";
import VehicleInfo from "@components/VehicleInfo";
import { getRoleBasedOnToken } from "src/utils/getRoleBasedOnToken";

export default function DashboardPage() {
	const navigate = useNavigate();
	const [userId, setUserId] = useState<number | null>(null);

	useEffect(() => {
		// Redirección si no hay token
		try {
			getRoleBasedOnToken(); // si falla, va al catch
		} catch {
			navigate("/auth/login");
		}
	}, [navigate]);

	const role = getRoleBasedOnToken();

	return (
		<main className="p-10 grid grid-cols-2 gap-10">
			<div className="home-section">
				<Profile setUserId={setUserId} />
				<button id="editProfile" onClick={() => navigate("/profile/edit")}>
					Editar
				</button>
			</div>

			{role === "ROLE_DRIVER" ? (
				<div className="home-section">
					<VehicleInfo />
					<button id="editVehicle" onClick={() => navigate("/vehicle/edit")}>
						Editar
					</button>
				</div>
			) : (
				<RidesHistorial />
			)}
		</main>
	);
}
