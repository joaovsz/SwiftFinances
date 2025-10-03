import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  Text,
  View,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import {
  ArrowLeftEndOnRectangleIcon,
  UserIcon,
  XMarkIcon,
  CameraIcon,
  PhotoIcon,
} from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { getAuth, updateProfile } from 'firebase/auth';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

import { logout } from '@/firebase/Services/authService';
import { useAuth } from '@/src/context/AuthContext';
import { useTheme } from '@/src/context/ThemeContext';
import { useProfileModal } from '@/src/context/ProfileModalContext';
import { CustomButton } from '@/src/components/inputs';

const { height: screenHeight } = Dimensions.get('window');

export const ProfileModal: React.FC = () => {
  const { theme, isDark } = useTheme();
  const { user: userAuthenticated, userData } = useAuth();
  const { isProfileModalVisible, hideProfileModal } = useProfileModal();

  // Animation states
  const slideAnim = useState(new Animated.Value(screenHeight))[0];

  // Profile image states
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  // Animation effects
  useEffect(() => {
    if (isProfileModalVisible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 8,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: screenHeight,
        useNativeDriver: true,
        tension: 65,
        friction: 8,
      }).start();
    }
  }, [isProfileModalVisible]);

  // Upload image when selected
  useEffect(() => {
    if (selectedImage) {
      uploadProfileImage();
    }
  }, [selectedImage]);

  // Image upload functionality
  const uploadProfileImage = async () => {
    setIsLoading(true);
    try {
      if (!selectedImage) {
        throw new Error('Nenhuma imagem selecionada');
      }

      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const storage = getStorage();
      const imageRef = ref(storage, `profilePictures/${user.uid}`);
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      
      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);

      await updateProfile(user, {
        photoURL: downloadURL,
      });

      setSelectedImage(downloadURL);
      Alert.alert('Sucesso', 'Imagem de perfil atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload da imagem de perfil:', error);
      Alert.alert('Erro', 'Erro ao atualizar imagem de perfil');
    } finally {
      setIsLoading(false);
    }
  };

  // Camera/Gallery functions
  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao acessar galeria');
    }
  };

  const takePhotoWithCamera = async () => {
    try {
      if (!permission?.granted) {
        const { status } = await requestPermission();
        if (status !== 'granted') {
          Alert.alert(
            'Permissão necessária',
            'Precisamos da sua permissão para acessar a câmera'
          );
          return;
        }
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao acessar câmera');
    }
  };

  // Logout functionality
  const handleLogout = () => {
    Alert.alert('Logout', 'Deseja realmente sair?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
            hideProfileModal();
          } catch (error) {
            Alert.alert('Erro', 'Erro ao fazer logout');
          }
        },
      },
    ]);
  };

  // Profile image component
  const ProfileImage = () => {
    const imageSource = userAuthenticated?.photoURL || selectedImage;

    if (isLoading) {
      return (
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: theme.colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: theme.colors.text }}>Carregando...</Text>
        </View>
      );
    }

    if (imageSource) {
      return (
        <Image
          source={{ uri: imageSource }}
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            borderWidth: 3,
            borderColor: theme.colors.primary,
          }}
        />
      );
    }

    return (
      <View
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: theme.colors.surface,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 3,
          borderColor: theme.colors.primary,
        }}
      >
        <UserIcon size={60} color={theme.colors.primary} />
      </View>
    );
  };

  return (
    <Modal
      visible={isProfileModalVisible}
      transparent={true}
      animationType="none"
      onRequestClose={hideProfileModal}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'flex-end',
        }}
      >
        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
            backgroundColor: theme.colors.background,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingTop: 20,
            paddingHorizontal: 20,
            paddingBottom: 40,
            maxHeight: screenHeight * 0.9,
            elevation: isDark ? 10 : 6,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: isDark ? 0.3 : 0.1,
            shadowRadius: 12,
          }}
        >
          <SafeAreaView edges={['bottom']}>
            {/* Header */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 30,
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: '600',
                  color: theme.colors.text,
                  fontFamily: 'AlanSans-SemiBold',
                }}
              >
                Meu Perfil
              </Text>
              <Pressable
                onPress={hideProfileModal}
                style={{
                  padding: 8,
                  borderRadius: 20,
                  backgroundColor: isDark ? theme.colors.surface : theme.colors.card,
                }}
              >
                <XMarkIcon size={24} color={theme.colors.secondary} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Profile Image Section */}
              <View style={{ alignItems: 'center', marginBottom: 30 }}>
                <ProfileImage />
                
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '600',
                    color: theme.colors.text,
                    marginTop: 16,
                    fontFamily: 'AlanSans-SemiBold',
                  }}
                >
                  {userData?.name || 'Usuário'}
                </Text>
                
                <Text
                  style={{
                    fontSize: 16,
                    color: theme.colors.secondary,
                    marginTop: 4,
                    fontFamily: 'AlanSans-Regular',
                  }}
                >
                  {userData?.email || userAuthenticated?.email}
                </Text>
              </View>

              {/* Image Action Buttons */}
              <View
                style={{
                  flexDirection: 'row',
                  gap: 12,
                  marginBottom: 30,
                }}
              >
                <Pressable
                  onPress={takePhotoWithCamera}
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: theme.colors.primary,
                    backgroundColor: 'transparent',
                    gap: 8,
                  }}
                  android_ripple={{ color: theme.colors.primary + '20' }}
                >
                  <CameraIcon size={20} color={theme.colors.primary} />
                  <Text
                    style={{
                      color: theme.colors.primary,
                      fontSize: 16,
                      fontFamily: 'AlanSans-SemiBold',
                    }}
                  >
                    Tirar Foto
                  </Text>
                </Pressable>
                
                <Pressable
                  onPress={pickImageFromGallery}
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: theme.colors.primary,
                    backgroundColor: 'transparent',
                    gap: 8,
                  }}
                  android_ripple={{ color: theme.colors.primary + '20' }}
                >
                  <PhotoIcon size={20} color={theme.colors.primary} />
                  <Text
                    style={{
                      color: theme.colors.primary,
                      fontSize: 16,
                      fontFamily: 'AlanSans-SemiBold',
                    }}
                  >
                    Galeria
                  </Text>
                </Pressable>
              </View>

              {/* Logout Button */}
              <View
                style={{
                  borderWidth: 2,
                  borderColor: '#ef4444',
                  borderRadius: 12,
                  overflow: 'hidden',
                }}
              >
                <Pressable
                  onPress={handleLogout}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 18,
                    paddingHorizontal: 24,
                    gap: 8,
                    minHeight: 56
                  }}
                  android_ripple={{ color: 'rgba(239, 68, 68, 0.1)' }}
                >
                  <ArrowLeftEndOnRectangleIcon size={24} color="#ef4444" />
                  <Text
                    style={{
                      color: '#ef4444',
                      fontSize: 18,
                      fontFamily: 'AlanSans-SemiBold',
                      lineHeight: 24,
                      paddingVertical: 2
                    }}
                  >
                    Fazer Logout
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
};