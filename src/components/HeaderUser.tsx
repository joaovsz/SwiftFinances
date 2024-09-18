import { View, Text, Image } from "react-native";
import React from "react";
import tw from "twrnc";

export default function HeaderUser() {
  return (
    <View
      style={tw`flex-row items-center gap-2  p-4 bg-[#323232] rounded-full`}
    >
      <Image
        style={tw`w-10 rounded-full h-10`}
        source={require("../assets/Perfil.jpg")}
      />
      <View style={tw`flex-row`}>
        <Text style={tw`font-bold text-[18px] text-white`}>Olá, </Text>
        <Text style={tw`font-bold text-[18px] text-white`}>João Vitor!</Text>
      </View>
    </View>
  );
}
