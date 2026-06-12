import {
  createContext,
  ReactNode,
  useContext,
  useState
} from 'react';
import { login as loginRequest } from '../services/auth.service';
import { getClaimsFromToken } from '../utils/jwt';
import { STORAGE_KEYS } from '../constants/storageKeys';

interface User {
  id: string;
  nome: string;
  email: string;
  role: string;
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  signIn: (email: string, senha: string) => Promise<void>;
  signOut: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

function loadStoredUser(): User | null {
  const stored = sessionStorage.getItem(STORAGE_KEYS.USER);

  if (!stored) return null;

  try {
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Inicializa de forma síncrona a partir do sessionStorage para evitar
  // "flash" de não-autenticado nas rotas protegidas no primeiro render.
  // Usamos sessionStorage (e não localStorage) para que a sessão fique
  // vinculada à aba: ao fechar a aba/janela a sessão é encerrada e o
  // usuário volta para a tela de login ao acessar o projeto novamente.
  const [user, setUser] = useState<User | null>(loadStoredUser);
  const [token, setToken] = useState<string | null>(
    () => sessionStorage.getItem(STORAGE_KEYS.TOKEN)
  );

  async function signIn(email: string, senha: string) {
    const response = await loginRequest({ email, senha });

    const claims = getClaimsFromToken(response.token);

    const authenticatedUser: User = {
      id: claims?.id ?? '',
      nome: claims?.nome ?? '',
      email: claims?.email || response.email,
      role: claims?.role ?? ''
    };

    sessionStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
    sessionStorage.setItem(
      STORAGE_KEYS.USER,
      JSON.stringify(authenticatedUser)
    );

    setToken(response.token);
    setUser(authenticatedUser);
  }

  function signOut() {
    sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.USER);

    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        signIn,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
