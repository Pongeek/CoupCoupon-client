import { createContext, useContext, useMemo, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme';

type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'light',
  toggleTheme: () => {},
});

/**
 * Hook to access the theme mode and toggle function.
 */
export function useThemeMode() {
  return useContext(ThemeContext);
}

/**
 * Detects the user's system preference for dark mode.
 */
function getInitialMode(): ThemeMode {
  // Check localStorage first (user's explicit choice)
  const saved = localStorage.getItem('themeMode') as ThemeMode | null;
  if (saved === 'light' || saved === 'dark') return saved;

  // Fall back to system preference
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

interface AppThemeProviderProps {
  children: ReactNode;
}

/**
 * Wraps the app with MUI ThemeProvider + CssBaseline.
 * Provides a toggle between light and dark mode.
 */
export function AppThemeProvider({ children }: AppThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);

  const toggleTheme = () => {
    setMode(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', next);
      return next;
    });
  };

  // Listen for system theme changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't manually chosen
      if (!localStorage.getItem('themeMode')) {
        setMode(e.matches ? 'dark' : 'light');
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const theme = useMemo(() => (mode === 'dark' ? darkTheme : lightTheme), [mode]);
  const contextValue = useMemo(() => ({ mode, toggleTheme }), [mode]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
