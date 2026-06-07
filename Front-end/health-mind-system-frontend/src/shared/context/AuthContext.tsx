import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react';

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

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('@healthmind:token');
    const storedUser = localStorage.getItem('@healthmind:user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  async function signIn(email: string, senha: string) {
    /**
     * Aqui você chamaria sua API
     */

    const fakeResponse = {
      token: 'TOKEN_JWT_EXEMPLO',
      user: {
        id: '1',
        nome: 'Raphael Rocha',
        email,
        role: 'ADMIN'
      }
    };

    localStorage.setItem(
      '@healthmind:token',
      fakeResponse.token
    );

    localStorage.setItem(
      '@healthmind:user',
      JSON.stringify(fakeResponse.user)
    );

    setToken(fakeResponse.token);
    setUser(fakeResponse.user);
  }

  function signOut() {
    localStorage.removeItem('@healthmind:token');
    localStorage.removeItem('@healthmind:user');

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