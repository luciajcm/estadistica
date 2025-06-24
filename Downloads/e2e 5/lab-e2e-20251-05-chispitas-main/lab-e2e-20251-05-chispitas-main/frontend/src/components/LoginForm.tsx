import { LoginRequest } from "@interfaces/auth/LoginRequest";
import { useAuthContext } from "@contexts/AuthContext";
import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRoleBasedOnToken } from "../utils/getRoleBasedOnToken";

export default function LoginForm() {
	const [formData, setFormData] = useState<LoginRequest>({
		email: '',
		password: ''
	});
	const [error, setError] = useState<string>('');
	const [successMessage, setSuccessMessage] = useState<string>('');
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const { login } = useAuthContext();

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	}

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsLoading(true);
		setError('');
		setSuccessMessage('');

		try {
			await login(formData);
			setSuccessMessage('Login successful!');
			const role = getRoleBasedOnToken();
			if (role === 'ROLE_DRIVER') {
				navigate('/dashboard');
			} else {
				navigate('/dashboard');
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Login failed');
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<section className="login-section bg-secondary">
			<h1 className="title">Ingresar a Uber</h1>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="email">Email</label>
					<input 
						type="email" 
						name="email" 
						id="email" 
						value={formData.email} 
						onChange={handleChange}
						required
					/>
				</div>
				<div>
					<label htmlFor="password">Contraseña</label>
					<input
						type="password"
						name="password"
						id="password"
						value={formData.password}
						onChange={handleChange}
						required
					/>
				</div>
				<button 
					id="loginSubmit" 
					className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50" 
					type="submit"
					disabled={isLoading}
				>
					{isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
				</button>
			</form>
			{error && <div style={{ color: "red" }}>{error}</div>}
			{successMessage && <div style={{ color: "blue" }}>{successMessage}</div>}
		</section>
	);
}
