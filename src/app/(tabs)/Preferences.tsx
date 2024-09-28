import { View, Text } from "react-native";
import React from "react";
import { useTheme } from "@/src/context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Preferences() {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
      }}
    >
      <Text>Em breve</Text>
    </SafeAreaView>
  );
}
