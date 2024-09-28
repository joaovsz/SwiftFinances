import { View, Image, Text, Pressable, Alert } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from "react";
import tw from "twrnc";
import {
  ArrowLeftEndOnRectangleIcon,
  ArrowLeftIcon,
  UserIcon,
} from "react-native-heroicons/outline";
import { router } from "expo-router";
import { useTheme } from "@/src/context/ThemeContext";
import { logout } from "@/firebase/Services/authService";
import { useAuth } from "@/src/context/AuthContext";
import { getAuth, updateProfile } from "firebase/auth";

export default function Profile() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  useEffect(() => {
    console.log(user?.photoURL);
  }, []);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      setSelectedImage(uri);
      return uri;
    }
    return null;
  };

  const uploadProfileImage = async () => {
    try {
      const imageUri = await pickImage();
      if (!imageUri) {
        throw new Error("Nenhuma imagem selecionada");
      }
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      const storage = getStorage();
      const imageRef = ref(storage, `profilePictures/${user.uid}`);
      const response = await fetch(imageUri);
      const blob = await response.blob();
      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);

      await updateProfile(user, {
        photoURL: downloadURL,
      });

      console.log("Imagem de perfil atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer upload da imagem de perfil:", error);
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
        {user && user.photoURL ? (
          <Image
            source={{ uri: user.photoURL }}
            className={`w-28 rounded-full h-28`}
          />
        ) : (
          <View
            className={`w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center`}
          >
            <UserIcon size={56} color={"#9ca3af"} />
          </View>
        )}

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
        onPress={() => {
          Alert.alert("Logout", "Deseja realmente sair?", [
            {
              text: "Cancelar",
              style: "cancel",
            },
            {
              text: "Sair",
              onPress: async () => {
                try {
                  await logout();
                } catch {
                  Alert.alert("Erro", "Erro ao fazer logout");
                }
              },
            },
          ]);
        }}
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
