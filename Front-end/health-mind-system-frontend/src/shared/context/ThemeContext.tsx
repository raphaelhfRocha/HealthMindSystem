import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState
} from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextData {
    theme: ThemeMode;
    toggleTheme: () => void;
}

interface ProviderProps {
    children: ReactNode;
}

const ThemeContext = createContext<ThemeContextData>(
    {} as ThemeContextData
);

export function ThemeProvider({
    children
}: ProviderProps) {
    const [theme, setTheme] =
        useState<ThemeMode>('light');

    useEffect(() => {
        const storedTheme =
            localStorage.getItem('@healthmind:theme');

        if (storedTheme) {
            setTheme(storedTheme as ThemeMode);
        }
    }, []);

    function toggleTheme() {
        const newTheme =
            theme === 'light'
                ? 'dark'
                : 'light';

        setTheme(newTheme);

        localStorage.setItem(
            '@healthmind:theme',
            newTheme
        );
    }

    return (
        <ThemeContext.Provider
            value={{
                theme,
                toggleTheme
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useThemeContext() {
    return useContext(ThemeContext);
}