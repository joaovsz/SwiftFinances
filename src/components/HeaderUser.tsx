import { View, Text, Image } from "react-native";
import React from "react";
import tw from "twrnc";
import { useAuth } from "../context/AuthContext";

export default function HeaderUser() {
  const { userData } = useAuth();
  return (
    <View
      className={`flex-row items-center gap-2 p-4 bg-[#101010] rounded-full`}
    >
      <Image
        className={`w-10 rounded-full h-10`}
        source={require("../assets/Perfil.jpg")}
      />
      <View className={`flex-row`}>
        <Text className={`font-outfit-bold text-[18px] text-white`}>Olá, </Text>
        <Text className={`font-outfit-bold text-[18px] text-white`}>
          {userData?.name}
        </Text>
      </View>
    </View>
  );
}
