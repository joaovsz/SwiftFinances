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
    background: "#f5f5f5",    // Cinza claro neutro
    text: "#1f2937",          // Cinza escuro para texto
    primary: "#3b82f6",       // Azul moderno
    secondary: "#6b7280",     // Cinza médio
    accent: "#1d4ed8",        // Azul escuro
    surface: "#ffffff",       // Branco sólido
    card: "#ffffff",          // Card branco
    border: "#e5e7eb",        // Borda cinza suave
  },
};
const darkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    ...NavigationDarkTheme.colors,
    background: "#111827",    // Cinza escuro
    text: "#f9fafb",          // Branco para texto
    primary: "#3b82f6",       // Azul moderno
    secondary: "#6b7280",     // Cinza médio  
    accent: "#60a5fa",        // Azul claro
    surface: "#1f2937",       // Cinza escuro sólido
    card: "#374151",          // Card cinza
    border: "#4b5563",        // Borda cinza
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
