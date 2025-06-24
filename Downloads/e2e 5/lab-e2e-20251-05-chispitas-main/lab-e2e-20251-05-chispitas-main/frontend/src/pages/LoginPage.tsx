import img4 from "@assets/Img4.jpg";
import Button from "@components/Button";
import LoginForm from "@components/LoginForm";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
	const navigate = useNavigate();

	return (
		<main className="px-10">
			<section className="flex justify-center items-center py-4 gap-4">
				<Button onClick={() => navigate('/auth/login')} className="bg-blue-500">
					Iniciar Sesión
				</Button>
				<Button onClick={() => navigate('/auth/register')} className="bg-green-500">
					Registrarse
				</Button>
			</section>

			<article className="flex justify-between">
				<LoginForm />
				<section className="login-section flex flex-col items-center p-4 text-center">
					<h2 className="title">Bienvenido de vuelta</h2>
					<p>Inicia sesión para empezar a usar Uber</p>
					<img src={img4} alt="uber" className="max-w-md" />
				</section>
			</article>
		</main>
	);
}
