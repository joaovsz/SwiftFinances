import { View, Image, Text, Pressable, Alert } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";

import {
  ArrowLeftEndOnRectangleIcon,
  ArrowLeftIcon,
  UserIcon,
} from "react-native-heroicons/outline";
import { useTheme } from "@/src/context/ThemeContext";
import { logout } from "@/firebase/Services/authService";
import { useAuth } from "@/src/context/AuthContext";
import { getAuth, updateProfile } from "firebase/auth";
import { Button, TouchableRipple } from "react-native-paper";
import { getUsuarioById } from "@/firebase/Services/createServices";

export default function Profile() {
  const { theme } = useTheme();
  const { user: userAuthenticated, userData } = useAuth();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  useEffect(() => {
    Alert.alert(JSON.stringify(userData));
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
  useEffect(() => {
    if (selectedImage) uploadProfileImage();
  }, [selectedImage]);

  const uploadProfileImage = async () => {
    try {
      let imageUri: string | null | undefined = selectedImage;
      if (imageUri === null) {
        imageUri = selectedImage;
      }
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

  const takePhoto = async () => {
    if (!permission?.granted) {
      const { status } = await requestPermission();
      if (status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "Precisamos da sua permissão para acessar a câmera"
        );
        return;
      }
    }

    let result = await ImagePicker.launchCameraAsync({
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

  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
      }}
    >
      <View className={`w-full items-center justify-center`}>
        {userAuthenticated && userAuthenticated.photoURL ? (
          <Image
            source={{ uri: userAuthenticated.photoURL }}
            className={`w-28 rounded-full h-28`}
          />
        ) : selectedImage ? (
          <Image
            source={{ uri: selectedImage }}
            className={`w-28 rounded-full h-28 mt-4`}
          />
        ) : (
          <View
            className={`w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center`}
          >
            <UserIcon size={56} color={"#9ca3af"} />
          </View>
        )}

        <Text
          className={`w-full text-center p-2 text-xl text-white font-outfit-regular`}
        >
          {" "}
          {userData?.name}
        </Text>
        <Text
          className={`w-full text-center text-[#c6c6c6] font-outfit-regular my-3`}
        >
          {userData?.email}
        </Text>
        <View className="flex flex-row mt-4 w-full justify-center gap-4">
          <View
            className={` flex flex-row items-center justify-center w-1/3 border border-green-400 p-1 rounded-lg`}
          >
            <TouchableRipple onPress={takePhoto} className={``}>
              <Text
                className={`text-green-500 text-center font-outfit-regular `}
              >
                Tirar foto
              </Text>
            </TouchableRipple>
          </View>
          <View
            className={`rounded-lg  border-green-400 p-1 flex flex-row items-center justify-center w-1/3 border`}
          >
            <TouchableRipple onPress={pickImage} className={`w-full`}>
              <Text
                className={`text-green-500 w-full text-center font-outfit-regular`}
              >
                Carregar uma foto
              </Text>
            </TouchableRipple>
          </View>
        </View>
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
        <Text className={`text-red-500 w-2/3 text-center font-outfit-regular`}>
          Fazer Logout
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
