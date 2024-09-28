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
    background: "#fff",
    text: "#333",
  },
};
const darkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    ...NavigationDarkTheme.colors,
    background: "#333",
    text: "#fff",
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
