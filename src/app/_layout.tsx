import "../global.css";

import {
  Outfit_300Light,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/outfit";
import { SplashScreen, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import Toast from "react-native-toast-message";

import { FinancesProvider } from "../context/FinancesProvider";
import { ThemeContextProvider } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";

SplashScreen.preventAutoHideAsync();

export default function HomeLayout() {
  const [fontsLoaded] = useFonts({
    Outfit_300Light,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
  });
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  return (
    <ThemeContextProvider>
      <AuthProvider>
        <FinancesProvider>
          <Stack
            initialRouteName="/(tabs)"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name="Login" />
            <Stack.Screen name="Signup" />
          </Stack>
          <Toast />
        </FinancesProvider>
      </AuthProvider>
    </ThemeContextProvider>
  );
}
