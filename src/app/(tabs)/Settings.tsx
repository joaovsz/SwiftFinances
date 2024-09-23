import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
export default function Settings() {
  return (
    <SafeAreaView
      style={{
        backgroundColor: "#1E1E1E",
        flex: 1,
        height: "100%",
      }}
    >
      <View className={`w-full items-center justify-center mt-24`}>
        <Text className={`w-full text-center p-2 text-xl text-white`}>
          Configurações
        </Text>
      </View>
    </SafeAreaView>
  );
}
