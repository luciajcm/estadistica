import { useStorageState } from "../hooks/useStorageState";
import Api from "../services/api";
import { createContext, type ReactNode, useContext } from "react";

interface AuthContextType {
  login: (apiKey: string) => Promise<void>; // Ahora recibe solo la API Key como string
  logout: () => void;
  session?: string | null; // `session` almacenará la API Key
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function loginHandler(apiKey: string, setSession: (value: string | null) => void) {
  // No hay llamada a un endpoint de login aquí.
  // Simplemente almacenamos la API Key.
  setSession(apiKey);
}

export function AuthProvider(props: { children: ReactNode }) {
  const [[isLoading, session], setSession] = useStorageState("api_key"); // Cambiar de "token" a "api_key"

  // Configurar la API Key en la instancia de Api cuando la sesión se carga o cambia
  if (session) {
    Api.getInstance().then((api) => {
      api.apiKey = session; // Usar el nuevo setter 'apiKey'
    });
  }

  return (
    <AuthContext.Provider
      value={{
        login: (apiKey) => loginHandler(apiKey, setSession),
        logout: () => {
          setSession(null); // Al desloguear, limpia la API key
        },
        session,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}