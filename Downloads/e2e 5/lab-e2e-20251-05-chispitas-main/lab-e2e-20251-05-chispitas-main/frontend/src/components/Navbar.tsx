import { useAuthContext } from "@contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
	const { session, logout } = useAuthContext();
	const navigate = useNavigate();

	function handleLogout() {
		logout();
		navigate('/auth/login');
	}

	if (session) {
		return (
			<div className="flex justify-between items-center p-4 bg-gray-100">
				<div className="text-2xl font-bold">Uber</div>
				<button 
					id="logout" 
					onClick={handleLogout}
					className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
				>
					Logout
				</button>
			</div>
		);
	} else {
		return (
			<div className="flex justify-between items-center p-4 bg-gray-100">
				<div className="text-2xl font-bold">Uber</div>
			</div>
		);
	}
}
