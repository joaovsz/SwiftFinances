import { SplashScreen, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  useFonts,
  Outfit_300Light,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
} from "@expo-google-fonts/outfit";
import "../global.css";
import { FinancesProvider } from "../context/FinancesProvider";
import { StyleSheet } from "nativewind";

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
    </FinancesProvider>
  );
}
