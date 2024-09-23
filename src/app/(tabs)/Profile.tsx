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

export default function Profile() {
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
        backgroundColor: "#1E1E1E",
        flex: 1,
        height: "100%",
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
        onPress={() => Alert.alert("Logout")}
        className={`w-[200px] border border-red-400 rounded-lg p-4 mt-8 mx-auto flex flex-row items-center justify-center`}
      >
        <ArrowLeftEndOnRectangleIcon size={28} className={`text-red-400`} />
        <Text className={`text-red-500 w-[80%] text-center `}>
          Fazer Logout
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
