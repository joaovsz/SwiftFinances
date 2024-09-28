import { View, Image, Text, Pressable, Alert } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { TouchableOpacity } from "react-native";
import { useState } from "react";
import tw from "twrnc";
import {
  ArrowLeftEndOnRectangleIcon,
  ArrowLeftIcon,
} from "react-native-heroicons/outline";
import { router } from "expo-router";
import { useTheme } from "@/src/context/ThemeContext";

export default function Profile() {
  const { theme } = useTheme();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };
  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
      }}
    >
      <View className={`w-full items-center justify-center`}>
        <Image
          className={`w-28 rounded-full h-28`}
          source={require("../../assets/Perfil.jpg")}
        />
        <Text className={`w-full text-center p-2 text-xl text-white`}>
          João Vitor Souza
        </Text>
        <Text className={`w-full text-center text-[#c6c6c6]`}>
          joaovitor1713coin@gmail.com
        </Text>
        <View className={`w-full flex flex-row items-center justify-center`}>
          <Pressable onPress={pickImage} className={`mt-4 mx-auto w-1/2 `}>
            <Text className={`text-green-500 text-center`}>
              Alterar foto de perfil
            </Text>
          </Pressable>
        </View>

        {selectedImage && (
          <Image
            source={{ uri: selectedImage }}
            className={`w-28 rounded-full h-28 mt-4`}
          />
        )}
      </View>
      <Pressable
        onPress={() => router.replace("/Login")}
        className={`w-[200px] border border-red-400 rounded-lg p-2 mt-8 mx-auto flex flex-row items-center justify-center`}
      >
        <ArrowLeftEndOnRectangleIcon
          size={28}
          color={"#ef4444"}
          className={`text-red-400 w-1/3`}
        />
        <Text className={`text-red-500 w-2/3 text-center `}>Fazer Logout</Text>
      </Pressable>
    </SafeAreaView>
  );
}
