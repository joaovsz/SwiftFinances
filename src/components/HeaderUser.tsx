import { View, Text, Image } from "react-native";
import React from "react";
import tw from "twrnc";
import { useAuth } from "../context/AuthContext";
import { UserIcon } from "react-native-heroicons/outline";

export default function HeaderUser() {
  const { userData, user } = useAuth();
  return (
    <View
      className={`flex-row items-center gap-4 p-4 bg-[#101010] rounded-full`}
    >
      {!user?.photoURL ? (
        <View
          className={`w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center`}
        >
          <UserIcon size={30} color={"#9ca3af"} />
        </View>
      ) : (
        <Image
          className={`w-10 rounded-full h-10`}
          source={{ uri: user?.photoURL! }}
        />
      )}

      <View className={`flex-row`}>
        <Text className={`font-outfit-bold text-[18px] text-white`}>Olá, </Text>
        <Text className={`font-outfit-bold text-[18px] text-white`}>
          {userData?.name}
        </Text>
      </View>
    </View>
  );
}
