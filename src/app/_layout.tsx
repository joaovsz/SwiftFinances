import "../global.css";

import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import Toast from "react-native-toast-message";

import { FinancesProvider } from "../context/FinancesProvider";
import { ThemeContextProvider } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";

SplashScreen.preventAutoHideAsync();

export default function HomeLayout() {
  const [fontsLoaded] = useFonts({
    'AlanSans-Light': require('../assets/fonts/AlanSans-Variable.ttf'),
    'AlanSans-Regular': require('../assets/fonts/AlanSans-Variable.ttf'),
    'AlanSans-Medium': require('../assets/fonts/AlanSans-Variable.ttf'),
    'AlanSans-SemiBold': require('../assets/fonts/AlanSans-Variable.ttf'),
    'AlanSans-Bold': require('../assets/fonts/AlanSans-Variable.ttf'),
    'AlanSans-ExtraBold': require('../assets/fonts/AlanSans-Variable.ttf'),
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
