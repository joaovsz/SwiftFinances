import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { useTheme } from "@/src/context/ThemeContext";
import { Button } from "react-native-paper";
export default function Settings() {
  const { isDark, toggleTheme, theme } = useTheme();
  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
      }}
    >
      <View className={`w-full items-center justify-center mt-24`}>
        <Button onPress={toggleTheme}>
          <Text>Alterar tema</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
