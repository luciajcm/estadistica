import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { getRoleBasedOnToken } from "src/utils/getRoleBasedOnToken";
import { getDriver } from "@services/driver/getDriver";
import { getPassenger } from "@services/passenger/getPassenger";
import { updateDriverInfo } from "@services/driver/updateDriverInfo";
import { updatePassenger } from "@services/passenger/updatePassenger";
import { deleteDriver } from "@services/driver/deleteDriver";
import { deletePassenger } from "@services/passenger/deletePassenger";
import Profile from "@components/Profile";

interface FormData {
	firstName: string;
	lastName: string;
	phoneNumber: string;
}

export default function EditProfilePage() {
	const [formData, setFormData] = useState<FormData>({
		firstName: "",
		lastName: "",
		phoneNumber: "",
	});
	const [userId, setUserId] = useState<number | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const role = getRoleBasedOnToken();
		async function fetchProfile() {
			try {
				if (role === "ROLE_DRIVER") {
					const data = await getDriver();
					setFormData({
						firstName: "",
						lastName: "",
						phoneNumber: "",
					});
					setUserId(data.id);
				} else if (role === "ROLE_PASSENGER") {
					const data = await getPassenger();
					setFormData({
						firstName: "",
						lastName: "",
						phoneNumber: "",
					});
					setUserId(data.id);
				}
			} catch (error) {
				console.error("Error loading profile data:", error);
			}
		}
		fetchProfile();
	}, []);

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	}

	async function fetchUpdateUser() {
		try {
			const role = getRoleBasedOnToken();
			if (role === "ROLE_DRIVER") {
				await updateDriverInfo(formData);
			} else if (role === "ROLE_PASSENGER") {
				await updatePassenger(formData);
			} else {
				console.error("Error: No valid role");
			}
		} catch (error) {
			console.error("Error updating profile:", error);
		}
	}

	async function fetchDeleteUser() {
		try {
			const role = getRoleBasedOnToken();
			if (!userId) {
				console.error("No user ID available for deletion");
				return;
			}
			if (role === "ROLE_DRIVER") {
				await deleteDriver(userId);
			} else if (role === "ROLE_PASSENGER") {
				await deletePassenger(userId);
			} else {
				console.error("Error: No valid role");
				return;
			}
			localStorage.removeItem("token");
			navigate("/auth/login");
		} catch (error) {
			console.error("Error deleting user:", error);
		}
	}

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		fetchUpdateUser().then(() => {
			window.location.href = "/dashboard"; // ← fuerza recarga desde cero
		});
	}

	return (
		<main>
			<article>
				<h1>Editar Perfil</h1>
				<form onSubmit={handleSubmit}>
					<div>
						<label htmlFor="firstName">Nombres</label>
						<input
							type="text"
							name="firstName"
							id="firstName"
							value={formData.firstName}
							onChange={handleChange}
							required
						/>
					</div>
					<div>
						<label htmlFor="lastName">Apellidos</label>
						<input
							type="text"
							name="lastName"
							id="lastName"
							value={formData.lastName}
							onChange={handleChange}
						/>
					</div>
					<div>
						<label htmlFor="phoneNumber">Celular</label>
						<input
							type="number"
							name="phoneNumber"
							id="phoneNumber"
							value={formData.phoneNumber}
							onChange={handleChange}
						/>
					</div>
					<button
						id="updateSubmit"
						className="bg-primary text-white font-bold mx-6 py-2 px-4 rounded-full cursor-pointer"
						type="submit"
					>
						Actualizar
					</button>
				</form>
			</article>

			<Profile setUserId={setUserId} />

			<button
				id="deleteUser"
				className="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded-full"
				onClick={fetchDeleteUser}
			>
				Eliminar cuenta
			</button>
		</main>
	);
}