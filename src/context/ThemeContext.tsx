import { useColorScheme } from "react-native";
import {
  Provider as PaperProvider,
  MD3DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
} from "react-native-paper";
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import React, { useCallback, useMemo } from "react";

const lightTheme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    ...NavigationDefaultTheme.colors,
    background: "#f1f5f9",    // Slate 100 - Cinza muito claro
    text: "#334155",          // Slate 700 - Cinza escuro
    primary: "#2563eb",       // Blue 600 - Azul principal
    secondary: "#64748b",     // Slate 500 - Cinza médio
    accent: "#1e40af",        // Blue 800 - Azul escuro
    surface: "#ffffff",       // Branco puro
    card: "#f8fafc",          // Slate 50 - Cinza clarissimo
    border: "#cbd5e1",        // Slate 300 - Borda cinza
    headerBg: "#e2e8f0",      // Slate 200 - Header cinza claro
    tabBar: "#f8fafc",        // Slate 50 - Tab bar cinza
  },
};
const darkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    ...NavigationDarkTheme.colors,
    background: "#0f172a",    // Slate 900 - Azul escuro profundo
    text: "#e2e8f0",          // Slate 200 - Texto claro
    primary: "#3b82f6",       // Blue 500 - Azul vibrante
    secondary: "#64748b",     // Slate 500 - Cinza azulado
    accent: "#60a5fa",        // Blue 400 - Azul claro
    surface: "#1e293b",       // Slate 800 - Superfície azul escuro
    card: "#334155",          // Slate 700 - Card azul escuro
    border: "#475569",        // Slate 600 - Borda azul escuro
    headerBg: "#1e293b",      // Slate 800 - Header azul escuro
    tabBar: "#1e293b",        // Slate 800 - Tab bar azul escuro
  },
};
export type Theme = typeof lightTheme;
export type ThemeType = "light" | "dark";
export interface ThemeContextValue {
  theme: Theme;
  themeType: ThemeType;
  toggleTheme: () => void;
  isDark: boolean;
  setThemeType: React.Dispatch<React.SetStateAction<ThemeType>>;
}

export const ThemeContext = React.createContext<ThemeContextValue>({
  theme: lightTheme,
  themeType: "light",
  toggleTheme: () => {},
  isDark: false,
  setThemeType: () => {},
});

export const useTheme = () => React.useContext(ThemeContext);
export interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeContextProvider: React.FC<ThemeProviderProps> = ({
  children,
}) => {
  const colorScheme = useColorScheme();
  const [themeType, setThemeType] = React.useState<ThemeType>(
    colorScheme || "light"
  );

  const toggleThemetype = useCallback(() => {
    setThemeType((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const isDark = useMemo(() => themeType === "dark", [themeType]);
  const theme = useMemo(() => (isDark ? darkTheme : lightTheme), [isDark]);

  return (
    <PaperProvider theme={theme}>
      <ThemeContext.Provider
        value={{
          theme,
          themeType,
          toggleTheme: toggleThemetype,
          isDark,
          setThemeType,
        }}
      >
        {children}
      </ThemeContext.Provider>
    </PaperProvider>
  );
};
