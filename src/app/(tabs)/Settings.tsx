import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { useTheme } from "@/src/context/ThemeContext";
import { Button, Switch } from "react-native-paper";
import { MoonIcon, SunIcon } from "react-native-heroicons/outline";
export default function Settings() {
  const { isDark, toggleTheme, theme } = useTheme();
  return (
    <SafeAreaView style={tw`flex-1 bg-[${theme.colors.background}]`}>
      <View className="w-full mt-24">
        <View className="flex-row items-center justify-between px-4 py-2">
          <Text
            className={`text-lg color-[${
              isDark ? "#fff" : "#000"
            }] font-outfit-regular`}
          >
            {isDark ? (
              <MoonIcon className="w-6 h-6 text-gray-500" />
            ) : (
              <SunIcon className="w-6 h-6 text-yellow-500" />
            )}{" "}
            Alterar tema
          </Text>
          <View className="flex-row items-center">
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              thumbColor={isDark ? "#f5dd4b" : "#f4f3f4"}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
