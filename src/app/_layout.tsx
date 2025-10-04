import "../global.css";

import { useFonts } from "expo-font";
import * as Font from 'expo-font';
import { SplashScreen, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { FinancesProvider } from "../context/FinancesProvider";
import { ThemeContextProvider } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import { PaperProvider } from "react-native-paper";

SplashScreen.preventAutoHideAsync();

export default function HomeLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'AlanSans-Light': require('../assets/fonts/AlanSans-Light.ttf'),
    'AlanSans-Regular': require('../assets/fonts/AlanSans-Regular.ttf'),
    'AlanSans-Medium': require('../assets/fonts/AlanSans-Medium.ttf'),
    'AlanSans-SemiBold': require('../assets/fonts/AlanSans-SemiBold.ttf'),
    'AlanSans-Bold': require('../assets/fonts/AlanSans-Bold.ttf'),
    'AlanSans-ExtraBold': require('../assets/fonts/AlanSans-ExtraBold.ttf'),
    'AlanSans-Black': require('../assets/fonts/AlanSans-Black.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Mostrar um indicador de carregamento enquanto as fontes não carregam
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <PaperProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
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
      </GestureHandlerRootView>
    </PaperProvider>
  );
}
