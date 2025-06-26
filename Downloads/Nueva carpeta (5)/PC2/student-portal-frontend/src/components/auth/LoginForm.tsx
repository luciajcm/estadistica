import { useAuthContext } from "@contexts/AuthContext";
import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@components/ui/Button"; // Importa tu componente Button
import InputField from "@components/ui/InputField"; // Importa tu componente InputField
import ErrorMessage from "@components/ui/ErrorMessage"; // Importa tu componente ErrorMessage
import LoadingSpinner from "@components/ui/LoadingSpinner"; // Importa tu componente LoadingSpinner

export default function LoginForm() {
    const [apiKey, setApiKey] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { login } = useAuthContext();
    const navigate = useNavigate();

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setApiKey(e.target.value);
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            console.log("LoginForm: Attempting login...");
            await login(apiKey); // This updates the session in AuthContext
            console.log("LoginForm: Login successful!");

            setSuccessMessage('Login successful!');
            const role = getRoleBasedOnToken(); // This reads the token from localStorage
            console.log("LoginForm: Detected role:", role);

            // The navigation happens here after login is successful
            if (role === 'ROLE_DRIVER') {
                navigate('/dashboard');
                console.log("LoginForm: Navigating to /dashboard (driver)");
            } else {
                navigate('/dashboard');
                console.log("LoginForm: Navigating to /dashboard (other role)");
            }
        } catch (err) {
            console.error("LoginForm: Login failed:", err);
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setIsLoading(false);
            console.log("LoginForm: Login process finished.");
        }
    }

    return (
        <section className="bg-white shadow-lg rounded-xl p-8 md:p-10 flex flex-col items-center justify-center gap-6 w-full max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-primary mb-2">Ingresar API Key</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
                <InputField
                    label="API Key"
                    id="apiKey"
                    type="text"
                    value={apiKey}
                    onChange={handleChange}
                    placeholder="Ingresa tu API Key aquí"
                    required
                />
                <Button
                    id="loginSubmit"
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                >
                    {isLoading ? (
                        <>
                            <LoadingSpinner className="mr-2" /> Validando...
                        </>
                    ) : (
                        'Validar API Key'
                    )}
                </Button>
            </form>
            {error && <ErrorMessage message={error} />}
            {successMessage && (
                <p className="text-accent-500 text-sm mt-2">{successMessage}</p>
            )}
        </section>
    );
}

// Decodes a JWT and returns the user's role, or undefined if not found
function getRoleBasedOnToken(): string | undefined {
    const token = localStorage.getItem('token');
    if (!token) return undefined;
    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
        // Common JWT claim for roles: 'role' or 'roles'
        if (typeof decoded.role === 'string') return decoded.role;
        if (Array.isArray(decoded.roles) && decoded.roles.length > 0) return decoded.roles[0];
        return undefined;
    } catch {
        return undefined;
    }
}
