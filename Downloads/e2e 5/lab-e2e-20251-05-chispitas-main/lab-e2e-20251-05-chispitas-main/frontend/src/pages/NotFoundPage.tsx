import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<h1 id="notFound" className="text-4xl font-bold mb-4">
				404 - Page Not Found
			</h1>
			<p className="text-gray-600 mb-6">La página que buscas no existe.</p>
			<button 
				id="historyBack" 
				onClick={() => navigate(-1)}
				className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
			>
				Volver
			</button>
		</div>
	);
}