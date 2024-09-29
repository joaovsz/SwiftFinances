import { logout } from '@/firebase/Services/authService';
import { useAuth } from '@/src/context/AuthContext';
import { useTheme } from '@/src/context/ThemeContext';
import { useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { getAuth, updateProfile } from 'firebase/auth';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';
import { ArrowLeftEndOnRectangleIcon, UserIcon } from 'react-native-heroicons/outline';
import { TouchableRipple } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {
  const { theme, isDark } = useTheme();
  const { user: userAuthenticated, userData } = useAuth();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (selectedImage) uploadProfileImage();
  }, [selectedImage]);

  const uploadProfileImage = async () => {
    setIsLoading(true);
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
      setSelectedImage(downloadURL); // Update the selected image with the download URL
    } catch (error) {
      console.error("Erro ao fazer upload da imagem de perfil:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
        {isLoading ? (
          <Text className={`text-white`}>Carregando...</Text>
        ) : userAuthenticated && userAuthenticated.photoURL ? (
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
          className={`w-full text-center p-2 text-xl  font-outfit-regular ${
            isDark ? "text-white" : "text-black"
          }`}
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
            className={`rounded-lg  border-green-400 p-1 flex flex-row items-center justify-center w-1/3 border`}
          >
            <TouchableRipple onPress={takePhoto} className={`w-full`}>
              <Text
                className={`text-green-500 text-center  w-full font-outfit-regular `}
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
                className={`text-green-500 text-center  w-full font-outfit-regular `}
              >
                Abrir Galeria
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
