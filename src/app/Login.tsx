import { View, Text, Pressable, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { useState } from "react";
import { Alert } from "react-native";
import { login } from "@/firebase/Services/authService";

import { Modal } from "react-native";
import { Button } from "react-native-paper";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import Toast from "react-native-toast-message";
import { CustomTextInput, CustomButton } from "@/src/components/inputs";
import { useTheme } from "@/src/context/ThemeContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const { theme, isDark } = useTheme();

  const handleForgetPassword = async () => {
    setModalVisible(true);
  };
  
  const handleLogin = async () => {
    try {
      await login(email, password);
      router.replace("/(tabs)");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: (error as Error).message,
      });
    }
  };
  
  const handleSendResetEmail = async () => {
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      Toast.show({
        type: "success",
        text1: "Email enviado com sucesso",
        text2: "Verifique sua caixa de entrada",
      });
      setModalVisible(false);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: (error as Error).message,
      });
    }
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        height: "100%",
      }}
    >
      <View className="flex-1 gap-6 relative mx-6 mt-8 justify-center">
        <View 
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: 20,
            padding: 32,
            marginBottom: 20,
            elevation: isDark ? 8 : 4,
            shadowColor: isDark ? '#000' : '#1f2937',
            shadowOffset: { width: 0, height: isDark ? 4 : 2 },
            shadowOpacity: isDark ? 0.3 : 0.08,
            shadowRadius: isDark ? 12 : 8,
          }}
        >
          {/* Logo Section */}
          <View className="items-center mb-8">
            <View 
              style={{
                backgroundColor: isDark ? theme.colors.surface : theme.colors.primary,
                borderRadius: 24,
                padding: 20,
                marginBottom: 16,
              }}
            >
              <Image 
                source={require('@/src/assets/SLogo.png')}
                style={{
                  width: 60,
                  height: 60,
                  resizeMode: 'contain',
                  tintColor: isDark ? theme.colors.primary : '#ffffff'
                }}
              />
            </View>
            <Text 
              className="font-alan-bold text-2xl text-center"
              style={{ color: theme.colors.text }}
            >
              Swift Finances
            </Text>
          </View>
          
          <Text 
            className="font-alan-medium text-lg text-center mb-8"
            style={{ 
              color: isDark ? theme.colors.text : theme.colors.secondary,
              opacity: 0.8 
            }}
          >
            Faça login em sua conta
          </Text>
          
          <CustomTextInput
            label="Email"
            placeholder="Digite seu email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            fontWeight="400"
          />
          
          <CustomTextInput
            label="Senha"
            placeholder="Senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            fontWeight="400"
          />
          
          <Pressable onPress={handleForgetPassword}>
            <Text 
              className="font-alan-semibold text-right"
              style={{ color: theme.colors.primary }}
            >
              Esqueci minha senha
            </Text>
          </Pressable>
          
          <CustomButton
            title="Entrar"
            onPress={handleLogin}
            size="large"
            style={{ 
              marginTop: 20,
              borderRadius: 16,
              paddingVertical: 16,
            }}
          />
        </View>
        
        <View className="flex flex-row gap-2 justify-center mt-6">
          <Text 
            className="font-alan-medium text-center"
            style={{ color: theme.colors.text }}
          >
            Ainda não tem uma conta?
          </Text>
          <Text
            onPress={() => router.replace("/Signup")}
            style={{ color: theme.colors.primary }}
            className="font-alan-bold"
          >
            Cadastre-se
          </Text>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
          className="w-full h-full"
        >
          <View style={{
            margin: 20,
            backgroundColor: theme.colors.surface,
            borderRadius: 20,
            padding: 32,
            marginTop: '30%',
            shadowColor: isDark ? '#000' : '#1f2937',
            shadowOffset: { width: 0, height: isDark ? 4 : 2 },
            shadowOpacity: isDark ? 0.3 : 0.15,
            shadowRadius: isDark ? 12 : 8,
            elevation: isDark ? 10 : 6,
          }}>
            <Text style={{
              color: theme.colors.text,
              textAlign: 'center',
              marginBottom: 8,
              fontWeight: '600',
              fontSize: 24,
            }}
            className="font-alan-bold"
            >
              Redefinir Senha
            </Text>
            <CustomTextInput
              label="Email"
              placeholder="Digite seu email"
              keyboardType="email-address"
              value={resetEmail}
              onChangeText={setResetEmail}
              fontWeight="400"
              style={{ marginBottom: 16 }}
            />
            <View className="flex-row mt-6 justify-between w-full gap-3">
              <Button
                onPress={() => setModalVisible(false)}
                mode="text"
                textColor={theme.colors.primary}
                style={{
                  borderRadius: 12,
                  paddingVertical: 4,
                  flex: 1,
                }}
              >
                Cancelar
              </Button>
              <Button
                onPress={handleSendResetEmail}
                mode="contained"
                buttonColor={theme.colors.primary}
                textColor="white"
                style={{
                  borderRadius: 12,
                  paddingVertical: 4,
                  flex: 1,
                }}
              >
                Enviar
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}